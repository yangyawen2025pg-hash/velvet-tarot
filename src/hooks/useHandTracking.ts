import { useEffect, useRef, useState, useCallback } from 'react';

export type HandState = 'waiting' | 'detected' | 'shuffling' | 'selecting' | 'selected';

interface HandTrackingResult {
  handState: HandState;
  isHandPresent: boolean;
  isPushing: boolean;
  isRotating: boolean;
  rotationDirection: 'clockwise' | 'counter' | null;
  selected: boolean;
  cameraActive: boolean;
  error: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

export function useHandTracking(): HandTrackingResult {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [handState, setHandState] = useState<HandState>('waiting');
  const [isHandPresent, setIsHandPresent] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationDirection, setRotationDirection] = useState<'clockwise' | 'counter' | null>(null);
  const [selected, setSelected] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number>(0);
  const handHistoryRef = useRef<{ x: number; y: number; z: number; time: number }[]>([]);

  const detectHand = useCallback(async () => {
    if (!videoRef.current || !cameraActive) return;

    const video = videoRef.current;
    if (video.readyState < 2) {
      frameRef.current = requestAnimationFrame(detectHand);
      return;
    }

    try {
      // Simplified hand detection using frame differencing
      // and basic skin color detection as fallback
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 120;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, 160, 120);
      const imageData = ctx.getImageData(0, 0, 160, 120);
      const data = imageData.data;

      let skinPixels = 0;
      let centerX = 0, centerY = 0;

      // Simple skin detection (RGB range for skin tones)
      for (let i = 0; i < data.length; i += 16) { // sample every 4th pixel
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (r > 80 && g > 40 && b > 20 &&
            r > g && r > b &&
            Math.abs(r - g) > 15 &&
            r < 240 && g < 220 && b < 200) {
          skinPixels++;
          centerX += (i / 4) % 160;
          centerY += Math.floor((i / 4) / 160);
        }
      }

      if (skinPixels > 30) {
        centerX /= skinPixels;
        centerY /= skinPixels;

        const now = Date.now();
        handHistoryRef.current.push({ x: centerX, y: centerY, z: skinPixels, time: now });

        // Keep last 20 frames
        if (handHistoryRef.current.length > 20) {
          handHistoryRef.current = handHistoryRef.current.slice(-20);
        }

        setIsHandPresent(true);

        // Detect rotation (horizontal movement)
        if (handHistoryRef.current.length >= 10) {
          const recent = handHistoryRef.current.slice(-10);
          const firstX = recent[0].x;
          const lastX = recent[recent.length - 1].x;
          const diff = lastX - firstX;

          if (Math.abs(diff) > 15) {
            setIsRotating(true);
            setRotationDirection(diff > 0 ? 'clockwise' : 'counter');
          } else {
            setIsRotating(false);
            setRotationDirection(null);
          }

          // Detect push (sudden increase in size/proximity)
          const firstSize = recent[0].z;
          const lastSize = recent[recent.length - 1].z;
          if (lastSize > firstSize * 1.5 && !isPushing) {
            setIsPushing(true);
            setSelected(true);
            setTimeout(() => {
              setIsPushing(false);
              setSelected(false);
            }, 800);
          }
        }
      } else {
        setIsHandPresent(false);
        setIsRotating(false);
        setRotationDirection(null);
      }
    } catch {
      // ignore
    }

    frameRef.current = requestAnimationFrame(detectHand);
  }, [cameraActive, isPushing]);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 320, height: 240 }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
        setHandState('detected');
        frameRef.current = requestAnimationFrame(detectHand);
      }
    } catch {
      setError('无法访问摄像头，请检查权限设置');
    }
  }, [detectHand]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
    setCameraActive(false);
    setIsHandPresent(false);
    setIsRotating(false);
    setRotationDirection(null);
    setIsPushing(false);
    handHistoryRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    handState,
    isHandPresent,
    isPushing,
    isRotating,
    rotationDirection,
    selected,
    cameraActive,
    error,
    videoRef,
    startCamera,
    stopCamera,
  };
}
