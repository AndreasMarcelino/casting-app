import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import TalentDetail from '@/components/TalentDetail'
import ProjectsPage from '@/pages/ProjectsPage'
import './index.css'

const qc = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } }
})

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore()
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

function EmptyDetail() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-zinc-700 gap-3">
      <span className="text-5xl">🎬</span>
      <p className="text-sm">Pilih talent dari daftar untuk melihat detail</p>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RequireAuth><DashboardPage /></RequireAuth>}>
            <Route index element={<EmptyDetail />} />
            <Route path="talent/:id" element={<TalentDetail />} />
          </Route>
          <Route path="/projects" element={<RequireAuth><ProjectsPage /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#1e1e1e', color: '#e8e8e8', border: '1px solid #2a2a2a', fontSize: '13px' },
          success: { iconTheme: { primary: '#c9a84c', secondary: '#000' } },
        }}
      />
    </QueryClientProvider>
  )
}
