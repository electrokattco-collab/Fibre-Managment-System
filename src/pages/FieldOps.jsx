import { useState } from 'react'
import { Search, MapPin, Clock, CheckCircle, User, AlertCircle, ChevronRight } from 'lucide-react'
import StatusBadge from '../components/ui/StatusBadge'
import { mockFieldTasks } from '../data/mockFieldTasks'

function FieldOps() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTasks = mockFieldTasks.filter((task) => {
    const matchesFilter = filter === 'all' || task.status === filter
    const matchesSearch =
      searchQuery === '' ||
      task.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.areaCode?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'border-l-slate-400',
      ASSIGNED: 'border-l-primary',
      IN_PROGRESS: 'border-l-tertiary',
      URGENT: 'border-l-error',
      COMPLETED: 'border-l-green-500',
    }
    return colors[status] || 'border-l-gray-300'
  }

  return (
    <div className="space-y-6">
      {/* Map Hero */}
      <div className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=London&zoom=13&size=1200x400&style=feature:all|saturation:-100')] bg-cover bg-center opacity-50"></div>
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-xl p-4 shadow-lg">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Sector</p>
          <h2 className="text-xl font-bold text-gray-900">North Greenwich (N-12)</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 bg-tertiary rounded-full animate-pulse"></span>
            <span className="text-sm text-gray-600">14 Pending Installs</span>
          </div>
        </div>
        <div className="absolute bottom-4 right-4">
          <button className="btn-primary shadow-lg">
            <MapPin className="w-4 h-4 mr-2" />
            Center Me
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Queue Management</h1>
          <p className="text-gray-500 mt-1">Prioritized installation list for Greenwich Sector</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Tasks</option>
            <option value="PENDING">Pending</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
          </select>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`card border-l-4 ${getStatusColor(task.status)} hover:shadow-card-hover transition-shadow`}
          >
            {/* Card Header */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <StatusBadge 
                  status={task.status === 'URGENT' ? 'urgent' : 
                          task.status === 'IN_PROGRESS' ? 'in_progress' :
                          task.status.toLowerCase()} 
                  size="sm" 
                />
                {task.status === 'IN_PROGRESS' && (
                  <div className="relative w-10 h-10">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-gray-200"
                      />
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray="100"
                        strokeDashoffset={100 - task.progress}
                        className="text-tertiary"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                      {task.progress}%
                    </span>
                  </div>
                )}
              </div>

              <h3 className="font-bold text-gray-900 mb-1">{task.address}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Area: {task.areaCode}
              </p>

              {/* Technician or Assignment */}
              {task.technician ? (
                <div className="flex items-center gap-2 mt-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{task.technician.name}</p>
                    <p className="text-xs text-gray-500">{task.technician.code}</p>
                  </div>
                </div>
              ) : task.status === 'PENDING' && (
                <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  Not Assigned
                </div>
              )}

              {/* Notes */}
              {task.notes && (
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-100 rounded-lg">
                  <p className="text-xs font-medium text-yellow-800 uppercase mb-1">Note</p>
                  <p className="text-sm text-yellow-700">{task.notes}</p>
                </div>
              )}

              {/* Scheduled Date */}
              {task.scheduledDate && (
                <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {new Date(task.scheduledDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              )}
            </div>

            {/* Card Actions */}
            <div className="px-5 pb-5">
              {task.status === 'PENDING' && (
                <button className="w-full btn-primary">
                  Assign Technician
                </button>
              )}
              {task.status === 'ASSIGNED' && (
                <button className="w-full btn-primary">
                  Start Installation
                </button>
              )}
              {task.status === 'IN_PROGRESS' && (
                <button className="w-full btn-primary flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Mark Complete
                </button>
              )}
              {task.status === 'URGENT' && (
                <div className="flex gap-2">
                  <button className="flex-1 btn-secondary">Wait</button>
                  <button className="flex-1 btn-primary bg-error hover:bg-error/90">
                    Mark Done
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Bottom Action */}
      <button className="fixed right-6 bottom-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-light transition-colors lg:hidden">
        <span className="text-2xl">+</span>
      </button>
    </div>
  )
}

export default FieldOps
