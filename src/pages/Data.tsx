import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sheet, BackBtn, NetworkSelector, StageRow, AuthSheet } from '../components/ui'
import { useDataFlow, useAuth } from '../context/AppContext'
import { DATA_PLANS, fmt, type Network, type DataPlan, type DataTabType, type PayMethod } from '../lib/constants'

type Step = 'select' | 'form' | 'processing' | 'success'

export default function DataPage() {
  const navigate = useNavigate()
  const { authed, openAuthSheet, walletBalance } = useAuth()
  const dataCtx = useDataFlow()

  const [step, setStep] = useState<Step>('select')
  const [network, setNetwork] = useState<Network>(dataCtx.network)
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(dataCtx.plan)
  const [tab, setTab] = useState<DataTabType>('SME')
  const [phone, setPhone] = useState(dataCtx.phone)
  const [payMethod, setPayMethod] = useState<PayMethod>('wallet')

  function handleBuy() {
    if (!selectedPlan) return
    dataCtx.set({ network, plan: selectedPlan, phone })
    // Auth gate — required before payout/purchase
    if (!authed) {
      openAuthSheet(() => setStep('processing'))
    } else {
      setStep('processing')
    }
  }

  if (step === 'processing') {
    return <ProcessingStep onDone={() => setStep('success')} />
  }
  if (step === 'success' && selectedPlan) {
    return (
      <SuccessStep
        network={network}
        plan={selectedPlan}
        phone={phone}
        onHome={() => navigate('/')}
      />
    )
  }

  const tabs: DataTabType[] = ['SME', 'Gifting', 'Corporate']
  const plans = DATA_PLANS[network]

  return (
    <>
      <div className="screen-scroll">
        <div className="page-header">
          <BackBtn onClick={() => navigate(-1)} />
          <h1 className="page-title">Buy Data</h1>
        </div>

        <div className="px-5 pt-4 flex flex-col gap-5">
          {/* Network */}
          <div className="animate-fade-up">
            <p className="section-label">Select Network</p>
            <NetworkSelector
              selected={network}
              onSelect={n => { setNetwork(n); setSelectedPlan(null) }}
            />
          </div>

          {/* Tabs */}
          <div className="tabs-bar animate-fade-up" style={{ animationDelay: '0.05s' }}>
            {tabs.map(t => (
              <button
                key={t}
                className={`tab-item ${tab === t ? 'active' : ''}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Plans */}
          <div className="flex flex-col animate-fade-up" style={{ animationDelay: '0.08s' }}>
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`plan-card mb-2 ${selectedPlan?.id === plan.id ? 'selected' : ''}`}
                onClick={() => setSelectedPlan(plan)}
              >
                <div>
                  <p className="font-display font-bold text-[16px] text-ink dark:text-white">{plan.size}</p>
                  {plan.popular && <span className="badge badge-green mt-1">Popular</span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-[16px] text-green-brand">{fmt(plan.price)}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                  ${selectedPlan?.id === plan.id
                                    ? 'border-green-brand'
                                    : 'border-warm-300 dark:border-night-500'}`}>
                    {selectedPlan?.id === plan.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-green-brand" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn-primary animate-fade-up"
            style={{ animationDelay: '0.12s' }}
            disabled={!selectedPlan}
            onClick={() => selectedPlan && setStep('form')}
          >
            Continue →
          </button>

          {!authed && (
            <p className="text-center text-xs text-ink-faint dark:text-white/30 -mt-2 pb-2">
              Sign in required before purchase
            </p>
          )}
        </div>
      </div>

      <AuthSheet />

      {/* Purchase form sheet */}
      <Sheet
        open={step === 'form'}
        onClose={() => setStep('select')}
        title="Confirm Purchase"
      >
        {selectedPlan && (
          <PurchaseForm
            network={network}
            plan={selectedPlan}
            phone={phone}
            setPhone={setPhone}
            payMethod={payMethod}
            setPayMethod={setPayMethod}
            walletBalance={walletBalance}
            onBuy={handleBuy}
            onBack={() => setStep('select')}
          />
        )}
      </Sheet>
    </>
  )
}

// ─── Purchase Form ────────────────────────────────────────────────────────────

function PurchaseForm({
  network, plan, phone, setPhone, payMethod, setPayMethod, walletBalance, onBuy, onBack,
}: {
  network: Network; plan: DataPlan
  phone: string; setPhone: (p: string) => void
  payMethod: PayMethod; setPayMethod: (m: PayMethod) => void
  walletBalance: number; onBuy: () => void; onBack: () => void
}) {
  const valid = phone.length >= 11

  return (
    <div className="px-5 py-5 flex flex-col gap-4">
      {/* Plan summary */}
      <div className="card-warm p-4 flex items-center justify-between">
        <div>
          <p className="font-display font-extrabold text-2xl text-ink dark:text-white">{plan.size}</p>
          <p className="text-sm text-ink-muted dark:text-white/50 mt-0.5">{network} · SME Data</p>
        </div>
        <p className="font-display font-extrabold text-2xl text-green-brand">{fmt(plan.price)}</p>
      </div>

      {/* Phone */}
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

      {/* Payment method */}
      <div>
        <p className="section-label">Payment Method</p>
        {[
          {
            id: 'wallet' as PayMethod,
            icon: '👛',
            label: 'Wallet Balance',
            sub: `${fmt(walletBalance)} available`,
          },
          {
            id: 'card' as PayMethod,
            icon: '💳',
            label: 'Card / Bank Transfer',
            sub: 'Secure via Paystack',
          },
        ].map(opt => (
          <button
            key={opt.id}
            onClick={() => setPayMethod(opt.id)}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 mb-2 transition-all
                        ${payMethod === opt.id
                          ? 'border-green-brand bg-green-light dark:bg-green-brand/10'
                          : 'border-warm-200 dark:border-night-600 bg-warm-100 dark:bg-night-700'
                        }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                            ${payMethod === opt.id ? 'border-green-brand' : 'border-warm-300 dark:border-night-500'}`}>
              {payMethod === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-green-brand" />}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-ink dark:text-white">{opt.label}</p>
              <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5">{opt.sub}</p>
            </div>
            <span className="text-xl">{opt.icon}</span>
          </button>
        ))}
      </div>

      <button className="btn-primary" disabled={!valid} onClick={onBuy}>
        Buy Now — {fmt(plan.price)}
      </button>
      <button className="btn-ghost" onClick={onBack}>← Back</button>
    </div>
  )
}

// ─── Processing ───────────────────────────────────────────────────────────────

function ProcessingStep({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="screen-scroll flex flex-col items-center justify-center min-h-[70vh]">
      <div className="spinner w-16 h-16 mb-6" />
      <p className="font-display font-bold text-xl text-ink dark:text-white mb-2">Sending data…</p>
      <p className="text-sm text-ink-faint dark:text-white/40">This only takes a moment</p>
    </div>
  )
}

// ─── Success ──────────────────────────────────────────────────────────────────

function SuccessStep({
  network, plan, phone, onHome,
}: {
  network: Network; plan: DataPlan; phone: string; onHome: () => void
}) {
  const rows = [
    ['Network', network],
    ['Plan', `${plan.size} SME Data`],
    ['Phone', phone],
    ['Amount', fmt(plan.price)],
    ['Time', new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })],
  ]

  return (
    <div className="screen-scroll flex flex-col items-center px-5 pt-14 pb-6">
      <div className="w-24 h-24 rounded-full bg-green-light dark:bg-green-brand/15
                      border-2 border-green-brand flex items-center justify-center
                      text-5xl animate-success-pop shadow-green-glow mb-6">
        📶
      </div>
      <h2 className="font-display font-extrabold text-3xl text-ink dark:text-white text-center mb-2">
        Data Sent! 🎉
      </h2>
      <p className="text-ink-muted dark:text-white/50 text-sm text-center mb-8">
        Your bundle is on its way
      </p>

      <div className="card w-full mb-6">
        {rows.map(([label, value], i) => (
          <div key={label} className={`flex justify-between py-3 px-4 ${i < rows.length - 1 ? 'border-b border-warm-100 dark:border-night-700' : ''}`}>
            <span className="text-sm text-ink-muted dark:text-white/50">{label}</span>
            <span className="text-sm font-semibold text-ink dark:text-white">{value}</span>
          </div>
        ))}
      </div>

      <button className="btn-primary w-full" onClick={onHome}>Back to Home</button>
    </div>
  )
}
