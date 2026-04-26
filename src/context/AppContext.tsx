import {
  createContext, useContext, useState, useEffect, useCallback,
  type ReactNode,
} from 'react'
import type { Network, DestType, DataPlan } from '../lib/constants'

// ─── Theme ───────────────────────────────────────────────────────────────────

type Theme = 'light' | 'dark'

interface ThemeCtx {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeCtx>({ theme: 'light', toggle: () => {} })
export const useTheme = () => useContext(ThemeContext)

// ─── Auth ────────────────────────────────────────────────────────────────────

interface AuthCtx {
  authed: boolean
  phone: string
  walletBalance: number
  login: (phone: string) => void
  logout: () => void
  showAuthSheet: boolean
  openAuthSheet: (onSuccess?: () => void) => void
  closeAuthSheet: () => void
  pendingAction: (() => void) | null
}

const AuthContext = createContext<AuthCtx>({
  authed: false, phone: '', walletBalance: 0,
  login: () => {}, logout: () => {},
  showAuthSheet: false, openAuthSheet: () => {}, closeAuthSheet: () => {},
  pendingAction: null,
})
export const useAuth = () => useContext(AuthContext)

// ─── Convert Flow State ──────────────────────────────────────────────────────

interface ConvertState {
  network: Network
  amount: number
  dest: DestType
}
interface ConvertCtx extends ConvertState {
  set: (s: Partial<ConvertState>) => void
}
const ConvertContext = createContext<ConvertCtx>({
  network: 'MTN', amount: 0, dest: 'bank', set: () => {},
})
export const useConvert = () => useContext(ConvertContext)

// ─── Data Flow State ─────────────────────────────────────────────────────────

interface DataState {
  network: Network
  plan: DataPlan | null
  phone: string
}
interface DataCtx extends DataState {
  set: (s: Partial<DataState>) => void
}
const DataContext = createContext<DataCtx>({
  network: 'MTN', plan: null, phone: '', set: () => {},
})
export const useDataFlow = () => useContext(DataContext)

// ─── Provider ────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  // Theme
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    return saved ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => setTheme(t => t === 'light' ? 'dark' : 'light'), [])

  // Auth
  const [authed, setAuthed] = useState(false)
  const [phone, setPhone] = useState('')
  const [walletBalance] = useState(12500)
  const [showAuthSheet, setShowAuthSheet] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)

  const login = useCallback((p: string) => {
    setPhone(p)
    setAuthed(true)
    setShowAuthSheet(false)
    // run pending action after login
    setPendingAction(prev => {
      if (prev) setTimeout(prev, 100)
      return null
    })
  }, [])

  const logout = useCallback(() => {
    setAuthed(false)
    setPhone('')
  }, [])

  const openAuthSheet = useCallback((onSuccess?: () => void) => {
    if (onSuccess) setPendingAction(() => onSuccess)
    setShowAuthSheet(true)
  }, [])

  const closeAuthSheet = useCallback(() => {
    setShowAuthSheet(false)
    setPendingAction(null)
  }, [])

  // Convert state
  const [convertState, setConvertState] = useState<ConvertState>({
    network: 'MTN', amount: 0, dest: 'bank',
  })
  const setConvert = useCallback((s: Partial<ConvertState>) =>
    setConvertState(prev => ({ ...prev, ...s })), [])

  // Data state
  const [dataState, setDataState] = useState<DataState>({
    network: 'MTN', plan: null, phone: '',
  })
  const setData = useCallback((s: Partial<DataState>) =>
    setDataState(prev => ({ ...prev, ...s })), [])

  return (
    <ThemeContext.Provider value={{ theme, toggle: toggleTheme }}>
      <AuthContext.Provider value={{
        authed, phone, walletBalance,
        login, logout,
        showAuthSheet, openAuthSheet, closeAuthSheet, pendingAction,
      }}>
        <ConvertContext.Provider value={{ ...convertState, set: setConvert }}>
          <DataContext.Provider value={{ ...dataState, set: setData }}>
            {children}
          </DataContext.Provider>
        </ConvertContext.Provider>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  )
}
