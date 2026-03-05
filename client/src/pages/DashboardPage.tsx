import { Outlet } from 'react-router-dom'
import FilterPanel from '@/components/FilterPanel'
import TalentList from '@/components/TalentList'
import TopBar from '@/components/TopBar'

export default function DashboardPage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[280px] min-w-[280px] bg-[#161616] border-r border-[#2a2a2a] flex flex-col overflow-hidden">
          <FilterPanel />
          <TalentList />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-[#0d0d0d]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
