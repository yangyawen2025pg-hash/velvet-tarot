import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
  type: 'cursor' | 'burst' | 'ambient';
}

const PALETTE = [
  '#D4A7A7', // rose
  '#C4A265', // gold
  '#D4B896', // amber
  '#E8D5D5', // blush
  '#C4B5D4', // lavender
  '#A3B899', // sage
];

function randomColor(): string {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -100, y: -100, prevX: -100, prevY: -100, moving: false });
  const cursorRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const lastMoveTimeRef = useRef(0);

  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;

  const createBurstParticles = useCallback((x: number, y: number, count: number = 40) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        size: 2 + Math.random() * 4,
        color: randomColor(),
        opacity: 0.8 + Math.random() * 0.2,
        life: 500 + Math.random() * 400,
        maxLife: 900,
        type: 'burst',
      });
    }
    particlesRef.current.push(...newParticles);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      ctx!.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    function onMouseMove(e: MouseEvent) {
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.moving = true;
      lastMoveTimeRef.current = Date.now();
    }

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button, a, [data-particle-burst]');
      if (isInteractive) {
        createBurstParticles(e.clientX, e.clientY, 35);
      }
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    // Expose burst function globally for button clicks
    (window as any).particleBurst = (x: number, y: number, count?: number) => {
      createBurstParticles(x, y, count);
    };

    let lastTime = Date.now();

    function animate() {
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 16.67, 3);
      lastTime = now;

      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx!.clearRect(0, 0, w, h);

      // Update mouse moving state
      if (now - lastMoveTimeRef.current > 100) {
        mouseRef.current.moving = false;
      }

      // Smooth cursor follow
      const cursor = cursorRef.current;
      const mouse = mouseRef.current;
      cursor.x += (mouse.x - cursor.x) * 0.15;
      cursor.y += (mouse.y - cursor.y) * 0.15;

      // Emit cursor trail particles
      if (mouse.moving) {
        const moveDist = Math.hypot(mouse.x - mouse.prevX, mouse.y - mouse.prevY);
        const emitCount = Math.min(Math.floor(moveDist / 4) + 1, 5);

        for (let i = 0; i < emitCount; i++) {
          const t = i / emitCount;
          const px = mouse.prevX + (mouse.x - mouse.prevX) * t + (Math.random() - 0.5) * 6;
          const py = mouse.prevY + (mouse.y - mouse.prevY) * t + (Math.random() - 0.5) * 6;

          particlesRef.current.push({
            x: px,
            y: py,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -0.3 - Math.random() * 0.5,
            size: 1.5 + Math.random() * 3,
            color: randomColor(),
            opacity: 0.5 + Math.random() * 0.4,
            life: 600 + Math.random() * 600,
            maxLife: 1200,
            type: 'cursor',
          });
        }
      }

      // Update and draw particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy -= 0.008 * dt;
        p.life -= 16.67 * dt;
        p.size *= 0.998;

        if (p.life <= 0 || p.size < 0.3) {
          particles.splice(i, 1);
          continue;
        }

        const lifeRatio = p.life / p.maxLife;
        const alpha = lifeRatio * p.opacity;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = hexToRgba(p.color, alpha);
        ctx!.fill();
      }

      // Limit max particles
      if (particles.length > 300) {
        particlesRef.current = particles.slice(-250);
      }

      // Draw cursor dot
      if (cursor.x > 0 && cursor.y > 0) {
        const isIdle = !mouse.moving;
        const pulseScale = isIdle ? 1 + Math.sin(now / 300) * 0.15 : 1;
        const dotSize = 5 * pulseScale;

        ctx!.beginPath();
        ctx!.arc(cursor.x, cursor.y, dotSize + 2, 0, Math.PI * 2);
        ctx!.fillStyle = hexToRgba('#FAF6F1', 0.8);
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(cursor.x, cursor.y, dotSize, 0, Math.PI * 2);
        ctx!.fillStyle = hexToRgba('#C4A265', 0.9);
        ctx!.fill();

        ctx!.shadowColor = 'rgba(196, 162, 101, 0.5)';
        ctx!.shadowBlur = 10;
        ctx!.beginPath();
        ctx!.arc(cursor.x, cursor.y, dotSize, 0, Math.PI * 2);
        ctx!.fillStyle = hexToRgba('#C4A265', 0.5);
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      delete (window as any).particleBurst;
    };
  }, [isTouchDevice, createBurstParticles]);

  if (isTouchDevice) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
