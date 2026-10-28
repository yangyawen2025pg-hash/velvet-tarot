/**
 * Privacy-first, opt-in product analytics for Velvet Tarot.
 * Only explicitly allowlisted event names and properties are sent.
 * Never send questions, letters, mood scores, card identities, or camera frames.
 */
import posthog from 'posthog-js';

export type ModuleName = 'draw' | 'crystal' | 'past' | 'index';
type TarotMethod = 'gesture' | 'automatic';
type AnalyticsEvent =
  | 'site_visit'
  | 'module_open'
  | 'module_close'
  | 'tarot_start'
  | 'tarot_complete'
  | 'tarot_interpretation_view'
  | 'letter_saved'
  | 'weekly_report_view'
  | 'weekly_archive_expand';

type SafeProperties = {
  module?: ModuleName;
  method?: TarotMethod;
  card_count?: number;
};

const CONSENT_KEY = 'velvet_analytics_consent_v1';
const PROJECT_TOKEN = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
const HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';
let initialized = false;

export function getAnalyticsConsent(): 'granted' | 'denied' | 'unset' {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === 'granted' || value === 'denied' ? value : 'unset';
  } catch {
    return 'unset';
  }
}

export function initializeAnalytics() {
  if (initialized || !PROJECT_TOKEN || typeof window === 'undefined') return;
  initialized = true;
  posthog.init(PROJECT_TOKEN, {
    api_host: HOST,
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    disable_session_recording: true,
    opt_out_capturing_by_default: true,
    // Browser-anonymous identifiers support deduplicated visitors and retention.
    // Nothing is collected until consent is explicitly granted.
    persistence: 'localStorage',
    person_profiles: 'never',
    // Prevent sending unexpected custom/event properties from this application.
    before_send: (event) => {
      if (!event) return event;
      const allowedEvents: AnalyticsEvent[] = [
        'site_visit', 'module_open', 'module_close', 'tarot_start',
        'tarot_complete', 'tarot_interpretation_view', 'letter_saved',
        'weekly_report_view', 'weekly_archive_expand',
      ];
      if (!allowedEvents.includes(event.event as AnalyticsEvent)) return null;
      const props = event.properties || {};
      const clean: Record<string, string | number> = {};
      if (['draw', 'crystal', 'past', 'index'].includes(String(props.module))) {
        clean.module = String(props.module);
      }
      if (props.method === 'gesture' || props.method === 'automatic') {
        clean.method = props.method;
      }
      if (typeof props.card_count === 'number' && props.card_count >= 0 && props.card_count <= 4) {
        clean.card_count = props.card_count;
      }
      // PostHog's anonymous IDs and transport metadata are SDK-managed.
      return { ...event, properties: { ...clean, distinct_id: props.distinct_id, token: props.token } };
    },
  });
  if (getAnalyticsConsent() === 'granted') {
    posthog.opt_in_capturing();
    trackEvent('site_visit');
  }
}

export function setAnalyticsConsent(allow: boolean) {
  try { localStorage.setItem(CONSENT_KEY, allow ? 'granted' : 'denied'); } catch { /* private mode */ }
  if (!initialized) initializeAnalytics();
  if (!initialized) return;
  if (allow) {
    posthog.opt_in_capturing();
    trackEvent('site_visit');
  } else {
    posthog.opt_out_capturing();
  }
}

export function trackEvent(event: AnalyticsEvent, properties: SafeProperties = {}) {
  if (!initialized || getAnalyticsConsent() !== 'granted') return;
  posthog.capture(event, properties);
}
