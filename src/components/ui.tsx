import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme, useAuth } from '../context/AppContext'
import { NETWORKS, NETWORK_COLORS, fmt, LIVE_FEED, type Network } from '../lib/constants'

// ─── Logo ─────────────────────────────────────────────────────────────────────

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-xl' : 'text-lg'
  return (
    <span
      className={`font-display font-extrabold ${cls} bg-gradient-to-br from-green-brand to-cyan-400 bg-clip-text text-transparent`}
    >
      AirSwap
    </span>
  )
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

export function Topbar() {
  const { authed, walletBalance, openAuthSheet } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()

  return (
    <header className="topbar">
      <button onClick={() => navigate('/')} className="flex items-center">
        <Logo />
      </button>
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="w-9 h-9 flex items-center justify-center rounded-xl
                     bg-warm-100 dark:bg-night-700 text-ink-muted dark:text-white/60
                     border border-warm-200 dark:border-night-600 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {authed ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl
                          bg-warm-100 dark:bg-night-700 border border-warm-200 dark:border-night-600">
            <span className="text-xs text-ink-faint dark:text-white/40 font-medium">Wallet</span>
            <span className="font-display font-bold text-sm text-green-brand">{fmt(walletBalance)}</span>
          </div>
        ) : (
          <button
            onClick={() => openAuthSheet()}
            className="px-4 py-2 rounded-xl bg-green-brand text-white font-display font-bold text-sm
                       transition-all active:scale-95"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  )
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────

const NAV = [
  { path: '/',        label: 'Home',    icon: HomeIcon },
  { path: '/convert', label: 'Convert', icon: ConvertIcon },
  { path: '/data',    label: 'Data',    icon: null },        // center FAB
  { path: '/wallet',  label: 'Wallet',  icon: WalletIcon },
  { path: '/history', label: 'History', icon: HistoryIcon },
]

export function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="bottom-nav">
      {NAV.map((item, i) => {
        if (item.icon === null) {
          // Center Data FAB
          return (
            <div key="data-fab" className="flex-1 flex justify-center">
              <button
                onClick={() => navigate('/data')}
                className="w-13 h-13 rounded-full bg-green-brand flex items-center justify-center
                           shadow-green-glow border-4 border-warm-50 dark:border-night-900
                           transition-transform active:scale-90"
                aria-label="Buy Data"
                style={{ width: 52, height: 52 }}
              >
                <DataIcon active={pathname === '/data'} />
              </button>
            </div>
          )
        }

        const Icon = item.icon
        const active = pathname === item.path
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-colors
                        ${active
                          ? 'text-green-brand'
                          : 'text-ink-faint dark:text-white/30'
                        }`}
          >
            <Icon active={active} />
            <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

// ─── Back Button ─────────────────────────────────────────────────────────────

export function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 flex items-center justify-center rounded-xl
                 bg-warm-100 dark:bg-night-700 border border-warm-200 dark:border-night-600
                 text-ink dark:text-white transition-colors active:scale-95"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}

// ─── Sheet ────────────────────────────────────────────────────────────────────

interface SheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export function Sheet({ open, onClose, children, title }: SheetProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div
        className="sheet-panel"
        onClick={e => e.stopPropagation()}
      >
        <div className="sheet-handle" />
        {title && (
          <div className="px-5 py-3 border-b border-warm-200 dark:border-night-700">
            <h3 className="font-display font-bold text-base text-ink dark:text-white">{title}</h3>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

// ─── Auth Sheet ───────────────────────────────────────────────────────────────

export function AuthSheet() {
  const { showAuthSheet, closeAuthSheet, login } = useAuth()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)

  // Reset on open
  useEffect(() => {
    if (showAuthSheet) { setPhone(''); setOtp(''); setStep('phone') }
  }, [showAuthSheet])

  const handleSendOtp = () => {
    if (phone.length < 11) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep('otp') }, 1400)
  }

  const handleVerify = () => {
    if (otp.length < 4) return
    setLoading(true)
    setTimeout(() => { setLoading(false); login(phone) }, 1200)
  }

  return (
    <Sheet open={showAuthSheet} onClose={closeAuthSheet} title="Sign in to continue">
      <div className="px-5 py-5 flex flex-col gap-4">
        <p className="text-sm text-ink-muted dark:text-white/50 leading-relaxed">
          {step === 'phone'
            ? 'Enter your phone number to receive a one-time code.'
            : `OTP sent to ${phone}. Enter it below.`}
        </p>

        {step === 'phone' ? (
          <>
            <div>
              <label className="field-label">Phone Number</label>
              <input
                className="field-input"
                type="tel"
                inputMode="tel"
                placeholder="08012345678"
                value={phone}
                maxLength={11}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
            <button
              className="btn-primary"
              disabled={phone.length < 11 || loading}
              onClick={handleSendOtp}
            >
              {loading ? 'Sending…' : 'Send OTP →'}
            </button>
          </>
        ) : (
          <>
            <div>
              <label className="field-label">One-Time Password</label>
              <input
                className="field-input text-center text-2xl tracking-[0.4em] font-display font-bold"
                type="number"
                inputMode="numeric"
                placeholder="····"
                value={otp}
                maxLength={6}
                onChange={e => setOtp(e.target.value)}
              />
            </div>
            <button
              className="btn-primary"
              disabled={otp.length < 4 || loading}
              onClick={handleVerify}
            >
              {loading ? 'Verifying…' : 'Confirm →'}
            </button>
            <button
              className="btn-ghost"
              onClick={() => setStep('phone')}
            >
              ← Change number
            </button>
          </>
        )}

        <p className="text-[11px] text-ink-faint dark:text-white/30 text-center leading-relaxed">
          By continuing you agree to AirSwap's Terms & Privacy Policy
        </p>
      </div>
    </Sheet>
  )
}

// ─── Network Selector ─────────────────────────────────────────────────────────

export function NetworkSelector({
  selected,
  onSelect,
}: {
  selected: Network
  onSelect: (n: Network) => void
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {NETWORKS.map(n => (
        <button
          key={n}
          className={`network-btn ${selected === n ? 'active' : ''}`}
          onClick={() => onSelect(n)}
        >
          <div
            className="w-7 h-7 rounded-full"
            style={{ background: NETWORK_COLORS[n] }}
          />
          <span className={`text-[11px] font-bold ${selected === n ? 'text-green-brand' : 'text-ink-faint dark:text-white/40'}`}>
            {n}
          </span>
        </button>
      ))}
    </div>
  )
}

// ─── Live Feed Ticker ─────────────────────────────────────────────────────────

export function LiveTicker() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % LIVE_FEED.length), 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center gap-2 overflow-hidden h-9">
      <span className="text-green-brand text-[8px] animate-pulse-dot flex-shrink-0">●</span>
      <span
        key={idx}
        className="text-sm text-ink-muted dark:text-white/50 animate-fade-up truncate"
      >
        {LIVE_FEED[idx]}
      </span>
    </div>
  )
}

// ─── Countdown Hook ───────────────────────────────────────────────────────────

export function useCountdown(seconds: number) {
  const [rem, setRem] = useState(seconds)
  useEffect(() => {
    if (rem <= 0) return
    const id = setInterval(() => setRem(r => r - 1), 1000)
    return () => clearInterval(id)
  }, [rem])
  const m = String(Math.floor(rem / 60)).padStart(2, '0')
  const s = String(rem % 60).padStart(2, '0')
  return { display: `${m}:${s}`, done: rem <= 0 }
}

// ─── Copy Button ─────────────────────────────────────────────────────────────

export function CopyBtn({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false)
  const handle = useCallback(() => {
    navigator.clipboard?.writeText(text).catch(() => {})
    setDone(true)
    setTimeout(() => setDone(false), 2000)
  }, [text])

  return (
    <button
      onClick={handle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                 bg-green-light dark:bg-green-brand/10 border border-green-brand/30
                 text-green-brand text-xs font-bold font-display transition-all active:scale-95"
    >
      {done ? '✓ Copied' : `📋 ${label}`}
    </button>
  )
}

// ─── Processing Stage Row ─────────────────────────────────────────────────────

type StageStatus = 'done' | 'active' | 'idle'

export function StageRow({
  label,
  status,
}: {
  label: string
  status: StageStatus
}) {
  return (
    <div className="stage-row">
      <div
        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
          status === 'done'   ? 'bg-green-brand' :
          status === 'active' ? 'bg-green-brand animate-pulse-dot' :
                                'bg-warm-300 dark:bg-night-600'
        }`}
      />
      <span
        className={`text-sm ${
          status === 'idle'
            ? 'text-ink-faint dark:text-white/30'
            : status === 'active'
            ? 'text-ink dark:text-white font-semibold'
            : 'text-ink dark:text-white'
        }`}
      >
        {label}
      </span>
      {status === 'done' && (
        <span className="ml-auto text-green-brand text-sm">✓</span>
      )}
    </div>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 8.5L10 3L17 8.5V17H13V12H7V17H3V8.5Z"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ConvertIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M5 7H15M15 7L12 4M15 7L12 10M15 13H5M5 13L8 10M5 13L8 16"
        stroke="currentColor"
        strokeWidth={active ? '2' : '1.6'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DataIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M4 16C4 14 6 12 11 12C16 12 18 14 18 16"
        stroke="white"
        strokeWidth={active ? '2.2' : '2'}
        strokeLinecap="round"
      />
      <path
        d="M7 11C7 9.5 8.5 8 11 8C13.5 8 15 9.5 15 11"
        stroke="white"
        strokeWidth={active ? '2.2' : '2'}
        strokeLinecap="round"
      />
      <path
        d="M9.5 8C9.5 6.5 10 5 11 5C12 5 12.5 6.5 12.5 8"
        stroke="white"
        strokeWidth={active ? '2.2' : '2'}
        strokeLinecap="round"
      />
    </svg>
  )
}

function WalletIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect
        x="2" y="5" width="16" height="12" rx="2"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.6"
        fillOpacity={active ? 0.15 : 0}
      />
      <path
        d="M2 8H18M13 12H15"
        stroke="currentColor"
        strokeWidth={active ? '2' : '1.6'}
        strokeLinecap="round"
      />
      <path d="M6 5V4C6 3 7 2 10 2C13 2 14 3 14 4V5" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  )
}

function HistoryIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle
        cx="10" cy="10" r="7"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.6"
        fillOpacity={active ? 0.12 : 0}
      />
      <path
        d="M10 7V10.5L12.5 12"
        stroke="currentColor"
        strokeWidth={active ? '2' : '1.6'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
