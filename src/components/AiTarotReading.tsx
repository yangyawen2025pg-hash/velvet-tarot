import { useEffect, useRef, useState } from 'react';
import type { TarotCard } from '@/types';
import { trackEvent } from '@/lib/analytics';

const WORKER_URL = 'https://velvet-tarot-ai-api.quickmatch-ajm.workers.dev/v1/tarot/interpret';
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
const POSITIONS = ['current', 'cause', 'overlooked', 'self_care'] as const;
type Position = typeof POSITIONS[number];
type AiReading = { sections: { position: Position; title: string; analysis: string }[]; summary: string; suggestions: string[] };

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: {sitekey: string; callback: (token:string)=>void; 'expired-callback':()=>void; 'error-callback':()=>void}) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}

function isReading(value: unknown): value is AiReading {
  if (!value || typeof value !== 'object') return false;
  const v = value as Partial<AiReading>;
  return Array.isArray(v.sections) && v.sections.length === 4 &&
    v.sections.every((s, i) => s?.position === POSITIONS[i] && typeof s.title === 'string' && typeof s.analysis === 'string') &&
    typeof v.summary === 'string' && Array.isArray(v.suggestions) && v.suggestions.every(s => typeof s === 'string');
}

function errorText(error: string): string {
  if (error === 'DAILY_QUOTA_REACHED') return '今天的 AI 解析名额已用完，请使用基础解析，明天再试。';
  if (error === 'AI_NOT_ENABLED_YET') return 'AI 解析还在测试中，基础解析仍可正常使用。';
  if (error === 'VERIFICATION_FAILED' || error === 'TURNSTILE_TOKEN_REQUIRED') return '人机验证未通过，请重试。';
  if (error === 'ORIGIN_NOT_ALLOWED') return '当前测试地址未被安全代理授权，请使用正式域名或配置专用预览域名。';
  return 'AI 解析暂时不可用，你仍然可以阅读上面的基础解析。';
}

export default function AiTarotReading({ question, cards }: { question: string; cards: TarotCard[] }) {
  const [expanded, setExpanded] = useState(false);
  const [consent, setConsent] = useState(false);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [reading, setReading] = useState<AiReading | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const requestSeq = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!expanded || !SITE_KEY || !widgetRef.current) return;
    let stopped = false;
    const scriptId = 'velvet-turnstile-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    function mount() {
      if (stopped || !widgetRef.current || !window.turnstile || widgetId.current) return;
      widgetId.current = window.turnstile.render(widgetRef.current, {
        sitekey: SITE_KEY!,
        callback: v => { if (!stopped) setToken(v); },
        'expired-callback': () => setToken(''),
        'error-callback': () => { setToken(''); setMessage('人机验证加载失败，请刷新页面重试。'); },
      });
    }
    if (window.turnstile) mount();
    else {
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        document.head.appendChild(script);
      }
      script.addEventListener('load', mount);
    }
    return () => {
      stopped = true;
      script?.removeEventListener('load', mount);
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [expanded]);

  useEffect(() => () => { requestSeq.current += 1; abortRef.current?.abort(); }, []);

  const submit = async () => {
    if (!consent || !token || loading || !question.trim() || cards.length !== 4) return;
    const seq = ++requestSeq.current;
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setMessage('');
    trackEvent('ai_reading_request', { module: 'draw' });
    const timer = setTimeout(() => controller.abort(), 35000);
    try {
      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          cards: cards.map((c, i) => ({ id: c.id, position: POSITIONS[i] })),
          turnstileToken: token,
        }),
        signal: controller.signal,
      });
      const data: unknown = await response.json();
      if (seq !== requestSeq.current) return;
      if (!response.ok) {
        const code = data && typeof data === 'object' && 'error' in data ? String(data.error) : 'SERVICE_ERROR';
        throw new Error(code);
      }
      const result = data && typeof data === 'object' && 'reading' in data ? data.reading : null;
      if (!isReading(result)) throw new Error('INVALID_RESPONSE');
      setReading(result);
      trackEvent('ai_reading_success', { module: 'draw' });
    } catch (err) {
      if (seq !== requestSeq.current) return;
      const error = err instanceof Error ? err.message : 'SERVICE_ERROR';
      setMessage(error === 'AbortError' ? '生成超时，请稍后重试，基础解析仍可使用。' : errorText(error));
      trackEvent('ai_reading_failure', { module: 'draw' });
    } finally {
      clearTimeout(timer);
      if (seq === requestSeq.current) {
        setLoading(false);
        setToken('');
        if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
      }
    }
  };

  return <div className="mt-4 w-full max-w-lg rounded-card border border-gold/20 bg-pearl/90 p-5 shadow-soft">
    <button type="button" onClick={() => setExpanded(v => !v)}
      className="w-full py-2.5 rounded-pill bg-lavender/25 border border-lavender/40 font-heading text-sm text-ink hover:bg-lavender/45">
      {expanded ? '收起 AI 深度解析' : '✨ AI 深度解析（可选）'}
    </button>
    {expanded && <div className="mt-4 space-y-3">
      <p className="font-body text-sm text-charcoal/75">AI 会结合你的问题和四张牌给出更具体的反思与建议。塔罗不是事实预测，也不能代替专业建议。</p>
      {!reading && <>
        <label className="flex items-start gap-2 font-body text-sm text-charcoal/80">
          <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-1" />
          <span>我同意仅为本次生成，将我输入的问题和四张牌的信息发送至 DeepSeek。基础解析不需要发送这些内容。</span>
        </label>
        {!question.trim() && <p role="alert" className="text-sm text-rose">使用 AI 前请在上方输入想问的问题。</p>}
        {question.length > 600 && <p role="alert" className="text-sm text-rose">问题请控制在 600 字以内。</p>}
        {!SITE_KEY ? <p role="status" className="text-sm text-rose">尚未配置 VITE_TURNSTILE_SITE_KEY，AI 按钮暂不可用。</p> : <div ref={widgetRef} aria-label="Cloudflare Turnstile 验证" />}
        <button type="button" onClick={submit} disabled={!consent || !token || loading || !question.trim() || question.length > 600 || cards.length !== 4}
          className="w-full py-3 rounded-pill bg-ink text-pearl font-heading text-sm disabled:opacity-40">
          {loading ? '正在生成个性化解析…' : '同意并生成 AI 解析'}
        </button>
      </>}
      {message && <p role="alert" className="text-sm text-rose">{message}</p>}
      {reading && <div className="space-y-4" aria-live="polite">
        <h3 className="font-heading text-lg text-ink">AI 个性化解析</h3>
        {reading.sections.map(section => <div key={section.position} className="border-t border-gold/15 pt-3">
          <h4 className="font-heading text-sm text-gold mb-1">{section.title}</h4>
          <p className="font-body text-sm text-charcoal whitespace-pre-wrap leading-relaxed">{section.analysis}</p>
        </div>)}
        <div className="border-t border-gold/15 pt-3">
          <h4 className="font-heading text-sm text-gold mb-1">整体启示</h4>
          <p className="font-body text-sm text-charcoal whitespace-pre-wrap leading-relaxed">{reading.summary}</p>
        </div>
        <div className="border-t border-gold/15 pt-3">
          <h4 className="font-heading text-sm text-gold mb-1">你可以尝试</h4>
          <ul className="list-disc pl-5 font-body text-sm text-charcoal space-y-1">{reading.suggestions.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </div>
        <p className="font-body text-xs text-charcoal/50">结果仅在当前页面显示，不会自动保存到信件。</p>
      </div>}
    </div>}
  </div>;
}
