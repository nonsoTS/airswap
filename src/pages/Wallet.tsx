import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AppContext'
import { MOCK_TRANSACTIONS, fmt } from '../lib/constants'

export default function WalletPage() {
  const navigate = useNavigate()
  const { authed, walletBalance, openAuthSheet } = useAuth()

  const handleProtectedAction = (action: () => void) => {
    if (!authed) openAuthSheet(action)
    else action()
  }

  return (
    <div className="screen-scroll">
      {/* Balance card */}
      <div className="px-5 pt-4">
        <div className="wallet-hero animate-fade-up">
          {/* Decorative orbs */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full
                          bg-[radial-gradient(circle,rgba(0,192,96,0.12)_0%,transparent_70%)]" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full
                          bg-[radial-gradient(circle,rgba(0,191,255,0.06)_0%,transparent_70%)]" />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/40 mb-2">
              Wallet Balance
            </p>
            {authed ? (
              <p className="font-display font-extrabold text-4xl text-green-brand leading-none mb-1">
                {fmt(walletBalance)}
              </p>
            ) : (
              <button
                onClick={() => openAuthSheet()}
                className="font-display font-extrabold text-2xl text-white/40 hover:text-green-brand transition-colors"
              >
                Sign in to view ›
              </button>
            )}
            <p className="text-xs text-white/30 mt-2">Updated just now</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-5 pt-4">
        <div className="grid grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: '0.05s' }}>
          {[
            { icon: '🏦', label: 'Withdraw', action: () => {} },
            { icon: '📶', label: 'Buy Data', action: () => navigate('/data') },
            { icon: '➕', label: 'Fund Wallet', action: () => {} },
          ].map(({ icon, label, action }) => (
            <button
              key={label}
              onClick={() => handleProtectedAction(action)}
              className="flex flex-col items-center gap-2 py-4 rounded-2xl
                         bg-white dark:bg-night-800 border border-warm-200 dark:border-night-700
                         shadow-card-light transition-all active:scale-95 hover:shadow-card-hover"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-bold text-ink-muted dark:text-white/60">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Incentive banner */}
      <div className="px-5 pt-4 animate-fade-up" style={{ animationDelay: '0.08s' }}>
        <div className="flex items-center gap-3 p-4 rounded-2xl
                        bg-gradient-to-r from-green-light to-cyan-50
                        dark:from-green-brand/10 dark:to-cyan-500/5
                        border border-green-brand/20">
          <span className="text-2xl flex-shrink-0">💡</span>
          <p className="text-sm text-ink dark:text-white leading-snug">
            <strong className="text-green-brand font-display">+10% bonus</strong> when you convert airtime to wallet instead of cash
          </p>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="px-5 pt-5 pb-4">
        <p className="section-label">Recent Transactions</p>
        <div className="card px-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {MOCK_TRANSACTIONS.slice(0, 5).map(tx => (
            <div key={tx.id} className="tx-row">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0
                              ${tx.type === 'airtime'
                                ? 'bg-blue-50 dark:bg-blue-500/10'
                                : 'bg-green-light dark:bg-green-brand/10'}`}>
                {tx.type === 'airtime' ? '💱' : '📶'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink dark:text-white truncate">
                  {tx.type === 'airtime' ? 'Airtime Converted' : 'Data Purchase'}
                </p>
                <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5 truncate">{tx.detail}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-sm font-display font-bold ${tx.type === 'airtime' ? 'text-blue-500' : 'text-red-500'}`}>
                  {tx.type === 'airtime' ? '+' : '−'}{fmt(tx.amount)}
                </p>
                <p className="text-[10px] text-ink-faint dark:text-white/40 mt-0.5">{tx.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
