import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const statusStyles = {
  active: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  suspended: 'bg-red-100 text-red-700 border-red-200',
  disconnected: 'bg-gray-100 text-gray-600 border-gray-200',
  trial_active: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  trial_pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  trial_expired: 'bg-red-100 text-red-700 border-red-200',
  converted: 'bg-green-100 text-green-700 border-green-200',
  preorder_pending: 'bg-slate-100 text-slate-600 border-slate-200',
  preorder_scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
  installing: 'bg-purple-100 text-purple-700 border-purple-200',
  installed: 'bg-green-100 text-green-700 border-green-200',
  task_pending: 'bg-slate-100 text-slate-600 border-slate-200',
  task_assigned: 'bg-primary/10 text-primary border-primary/20',
  in_progress: 'bg-tertiary/10 text-tertiary border-tertiary/20',
  completed: 'bg-green-100 text-green-700 border-green-200',
  urgent: 'bg-red-100 text-red-700 border-red-200',
  coverage: 'bg-slate-100 text-slate-600 border-slate-200',
  pre_trial: 'bg-secondary/10 text-secondary border-secondary/20',
  eligible: 'bg-green-100 text-green-700 border-green-200',
  incomplete: 'bg-yellow-100 text-yellow-700 border-yellow-200',
}

const statusLabels = {
  active: 'Active',
  pending: 'Pending',
  suspended: 'Suspended',
  disconnected: 'Disconnected',
  trial_active: 'Trial Active',
  trial_pending: 'Expiring Soon',
  trial_expired: 'Expired',
  converted: 'Converted',
  preorder_pending: 'Awaiting Install',
  preorder_scheduled: 'Scheduled',
  installing: 'Installing',
  installed: 'Installed',
  task_pending: 'Pending',
  task_assigned: 'Assigned',
  in_progress: 'In Progress',
  completed: 'Completed',
  urgent: 'Urgent',
  coverage: 'Live Coverage',
  pre_trial: 'Pre-Trial Zone',
  eligible: 'Eligible',
  incomplete: 'Incomplete',
}

function StatusBadge({ status, size = 'md', className }) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  }

  const normalizedStatus = status?.toLowerCase().replace(/\s+/g, '_')
  const styleClass = statusStyles[normalizedStatus] || statusStyles.pending
  const label = statusLabels[normalizedStatus] || status

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        sizeClasses[size],
        styleClass,
        className
      )}
    >
      {label}
    </span>
  )
}

export default StatusBadge