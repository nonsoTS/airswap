import { useState } from 'react'
import { MOCK_TRANSACTIONS, fmt, type HistoryFilter } from '../lib/constants'

export default function HistoryPage() {
  const [filter, setFilter] = useState<HistoryFilter>('All')
  const filters: HistoryFilter[] = ['All', 'Airtime', 'Data']

  const filtered = MOCK_TRANSACTIONS.filter(tx =>
    filter === 'All' ? true :
    filter === 'Airtime' ? tx.type === 'airtime' : tx.type === 'data'
  )

  return (
    <div className="screen-scroll">
      <div className="px-5 pt-5">
        <h1 className="font-display font-extrabold text-2xl text-ink dark:text-white mb-4 animate-fade-up">
          History
        </h1>

        {/* Filters */}
        <div className="tabs-bar mb-4 animate-fade-up" style={{ animationDelay: '0.04s' }}>
          {filters.map(f => (
            <button
              key={f}
              className={`tab-item ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="card px-4 animate-fade-up" style={{ animationDelay: '0.08s' }}>
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-ink-faint dark:text-white/30 text-sm">
              No transactions yet
            </div>
          ) : (
            filtered.map(tx => (
              <div key={tx.id} className="tx-row">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0
                                ${tx.type === 'airtime'
                                  ? 'bg-blue-50 dark:bg-blue-500/10'
                                  : 'bg-green-light dark:bg-green-brand/10'}`}>
                  {tx.type === 'airtime' ? '💱' : '📶'}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink dark:text-white">
                    {tx.type === 'airtime' ? 'Airtime Converted' : 'Data Purchase'}
                  </p>
                  <p className="text-xs text-ink-faint dark:text-white/40 mt-0.5 truncate">{tx.detail}</p>
                </div>

                <div className="text-right flex-shrink-0 flex flex-col items-end gap-1">
                  <p className={`text-sm font-display font-bold ${
                    tx.type === 'airtime' ? 'text-blue-500' : 'text-red-500'
                  }`}>
                    {tx.type === 'airtime' ? '+' : '−'}{fmt(tx.amount)}
                  </p>
                  <p className="text-[10px] text-ink-faint dark:text-white/40">{tx.timestamp}</p>
                  <span className={`badge ${
                    tx.status === 'success' ? 'badge-green' :
                    tx.status === 'failed'  ? 'badge-red' : 'badge-warn'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
