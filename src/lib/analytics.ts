/**
 * Opt-in analytics: only fixed event names and explicitly approved primitive fields.
 * Never pass user text, emotion scores, card IDs, URLs or raw storage to trackEvent.
 */
import posthog from 'posthog-js';

export type ModuleName = 'draw' | 'crystal' | 'past' | 'index';
type Method = 'gesture' | 'automatic';
type EventName =
  | 'site_visit' | 'site_exit'
  | 'module_open' | 'module_close' | 'module_active_time'
  | 'tarot_start' | 'tarot_complete' | 'tarot_interpretation_view'
  | 'letter_compose_open' | 'letter_choice' | 'letter_saved' | 'weekly_report_view'
  | 'weekly_archive_expand';
type SafeProperties = {
  module?: ModuleName;
  method?: Method;
  choice?: 'write' | 'skip';
  card_count?: number;
  duration_seconds?: number;
};
const ALLOWED_EVENTS: ReadonlySet<string> = new Set<EventName>([
  'site_visit','site_exit','module_open','module_close','module_active_time',
  'tarot_start','tarot_complete','tarot_interpretation_view',
  'letter_compose_open','letter_choice','letter_saved','weekly_report_view','weekly_archive_expand',
]);
const CONSENT_KEY = 'velvet_analytics_consent_v1';
const TOKEN = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';
let initialized = false;
let activeModule: ModuleName | null = null;
let visibleSince: number | null = null;
let activeMilliseconds = 0;
let visitStarted = 0;
let listenersAdded = false;

export function getAnalyticsConsent(): 'granted' | 'denied' | 'unset' {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : 'unset';
  } catch { return 'unset'; }
}
function currentlyTracking() {
  return initialized && getAnalyticsConsent() === 'granted';
}
function safeProps(raw: SafeProperties): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  if (raw.module && ['draw','crystal','past','index'].includes(raw.module)) out.module = raw.module;
  if (raw.method === 'gesture' || raw.method === 'automatic') out.method = raw.method;
  if (raw.choice === 'write' || raw.choice === 'skip') out.choice = raw.choice;
  if (typeof raw.card_count === 'number' && Number.isInteger(raw.card_count) && raw.card_count >= 0 && raw.card_count <= 4) out.card_count = raw.card_count;
  if (typeof raw.duration_seconds === 'number' && Number.isFinite(raw.duration_seconds)) out.duration_seconds = Math.max(0, Math.min(86400, Math.round(raw.duration_seconds)));
  return out;
}
export function trackEvent(event: EventName, props: SafeProperties = {}) {
  if (!currentlyTracking() || !ALLOWED_EVENTS.has(event)) return;
  posthog.capture(event, safeProps(props));
}
function accumulateVisibleTime() {
  if (visibleSince !== null) {
    activeMilliseconds += Math.max(0, performance.now() - visibleSince);
    visibleSince = null;
  }
}
function flushActiveTime() {
  if (!activeModule) return;
  accumulateVisibleTime();
  if (activeMilliseconds >= 1000) trackEvent('module_active_time', { module: activeModule, duration_seconds: activeMilliseconds / 1000 });
  activeMilliseconds = 0;
}
export function enterModule(module: ModuleName) {
  if (activeModule) leaveModule();
  activeModule = module;
  activeMilliseconds = 0;
  visibleSince = document.visibilityState === 'visible' ? performance.now() : null;
  trackEvent('module_open', { module });
  if (module === 'index') trackEvent('weekly_report_view', { module: 'index' });
}
export function leaveModule() {
  const module = activeModule;
  if (!module) return;
  flushActiveTime();
  trackEvent('module_close', { module });
  activeModule = null;
  visibleSince = null;
}
function onVisibilityChange() {
  if (!activeModule) return;
  if (document.visibilityState === 'hidden') flushActiveTime();
  else if (visibleSince === null) visibleSince = performance.now();
}
function onPageHide() {
  flushActiveTime();
  if (visitStarted > 0) trackEvent('site_exit', { duration_seconds: (Date.now() - visitStarted) / 1000 });
}
export function initializeAnalytics() {
  if (initialized || !TOKEN || typeof window === 'undefined') return;
  initialized = true;
  posthog.init(TOKEN, {
    api_host: HOST,
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    disable_session_recording: true,
    disable_surveys: true,
    opt_out_capturing_by_default: true,
    persistence: 'localStorage',
    person_profiles: 'never',
    // Fail-closed event + property validation, including SDK-added URL properties.
    before_send: (event) => {
      if (!event || !ALLOWED_EVENTS.has(event.event)) return null;
      const props = event.properties || {};
      return {
        ...event,
        properties: {
          ...safeProps(props),
          distinct_id: props.distinct_id,
          token: props.token,
          $lib: props.$lib,
          $lib_version: props.$lib_version,
          $geoip_disable: true,
        },
      };
    },
  });
  if (!listenersAdded) {
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', onPageHide);
    listenersAdded = true;
  }
  if (getAnalyticsConsent() === 'granted') {
    posthog.opt_in_capturing();
    visitStarted = Date.now();
    trackEvent('site_visit');
  }
}
export function setAnalyticsConsent(allow: boolean) {
  // Flush current segment BEFORE revocation; no event may be emitted after opt-out.
  if (!allow) {
    activeMilliseconds = 0;
    visibleSince = null;
  }
  try { localStorage.setItem(CONSENT_KEY, allow ? 'granted' : 'denied'); } catch { /* storage blocked */ }
  if (!initialized) initializeAnalytics();
  if (!initialized) return;
  if (allow) {
    posthog.opt_in_capturing();
    visitStarted = Date.now();
    if (activeModule && document.visibilityState === 'visible') visibleSince = performance.now();
    trackEvent('site_visit');
  } else {
    posthog.opt_out_capturing();
    posthog.reset();
    visitStarted = 0;
  }
}
