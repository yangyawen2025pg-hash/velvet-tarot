import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Star, ChevronDown, Feather } from 'lucide-react';
import type { Reading } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface ShowcaseTarotProps {
  readings: Reading[];
  onEnter: () => void;
}

export default function ShowcaseTarot({ readings, onEnter }: ShowcaseTarotProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' } });
    }, sectionRef.current!);
    return () => ctx.revert();
  }, []);

  const latestReading = readings[0];

  return (
    <section id="showcase-tarot" ref={sectionRef} className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background — soft solid color, clean and breathable */}
      <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(180deg, #F5EDE4 0%, #F0E8DE 50%, #EDE5D8 100%)' }} />
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.03]" style={{ backgroundImage: 'url(/images/bg-draw.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'saturate(0.3)' }} />

      <div ref={contentRef} className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles size={14} className="text-gold" />
            <span className="font-heading text-xs text-gold tracking-[0.2em] uppercase">Tarot Reading</span>
            <Sparkles size={14} className="text-gold" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-ink mb-3">牌语心言</h2>
          <p className="font-body text-ink/70 text-base max-w-lg mx-auto leading-relaxed">
            在静谧中闭上眼，让心灵与塔罗对话。<br />
            <span className="text-sm text-ink/45">四张牌，四个维度，照见你内心深处的答案。</span>
          </p>
        </div>

        {/* Left-Right Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Description + Button */}
          <div className="text-center md:text-left">
            <div className="bg-pearl/70 backdrop-blur-sm rounded-card p-6 border border-gold/15 shadow-soft">
              <Feather size={20} className="text-gold mb-3 mx-auto md:mx-0" />
              <p className="font-body text-ink leading-relaxed mb-4">
                当你心中有一个问题无处倾诉时，塔罗牌是最好的倾听者。
                它们不会评判，只会用古老的智慧为你照亮前行的路。
                每一次抽牌，都是与自己的一次深度对话。
              </p>
              <p className="font-body text-sm text-charcoal/60 italic mb-5">
                "牌面不会告诉你该做什么，但会让你看见自己真正想要什么。"
              </p>
              <button onClick={onEnter}
                className="px-8 py-3 bg-ink text-pearl font-heading text-sm rounded-pill tracking-wider transition-all hover:bg-gold hover:text-ink hover:shadow-glow flex items-center gap-2 mx-auto md:mx-0"
                data-particle-burst>
                <Sparkles size={16} />
                开启牌阵
              </button>
            </div>
          </div>

          {/* Right: User History */}
          <div className="text-center md:text-left">
            <div className="bg-pearl/70 backdrop-blur-sm rounded-card p-6 border border-gold/15 shadow-soft">
              <div className="flex items-center gap-2 mb-4">
                <Star size={14} className="text-gold" />
                <span className="font-heading text-xs text-gold tracking-wider uppercase">你的占卜记录</span>
              </div>

              {readings.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
                    <Sparkles size={24} className="text-gold/40" />
                  </div>
                  <p className="font-body text-sm text-charcoal/50">还没有进行过占卜</p>
                  <p className="font-body text-xs text-charcoal/35 mt-1">开启你的第一次塔罗之旅吧</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="font-heading text-sm text-ink">
                    已累计占卜 <span className="text-gold text-lg">{readings.length}</span> 次
                  </p>
                  {latestReading && (
                    <div className="p-3 bg-cream/40 rounded-lg">
                      <p className="font-body text-xs text-dusty-rose mb-1">
                        最近一次 · {new Date(latestReading.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                      </p>
                      <p className="font-body text-sm text-ink italic line-clamp-2">"{latestReading.question || '没有写下问题'}"</p>
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {latestReading.cards.map(c => (
                          <span key={c.id} className="px-2 py-0.5 bg-gold/10 rounded-full font-body text-[10px] text-gold">{c.name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {readings.length > 1 && (
                    <p className="font-body text-xs text-charcoal/40 text-center">
                      还有 {readings.length - 1} 次占卜记录...
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section bottom hint */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 pointer-events-auto">
        <span className="font-body text-sm text-charcoal/45 tracking-wider">掌管属于你的记忆星星</span>
        <ChevronDown size={16} className="text-charcoal/35 animate-bounce" />
      </div>
    </section>
  );
}
