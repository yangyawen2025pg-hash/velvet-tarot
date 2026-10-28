import { useEffect, useState, useCallback } from 'react';
import { Routes, Route } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import ParticleCanvas from '@/components/ParticleCanvas';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HeroSection from '@/sections/HeroSection';
import ShowcaseTarot from '@/sections/ShowcaseTarot';
import ShowcaseCrystal from '@/sections/ShowcaseCrystal';
import ShowcasePast from '@/sections/ShowcasePast';
import ShowcaseMood from '@/sections/ShowcaseMood';
import CardDrawSection from '@/sections/CardDrawSection';
import CrystalBallSection from '@/sections/CrystalBallSection';
import PastMemoriesSection from '@/sections/PastMemoriesSection';
import MoodIndexSection from '@/sections/MoodIndexSection';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { trpc } from '@/providers/trpc';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import type { TarotCard } from '@/types';
import { trackEvent, type ModuleName } from '@/lib/analytics';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

type OperatorPage = 'draw' | 'crystal' | 'past' | 'index' | null;

function LoadingOverlay({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => { setVisible(false); setTimeout(onComplete, 500); }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[10000] bg-ink flex flex-col items-center justify-center" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s' }}>
      <div className="relative w-20 h-32 mb-6" style={{ perspective: '600px' }}>
        <div className="w-full h-full relative" style={{ transformStyle: 'preserve-3d', animation: 'cardFlip 1.5s ease-in-out forwards' }}>
          <div className="absolute inset-0 rounded-lg overflow-hidden border-2 border-gold" style={{ backfaceVisibility: 'hidden' }}>
            <img src="/images/card-back.jpg" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 rounded-lg overflow-hidden border-2 border-gold flex items-center justify-center bg-gold" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" className="text-pearl"><path fill="currentColor" d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" /></svg>
          </div>
        </div>
      </div>
      <p className="font-heading text-sm text-blush/70 tracking-wider animate-pulse">洗牌中...</p>
      <style>{`@keyframes cardFlip { 0%{transform:rotateY(0)}60%{transform:rotateY(180deg)}100%{transform:rotateY(180deg)} }`}</style>
    </div>
  );
}

/* Main app with all sections */
function MainApp() {
  const [activeSection, setActiveSection] = useState('hero');
  const [operatorPage, setOperatorPage] = useState<OperatorPage>(null);
  const { data, addEntry, getWeeklyScores, getAverageScore, getCurrentWeekData } = useLocalStorage();

  // Sync data to cloud when user is logged in
  const utils = trpc.useUtils();
  const syncMutation = trpc.entry.sync.useMutation({
    onSuccess: () => {
      utils.entry.list.invalidate();
    },
  });

  // Track active section on scroll
  useEffect(() => {
    if (operatorPage) return;
    const sectionIds = ['hero', 'showcase-tarot', 'showcase-crystal', 'showcase-past', 'showcase-mood'];
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(id); }); },
        { threshold: 0.2 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => { observers.forEach((o) => o.disconnect()); };
  }, [operatorPage]);

  const handleNavigate = useCallback((id: string) => {
    setOperatorPage(null);
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) gsap.to(window, { scrollTo: { y: el, offsetY: 0 }, duration: 1, ease: 'power3.inOut' });
  }, []);

  const openOperator = useCallback((page: OperatorPage) => {
    if (page) {
      trackEvent('module_open', { module: page as ModuleName });
      if (page === 'index') trackEvent('weekly_report_view', { module: 'index' });
    }
    setOperatorPage(page);
    if (page) setActiveSection(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const closeOperator = useCallback(() => {
    if (operatorPage) trackEvent('module_close', { module: operatorPage });
    setOperatorPage(null);
    const showcaseMap: Record<string, string> = { draw: 'showcase-tarot', crystal: 'showcase-crystal', past: 'showcase-past', index: 'showcase-mood' };
    if (operatorPage) {
      const showcaseId = showcaseMap[operatorPage];
      if (showcaseId) {
        setActiveSection(showcaseId);
        setTimeout(() => {
          const el = document.getElementById(showcaseId);
          if (el) gsap.to(window, { scrollTo: { y: el, offsetY: 0 }, duration: 0.8, ease: 'power3.inOut' });
        }, 100);
      }
    }
  }, [operatorPage]);

  const handleSaveEntry = useCallback((text: string, question: string, cards: TarotCard[]) => {
    addEntry(text, question, cards);
    // Try to sync to cloud
    try {
      const entriesJson = localStorage.getItem('velvet-tarot-data-v2');
      if (entriesJson) {
        const parsed = JSON.parse(entriesJson);
        syncMutation.mutate({ entries: parsed.entries || [], readings: parsed.readings || [] });
      }
    } catch { /* ignore */ }
  }, [addEntry, syncMutation]);

  return (
    <>
      <ParticleCanvas />
      <Navigation activeSection={activeSection} onNavigate={handleNavigate} />

      {/* SHOWCASE PAGES (scrollable) */}
      <main className={operatorPage ? 'hidden' : ''}>
        <HeroSection />
        <ShowcaseTarot readings={data.readings} onEnter={() => openOperator('draw')} />
        <ShowcaseCrystal entries={data.entries} onEnter={() => openOperator('crystal')} />
        <ShowcasePast entries={data.entries} onEnter={() => openOperator('past')} />
        <ShowcaseMood entries={data.entries} streak={data.streak} averageScore={getAverageScore()} weeklyScores={getWeeklyScores()} currentWeek={getCurrentWeekData()} onEnter={() => openOperator('index')} />
        <Footer />
      </main>

      {/* OPERATOR PAGES (fullscreen overlay) */}
      {operatorPage === 'draw' && <CardDrawSection onSaveEntry={handleSaveEntry} onBack={closeOperator} />}
      {operatorPage === 'crystal' && <CrystalBallSection entries={data.entries} onBack={closeOperator} />}
      {operatorPage === 'past' && <PastMemoriesSection entries={data.entries} onBack={closeOperator} />}
      {operatorPage === 'index' && <MoodIndexSection entries={data.entries} streak={data.streak} averageScore={getAverageScore()} weeklyScores={getWeeklyScores()} weeklyArchive={data.weeklyArchive} currentWeek={getCurrentWeekData()} onBack={closeOperator} />}

      {/* Hide watermark */}
      <style>{`
        a[href*="kimi.com/agent"],a[href*="kimi"],div[class*="kimi"],[class*="watermark"]{display:none!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important}
      `}</style>
    </>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingOverlay onComplete={() => setLoading(false)} />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainApp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
