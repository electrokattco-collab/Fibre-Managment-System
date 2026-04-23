import { useState } from 'react'
import { Search, Plus, Filter, ChevronRight, Phone, MapPin } from 'lucide-react'
import StatusBadge from '../components/ui/StatusBadge'
import { mockCustomers } from '../data/mockCustomers'

function Customers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      searchQuery === '' ||
      customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.address?.street?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.accountId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery)
    
    const matchesStatus = statusFilter === 'all' || customer.status?.toLowerCase() === statusFilter.toLowerCase()
    
    return matchesSearch && matchesStatus
  })

  const getInitials = (name) => {
    if (!name) return '??'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getAvatarColor = (name) => {
    if (!name) return 'bg-gray-200 text-gray-500'
    const colors = [
      'bg-cyan-100 text-cyan-700',
      'bg-purple-100 text-purple-700',
      'bg-green-100 text-green-700',
      'bg-amber-100 text-amber-700',
      'bg-rose-100 text-rose-700',
    ]
    return colors[name.length % colors.length]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Directory</h1>
          <p className="text-gray-500 mt-1">Search, filter, and manage your subscriber base</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, address, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
          <button className="btn-secondary">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Customer Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Customer Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Account ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Current Plan
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  className="group hover:bg-gray-50/50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getAvatarColor(customer.name)}`}>
                        {getInitials(customer.name)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {customer.name || (
                            <span className="text-gray-400 italic">Unknown</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          {customer.address?.street}
                          {customer.address?.unit && `, ${customer.address.unit}`}
                        </div>
                        {!customer.name && !customer.phone && (
                          <StatusBadge status="incomplete" size="sm" className="mt-1" />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-gray-500">{customer.accountId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={customer.status} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{customer.plan || '-'}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 group-hover:text-primary transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Showing {filteredCustomers.length} results
          </span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-400 cursor-not-allowed">
              Prev
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Selected Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${getAvatarColor(selectedCustomer.name)}`}>
                    {getInitials(selectedCustomer.name)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedCustomer.name || 'Unknown Customer'}
                    </h2>
                    <div className="flex items-center gap-2 mt-1 text-gray-500">
                      <span className="font-mono text-sm">{selectedCustomer.accountId}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {selectedCustomer.address?.street}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  {selectedCustomer.phone ? (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {selectedCustomer.phone}
                    </div>
                  ) : (
                    <div className="text-gray-400 italic">No phone number</div>
                  )}
                  {selectedCustomer.email && (
                    <div className="text-gray-700">{selectedCustomer.email}</div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Connection Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <StatusBadge status={selectedCustomer.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Plan</span>
                    <span className="text-gray-700">{selectedCustomer.plan || '-'}</span>
                  </div>
                  {selectedCustomer.connection?.ipAddress && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">IP Address</span>
                      <span className="font-mono text-sm">{selectedCustomer.connection.ipAddress}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Customers
