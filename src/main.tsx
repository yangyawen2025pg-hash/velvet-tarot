import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { TRPCProvider } from '@/providers/trpc'
import './index.css'
import App from './App.tsx'
import AnalyticsConsent from '@/components/AnalyticsConsent'
import { initializeAnalytics } from '@/lib/analytics'

initializeAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TRPCProvider>
        <App />
        <AnalyticsConsent />
      </TRPCProvider>
    </BrowserRouter>
  </StrictMode>,
)
