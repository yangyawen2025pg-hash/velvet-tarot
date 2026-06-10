import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, TrendingUp, Calendar } from 'lucide-react';
import { getMoodLabel } from '@/lib/tarotData';
import type { Entry, WeeklyData } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface ShowcaseMoodProps {
  entries: Entry[];
  streak: number;
  averageScore: number;
  weeklyScores: { day: string; score: number; hasEntry: boolean; label: string }[];
  currentWeek: WeeklyData | null;
  onEnter: () => void;
}

export default function ShowcaseMood({ entries, streak, averageScore, weeklyScores, currentWeek, onEnter }: ShowcaseMoodProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' } });
    }, sectionRef.current!);
    return () => ctx.revert();
  }, []);

  const hasData = entries.length > 0;
  const validDays = weeklyScores.filter(d => d.hasEntry);
  const bestDay = validDays.length > 0 ? validDays.reduce((a, b) => a.score > b.score ? a : b) : null;

  return (
    <section id="showcase-mood" ref={sectionRef} className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background — soft rose, clean */}
      <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(180deg, #F0E8E8 0%, #EADEDE 50%, #E5D5D5 100%)' }} />
      <div className="absolute inset-0 z-[1] opacity-[0.03]" style={{ backgroundImage: 'url(/images/bg-index.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'saturate(0.3)' }} />

      <div ref={contentRef} className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart size={14} className="text-gold" />
            <span className="font-heading text-xs text-gold tracking-[0.2em] uppercase">My Mood Journey</span>
            <Heart size={14} className="text-gold" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-ink mb-3">心绪织锦</h2>
          <p className="font-body text-charcoal/70 text-base max-w-lg mx-auto leading-relaxed">
            你的情绪是一条河流，有平静也有波澜。<br />
            <span className="text-sm text-charcoal/45">在这里，你可以看见它流淌的轨迹。</span>
          </p>
        </div>

        {/* Left-Right Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: Description + Button */}
          <div>
            <div className="bg-pearl/75 backdrop-blur-sm rounded-card p-6 border border-gold/10 shadow-soft">
              <TrendingUp size={20} className="text-gold mb-3" />
              <p className="font-body text-ink leading-relaxed mb-4">
                我们常常忽略了自己的情绪，直到有一天它们突然涌上心头。
                在这里，你可以温柔地记录下每一天的心情，
                看看那些曾经以为无法承受的日子，是如何一点点被时间抚平的。
              </p>
              <p className="font-body text-sm text-charcoal/55 italic mb-5">
                "情绪不是敌人，它们是你内心最诚实的信使。"
              </p>
              <button onClick={onEnter}
                className="px-8 py-3 bg-rose/20 border border-rose/30 text-ink font-heading text-sm rounded-pill tracking-wider transition-all hover:bg-rose/40 hover:shadow-soft flex items-center gap-2"
                data-particle-burst>
                <Heart size={16} />
                查看心迹
              </button>
            </div>
          </div>

          {/* Right: User History */}
          <div>
            <div className="bg-pearl/75 backdrop-blur-sm rounded-card p-6 border border-gold/10 shadow-soft">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={14} className="text-gold" />
                <span className="font-heading text-xs text-gold tracking-wider uppercase">你的心绪档案</span>
              </div>

              {!hasData ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-gold/8 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp size={24} className="text-dusty-rose/40" />
                  </div>
                  <p className="font-body text-sm text-charcoal/50">还没有心情记录</p>
                  <p className="font-body text-xs text-charcoal/35 mt-1">开始记录你的第一份心情吧</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-heading text-xs text-charcoal">心情指数</p>
                      <p className="font-display text-2xl text-gold">{averageScore}<span className="font-body text-xs text-dusty-rose">/100</span></p>
                      <p className="font-body text-xs text-dusty-rose">{getMoodLabel(averageScore)}</p>
                    </div>
                    <div className="w-px h-10 bg-dusty-rose/15" />
                    <div>
                      <p className="font-heading text-xs text-charcoal">记录天数</p>
                      <p className="font-display text-2xl text-ink">{streak}<span className="font-body text-xs text-dusty-rose">天</span></p>
                    </div>
                    <div className="w-px h-10 bg-dusty-rose/15" />
                    <div>
                      <p className="font-heading text-xs text-charcoal">信件总数</p>
                      <p className="font-display text-2xl text-ink">{entries.length}<span className="font-body text-xs text-dusty-rose">封</span></p>
                    </div>
                  </div>

                  {/* Weekly mini chart */}
                  <div className="flex items-end gap-1.5 h-12 pt-2">
                    {weeklyScores.map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                        <div className="w-full rounded-t" style={{
                          height: d.hasEntry ? `${(d.score / 100) * 32}px` : '4px',
                          background: d.hasEntry
                            ? d.score >= 60 ? 'rgba(163,184,153,0.6)' : d.score >= 40 ? 'rgba(196,162,101,0.6)' : 'rgba(212,167,167,0.6)'
                            : 'rgba(212,167,167,0.15)'
                        }} />
                        <span className="font-body text-[8px] text-charcoal/40">{d.day}</span>
                      </div>
                    ))}
                  </div>

                  {bestDay && (
                    <p className="font-body text-xs text-sage/70 bg-sage/8 p-2 rounded">
                      本周心情最好的一天是{bestDay.day}，{bestDay.label}。
                    </p>
                  )}

                  {currentWeek && currentWeek.lowestScore < 50 && (
                    <p className="font-body text-xs text-rose/60 bg-rose/5 p-2 rounded">
                      {currentWeek.encouragement}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade-out to footer */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <div className="w-full" style={{ height: '15vh', background: 'linear-gradient(to bottom, transparent 0%, rgba(58,42,42,0.4) 60%, rgba(58,42,42,0.9) 100%)' }} />
      </div>
    </section>
  );
}
