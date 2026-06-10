import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Moon, Sparkles, Star, ChevronDown } from 'lucide-react';
import type { Entry } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface ShowcaseCrystalProps {
  entries: Entry[];
  onEnter: () => void;
}

export default function ShowcaseCrystal({ entries, onEnter }: ShowcaseCrystalProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' } });
    }, sectionRef.current!);
    return () => ctx.revert();
  }, []);

  const latestEntry = entries[0];
  const starCount = Math.min(entries.length, 30);
  const stars = Array.from({ length: starCount }, (_, i) => ({
    id: i, x: 15 + Math.random() * 70, y: 15 + Math.random() * 70,
    size: 2 + Math.random() * 3,
    color: ['#C4A265', '#D4A7A7', '#C4B5D4', '#A3B899', '#D4B896'][i % 5],
    delay: Math.random() * 3,
  }));

  return (
    <section id="showcase-crystal" ref={sectionRef} className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background — soft sage, clean */}
      <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(180deg, #E8EDE5 0%, #E2E9DE 50%, #DDE6D8 100%)' }} />
      <div className="absolute inset-0 z-[1] opacity-[0.03]" style={{ backgroundImage: 'url(/images/bg-crystal.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'saturate(0.3)' }} />

      <div ref={contentRef} className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Moon size={14} className="text-charcoal/50" />
            <span className="font-heading text-xs text-charcoal/50 tracking-[0.2em] uppercase">Crystal Memory</span>
            <Moon size={14} className="text-charcoal/50" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-ink mb-2">星尘记忆</h2>
          <p className="font-body text-charcoal/70 text-base max-w-lg mx-auto">
            每一颗星星，都是你曾写给自己的心语
          </p>
        </div>

        {/* Crystal Ball + Left-Right Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left: Description (cols 1-4) */}
          <div className="md:col-span-4 order-2 md:order-1">
            <div className="bg-white/40 backdrop-blur-sm rounded-card p-5 border border-sage/20 shadow-soft">
              <p className="font-body text-ink/85 leading-relaxed mb-4">
                当你把心事说给塔罗听，它不会回答你，但会让你在说出问题的那一刻，
                就已经找到了答案的方向。每一句写给自己的话，都会化作星星，
                永远闪烁在你的记忆里。
              </p>
              <p className="font-body text-sm text-charcoal/50 italic mb-5">
                "最深的话，只说给自己听。"
              </p>
              <button onClick={onEnter}
                className="px-6 py-2.5 bg-white/50 border border-sage/30 text-ink font-heading text-sm rounded-pill tracking-wider transition-all hover:bg-white/70 hover:shadow-soft flex items-center gap-2"
                data-particle-burst>
                <Moon size={14} />
                凝视水晶球
              </button>
            </div>
          </div>

          {/* Center: Crystal Ball (cols 5-8) */}
          <div className="md:col-span-4 order-1 md:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 -m-6 rounded-full animate-pulse-glow opacity-40" />
              <div className="relative w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full overflow-hidden"
                style={{ background: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3), transparent 50%)', boxShadow: 'inset 0 0 50px rgba(196,162,101,0.2), 0 0 35px rgba(164,181,212,0.3)' }}>
                <div className="absolute inset-0 rounded-full animate-mist" style={{ background: 'radial-gradient(circle at 30% 40%, rgba(196,162,101,0.2), transparent 60%)' }} />
                <div className="absolute inset-0 rounded-full animate-mist" style={{ background: 'radial-gradient(circle at 60% 60%, rgba(196,181,212,0.25), transparent 55%)', animationDelay: '-3s', animationDuration: '12s' }} />
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  {stars.map(s => <div key={s.id} className="absolute rounded-full animate-twinkle"
                    style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, backgroundColor: s.color, boxShadow: `0 0 ${s.size * 2}px ${s.color}`, animationDelay: `${s.delay}s` }} />)}
                  {entries.length === 0 && <div className="absolute inset-0 flex items-center justify-center"><p className="font-body text-[11px] text-charcoal/35 text-center">写下第一封信<br/>点亮第一颗星</p></div>}
                </div>
                <div className="absolute top-[8%] left-[15%] w-[30%] h-[20%] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.3), transparent 70%)' }} />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[60px] h-[14px] rounded-full blur-md" style={{ background: 'rgba(58,42,42,0.1)' }} />
            </div>
          </div>

          {/* Right: User History (cols 9-12) */}
          <div className="md:col-span-4 order-3">
            <div className="bg-white/40 backdrop-blur-sm rounded-card p-5 border border-sage/20 shadow-soft">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={13} className="text-gold" />
                <span className="font-heading text-xs text-gold tracking-wider uppercase">你的记忆</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Star size={14} className="text-gold" />
                <span className="font-heading text-sm text-ink">
                  记忆星星: <span className="text-gold">{entries.length}</span>
                </span>
              </div>
              {latestEntry && (
                <div className="bg-white/50 rounded-lg p-3">
                  <p className="font-heading text-[10px] text-gold/70 uppercase tracking-wider mb-1">最新心语</p>
                  <p className="font-body text-sm text-ink/80 italic line-clamp-2">"{latestEntry.text}"</p>
                  <p className="font-body text-[10px] text-charcoal/40 mt-1">
                    {new Date(latestEntry.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              )}
              {entries.length === 0 && (
                <p className="font-body text-sm text-charcoal/50 text-center py-3">
                  还没有写下任何信件...<br />
                  <span className="text-xs">去开启你的第一封信吧</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section bottom hint */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 pointer-events-auto">
        <span className="font-body text-sm text-charcoal/50 tracking-wider">往日信件在等你</span>
        <ChevronDown size={16} className="text-charcoal/40 animate-bounce" />
      </div>
    </section>
  );
}
