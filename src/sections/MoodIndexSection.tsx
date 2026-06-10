import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CountUp from 'react-countup';
import { TrendingUp, Mail, Star, Activity, ChevronUp, ChevronDown, Calendar, Heart, ChevronLeft } from 'lucide-react';
import { getMoodLabel, getEncouragement } from '@/lib/tarotData';
import type { Entry, WeeklyData } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface MoodIndexSectionProps {
  entries: Entry[];
  streak: number;
  averageScore: number;
  weeklyScores: { day: string; score: number; hasEntry: boolean; label: string }[];
  weeklyArchive: WeeklyData[];
  currentWeek: WeeklyData | null;
  onBack: () => void;
}

export default function MoodIndexSection({
  entries, streak, averageScore, weeklyScores, weeklyArchive, currentWeek, onBack
}: MoodIndexSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const chartRef = useRef<SVGSVGElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);
  const hasData = entries.length > 0;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.from('.index-header', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 60%', toggleActions: 'play none none none' },
      });
      const cards = cardsRef.current?.querySelectorAll('.stat-card');
      if (cards) {
        gsap.from(cards, { y: 30, opacity: 0, duration: 0.6, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 70%', toggleActions: 'play none none none' },
        });
      }
      if (chartRef.current && hasData) {
        const path = chartRef.current.querySelector('.chart-line');
        if (path) {
          const length = (path as SVGPathElement).getTotalLength?.() || 500;
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(path, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.out',
            scrollTrigger: { trigger: chartRef.current, start: 'top 70%', toggleActions: 'play none none none' },
          });
        }
      }
    }, section);
    return () => ctx.revert();
  }, [hasData]);

  // Current week chart
  const chartPoints = weeklyScores.map((d, i) => {
    const x = 30 + (i / 6) * 440;
    const y = d.hasEntry ? 20 + (1 - d.score / 100) * 110 : 75;
    return { x, y, ...d };
  });

  let linePath = '';
  if (chartPoints.length > 0) {
    linePath = `M ${chartPoints[0].x} ${chartPoints[0].y}`;
    for (let i = 1; i < chartPoints.length; i++) {
      const prev = chartPoints[i - 1];
      const curr = chartPoints[i];
      const cpx1 = prev.x + (curr.x - prev.x) / 3;
      const cpx2 = prev.x + (2 * (curr.x - prev.x)) / 3;
      linePath += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
    }
  }

  const lowestPoint = currentWeek ? chartPoints.find(p => p.day === currentWeek.lowestDay) : null;

  return (
    <section id="index" ref={sectionRef} className="relative min-h-[100dvh] py-12 overflow-hidden">
      {/* Top fade-in 1/10 */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none" style={{ height: '10vh', background: 'linear-gradient(to bottom, rgba(240,232,232,0.95) 0%, rgba(240,232,232,0.7) 50%, transparent 100%)' }} />

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(/images/bg-index.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(240,232,232,0.88) 0%, rgba(234,222,222,0.85) 50%, rgba(229,213,213,0.9) 100%)' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Back button */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2.5 bg-pearl/80 rounded-full border border-dusty-rose/20 text-charcoal hover:bg-rose hover:text-pearl hover:border-rose transition-all" data-particle-burst>
            <ChevronLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Heart size={13} className="text-gold" />
              <span className="font-heading text-xs text-gold tracking-[0.15em] uppercase">My Mood Journey</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-ink">心绪织锦</h2>
          </div>
        </div>
        <div className="index-header text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart size={18} className="text-gold" />
            <span className="font-heading text-xs text-gold tracking-[0.15em] uppercase">My Mood Journey</span>
            <Heart size={18} className="text-gold" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-2">心情小屋</h2>
          <p className="font-body text-charcoal max-w-lg mx-auto text-sm">
            这里记录着你情绪的潮汐。每一份心情都值得被看见，被温柔以待。
          </p>
        </div>

        {hasData ? (
          <>
            {/* Stats */}
            <div ref={cardsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="stat-card bg-pearl/90 backdrop-blur-sm rounded-card p-4 shadow-soft border border-gold/10">
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={16} className="text-gold" />
                  <span className="font-heading text-xs text-charcoal">心情指数</span>
                </div>
                <span className="font-display text-3xl text-gold"><CountUp end={averageScore} duration={2} /></span>
                <span className="font-body text-xs text-dusty-rose ml-1">/100</span>
                <p className="font-body text-xs text-dusty-rose mt-1">{getMoodLabel(averageScore)}</p>
              </div>
              <div className="stat-card bg-pearl/90 backdrop-blur-sm rounded-card p-4 shadow-soft border border-gold/10">
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={16} className="text-sage" />
                  <span className="font-heading text-xs text-charcoal">记录次数</span>
                </div>
                <span className="font-display text-3xl text-ink"><CountUp end={entries.length} duration={2} /></span>
              </div>
              <div className="stat-card bg-pearl/90 backdrop-blur-sm rounded-card p-4 shadow-soft border border-gold/10">
                <div className="flex items-center gap-2 mb-2">
                  <Star size={16} className="text-gold" />
                  <span className="font-heading text-xs text-charcoal">连续记录</span>
                </div>
                <div className="flex items-end gap-1">
                  <span className="font-display text-3xl text-ink"><CountUp end={streak} duration={2} /></span>
                  <span className="font-body text-xs text-dusty-rose mb-1">天</span>
                </div>
              </div>
              <div className="stat-card bg-pearl/90 backdrop-blur-sm rounded-card p-4 shadow-soft border border-gold/10">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} className="text-lavender" />
                  <span className="font-heading text-xs text-charcoal">周存档</span>
                </div>
                <span className="font-display text-3xl text-ink">{weeklyArchive.length}</span>
              </div>
            </div>

            {/* Weekly Chart */}
            <div className="bg-pearl/90 backdrop-blur-sm rounded-card p-5 shadow-soft border border-gold/10 mb-6">
              <h3 className="font-heading text-sm text-ink mb-1">本周心情走势</h3>
              <p className="font-body text-xs text-charcoal/60 mb-4">{currentWeek ? currentWeek.encouragement : getEncouragement(averageScore)}</p>
              <svg ref={chartRef} viewBox="0 0 500 160" className="w-full" preserveAspectRatio="xMidYMid meet">
                {[0, 25, 50, 75, 100].map((val) => (
                  <g key={val}>
                    <line x1="30" y1={20 + (100 - val) * 1.2} x2="470" y2={20 + (100 - val) * 1.2} stroke="#E8D5D5" strokeWidth="0.5" />
                    <text x="25" y={20 + (100 - val) * 1.2 + 3} fontSize="9" fill="#9E7B7B" textAnchor="end">{val}</text>
                  </g>
                ))}
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C4A265" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#C4A265" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {linePath && (
                  <>
                    <path d={`${linePath} L ${chartPoints[chartPoints.length-1].x} 155 L ${chartPoints[0].x} 155 Z`} fill="url(#chartGrad)" />
                    <path className="chart-line" d={linePath} fill="none" stroke="#C4A265" strokeWidth="2" strokeLinecap="round" />
                  </>
                )}
                {chartPoints.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r={p.hasEntry ? 5 : 3} fill={p.hasEntry ? '#C4A265' : '#E8D5D5'} stroke="#FAF6F1" strokeWidth="2" />
                    <text x={p.x} y="150" fontSize="10" fill="#5C4A4A" textAnchor="middle">{p.day}</text>
                    {p.hasEntry && <text x={p.x} y={p.y - 10} fontSize="9" fill="#C4A265" textAnchor="middle">{p.score}</text>}
                  </g>
                ))}
                {/* Highlight lowest point */}
                {lowestPoint && (
                  <g>
                    <circle cx={lowestPoint.x} cy={lowestPoint.y} r="10" fill="none" stroke="#D4A7A7" strokeWidth="1" strokeDasharray="3,3" opacity="0.6">
                      <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </g>
                )}
              </svg>
              {currentWeek && currentWeek.lowestScore < 50 && (
                <div className="mt-3 p-3 bg-rose/10 border border-rose/20 rounded-lg">
                  <p className="font-body text-xs text-charcoal">
                    <span className="text-rose font-heading">{currentWeek.lowestDay}</span> 是本周心情最低的一天。
                    {currentWeek.encouragement}
                  </p>
                </div>
              )}
            </div>

            {/* Weekly Archive */}
            {weeklyArchive.length > 0 && (
              <div className="bg-pearl/90 backdrop-blur-sm rounded-card p-5 shadow-soft border border-gold/10">
                <h3 className="font-heading text-sm text-ink mb-4 flex items-center gap-2">
                  <Calendar size={16} className="text-gold" />
                  周心情存档
                </h3>
                <div className="space-y-3">
                  {weeklyArchive.slice(0, 8).map((week) => (
                    <div key={week.weekId} className="border border-dusty-rose/10 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedWeek(expandedWeek === week.weekId ? null : week.weekId)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-cream/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-heading text-xs text-dusty-rose">
                            {new Date(week.weekStart).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                            - {new Date(week.weekEnd).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                          </span>
                          <div className="flex gap-0.5">
                            {week.dailyScores.filter(d => d.hasEntry).map((d, i) => (
                              <div key={i} className={`w-2 h-2 rounded-full ${d.score >= 60 ? 'bg-sage' : d.score >= 40 ? 'bg-gold' : 'bg-rose'}`} />
                            ))}
                          </div>
                          <span className="font-heading text-xs text-gold">均{week.averageScore}分</span>
                        </div>
                        {expandedWeek === week.weekId ? <ChevronUp size={16} className="text-dusty-rose" /> : <ChevronDown size={16} className="text-dusty-rose" />}
                      </button>
                      {expandedWeek === week.weekId && (
                        <div className="px-4 pb-3 border-t border-dusty-rose/10">
                          <div className="grid grid-cols-7 gap-1 mt-3">
                            {week.dailyScores.map((d, i) => (
                              <div key={i} className="text-center">
                                <p className="font-body text-[10px] text-dusty-rose">{d.day}</p>
                                <div className={`w-6 h-6 rounded-full mx-auto mt-1 flex items-center justify-center text-[9px] font-heading ${
                                  d.hasEntry ? (d.score >= 60 ? 'bg-sage/20 text-sage' : d.score >= 40 ? 'bg-gold/20 text-gold' : 'bg-rose/20 text-rose') : 'bg-cream text-dusty-rose/30'
                                }`}>
                                  {d.hasEntry ? d.score : '-'}
                                </div>
                              </div>
                            ))}
                          </div>
                          {week.lowestScore < 50 && (
                            <p className="mt-2 font-body text-xs text-rose/70 bg-rose/5 p-2 rounded">{week.encouragement}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 rounded-full bg-pearl/60 flex items-center justify-center mx-auto">
                <TrendingUp size={40} className="text-dusty-rose/40" />
              </div>
              <Star size={16} className="absolute -top-1 -right-1 text-gold/50 animate-twinkle" />
            </div>
            <p className="font-heading text-xl text-charcoal mb-2">写下第一封信后，这里会开始亮起</p>
            <p className="font-body text-charcoal/60">去抽牌记录你的心情，指数将为你展现情绪的变化</p>
          </div>
        )}
      </div>
    </section>
  );
}
