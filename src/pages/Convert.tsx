import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sheet, BackBtn, NetworkSelector, useCountdown,
  CopyBtn, StageRow, AuthSheet,
} from '../components/ui'
import { useConvert, useAuth } from '../context/AppContext'
import { fmt, type Network, type DestType } from '../lib/constants'

type Step = 'input' | 'instructions' | 'processing' | 'success'

export default function ConvertPage() {
  const navigate = useNavigate()
  const { authed, openAuthSheet } = useAuth()
  const convertCtx = useConvert()
  const [step, setStep] = useState<Step>('input')

  // local form state
  const [network, setNetwork] = useState<Network>(convertCtx.network)
  const [amountStr, setAmountStr] = useState(convertCtx.amount > 0 ? String(convertCtx.amount) : '')
  const [dest, setDest] = useState<DestType>(convertCtx.dest)

  const amount = parseInt(amountStr) || 0
  const rate = dest === 'wallet' ? 0.85 : 0.80
  const receive = Math.floor(amount * rate)
  const valid = amount >= 100

  function handleContinue() {
    convertCtx.set({ network, amount, dest })
    // Auth gate — required before generating transfer details
    if (!authed) {
      openAuthSheet(() => setStep('instructions'))
    } else {
      setStep('instructions')
    }
  }

  if (step === 'processing') return <ProcessingStep onDone={() => setStep('success')} />
  if (step === 'success') return (
    <SuccessStep
      amount={amount}
      receive={receive}
      dest={dest}
      onBuyData={() => navigate('/data')}
      onHome={() => navigate('/')}
    />
  )

  return (
    <>
      <div className="screen-scroll">
        {/* Step indicator */}
        <div className="page-header">
          <BackBtn onClick={() => navigate(-1)} />
          <div className="flex-1">
            <h1 className="page-title">Convert Airtime</h1>
          </div>
          <StepPills current={step === 'input' ? 1 : step === 'instructions' ? 2 : 3} total={3} />
        </div>

        <div className="px-5 pt-4 flex flex-col gap-5 pb-4">
          {/* Network */}
          <div className="animate-fade-up">
            <p className="section-label">Select Network</p>
            <NetworkSelector selected={network} onSelect={setNetwork} />
          </div>

          {/* Amount */}
          <div className="animate-fade-up" style={{ animationDelay: '0.05s' }}>
            <label className="field-label">Airtime Amount (₦)</label>
            <input
              className="field-input text-lg font-display font-bold"
              type="number"
              inputMode="numeric"
              placeholder="e.g. 5000"
              value={amountStr}
              onChange={e => setAmountStr(e.target.value)}
            />
          </div>

          {/* Receive preview */}
          {amount > 0 && (
            <div className="receive-box animate-fade-up">
              <div>
                <p className="text-xs text-ink-faint dark:text-white/40 font-semibold uppercase tracking-wide mb-1">You will receive</p>
                <p className="font-display font-extrabold text-2xl text-green-brand">{fmt(receive)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-ink-faint dark:text-white/40 font-semibold uppercase tracking-wide mb-1">Rate</p>
                <p className="font-display font-bold text-lg text-ink dark:text-white">{(rate * 100).toFixed(0)}%</p>
              </div>
            </div>
          )}

          {/* Destination */}
          <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <p className="section-label">Payout Destination</p>
            <div className="grid grid-cols-2 gap-3">
              <DestCard
                icon="🏦" label="Bank Account" sub="80% rate"
                active={dest === 'bank'} onClick={() => setDest('bank')}
              />
              <DestCard
                icon="👛" label="Wallet" sub="+5% bonus" subGreen
                active={dest === 'wallet'} onClick={() => setDest('wallet')}
              />
            </div>
          </div>

          {/* CTA */}
          <button
            className="btn-primary animate-fade-up"
            style={{ animationDelay: '0.15s' }}
            disabled={!valid}
            onClick={handleContinue}
          >
            Continue →
          </button>

          {!authed && (
            <p className="text-center text-xs text-ink-faint dark:text-white/30">
              You'll be asked to sign in before we generate transfer details
            </p>
          )}
        </div>
      </div>

      {/* Auth sheet lives here too */}
      <AuthSheet />

      {/* Instructions sheet */}
      <Sheet
        open={step === 'instructions'}
        onClose={() => setStep('input')}
        title="Transfer Airtime"
      >
        <InstructionsContent
          network={network}
          amount={amount}
          onConfirm={() => setStep('processing')}
          onBack={() => setStep('input')}
        />
      </Sheet>
    </>
  )
}

// ─── Instructions Sheet Content ───────────────────────────────────────────────

function InstructionsContent({
  network, amount, onConfirm, onBack,
}: {
  network: Network; amount: number; onConfirm: () => void; onBack: () => void
}) {
  const phone = '0801 234 5678'
  const ussd = `*321*${amount}*08012345678#`
  const { display, done } = useCountdown(300)

  return (
    <div className="px-5 py-5 flex flex-col gap-4">
      {/* Phone */}
      <div className="card p-4">
        <p className="text-sm text-ink-muted dark:text-white/50 mb-3">
          Send <strong className="text-ink dark:text-white">{network} {fmt(amount)}</strong> airtime to:
        </p>
        <div className="flex items-center justify-between">
          <span className="font-display font-extrabold text-xl text-green-brand tracking-wide">
            {phone}
          </span>
          <CopyBtn text={phone.replace(/\s/g, '')} />
        </div>
      </div>

      {/* USSD */}
      <div>
        <p className="section-label">Or dial USSD</p>
        <div className="card-warm p-4 text-center">
          <p className="font-mono font-bold text-lg text-green-brand tracking-wide break-all mb-3">
            {ussd}
          </p>
          <CopyBtn text={ussd} label="Copy USSD" />
        </div>
      </div>

      {/* Timer */}
      <div className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold font-display
                       ${done
                         ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-500'
                         : 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400'
                       }`}>
        <span>⏱</span>
        <span>{done ? 'Session expired' : `Expires in ${display}`}</span>
      </div>

      {/* Status */}
      <div className="flex items-center gap-3 p-4 rounded-xl
                      bg-warm-100 dark:bg-night-700 border border-warm-200 dark:border-night-600">
        <span className="text-xl animate-pulse-dot">⏳</span>
        <span className="text-sm text-ink-muted dark:text-white/60">Waiting for airtime transfer…</span>
      </div>

      <button className="btn-primary" onClick={onConfirm} disabled={done}>
        I've Sent the Airtime ✓
      </button>
      <button className="btn-ghost" onClick={onBack}>Cancel</button>
    </div>
  )
}

// ─── Processing Step ──────────────────────────────────────────────────────────

function ProcessingStep({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0)
  const stages = ['Airtime received', 'Verifying…', 'Processing payment…']

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1500)
    const t2 = setTimeout(() => setStage(2), 3200)
    const t3 = setTimeout(() => onDone(), 5000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  return (
    <div className="screen-scroll flex flex-col items-center justify-center min-h-[70vh] px-8">
      <div className="spinner w-16 h-16 mb-8" />
      <h2 className="font-display font-bold text-xl text-ink dark:text-white text-center mb-8">
        Processing your conversion
      </h2>
      <div className="card p-4 w-full">
        {stages.map((label, i) => (
          <StageRow
            key={label}
            label={label}
            status={i < stage ? 'done' : i === stage ? 'active' : 'idle'}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Success Step ─────────────────────────────────────────────────────────────

function SuccessStep({
  amount, receive, dest, onBuyData, onHome,
}: {
  amount: number; receive: number; dest: DestType
  onBuyData: () => void; onHome: () => void
}) {
  return (
    <div className="screen-scroll flex flex-col items-center px-5 pt-14 pb-6">
      <div className="w-24 h-24 rounded-full bg-green-light dark:bg-green-brand/15
                      border-2 border-green-brand flex items-center justify-center
                      text-5xl animate-success-pop shadow-green-glow mb-6">
        🎉
      </div>
      <h2 className="font-display font-extrabold text-3xl text-ink dark:text-white text-center mb-2">
        {fmt(receive)} sent!
      </h2>
      <p className="text-ink-muted dark:text-white/50 text-sm text-center mb-8">
        {dest === 'bank' ? 'Funds sent to your bank account' : 'Funds added to your AirSwap wallet'}
      </p>

      <div className="card p-4 w-full mb-5">
        {[
          ['You sent', `${fmt(amount)} airtime`],
          ['You received', fmt(receive)],
          ['Reference', `#AS${Date.now().toString().slice(-6)}`],
        ].map(([label, value], i) => (
          <div key={label} className={`flex justify-between py-3 ${i < 2 ? 'border-b border-warm-100 dark:border-night-700' : ''}`}>
            <span className="text-sm text-ink-muted dark:text-white/50">{label}</span>
            <span className={`text-sm font-semibold ${i === 1 ? 'text-green-brand' : 'text-ink dark:text-white'}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Upsell */}
      <div className="flex items-center gap-3 p-4 w-full rounded-2xl mb-6
                      bg-gradient-to-r from-green-light to-cyan-50
                      dark:from-green-brand/10 dark:to-cyan-500/5
                      border border-green-brand/20">
        <span className="text-2xl">📶</span>
        <div>
          <p className="text-xs text-ink-muted dark:text-white/50 mb-0.5">Get more value next time</p>
          <p className="text-sm text-ink dark:text-white font-medium">Use your balance to buy <strong>discounted data</strong></p>
        </div>
      </div>

      <button className="btn-primary w-full mb-3" onClick={onBuyData}>📶 Buy Data Now</button>
      <button className="btn-ghost w-full" onClick={onHome}>Back to Home</button>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function DestCard({
  icon, label, sub, subGreen = false, active, onClick,
}: {
  icon: string; label: string; sub: string; subGreen?: boolean
  active: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 py-4 px-3 rounded-xl border-2 transition-all
                  ${active
                    ? 'border-green-brand bg-green-light dark:bg-green-brand/10'
                    : 'border-warm-200 dark:border-night-600 bg-warm-100 dark:bg-night-700'
                  }`}
    >
      <span className="text-2xl mb-1">{icon}</span>
      <span className={`text-sm font-bold font-display ${active ? 'text-green-brand' : 'text-ink dark:text-white'}`}>{label}</span>
      <span className={`text-xs ${subGreen ? 'text-green-brand font-bold' : 'text-ink-faint dark:text-white/40'}`}>{sub}</span>
    </button>
  )
}

function StepPills({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i + 1 === current ? 'w-6 bg-green-brand' :
            i + 1 < current  ? 'w-3 bg-green-brand/40' :
                                'w-3 bg-warm-200 dark:bg-night-600'
          }`}
        />
      ))}
    </div>
  )
}
