import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { Topbar, BottomNav, AuthSheet } from './components/ui'
import HomePage    from './pages/Home'
import ConvertPage from './pages/Convert'
import DataPage    from './pages/Data'
import WalletPage  from './pages/Wallet'
import HistoryPage from './pages/History'

function Layout() {
  const { pathname } = useLocation()

  // Pages where we hide bottom nav (full-screen flow steps)
  const hideNav = false // nav always visible; sheets overlay instead

  return (
    <div className="app-shell">
      <Topbar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/"        element={<HomePage />} />
          <Route path="/convert" element={<ConvertPage />} />
          <Route path="/data"    element={<DataPage />} />
          <Route path="/wallet"  element={<WalletPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
      {!hideNav && <BottomNav />}

      {/* Global auth sheet — available on any page */}
      <AuthSheet />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout />
      </AppProvider>
    </BrowserRouter>
  )
}
