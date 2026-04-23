import { Outlet } from 'react-router-dom'
import TopNav from './TopNav'
import Sidebar from './Sidebar'

function Layout() {
  return (
    <div className="min-h-screen bg-surface">
      <TopNav />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 pt-20 lg:p-8 lg:pt-24 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
