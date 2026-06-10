import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, Star, ChevronDown, Mail } from 'lucide-react';
import type { Entry } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface ShowcasePastProps {
  entries: Entry[];
  onEnter: () => void;
}

export default function ShowcasePast({ entries, onEnter }: ShowcasePastProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' } });
    }, sectionRef.current!);
    return () => ctx.revert();
  }, []);

  const recentEntries = entries.slice(0, 3);

  return (
    <section id="showcase-past" ref={sectionRef} className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background — soft lavender, clean */}
      <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(180deg, #ECE8F0 0%, #E6E2EA 50%, #E0DBE4 100%)' }} />
      <div className="absolute inset-0 z-[1] opacity-[0.03]" style={{ backgroundImage: 'url(/images/bg-past.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'saturate(0.3)' }} />

      <div ref={contentRef} className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <BookOpen size={14} className="text-ink/45" />
            <span className="font-heading text-xs text-ink/45 tracking-[0.2em] uppercase">Letters to Myself</span>
            <BookOpen size={14} className="text-ink/45" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-ink mb-3">时光信笺</h2>
          <p className="font-body text-charcoal/70 text-base max-w-lg mx-auto leading-relaxed">
            打开这些写给自己的信，你会发现，<br />
            <span className="text-sm text-charcoal/45">曾经以为走不过去的坎，如今都已成为身后的风景。</span>
          </p>
        </div>

        {/* Left-Right Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: Description + Button */}
          <div>
            <div className="bg-pearl/75 backdrop-blur-sm rounded-card p-6 border border-dusty-rose/10 shadow-soft">
              <Mail size={20} className="text-gold mb-3" />
              <p className="font-body text-ink leading-relaxed mb-4">
                每一封信都是过去某个时刻的自己，在时间长河里投下的一颗石子。
                当你重新打开它们，你会发现：那些让你哭泣的夜晚，那些让你迷茫的十字路口，
                都已成为生命中温柔的注脚。
              </p>
              <p className="font-body text-sm text-charcoal/55 italic mb-5">
                "给未来的自己写一封信吧，告诉她：你比想象中更勇敢。"
              </p>
              <button onClick={onEnter}
                className="px-8 py-3 bg-lavender/30 border border-lavender/40 text-ink font-heading text-sm rounded-pill tracking-wider transition-all hover:bg-lavender/50 hover:shadow-mystical flex items-center gap-2"
                data-particle-burst>
                <BookOpen size={16} />
                阅读信件
              </button>
            </div>
          </div>

          {/* Right: User History */}
          <div>
            <div className="bg-pearl/75 backdrop-blur-sm rounded-card p-6 border border-dusty-rose/10 shadow-soft">
              <div className="flex items-center gap-2 mb-4">
                <Star size={14} className="text-gold" />
                <span className="font-heading text-xs text-gold tracking-wider uppercase">你的时光档案</span>
              </div>

              {entries.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-gold/8 flex items-center justify-center mx-auto mb-3">
                    <Mail size={24} className="text-dusty-rose/40" />
                  </div>
                  <p className="font-body text-sm text-charcoal/50">还没有写下任何信件</p>
                  <p className="font-body text-xs text-charcoal/35 mt-1">每一次记录都是珍贵的</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="font-heading text-sm text-ink mb-3">
                    共收藏 <span className="text-gold text-lg">{entries.length}</span> 封信件
                  </p>
                  {recentEntries.map((entry) => (
                    <div key={entry.id} className="p-3 bg-cream/35 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-body text-[10px] text-dusty-rose">
                          {new Date(entry.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="font-heading text-[10px] text-gold">{entry.score}分</span>
                      </div>
                      <p className="font-body text-sm text-ink italic line-clamp-2">"{entry.text}"</p>
                      {entry.question && (
                        <p className="font-body text-[11px] text-charcoal/40 mt-1">Q: {entry.question}</p>
                      )}
                    </div>
                  ))}
                  {entries.length > 3 && (
                    <p className="font-body text-xs text-charcoal/35 text-center">
                      还有 {entries.length - 3} 封信...
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
        <span className="font-body text-sm text-charcoal/45 tracking-wider">看看你的心情轨迹</span>
        <ChevronDown size={16} className="text-charcoal/35 animate-bounce" />
      </div>
    </section>
  );
}
