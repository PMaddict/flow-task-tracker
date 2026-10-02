const STATUS_STYLES = {
  'Not Started': 'bg-gray-100 text-gray-600 ring-gray-200',
  'In Progress': 'bg-blue-50 text-blue-700 ring-blue-200',
  Blocked: 'bg-red-50 text-red-700 ring-red-200',
  Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
}

const PRIORITY_STYLES = {
  Low: 'bg-gray-100 text-gray-600 ring-gray-200',
  Medium: 'bg-amber-50 text-amber-700 ring-amber-200',
  High: 'bg-rose-50 text-rose-700 ring-rose-200',
}

const HEALTH_STYLES = {
  'On Track': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'At Risk': 'bg-amber-50 text-amber-700 ring-amber-200',
  Blocked: 'bg-red-50 text-red-700 ring-red-200',
}

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES['Not Started']
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${style}`}>
      {status}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.Medium
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${style}`}>
      {priority}
    </span>
  )
}

export function HealthBadge({ health }) {
  const style = HEALTH_STYLES[health] || HEALTH_STYLES['On Track']
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${style}`}>
      {health}
    </span>
  )
}

export function OverdueBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-medium text-white whitespace-nowrap">
      Overdue
    </span>
  )
}
