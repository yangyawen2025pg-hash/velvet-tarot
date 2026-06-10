import { useEffect, useState, useRef, useCallback } from 'react';
import { getDailyNotification } from '@/lib/tarotData';
import FloatingTarotCards from '@/components/FloatingTarotCards';

const affirmations = [
  '生活不会永远顺利，\n但你有足够的力量，\n面对一切。',
  '每个人的生命都有自己的节奏，\n你的时区正是最好的时区。',
  '迷茫不是软弱，\n而是你在认真思考自己想要什么。',
  '允许自己不完美，\n因为不完美才是最真实的美。',
  '深呼吸，慢慢来。\n你比自己想象的更强大。',
  '今天的困难，\n是未来最好的故事。',
  '不必匆忙，慢慢来，\n你已经在路上了。',
];

/* Dust particles */
const dustParticles = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  x: 15 + Math.random() * 70,
  y: 55 + Math.random() * 45,
  size: 1 + Math.random() * 2.5,
  speed: 15 + Math.random() * 18,
  delay: Math.random() * 12,
  opacity: 0.1 + Math.random() * 0.2,
}));

/* Tyndall effect particles — dust motes floating in sunbeam */
const tyndallParticles = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  // Concentrated in the sunbeam area: from window (center-upper) to text area
  x: 38 + Math.random() * 35,  // 38-73%, sunbeam horizontal range
  y: 12 + Math.random() * 52,  // 12-64%, from window down to text area
  size: 1.5 + Math.random() * 3,
  speed: 6 + Math.random() * 10,
  delay: Math.random() * 8,
  opacity: 0.2 + Math.random() * 0.45,
}));

