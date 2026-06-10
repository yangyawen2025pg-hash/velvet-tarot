import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Star, Feather, Calendar, HelpCircle, ChevronLeft, BookOpen } from 'lucide-react';
import type { Entry } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface PastMemoriesSectionProps {
  entries: Entry[];
  onBack: () => void;
}

export default function PastMemoriesSection({ entries, onBack }: PastMemoriesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.from('.past-header', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 60%' } });
      const cards = cardsRef.current?.querySelectorAll('.memory-letter');
      if (cards && cards.length > 0) {
        gsap.from(cards, { y: 50, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 70%' } });
      }
    }, section);
    return () => ctx.revert();
  }, [entries]);

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };
  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  const getMoodColor = (score: number) => {
    if (score >= 70) return 'text-sage';
    if (score >= 50) return 'text-gold';
    if (score >= 30) return 'text-amber';
    return 'text-rose';
  };

  return (
    <section id="past" ref={sectionRef} className="relative min-h-[100dvh] py-12 overflow-hidden">
      {/* Top fade-in 1/10 */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none" style={{ height: '10vh', background: 'linear-gradient(to bottom, rgba(236,232,240,0.95) 0%, rgba(236,232,240,0.7) 50%, transparent 100%)' }} />

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/images/bg-past.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(236,232,240,0.88) 0%, rgba(230,226,234,0.85) 50%, rgba(224,219,228,0.9) 100%)' }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        {/* Back button */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2.5 bg-pearl/80 rounded-full border border-dusty-rose/20 text-charcoal hover:bg-rose hover:text-pearl hover:border-rose transition-all" data-particle-burst>
            <ChevronLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <BookOpen size={13} className="text-ink/45" />
              <span className="font-heading text-xs text-ink/45 tracking-[0.15em] uppercase">Letters to Myself</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-ink">时光信笺</h2>
          </div>
        </div>

        <div className="past-header text-center mb-8">
          <p className="font-body text-charcoal/60 mb-2 text-sm">
            打开这些写给自己的信，和过去的自己对话
          </p>
          <div className="flex items-center justify-center gap-2">
            <Star size={13} className="text-gold" />
            <span className="font-heading text-sm text-ink">共 <span className="text-gold text-lg">{entries.length}</span> 封记忆信件</span>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 rounded-full bg-pearl/60 flex items-center justify-center mx-auto animate-float">
                <Mail size={32} className="text-dusty-rose/60" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Star size={14} className="text-gold animate-twinkle" />
              </div>
            </div>
            <p className="font-heading text-xl text-charcoal mb-2">还没有写下任何信件...</p>
            <p className="font-body text-charcoal/55 mb-4">去抽牌，然后开启信封，写一封给未来的自己</p>
            <div className="flex items-center justify-center gap-2 text-dusty-rose/45">
              <Feather size={14} />
              <span className="font-body text-sm">每一封信都值得被珍藏</span>
            </div>
          </div>
        ) : (
          <div ref={cardsRef} className="space-y-5">
            {entries.map((entry) => (
              <div key={entry.id} className="memory-letter relative">
                <div className="bg-pearl rounded-card shadow-soft overflow-hidden border border-dusty-rose/10 hover:shadow-medium hover:-translate-y-1 transition-all duration-300">
                  {/* Header */}
                  <div className="px-5 pt-4 pb-3 border-b border-dusty-rose/10 bg-cream/25">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-dusty-rose" />
                        <span className="font-body text-xs text-dusty-rose">{formatDate(entry.timestamp)} {formatTime(entry.timestamp)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {entry.moodKeywords.slice(0, 3).map((kw) => (
                          <span key={kw} className="px-2 py-0.5 bg-gold/10 rounded-full font-body text-[10px] text-gold">{kw}</span>
                        ))}
                        <span className={`font-heading text-xs ${getMoodColor(entry.score)}`}>{entry.score}分</span>
                      </div>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="px-5 py-3 bg-lavender/8">
                    <div className="flex items-start gap-2">
                      <HelpCircle size={13} className="text-lavender mt-0.5 shrink-0" />
                      <div>
                        <p className="font-heading text-[10px] text-lavender uppercase tracking-wider mb-0.5">当时想问的问题</p>
                        <p className="font-body text-sm text-ink">{entry.question || '（没有写下问题）'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Cards drawn */}
                  {entry.drawnCards.length > 0 && (
                    <div className="px-5 py-2.5 bg-cream/15 flex gap-3 flex-wrap">
                      {entry.drawnCards.map((card, i) => (
                        <div key={card.id} className="flex items-center gap-2">
                          <img src={card.image} alt={card.name} className="w-7 h-10 rounded object-cover border border-gold/25" />
                          <div>
                            <p className="font-heading text-[10px] text-gold">{['我现在的情绪','为什么会这样','我忽略了什么','我该如何照顾自己'][i]}</p>
                            <p className="font-body text-[11px] text-charcoal">{card.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Letter content */}
                  <div className="px-5 py-4">
                    <div className="flex items-start gap-2">
                      <Feather size={13} className="text-gold mt-0.5 shrink-0" />
                      <div>
                        <p className="font-heading text-[10px] text-gold uppercase tracking-wider mb-1">写给自己的话</p>
                        <p className="font-body text-ink leading-relaxed whitespace-pre-wrap">{entry.text}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3 border-t border-dusty-rose/10 flex items-center justify-center gap-2">
                    <div className="w-8 h-px bg-gold/25" />
                    <div className="w-1.5 h-1.5 rotate-45 bg-gold/25" />
                    <Star size={9} className="text-gold/35" />
                    <div className="w-1.5 h-1.5 rotate-45 bg-gold/25" />
                    <div className="w-8 h-px bg-gold/25" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
