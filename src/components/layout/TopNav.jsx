import { Hub, Search, Bell, User } from 'lucide-react'

function TopNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-md border-b border-outline/10">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Hub className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-primary tracking-tight">FibreForge</span>
        </div>

        {/* Search - hidden on mobile */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input
              type="text"
              placeholder="Search customers, addresses..."
              className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-lg text-sm border border-outline/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-outline hover:text-primary hover:bg-surface-container rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-outline/20">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
              <User className="w-4 h-4" />
            </div>
            <span className="hidden sm:block text-sm font-medium">Admin</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopNav
