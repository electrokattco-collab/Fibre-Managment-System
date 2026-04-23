import { Users, MapPin, Package, TrendingUp, Upload, FileText, Phone, CheckCircle } from 'lucide-react'
import StatusBadge from '../components/ui/StatusBadge'

const stats = [
  {
    title: 'Trial Customers',
    value: '1,428',
    breakdown: { active: 842, pending: 412, expired: 174 },
    icon: Users,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
  },
  {
    title: 'Unconnected',
    value: '3,892',
    subtitle: 'Coverage addresses',
    icon: MapPin,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
  },
  {
    title: 'Pre-Orders',
    value: '412',
    subtitle: 'Pending installations',
    icon: Package,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    title: 'Conversion Rate',
    value: '42%',
    trend: '+3.2%',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
]

const recentActivity = [
  {
    id: 1,
    type: 'upload',
    title: 'Trial Customers Database Updated',
    description: 'Uploaded trials_Q4_new.csv with 1,428 records',
    time: 'Today, 09:42 AM',
    icon: Upload,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    id: 2,
    type: 'followup',
    title: 'Expired User Follow-Up Executed',
    description: 'Automated emails & SMS dispatched to 142 expired trial customers',
    time: 'Yesterday, 14:15 PM',
    icon: Phone,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    id: 3,
    type: 'dispatch',
    title: 'Field Team Dispatch List Forwarded',
    description: 'Exported Pre-Trial Coverage segment to Regional Sales',
    time: 'Oct 24, 2023, 11:30 AM',
    icon: CheckCircle,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
]

const csvUploads = [
  { name: 'Trial Customers Data', lastUpdated: 'Today, 09:42 AM', type: 'trials' },
  { name: 'Unconnected Accounts Data', lastUpdated: 'Oct 24, 2023', type: 'unconnected' },
  { name: 'Pre-orders Data', lastUpdated: 'Oct 23, 2023', type: 'preorders' },
]

function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Management Overview</h1>
          <p className="text-gray-500 mt-1">Network deployment and customer acquisition status</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container rounded-lg">
          <span className="w-2 h-2 bg-tertiary rounded-full animate-pulse"></span>
          <span className="text-sm font-medium text-tertiary uppercase tracking-wide">Live Network</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="card-hover p-6 cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  
                  {stat.breakdown && (
                    <div className="mt-3 space-y-1">
                      <div className="flex gap-1 h-1.5 rounded-full overflow-hidden">
                        <div className="flex-1 bg-green-500" style={{ width: '59%' }}></div>
                        <div className="flex-1 bg-yellow-500" style={{ width: '29%' }}></div>
                        <div className="flex-1 bg-red-500" style={{ width: '12%' }}></div>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="text-green-600">{stat.breakdown.active} Active</span>
                        <span className="text-yellow-600">{stat.breakdown.pending} Pending</span>
                      </div>
                    </div>
                  )}
                  
                  {stat.subtitle && (
                    <p className="text-sm text-gray-500 mt-2">{stat.subtitle}</p>
                  )}
                  
                  {stat.trend && (
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-sm font-medium text-green-600">{stat.trend}</span>
                      <span className="text-xs text-gray-400">vs last month</span>
                    </div>
                  )}
                </div>
                <div className={`p-3 ${stat.bgColor} rounded-xl group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* CSV Upload Section */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Upload className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">CSV Data Administration</h2>
        </div>
        
        <div className="space-y-4">
          {csvUploads.map((upload) => (
            <div
              key={upload.type}
              className="flex items-center justify-between p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{upload.name}</h3>
                  <p className="text-sm text-gray-500">Last Updated: {upload.lastUpdated}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-xs font-medium text-gray-400 uppercase tracking-wider">.csv only</span>
                <label className="btn-primary cursor-pointer text-sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                  <input type="file" accept=".csv" className="hidden" />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6 border-b border-outline/10 pb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Recent Activities</h2>
        </div>
        
        <div className="space-y-4">
          {recentActivity.map((activity) => {
            const Icon = activity.icon
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-surface-container transition-colors border-l-4 border-primary"
              >
                <div className={`p-2 ${activity.iconBg} rounded-full shrink-0`}>
                  <Icon className={`w-4 h-4 ${activity.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                </div>
                <span className="text-xs font-medium text-gray-400 whitespace-nowrap">{activity.time}</span>
              </div>
            )
          })}
        </div>
        
        <button className="w-full mt-4 py-3 text-sm font-medium text-primary hover:text-primary-light transition-colors">
          View Complete Log History
        </button>
      </div>
    </div>
  )
}

export default Dashboard
