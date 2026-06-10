import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Moon, Sparkles, ChevronLeft, Star } from 'lucide-react';
import type { Entry } from '@/types';

interface CrystalBallSectionProps {
  entries: Entry[];
  onBack: () => void;
}

export default function CrystalBallSection({ entries, onBack }: CrystalBallSectionProps) {
  const ballRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(contentRef.current, { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 });
    if (ballRef.current) gsap.from(ballRef.current, { scale: 0.5, opacity: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)', delay: 0.4 });
  }, []);

  const starCount = Math.min(entries.length, 30);
  const stars = Array.from({ length: starCount }, (_, i) => ({
    id: i, x: 15 + Math.random() * 70, y: 15 + Math.random() * 70,
    size: 2 + Math.random() * 3,
    color: ['#C4A265', '#D4A7A7', '#C4B5D4', '#A3B899', '#D4B896'][i % 5],
    delay: Math.random() * 3,
  }));

  return (
    <section id="crystal" className="relative min-h-[100dvh] py-12 flex flex-col items-center justify-center overflow-hidden">
      {/* Top fade-in 1/10 */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none" style={{ height: '10vh', background: 'linear-gradient(to bottom, rgba(232,237,229,0.95) 0%, rgba(232,237,229,0.7) 50%, transparent 100%)' }} />

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/images/bg-crystal.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(232,237,229,0.88) 0%, rgba(226,233,222,0.85) 50%, rgba(221,230,216,0.9) 100%)' }} />
      </div>

      <div ref={contentRef} className="relative z-10 w-full max-w-4xl mx-auto px-6">
        {/* Back button */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2.5 bg-white/60 rounded-full border border-dusty-rose/20 text-ink hover:bg-rose hover:text-pearl hover:border-rose transition-all" data-particle-burst>
            <ChevronLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Moon size={14} className="text-charcoal/55" />
              <span className="font-heading text-xs text-charcoal/55 tracking-[0.15em] uppercase">Crystal Memory</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-ink">星尘记忆</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Crystal Ball */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 -m-6 rounded-full animate-pulse-glow opacity-45" />
              <div ref={ballRef} className="relative w-[200px] h-[200px] md:w-[240px] md:h-[240px] rounded-full overflow-hidden"
                style={{ background: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3), transparent 50%)', boxShadow: 'inset 0 0 60px rgba(196,162,101,0.2), 0 0 40px rgba(164,181,212,0.3)' }}>
                <div className="absolute inset-0 rounded-full animate-mist" style={{ background: 'radial-gradient(circle at 30% 40%, rgba(196,162,101,0.2), transparent 60%)' }} />
                <div className="absolute inset-0 rounded-full animate-mist" style={{ background: 'radial-gradient(circle at 60% 60%, rgba(196,181,212,0.25), transparent 55%)', animationDelay: '-3s', animationDuration: '12s' }} />
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  {stars.map(s => <div key={s.id} className="absolute rounded-full animate-twinkle"
                    style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, backgroundColor: s.color, boxShadow: `0 0 ${s.size * 2}px ${s.color}`, animationDelay: `${s.delay}s` }} />)}
                  {entries.length === 0 && <div className="absolute inset-0 flex items-center justify-center"><p className="font-body text-xs text-charcoal/40 text-center">写下第一封信<br/>点亮第一颗星</p></div>}
                </div>
                <div className="absolute top-[8%] left-[15%] w-[30%] h-[20%] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.3), transparent 70%)' }} />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[60px] h-[14px] rounded-full blur-md" style={{ background: 'rgba(58,42,42,0.1)' }} />
            </div>
          </div>

          {/* Right: All entries */}
          <div className="bg-white/30 backdrop-blur-sm rounded-card p-5 border border-white/25 max-h-[60vh] overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={13} className="text-gold" />
              <span className="font-heading text-xs text-gold tracking-wider uppercase">你的记忆星星</span>
              <span className="font-heading text-sm text-ink ml-1">{entries.length} 颗</span>
            </div>

            {entries.length === 0 ? (
              <div className="text-center py-8">
                <Star size={28} className="text-charcoal/25 mx-auto mb-2" />
                <p className="font-body text-sm text-charcoal/50">还没有记忆星星</p>
                <p className="font-body text-xs text-charcoal/30 mt-1">去抽牌后写一封信给自己吧</p>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <div key={entry.id} className="bg-white/25 rounded-lg p-3 border border-white/15">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-body text-[10px] text-charcoal/50">
                        {new Date(entry.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex gap-1">
                        {entry.moodKeywords.slice(0, 2).map(kw => (
                          <span key={kw} className="px-1.5 py-0.5 bg-gold/10 rounded-full font-body text-[9px] text-gold">{kw}</span>
                        ))}
                      </div>
                    </div>
                    <p className="font-body text-sm text-ink/80 italic line-clamp-2">"{entry.text}"</p>
                    {entry.question && <p className="font-body text-[10px] text-charcoal/40 mt-1">Q: {entry.question}</p>}
                    <div className="flex gap-1 mt-1.5">
                      {entry.drawnCards.slice(0, 4).map(c => (
                        <span key={c.id} className="font-body text-[9px] text-gold/50">{c.name}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom message */}
        <div className="mt-8 text-center">
          <p className="font-body text-base text-ink/80">过去的自己，请向前走吧</p>
          <p className="font-display text-lg text-gold/90">你看，今天的自己也没有那么糟糕</p>
        </div>
      </div>
    </section>
  );
}
