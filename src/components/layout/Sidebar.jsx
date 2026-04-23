import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Clock, Package, MapPin, Wrench } from 'lucide-react'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/customers', label: 'Customers', icon: Users },
  { path: '/trials', label: 'Trials', icon: Clock },
  { path: '/pre-orders', label: 'Pre-Orders', icon: Package },
  { path: '/unconnected', label: 'Leads', icon: MapPin },
  { path: '/field-ops', label: 'Field Ops', icon: Wrench },
]

function Sidebar() {
  return (
    <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-outline/10">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/5 text-primary'
                    : 'text-gray-600 hover:bg-surface-container hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
      
      {/* Status indicator */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-outline/10">
        <div className="flex items-center gap-2 px-4 py-2 bg-success/10 rounded-lg">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
          <span className="text-sm text-success font-medium">Network Healthy</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
