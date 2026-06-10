import { useEffect, useRef } from 'react';
import { Home, Flower2, Moon, Star, Heart } from 'lucide-react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

interface NavItem {
  id: string;
  poeticName: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'hero', poeticName: '归处', icon: <Home size={16} /> },
  { id: 'showcase-tarot', poeticName: '牌语心言', icon: <Flower2 size={16} /> },
  { id: 'showcase-crystal', poeticName: '星尘记忆', icon: <Moon size={16} /> },
  { id: 'showcase-past', poeticName: '时光信笺', icon: <Star size={16} /> },
  { id: 'showcase-mood', poeticName: '心绪织锦', icon: <Heart size={16} /> },
];

interface NavigationProps {
  activeSection: string;
  onNavigate: (id: string) => void;
}

export default function Navigation({ activeSection: _activeSection, onNavigate }: NavigationProps) {
  const navRef = useRef<HTMLElement>(null);
  void _activeSection;

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    gsap.fromTo(nav, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out', delay: 0.5 });
    window.addEventListener('scroll', () => {}, { passive: true });
  }, []);

  const handleClick = (id: string) => {
    onNavigate(id);
    const el = document.getElementById(id);
    if (el) gsap.to(window, { scrollTo: { y: el, offsetY: 0 }, duration: 1, ease: 'power3.inOut' });
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      style={{ opacity: 0 }}
    >
      <div className="flex items-start justify-between px-6 md:px-10 pt-5 md:pt-6">
        {/* Brand - left */}
        <div className="pointer-events-auto flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8DDD0" strokeWidth="1.5" opacity="0.8">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
          <span
            className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              color: '#E8DDD0',
              opacity: 0.85,
              textShadow: '0 1px 8px rgba(0,0,0,0.15)',
            }}
          >
            Velvet Tarot Room
          </span>
        </div>

        {/* Nav buttons - right */}
        <div className="pointer-events-auto flex items-start gap-2.5 md:gap-3">
          {navItems.map((item, idx) => {
            const isSecond = idx === 1;
            return (
              <div key={item.id} className="flex flex-col items-center gap-1.5 relative">
                <button
                  onClick={() => handleClick(item.id)}
                  className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full transition-all duration-300 hover:scale-110"
                  style={{
                    background: 'rgba(255,255,255,0.25)',
                    border: '1px solid rgba(212,188,160,0.35)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 2px 8px rgba(100,80,70,0.06)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.45)';
                    e.currentTarget.style.borderColor = 'rgba(212,188,160,0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                    e.currentTarget.style.borderColor = 'rgba(212,188,160,0.35)';
                  }}
                  data-particle-burst
                >
                  <span style={{ color: '#8A7A6E' }}>{item.icon}</span>
                </button>
                {/* Label below second button (matching reference) */}
                {isSecond && (
                  <span
                    className="absolute -bottom-5 text-[9px] tracking-[0.1em] whitespace-nowrap"
                    style={{
                      fontFamily: '"Noto Serif SC", serif',
                      color: '#A89080',
                      opacity: 0.75,
                    }}
                  >
                    牌语心言
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
