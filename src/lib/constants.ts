// ─── Types ────────────────────────────────────────────────────────────────────

export type Network = 'MTN' | 'Airtel' | 'Glo' | '9mobile'
export type DestType = 'bank' | 'wallet'
export type PayMethod = 'wallet' | 'card'
export type DataTabType = 'SME' | 'Gifting' | 'Corporate'
export type HistoryFilter = 'All' | 'Airtime' | 'Data'

export interface DataPlan {
  id: string
  size: string
  price: number
  popular?: boolean
}

export interface Transaction {
  id: string
  type: 'airtime' | 'data'
  amount: number
  status: 'success' | 'pending' | 'failed'
  timestamp: string
  detail: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const NETWORKS: Network[] = ['MTN', 'Airtel', 'Glo', '9mobile']

export const NETWORK_COLORS: Record<Network, string> = {
  MTN:     '#FFCC00',
  Airtel:  '#E20000',
  Glo:     '#00A550',
  '9mobile': '#006E51',
}

export const DATA_PLANS: Record<Network, DataPlan[]> = {
  MTN: [
    { id: '1', size: '1GB',  price: 300 },
    { id: '2', size: '2GB',  price: 550, popular: true },
    { id: '3', size: '5GB',  price: 1200 },
    { id: '4', size: '10GB', price: 2200 },
    { id: '5', size: '20GB', price: 3900 },
  ],
  Airtel: [
    { id: '1', size: '1GB',  price: 310 },
    { id: '2', size: '2GB',  price: 570, popular: true },
    { id: '3', size: '5GB',  price: 1250 },
    { id: '4', size: '10GB', price: 2300 },
  ],
  Glo: [
    { id: '1', size: '1.5GB', price: 300, popular: true },
    { id: '2', size: '3GB',   price: 550 },
    { id: '3', size: '6GB',   price: 1200 },
    { id: '4', size: '12GB',  price: 2200 },
  ],
  '9mobile': [
    { id: '1', size: '1GB',   price: 290 },
    { id: '2', size: '2.5GB', price: 550, popular: true },
    { id: '3', size: '5GB',   price: 1150 },
  ],
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'airtime', amount: 5000,  status: 'success', timestamp: '2 mins ago',  detail: 'MTN → Bank' },
  { id: '2', type: 'data',    amount: 550,   status: 'success', timestamp: '1 hr ago',    detail: 'MTN 2GB → 08012345678' },
  { id: '3', type: 'airtime', amount: 23000, status: 'success', timestamp: '3 hrs ago',   detail: 'Airtel → Bank' },
  { id: '4', type: 'data',    amount: 1200,  status: 'success', timestamp: 'Yesterday',   detail: 'Glo 5GB → 08098765432' },
  { id: '5', type: 'airtime', amount: 10700, status: 'success', timestamp: 'Yesterday',   detail: 'MTN → Wallet' },
  { id: '6', type: 'airtime', amount: 3500,  status: 'failed',  timestamp: '2 days ago',  detail: '9mobile → Bank' },
]

export const LIVE_FEED = [
  '₦5,000 converted 2 mins ago',
  '₦23,000 converted 4 mins ago',
  '₦10,700 converted 7 mins ago',
  '₦25,000 converted 13 mins ago',
  '₦8,500 converted 18 mins ago',
  '₦15,000 converted 22 mins ago',
]

export const fmt = (n: number) => `₦${n.toLocaleString('en-NG')}`
