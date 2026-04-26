import { useNavigate } from 'react-router-dom'
import { LiveTicker } from '../components/ui'
import { fmt } from '../lib/constants'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="screen-scroll">
      {/* Hero */}
      <div className="px-5 pt-4 pb-0">
        <div className="animate-fade-up relative overflow-hidden rounded-3xl p-6
                        bg-gradient-to-br from-[#071A10] to-night-800
                        border border-green-brand/20">
          {/* Glow orb */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full
                          bg-[radial-gradient(circle,rgba(0,192,96,0.18)_0%,transparent_70%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                            bg-green-brand/15 border border-green-brand/25 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-green-brand animate-pulse-dot" />
              <span className="text-green-brand text-xs font-bold tracking-wide">Live & Instant</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl text-white leading-tight mb-3">
              Convert Airtime<br />to Cash or Buy<br />
              <span className="text-green-brand">Cheap Data</span>
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4">
              {[['⚡', 'Fast payouts'], ['🔒', 'Secure'], ['✓', '10,000+ users']].map(([icon, label]) => (
                <span key={label} className="flex items-center gap-1.5 text-white/60 text-xs font-medium">
                  <span className="text-green-brand">{icon}</span>{label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="px-5 pt-6">
        <p className="section-label" style={{ animationDelay: '0.05s' }}>What do you want to do?</p>

        <div className="flex flex-col gap-3">
          <ActionCard
            emoji="💱"
            emojiColor="bg-blue-50 dark:bg-blue-500/10"
            title="Convert Airtime → Cash"
            desc="Sell excess airtime. Get paid in seconds."
            onClick={() => navigate('/convert')}
            delay="0.08s"
          />
          <ActionCard
            emoji="📶"
            emojiColor="bg-green-light dark:bg-green-brand/10"
            title="Buy Cheap Data"
            desc="SME data. All networks. Best rates."
            onClick={() => navigate('/data')}
            delay="0.12s"
          />
        </div>
      </div>

      {/* Stats + Live Feed */}
      <div className="px-5 pt-6 pb-4">
        <p className="section-label">Live Activity</p>
        <div className="card p-4" style={{ animation: 'fadeUp 0.4s 0.16s ease both' }}>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              ['10k+', 'Transactions'],
              ['~30s', 'Avg payout'],
              ['99%',  'Success rate'],
            ].map(([value, label]) => (
              <div key={label} className="flex flex-col items-center py-3 rounded-xl
                                          bg-warm-50 dark:bg-night-700">
                <span className="font-display font-extrabold text-xl text-green-brand">{value}</span>
                <span className="text-[10px] text-ink-faint dark:text-white/40 mt-0.5">{label}</span>
              </div>
            ))}
          </div>
          <LiveTicker />
        </div>
      </div>

      {/* Incentive Banner */}
      <div className="px-5 pb-2">
        <div className="flex items-center gap-3 p-4 rounded-2xl
                        bg-gradient-to-r from-green-light to-cyan-50
                        dark:from-green-brand/10 dark:to-cyan-500/5
                        border border-green-brand/20">
          <span className="text-2xl flex-shrink-0">💡</span>
          <div>
            <span className="text-green-brand font-display font-extrabold text-sm">+10% Bonus </span>
            <span className="text-ink dark:text-white/80 text-sm">when you convert airtime to wallet instead of cash</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActionCard({
  emoji, emojiColor, title, desc, onClick, delay,
}: {
  emoji: string; emojiColor: string; title: string; desc: string
  onClick: () => void; delay: string
}) {
  return (
    <button
      onClick={onClick}
      className="card flex items-center gap-4 p-4 text-left w-full
                 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5
                 active:scale-[0.98] group"
      style={{ animation: `fadeUp 0.4s ${delay} ease both` }}
    >
      <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl ${emojiColor}`}>
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display font-bold text-[15px] text-ink dark:text-white mb-0.5">{title}</div>
        <div className="text-sm text-ink-muted dark:text-white/50 truncate">{desc}</div>
      </div>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
           className="text-warm-300 dark:text-night-600 group-hover:text-green-brand transition-colors flex-shrink-0">
        <path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}