export default function HeroSection() {
  const [, setNotification] = useState<string | null>(null);
  const [affirmation] = useState(() => affirmations[Math.floor(Math.random() * affirmations.length)]);
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  /* mouse-following glow */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!glowRef.current || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    glowRef.current.style.background = `radial-gradient(500px circle at ${x}% ${y}%, rgba(255,250,240,0.1), transparent 55%)`;
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => el.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('velvet-tarot-data-v2');
      const data = stored ? JSON.parse(stored) : {};
      const entries = data.entries || [];
      if (entries.length > 0) {
        const avgScore = Math.round(
          entries.slice(0, 7).reduce((s: number, e: { score: number }) => s + e.score, 0) /
            Math.min(entries.length, 7)
        );
        const msg = getDailyNotification(avgScore, new Date().getDay());
        if (msg) setNotification(msg);
      }
    } catch { /* ignore */ }
  }, []);

  const handleExplore = () => {
    const next = document.getElementById('showcase-tarot');
    if (next) next.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" ref={sectionRef} className="relative w-[100dvw] h-[100dvh] overflow-hidden select-none">
      {/* Background oil painting — NEW */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/hero-bg-new.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          transform: 'scale(1.03)',
        }}
      />

      {/* ═══════ TYNDALL EFFECT — Sunbeams from window ═══════ */}
      {/* Window area: center-upper, ~x:38-82%, y:0-65%. Sun enters and falls to text area */}

      {/* Beam 1 — main strong beam from upper window to text area */}
      <div
        className="absolute pointer-events-none z-[2]"
        style={{
          top: '-10%',
          left: '25%',
          width: '55%',
          height: '90%',
          background: 'linear-gradient(155deg, rgba(255,252,248,0.18) 0%, rgba(255,250,245,0.08) 30%, rgba(255,248,240,0.03) 50%, transparent 70%)',
          filter: 'blur(20px)',
          transform: 'skewX(-8deg)',
          mixBlendMode: 'screen',
        }}
      />
      {/* Beam 2 — wider softer beam */}
      <div
        className="absolute pointer-events-none z-[2]"
        style={{
          top: '-5%',
          left: '30%',
          width: '50%',
          height: '85%',
          background: 'linear-gradient(150deg, rgba(255,250,240,0.1) 0%, rgba(255,248,235,0.05) 25%, transparent 60%)',
          filter: 'blur(35px)',
          transform: 'skewX(-5deg)',
          mixBlendMode: 'screen',
        }}
      />
      {/* Beam 3 — narrow bright core */}
      <div
        className="absolute pointer-events-none z-[2]"
        style={{
          top: '5%',
          left: '42%',
          width: '22%',
          height: '65%',
          background: 'linear-gradient(160deg, rgba(255,254,250,0.25) 0%, rgba(255,252,248,0.08) 35%, transparent 65%)',
          filter: 'blur(12px)',
          transform: 'skewX(-10deg)',
          mixBlendMode: 'screen',
        }}
      />
      {/* Beam 4 — right side wider diffusion */}
      <div
        className="absolute pointer-events-none z-[2]"
        style={{
          top: '0%',
          left: '50%',
          width: '40%',
          height: '75%',
          background: 'linear-gradient(145deg, rgba(255,250,245,0.12) 0%, rgba(255,248,242,0.04) 30%, transparent 55%)',
          filter: 'blur(40px)',
          transform: 'skewX(-3deg)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Tyndall particles — floating dust motes in sunbeam */}
      {tyndallParticles.map((p) => (
        <div
          key={`tyndall-${p.id}`}
          className="absolute pointer-events-none z-[3] rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: 'radial-gradient(circle, rgba(255,252,248,0.9) 0%, rgba(255,250,240,0.4) 40%, transparent 70%)',
            boxShadow: `0 0 ${p.size * 2}px rgba(255,250,240,0.3)`,
            opacity: p.opacity,
            ['--t-opacity' as string]: p.opacity,
            animation: `tyndallFloat ${p.speed}s ease-in-out infinite ${p.delay}s`,
          }}
        />
      ))}

      {/* Text area brightening — sunbeam illuminates center text */}
      <div
        className="absolute pointer-events-none z-[3]"
        style={{
          top: '28%',
          left: '20%',
          width: '60%',
          height: '38%',
          background: 'radial-gradient(ellipse 55% 50% at 50% 45%, rgba(255,254,252,0.2) 0%, rgba(255,250,245,0.06) 50%, transparent 80%)',
          filter: 'blur(30px)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Warm color overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse 65% 60% at 50% 32%, rgba(255,248,240,0.15) 0%, transparent 60%)',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Mouse-following glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none z-[6] transition-[background] duration-500 ease-out"
      />

      {/* Soft central luminance */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(ellipse 55% 50% at 50% 36%, rgba(255,254,252,0.3) 0%, rgba(255,250,245,0.1) 40%, transparent 70%)',
        }}
      />

      {/* Warm vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{
          background: 'radial-gradient(ellipse 75% 70% at 50% 45%, transparent 38%, rgba(140,120,160,0.08) 75%, rgba(120,100,145,0.14) 100%)',
        }}
      />

      {/* Candle flickers */}
      <div className="absolute top-[15%] left-[25%] w-2.5 h-2.5 rounded-full pointer-events-none z-[4]" style={{ background: 'radial-gradient(circle, rgba(235,200,154,0.28) 0%, transparent 70%)', animation: 'candleFlicker 6s ease-in-out infinite' }} />
      <div className="absolute top-[52%] right-[30%] w-3.5 h-3.5 rounded-full pointer-events-none z-[4]" style={{ background: 'radial-gradient(circle, rgba(235,200,154,0.2) 0%, transparent 70%)', animation: 'candleFlicker 6s ease-in-out infinite 2s' }} />
      <div className="absolute top-[38%] left-[16%] w-1.5 h-1.5 rounded-full pointer-events-none z-[4]" style={{ background: 'radial-gradient(circle, rgba(255,250,240,0.15) 0%, transparent 70%)', animation: 'candleFlicker 8s ease-in-out infinite 1s' }} />

      {/* Ambient dust particles */}
      {dustParticles.map((d) => (
        <div
          key={d.id}
          className="absolute pointer-events-none z-[4] rounded-full"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            background: 'radial-gradient(circle, rgba(235,200,154,0.45) 0%, transparent 70%)',
            opacity: d.opacity,
            animation: `dustRise ${d.speed}s linear infinite ${d.delay}s`,
          }}
        />
      ))}

      {/* ═══════ FLOATING TAROT CARDS (behind text) ═══════ */}
      <FloatingTarotCards />

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div className="relative z-10 h-full flex flex-col">

        {/* ── Daily Quote Card — top left ── */}
        <div
          className="absolute top-16 md:top-20 left-6 md:left-10 z-20 rounded-2xl overflow-hidden animate-fade-in"
          style={{
            width: '220px',
            background: 'rgba(255,252,248,0.6)',
            backdropFilter: 'blur(16px) saturate(1.05)',
            WebkitBackdropFilter: 'blur(16px) saturate(1.05)',
            border: '1px solid rgba(255,255,255,0.4)',
            boxShadow: '0 4px 20px rgba(140,110,100,0.04)',
            animationDelay: '0.8s',
          }}
        >
          <div className="px-4 py-3.5">
            {/* Header */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C4A265" strokeWidth="1.5" opacity="0.6">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
                <span
                  className="text-[9px] tracking-[0.14em]"
                  style={{ fontFamily: '"Noto Serif SC", serif', color: '#A08080', opacity: 0.7 }}
                >
                  每日寄语
                </span>
              </div>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="rgba(196,162,101,0.3)">
                <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
              </svg>
            </div>
            {/* Quote text */}
            <p
              className="text-xs leading-[2] pl-1"
              style={{
                fontFamily: '"Noto Serif SC", serif',
                color: '#7A6464',
                fontWeight: 400,
              }}
            >
              <span style={{ color: '#C4A265', opacity: 0.5, fontSize: '14px' }}>"</span>
              {affirmation.split('\n').map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
              <span style={{ color: '#C4A265', opacity: 0.5, fontSize: '14px' }}>"</span>
            </p>
            {/* Rose icon */}
            <div className="mt-2 flex justify-end">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A7A7" strokeWidth="1" opacity="0.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M12 12v6" />
                <path d="M9 16c-2 1-3 4-3 4" />
                <path d="M15 16c2 1 3 4 3 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Center Content ── */}
        <div className="flex-1 flex flex-col items-center justify-center">

          {/* Moon decoration above title */}
          <div className="flex items-center gap-3 mb-7 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-full" style={{
                  width: i === 1 ? '2px' : '1.5px',
                  height: i === 1 ? '2px' : '1.5px',
                  background: i === 1 ? 'rgba(196,162,101,0.35)' : 'rgba(196,162,101,0.2)',
                  marginLeft: i === 0 ? 0 : '5px',
                }} />
              ))}
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4A265" strokeWidth="1.2" opacity="0.6">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-full" style={{
                  width: i === 1 ? '2px' : '1.5px',
                  height: i === 1 ? '2px' : '1.5px',
                  background: i === 1 ? 'rgba(196,162,101,0.35)' : 'rgba(196,162,101,0.2)',
                  marginLeft: i === 0 ? 0 : '5px',
                }} />
              ))}
            </div>
          </div>

          {/* ═══ MAIN TITLE ═══ */}
          <h1
            className="text-center animate-title-entry"
            style={{
              fontFamily: '"Noto Serif SC", "Cormorant Garamond", serif',
              fontSize: 'clamp(24px, 3.6vw, 46px)',
              fontWeight: 500,
              letterSpacing: '0.06em',
              color: '#C4A265',
              lineHeight: 1.7,
              textShadow: '0 0 50px rgba(255,250,240,0.45), 0 0 100px rgba(255,248,240,0.2)',
            }}
          >
            亲爱的朋友
            <br />
            今天过得还好吗？
          </h1>

          {/* Thin gold line */}
          <div
            className="my-5 animate-fade-in"
            style={{
              width: '36px',
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(196,162,101,0.3), transparent)',
              animationDelay: '0.6s',
            }}
          />

          {/* Subtitle */}
          <p
            className="text-center animate-fade-in"
            style={{
              fontFamily: '"Noto Serif SC", "Cormorant Garamond", serif',
              fontSize: 'clamp(11px, 1.05vw, 14px)',
              fontWeight: 400,
              letterSpacing: '0.1em',
              color: '#8A7A70',
              opacity: 0.82,
              textShadow: '0 0 16px rgba(255,250,240,0.5)',
              animationDelay: '0.8s',
            }}
          >
            这里有一张牌，愿意听听你的故事。
          </p>

          {/* Heart divider */}
          <div className="flex items-center gap-2.5 my-5 animate-fade-in" style={{ animationDelay: '1s' }}>
            <div style={{ width: '18px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(196,162,101,0.25))' }} />
            <svg width="9" height="9" viewBox="0 0 24 24" fill="rgba(196,162,101,0.45)">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <div style={{ width: '18px', height: '1px', background: 'linear-gradient(to left, transparent, rgba(196,162,101,0.25))' }} />
          </div>

          {/* CTA Button */}
          <button
            onClick={handleExplore}
            className="flex items-center gap-2 px-8 py-2.5 rounded-full transition-all duration-300 cursor-none group animate-fade-in"
            style={{
              background: 'rgba(212,166,112,0.82)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 4px 20px rgba(180,140,90,0.15), inset 0 1px 0 rgba(255,255,255,0.15)',
              animationDelay: '1.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212,166,112,0.95)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(180,140,90,0.28), inset 0 1px 0 rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(212,166,112,0.82)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(180,140,90,0.15), inset 0 1px 0 rgba(255,255,255,0.15)';
            }}
            data-particle-burst
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)">
              <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
            </svg>
            <span
              className="text-sm tracking-[0.12em]"
              style={{
                fontFamily: '"Noto Serif SC", serif',
                color: '#FFF',
                fontWeight: 400,
              }}
            >
              开始探索
            </span>
          </button>

          {/* Bottom small text */}
          <p
            className="mt-5 text-center animate-fade-in"
            style={{
              fontFamily: '"Noto Serif SC", serif',
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: '#A89888',
              opacity: 0.55,
              animationDelay: '1.6s',
            }}
          >
            不必匆忙，慢慢来
          </p>
        </div>

        {/* ── Bottom bar ── */}
        <div className="relative z-10 flex flex-col items-center pb-6">
          <span
            className="text-xs tracking-[0.12em] animate-fade-in"
            style={{
              fontFamily: '"Noto Serif SC", serif',
              color: '#6B4C3B',
              opacity: 0.9,
              animationDelay: '1.8s',
            }}
          >
            让塔罗牌听你的心声
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6B4C3B"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-1.5 animate-fade-in"
            style={{ opacity: 0.45, animationDelay: '2s' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Bottom gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none z-[5]"
        style={{
          height: '10vh',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(245,237,228,0.3) 60%, rgba(245,237,228,0.8) 100%)',
        }}
      />

      <style>{`
        @keyframes candleFlicker {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          25% { opacity: 0.85; transform: scale(1.2); }
          55% { opacity: 0.55; transform: scale(0.92); }
          80% { opacity: 1; transform: scale(1.12); }
        }
        @keyframes dustRise {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          8% { opacity: var(--d-opacity, 0.15); }
          92% { opacity: var(--d-opacity, 0.15); }
          100% { transform: translateY(-30vh) translateX(12px); opacity: 0; }
        }
        @keyframes tyndallFloat {
          0%, 100% { transform: translate(0, 0); opacity: var(--t-opacity, 0.3); }
          25% { transform: translate(6px, -8px); opacity: calc(var(--t-opacity, 0.3) * 1.4); }
          50% { transform: translate(-3px, -4px); opacity: calc(var(--t-opacity, 0.3) * 0.7); }
          75% { transform: translate(5px, 3px); opacity: calc(var(--t-opacity, 0.3) * 1.1); }
        }
        @keyframes titleEntry {
          0% { opacity: 0; transform: translateY(18px); letter-spacing: 0.12em; }
          100% { opacity: 0.95; transform: translateY(0); letter-spacing: 0.06em; }
        }
        .animate-title-entry {
          animation: titleEntry 2.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          opacity: 0;
          animation: fadeIn 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </section>
  );
}
