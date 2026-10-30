import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { tarotCards, cardBackImage, fourCardSpread } from '@/lib/tarotData';
import { shuffleTarotDeck } from '@/lib/tarotRandom';
import { RotateCcw, Sparkles, Send, X, Feather, ChevronLeft, Camera, Hand } from 'lucide-react';
import type { TarotCard as TarotCardType } from '@/types';
import { trackEvent } from '@/lib/analytics';

type Phase = 'idle' | 'camera-request' | 'camera-loading' | 'camera-active' | 'shuffling' | 'selecting' | 'done';

interface CardDrawSectionProps {
  onSaveEntry: (text: string, question: string, cards: TarotCardType[]) => void;
  onBack: () => void;
  onViewLetters: () => void;
}

export default function CardDrawSection({ onSaveEntry, onBack, onViewLetters }: CardDrawSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [question, setQuestion] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const phaseRef = useRef<Phase>('idle');
  const [drawnCards, setDrawnCards] = useState<TarotCardType[]>([]);
  const drawnCardsRef = useRef<TarotCardType[]>([]);
  // One uniformly shuffled, immutable draw order per reading, shared by both modes.
  const deckRef = useRef<TarotCardType[]>([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const selectedCountRef = useRef(0);
  const [revealed, setRevealed] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [handMessage, setHandMessage] = useState('');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [letterText, setLetterText] = useState('');
  const [letterSubmitted, setLetterSubmitted] = useState(false);
  const [letterChoice, setLetterChoice] = useState<'unselected' | 'write' | 'skip'>('unselected');
  const [interpretation, setInterpretation] = useState('');
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const handHistoryRef = useRef<number[]>([]);

  // Keep phase ref in sync
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { drawnCardsRef.current = drawnCards; }, [drawnCards]);
  useEffect(() => { selectedCountRef.current = selectedCount; }, [selectedCount]);

  useEffect(() => {
    gsap.from(contentRef.current, { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 });
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // Stop camera on unmount
  useEffect(() => {
    return () => { if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; } };
  }, []);

  // ===== CAMERA + HAND TRACKING =====
  const startCamera = useCallback(async () => {
    deckRef.current = shuffleTarotDeck(tarotCards);
    trackEvent('tarot_start', { module: 'draw', method: 'gesture' });
    setCameraError('');
    setPhase('camera-loading');
    phaseRef.current = 'camera-loading';

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 320, height: 240 }
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        // Camera is active now
        setPhase('camera-active');
        phaseRef.current = 'camera-active';
        setHandMessage('请伸出你的手掌 ✋');

        // Start detection loop
        runDetectionLoop('wait-hand');
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      setCameraError('无法访问摄像头，将使用自动洗牌');
      setTimeout(() => proceedWithShuffle(), 1500);
    }
  }, []);

  // Unified detection loop using refs to avoid closure traps
  const runDetectionLoop = useCallback((mode: 'wait-hand' | 'shuffle' | 'shuffle-wait' | 'select') => {
    let frameCount = 0;
    let handWasPresent = false;
    let pushCooldown = 0;

    const detect = () => {
      const currentPhase = phaseRef.current;
      if (currentPhase === 'done' || currentPhase === 'idle') return;

      if (!videoRef.current) { rafRef.current = requestAnimationFrame(detect); return; }
      const v = videoRef.current;
      if (v.readyState < 2 || v.paused) { rafRef.current = requestAnimationFrame(detect); return; }

      // Skin detection on a small canvas
      const c = document.createElement('canvas');
      c.width = 120; c.height = 90;
      const ctx = c.getContext('2d');
      if (!ctx) { rafRef.current = requestAnimationFrame(detect); return; }
      ctx.drawImage(v, 0, 0, 120, 90);
      const d = ctx.getImageData(0, 0, 120, 90).data;

      let skinPixels = 0;
      for (let i = 0; i < d.length; i += 12) {
        const r = d[i], g = d[i+1], b = d[i+2];
        if (r > 85 && g > 35 && b > 20 && r > g && r > b && r < 245) skinPixels++;
      }

      const isHandPresent = skinPixels > 25;

      // === MODE: wait-hand ===
      if (mode === 'wait-hand') {
        if (isHandPresent) {
          // Hand detected! Start shuffling
          setPhase('shuffling');
          phaseRef.current = 'shuffling';
          setIsShuffling(true);
          setHandMessage('手掌已识别！正在顺时针洗牌...');

          // Animate rotation
          let angle = 0;
          const spin = () => {
            angle += 4;
            setRotationAngle(angle);
            if (angle < 1080) requestAnimationFrame(spin);
            else {
              // Shuffle done, go to select mode
              setIsShuffling(false);
              setHandMessage('请向前推出手掌，选出一张牌 👋');
              // Switch to select mode
              mode = 'select';
              handWasPresent = true;
              pushCooldown = 0;
              handHistoryRef.current = [];
            }
          };
          requestAnimationFrame(spin);
          // Continue detecting but now in select mode
          mode = 'shuffle-wait'; // transitional
        } else {
          frameCount++;
          if (frameCount % 60 === 0) {
            setHandMessage('请伸出你的手掌 ✋ (将手掌放在摄像头前)');
          }
        }
      }

      // === MODE: select (push to pick card) ===
      if (mode === 'select') {
        pushCooldown = Math.max(0, pushCooldown - 1);

        if (isHandPresent) {
          handHistoryRef.current.push(skinPixels);
          if (handHistoryRef.current.length > 12) handHistoryRef.current.shift();

          // Detect push: sudden size increase
          if (handHistoryRef.current.length >= 8 && pushCooldown === 0) {
            const arr = handHistoryRef.current;
            const mid = Math.floor(arr.length / 2);
            const before = arr.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
            const after = arr.slice(mid).reduce((a, b) => a + b, 0) / (arr.length - mid);

            if (after > before * 1.5) {
              // PUSH detected! Select a card
              pushCooldown = 30; // 0.5s cooldown
              const newCount = selectedCountRef.current + 1;
              selectedCountRef.current = newCount;
              setSelectedCount(newCount);

              // Reveal the next card from this reading's uniformly shuffled deck.
              const card = deckRef.current[newCount - 1];
              if (card) {
                const newCards = [...drawnCardsRef.current, card];
                drawnCardsRef.current = newCards;
                setDrawnCards(newCards);
              }

              setHandMessage(`第 ${newCount}/4 张已选出！`);
              handHistoryRef.current = [];

              if (newCount >= 4) {
                // All 4 cards selected!
                setTimeout(() => {
                  setPhase('done');
                  phaseRef.current = 'done';
                  setHandMessage('四张牌已选出');
                  trackEvent('tarot_complete', { module: 'draw', method: 'gesture', card_count: 4 });
                  if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
                }, 600);
                return; // Stop detection
              } else {
                // Continue with brief rotation between picks
                let angle = rotationAngle;
                setIsShuffling(true);
                const spin2 = () => {
                  angle += 5;
                  setRotationAngle(angle);
                  if (angle < rotationAngle + 360) requestAnimationFrame(spin2);
                  else {
                    setIsShuffling(false);
                    setHandMessage('继续向前推出手掌，选出下一张牌 👋');
                  }
                };
                requestAnimationFrame(spin2);
              }
            }
          }
        }

        if (!isHandPresent && handWasPresent) {
          setHandMessage('手掌离开了...请再次伸入手掌');
          handWasPresent = false;
        } else if (isHandPresent) {
          handWasPresent = true;
        }
      }

      rafRef.current = requestAnimationFrame(detect);
    };

    rafRef.current = requestAnimationFrame(detect);
  }, [rotationAngle]);

  // Fallback: auto shuffle without camera
  const proceedWithShuffle = useCallback(() => {
    setPhase('shuffling');
    phaseRef.current = 'shuffling';
    setIsShuffling(true);
    setHandMessage('自动洗牌中...');
    let angle = 0;
    const spin = () => {
      angle += 5;
      setRotationAngle(angle);
      if (angle < 1080) requestAnimationFrame(spin);
      else {
        setIsShuffling(false);
        // Auto select 4 cards
        // Camera fallback reuses the original deck; a direct auto draw initializes it.
        const picked = deckRef.current.slice(0, 4);
        drawnCardsRef.current = picked;
        setDrawnCards(picked);
        selectedCountRef.current = 4;
        setSelectedCount(4);
        setTimeout(() => {
          setPhase('done');
          phaseRef.current = 'done';
          setHandMessage('四张牌已选出');
          trackEvent('tarot_complete', { module: 'draw', method: 'automatic', card_count: 4 });
        }, 600);
      }
    };
    requestAnimationFrame(spin);
  }, []);

  // Generate interpretation
  const generateInterpretation = useCallback(() => {
    if (drawnCards.length === 0) return '';
    const positions = ['我现在的情绪', '为什么会这样', '我忽略了什么', '我该如何照顾自己'];
    let text = `针对你的问题，四张牌给出了以下指引：\n\n`;
    drawnCards.forEach((card, i) => {
      text += `${i + 1}. ${positions[i]} — ${card.name}\n   ${card.upright}\n\n`;
    });
    if (question) {
      text += `关于「${question}」：${drawnCards[0].name}反映了你当下的真实感受；${drawnCards[1].name}揭示了背后的深层原因；${drawnCards[2].name}提示了你可能忽略的角度；${drawnCards[3].name}给出了温柔的行动指引。\n\n记住，塔罗不是预言，而是一面镜子。答案一直在你心里。`;
    }
    return text;
  }, [drawnCards, question]);

  const handleGetInterpretation = () => {
    trackEvent('tarot_interpretation_view', { module: 'draw' });
    setInterpretation(generateInterpretation());
    setRevealed(true);
  };

  const handleLetterSubmit = () => {
    if (!letterText.trim()) return;
    onSaveEntry(letterText.trim(), question, drawnCards);
    trackEvent('letter_saved', { module: 'draw' });
    setLetterSubmitted(true);
    setShowLetter(false);
  };

  const handleReset = () => {
    setDrawnCards([]); drawnCardsRef.current = []; deckRef.current = [];
    setSelectedCount(0); selectedCountRef.current = 0;
    setPhase('idle'); phaseRef.current = 'idle';
    setRevealed(false); setInterpretation('');
    setLetterSubmitted(false); setLetterText(''); setLetterChoice('unselected');
    setRotationAngle(0); setHandMessage('');
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  // Stacked cards for the table
  const stackedCards = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i * 30) + (Math.random() * 15 - 7.5),
    offsetX: Math.cos(i * 0.5) * 10 + (Math.random() * 6 - 3),
    offsetY: Math.sin(i * 0.5) * 10 + (Math.random() * 6 - 3),
    scale: 0.85 + Math.random() * 0.15,
  }));

  // Determine what to show on the left
  const showTable = phase !== 'done';
  const showCards2x2 = phase === 'done' && drawnCards.length > 0;

  return (
    <section id="draw" className="relative min-h-[100dvh] py-12 overflow-hidden bg-blush/30">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/images/bg-draw.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(245,237,228,0.88) 0%, rgba(240,232,222,0.85) 50%, rgba(237,229,216,0.9) 100%)' }} />
      </div>
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none" style={{ height: '10vh', background: 'linear-gradient(to bottom, rgba(245,237,228,0.95) 0%, rgba(245,237,228,0.7) 50%, transparent 100%)' }} />

      <div ref={contentRef} className="relative z-10 max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2.5 bg-pearl/80 rounded-full border border-dusty-rose/20 text-charcoal hover:bg-rose hover:text-pearl transition-all" data-particle-burst>
            <ChevronLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-gold" />
              <span className="font-heading text-xs text-gold tracking-[0.15em] uppercase">Tarot Reading</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-ink">向塔罗提问</h2>
          </div>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${showCards2x2 ? 'lg:items-stretch' : 'items-start'}`}>
          {/* LEFT: Cards 2x2 - compact, max 40% width */}
          <div className={`${showCards2x2 ? 'lg:col-span-5' : 'lg:col-span-7'} flex flex-col`}>
            {showTable && (
              <div className="flex flex-col items-center">
                {/* Camera preview */}
                {(phase === 'camera-active' || phase === 'camera-loading' || phase === 'shuffling' || phase === 'selecting') && (
                  <div className="mb-4 relative w-[200px] h-[150px] rounded-lg overflow-hidden border-2 border-gold/40 shadow-glow bg-ink/50">
                    <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {phase === 'camera-loading' && (
                        <div className="px-3 py-1.5 rounded-full bg-ink/60 text-pearl font-body text-xs">
                          正在启动摄像头...
                        </div>
                      )}
                      {phase === 'camera-active' && (
                        <div className="px-3 py-1.5 rounded-full bg-gold/80 text-ink font-body text-xs flex items-center gap-1.5 animate-pulse">
                          <Hand size={12} /> {handMessage}
                        </div>
                      )}
                      {(phase === 'shuffling' || phase === 'selecting') && (
                        <div className={`px-3 py-1.5 rounded-full font-body text-xs ${phase === 'selecting' ? 'bg-gold/80 text-ink' : 'bg-ink/60 text-pearl'}`}>
                          <div className="flex items-center gap-1.5">
                            <Hand size={12} /> {handMessage}
                          </div>
                        </div>
                      )}
                    </div>
                    {cameraError && (
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-rose/80 text-pearl font-body text-xs text-center">
                        {cameraError}
                      </div>
                    )}
                  </div>
                )}

                {/* Circular table */}
                <div className="relative w-[260px] h-[260px] md:w-[320px] md:h-[320px]">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-b from-rose/20 via-blush/25 to-rose/15 border border-gold/15 shadow-medium" />
                  <div className="absolute inset-2 rounded-full border border-gold/8" />
                  <div className="absolute inset-5 rounded-full bg-gradient-to-b from-cream/35 to-blush/25" />

                  {/* Stacked cards - rotate with shuffle */}
                  <div className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: `rotate(${rotationAngle}deg)`, transition: isShuffling ? 'none' : 'transform 0.4s ease-out' }}>
                    {stackedCards.map((card) => (
                      <div key={card.id}
                        className="absolute w-[46px] h-[72px] md:w-[54px] md:h-[84px] rounded-md overflow-hidden shadow-soft border border-gold/10"
                        style={{ transform: `translate(${card.offsetX}px, ${card.offsetY}px) rotate(${card.angle}deg) scale(${card.scale})` }}>
                        <img src={cardBackImage} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gold/15 border border-gold/25 flex items-center justify-center">
                    <Sparkles size={14} className="text-gold/50" />
                  </div>
                </div>

                {/* Phase dots */}
                <div className="mt-4 flex items-center gap-2">
                  {['idle/camera', 'shuffling', 'selecting', 'done'].map((label, i) => {
                    const isActive =
                      (i === 0 && (phase === 'idle' || phase === 'camera-request' || phase === 'camera-loading' || phase === 'camera-active')) ||
                      (i === 1 && phase === 'shuffling') ||
                      (i === 2 && phase === 'selecting');
                    return <div key={label} className={`w-2 h-2 rounded-full transition-all ${isActive ? 'bg-gold scale-125' : 'bg-dusty-rose/25'}`} />;
                  })}
                </div>
                <p className="font-body text-xs text-charcoal/45 mt-1.5">
                  {phase === 'idle' && '准备洗牌'}
                  {phase === 'camera-request' && '选择洗牌方式'}
                  {phase === 'camera-loading' && '正在启动摄像头...'}
                  {phase === 'camera-active' && '等待手掌进入画面'}
                  {phase === 'shuffling' && '顺时针洗牌中'}
                  {phase === 'selecting' && `已选出 ${selectedCount}/4 张`}
                </p>
              </div>
            )}

            {/* 2x2 result cards - compact, centered, NOT enlarged */}
            {showCards2x2 && (
              <div className="flex flex-col justify-center h-full">
                <div className="max-w-[280px] mx-auto w-full">
                  <div className="grid grid-cols-2 gap-2.5">
                    {drawnCards.map((card, i) => (
                      <div key={card.id} className="bg-pearl/85 rounded-card p-2 border border-gold/15 shadow-soft">
                        <p className="font-heading text-[10px] text-gold mb-0.5">{fourCardSpread[i].label}</p>
                        <p className="font-body text-[9px] text-charcoal/45 mb-1.5">{fourCardSpread[i].question}</p>
                        <div className="aspect-[2/3] rounded-md overflow-hidden border border-gold/25">
                          <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                        </div>
                        <p className="font-heading text-xs text-ink text-center mt-1.5">{card.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Question Panel - 60% */}
          <div className={`${showCards2x2 ? 'lg:col-span-7' : 'lg:col-span-5'} flex flex-col h-full`}>
            <div className="bg-pearl/90 backdrop-blur-sm rounded-card p-5 shadow-soft border border-gold/15 flex flex-col h-full">
              <h3 className="font-heading text-lg text-ink mb-3 flex items-center gap-2">
                <Feather size={18} className="text-gold" />写下你的问题
              </h3>
              <textarea value={question} onChange={(e) => setQuestion(e.target.value)}
                placeholder="慢慢闭上眼睛，在心中默念你的问题..."
                className={`w-full p-3 bg-cream/50 border border-dusty-rose/15 rounded-input font-body text-ink placeholder:text-dusty-rose/35 resize-none focus:outline-none focus:border-gold focus:shadow-glow transition-all duration-300 mb-3 ${showCards2x2 ? 'flex-1 min-h-[120px]' : 'min-h-[80px]'}`} />

              <div className="grid grid-cols-2 gap-2 mb-4">
                {fourCardSpread.map((pos) => (
                  <div key={pos.position} className="py-2 px-3 bg-gold/8 border border-gold/25 rounded-lg">
                    <p className="font-heading text-[10px] text-gold">{pos.label}</p>
                    <p className="font-body text-xs text-charcoal">{pos.question}</p>
                  </div>
                ))}
              </div>

              {/* Phase: idle -> show start button */}
              {phase === 'idle' && (
                <button onClick={() => { setPhase('camera-request'); phaseRef.current = 'camera-request'; }}
                  className="w-full py-3 bg-ink text-pearl font-heading text-sm rounded-pill tracking-wider transition-all hover:bg-gold hover:text-ink flex items-center justify-center gap-2"
                  data-particle-burst>
                  <Sparkles size={16} /> 开始洗牌
                </button>
              )}

              {/* Phase: camera-request -> show camera options */}
              {phase === 'camera-request' && (
                <div className="p-4 bg-cream/50 rounded-lg text-center">
                  <Camera size={24} className="text-gold mx-auto mb-2" />
                  <p className="font-body text-sm text-ink mb-1">体验手势交互洗牌</p>
                  <p className="font-body text-xs text-charcoal/55 mb-4">通过摄像头识别手掌动作来洗牌和选牌</p>
                  <div className="flex gap-2">
                    <button onClick={startCamera}
                      className="flex-1 py-2.5 bg-gold/80 text-ink font-heading text-sm rounded-pill hover:bg-gold transition-all flex items-center justify-center gap-1.5"
                      data-particle-burst>
                      <Hand size={14} /> 开启手势体验
                    </button>
                    <button onClick={() => { deckRef.current = shuffleTarotDeck(tarotCards); trackEvent('tarot_start', { module: 'draw', method: 'automatic' }); proceedWithShuffle(); }}
                      className="flex-1 py-2.5 bg-cream border border-dusty-rose/25 text-charcoal font-heading text-sm rounded-pill hover:bg-blush transition-all">
                      自动洗牌
                    </button>
                  </div>
                </div>
              )}

              {/* Loading / Active / Shuffling / Selecting states */}
              {(phase === 'camera-loading' || phase === 'camera-active' || phase === 'shuffling' || phase === 'selecting') && (
                <div className="p-3 bg-cream/40 rounded-lg">
                  <div className="flex items-center gap-2 text-charcoal/60">
                    <div className={`w-2 h-2 rounded-full ${phase === 'camera-loading' ? 'bg-gold animate-pulse' : 'bg-sage'}`} />
                    <p className="font-body text-sm">
                      {phase === 'camera-loading' && '正在启动摄像头...'}
                      {phase === 'camera-active' && '请伸出你的手掌 ✋'}
                      {phase === 'shuffling' && '顺时针洗牌中...'}
                      {phase === 'selecting' && `向前推出手掌选牌 (${selectedCount}/4)`}
                    </p>
                  </div>
                </div>
              )}

              {/* Done state */}
              {phase === 'done' && (
                <div className="p-4 bg-sage/10 rounded-lg text-center border border-sage/20 mt-auto">
                  <Sparkles size={18} className="text-sage mx-auto mb-1.5" />
                  <p className="font-heading text-sm text-ink">四张牌已选出</p>
                  <p className="font-body text-xs text-charcoal/45 mt-1">点击下方「获取解析」查看牌面启示</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Centered: Get Interpretation + Result + Actions */}
        {showCards2x2 && (
          <div className="mt-6 flex flex-col items-center">
            {!revealed ? (
              <button onClick={handleGetInterpretation}
                className="px-10 py-3 bg-ink text-pearl font-heading text-sm rounded-pill tracking-wider transition-all hover:bg-gold hover:text-ink hover:shadow-glow flex items-center gap-2"
                data-particle-burst>
                <Sparkles size={16} /> 获取解析
              </button>
            ) : (
              <>
                <div className="bg-pearl/85 rounded-card p-5 border border-gold/15 shadow-soft max-w-lg w-full mx-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-gold" />
                    <span className="font-heading text-sm text-gold">牌面启示</span>
                  </div>
                  <pre className="font-body text-sm text-charcoal leading-relaxed whitespace-pre-wrap">{interpretation}</pre>
                </div>

                {!letterSubmitted && letterChoice !== 'skip' && (
                  <div className="mt-5 w-full max-w-lg rounded-card bg-pearl/85 border border-lavender/30 p-5 text-center shadow-soft">
                    <h3 className="font-heading text-lg text-ink mb-2">此刻，有什么想对自己说的吗？</h3>
                    <p className="font-body text-sm text-charcoal/65 mb-4">你可以把心情留在这里，也可以暂时不写。</p>
                    <button onClick={() => {
                      if (letterChoice !== 'write') trackEvent('letter_choice', { module: 'draw', choice: 'write' });
                      trackEvent('letter_compose_open', { module: 'draw' });
                      setLetterChoice('write');
                      setShowLetter(true);
                    }}
                      className="w-full py-3 bg-lavender/25 border border-lavender/40 text-ink font-heading text-sm rounded-pill hover:bg-lavender/45 transition-all flex items-center justify-center gap-2"
                      data-particle-burst>
                      <Feather size={14} /> 写一封给自己的信
                    </button>
                    <button onClick={() => {
                      if (letterChoice === 'unselected') trackEvent('letter_choice', { module: 'draw', choice: 'skip' });
                      setLetterChoice('skip');
                    }} className="mt-3 font-body text-sm text-charcoal/60 hover:text-ink underline underline-offset-4">
                      现在不想写，先看看牌面启示
                    </button>
                  </div>
                )}
                {letterChoice === 'skip' && !letterSubmitted && (
                  <p className="mt-4 font-body text-sm text-charcoal/60">好的，想记录的时候，随时可以再来。</p>
                )}
                {letterSubmitted && (
                  <div className="mt-5 text-center space-y-3" role="status">
                    <p className="font-heading text-sm text-gold">信件已保存到此设备</p>
                    <p className="font-body text-xs text-charcoal/60">你可以到「时光信笺」重新阅读。</p>
                    <button onClick={onViewLetters}
                      className="px-6 py-2.5 bg-lavender/25 border border-lavender/40 text-ink rounded-pill font-heading text-sm hover:bg-lavender/45">
                      查看我的信件
                    </button>
                  </div>
                )}

                <button onClick={handleReset}
                  className="mt-4 flex items-center gap-1.5 px-4 py-2 text-charcoal/45 font-body text-sm hover:text-gold transition-all"
                  data-particle-burst>
                  <RotateCcw size={14} /> 重新抽牌
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Letter Modal */}
      {showLetter && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={() => !letterSubmitted && setShowLetter(false)}>
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" />
          <div className="relative bg-pearl rounded-card p-6 md:p-8 shadow-medium max-w-md w-full max-h-[85vh] overflow-y-auto border border-cream" onClick={(e) => e.stopPropagation()}>
            {!letterSubmitted ? (
              <>
                <button onClick={() => setShowLetter(false)} className="absolute top-4 right-4 text-dusty-rose hover:text-ink transition-colors"><X size={20} /></button>
                <div className="text-center mb-5">
                  <Feather size={22} className="text-gold mx-auto mb-2" />
                  <h3 className="font-display text-xl text-ink">写一封给自己的信</h3>
                  <p className="font-body text-sm text-charcoal/60 mt-1">文字会保存在当前设备；清除浏览器数据可能导致记录丢失。</p>
                </div>
                <div className="mb-3">
                  <p className="font-heading text-[11px] text-dusty-rose uppercase tracking-wider mb-1">你问塔罗的问题</p>
                  <p className="font-body text-base text-ink">{question || '（没有写下问题）'}</p>
                </div>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {drawnCards.map((c) => <span key={c.id} className="px-3 py-1 bg-gold/10 border border-gold/20 rounded-full font-body text-xs text-gold">{c.name}</span>)}
                </div>
                <div className="relative mb-4">
                  <textarea value={letterText} onChange={(e) => setLetterText(e.target.value)}
                    placeholder="亲爱的自己，今天我想对你说..."
                    className="w-full min-h-[160px] p-5 bg-cream/40 border border-dusty-rose/15 rounded-card font-body text-ink placeholder:text-dusty-rose/30 resize-none focus:outline-none focus:border-gold/40 transition-all duration-300 leading-[1.8]"
                    style={{ backgroundImage: 'linear-gradient(transparent 29px, rgba(158,123,123,0.08) 30px)', backgroundSize: '100% 30px', lineHeight: '30px' }} />
                </div>
                <button onClick={handleLetterSubmit} disabled={!letterText.trim()}
                  className="w-full py-3 bg-gold/80 text-ink font-heading text-sm rounded-pill hover:bg-gold hover:shadow-glow disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                  data-particle-burst><Send size={15} /> 封存这封信</button>
              </>
            ) : (
              <div className="text-center py-10">
                <div className="relative inline-block mb-4">
                  <div className="w-12 h-16 bg-cream border border-gold/40 rounded mx-auto flex items-center justify-center"><Sparkles size={20} className="text-gold" /></div>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-7 bg-cream border border-gold/40 rounded-t-full" />
                </div>
                <p className="font-heading text-gold animate-twinkle">信件已封存，化作星光</p>
                <p className="font-body text-xs text-charcoal/50 mt-2">你可以在水晶球中看见它</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
