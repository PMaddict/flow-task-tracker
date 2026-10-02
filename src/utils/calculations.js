export function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export function parseDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(`${dateStr}T00:00:00`)
  return Number.isNaN(d.getTime()) ? null : d
}

export function isOverdue(task) {
  if (!task.dueDate || task.status === 'Completed') return false
  const due = parseDate(task.dueDate)
  if (!due) return false
  return due.getTime() < startOfToday().getTime()
}

export function isDueSoon(task, days = 7) {
  if (!task.dueDate || task.status === 'Completed') return false
  const due = parseDate(task.dueDate)
  if (!due) return false
  const today = startOfToday()
  const limit = new Date(today)
  limit.setDate(limit.getDate() + days)
  return due.getTime() >= today.getTime() && due.getTime() <= limit.getTime()
}

export function formatDate(dateStr) {
  const d = parseDate(dateStr)
  if (!d) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatDateLong(dateStr) {
  const d = parseDate(dateStr)
  if (!d) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function daysBetween(a, b) {
  const MS = 1000 * 60 * 60 * 24
  return Math.round((b.getTime() - a.getTime()) / MS)
}

export function subtaskProgress(subtasks) {
  if (!subtasks || subtasks.length === 0) return null
  const completed = subtasks.filter((s) => s.completed).length
  return Math.round((completed / subtasks.length) * 100)
}

// task.progress is kept authoritative (derived from subtasks when present) by the
// data layer whenever subtasks or status change — see DataContext.
export function effectiveProgress(task) {
  if (task.status === 'Completed') return 100
  return task.progress ?? 0
}

export function taskCountsForProject(projectId, tasks) {
  const projectTasks = tasks.filter((t) => t.projectId === projectId)
  const total = projectTasks.length
  const completed = projectTasks.filter((t) => t.status === 'Completed').length
  const pending = total - completed
  const overdue = projectTasks.filter(isOverdue).length
  const progress = total === 0
    ? 0
    : Math.round(projectTasks.reduce((sum, t) => sum + effectiveProgress(t), 0) / total)
  return { total, completed, pending, overdue, progress }
}

export function dashboardStats(tasks) {
  const total = tasks.length
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length
  const completed = tasks.filter((t) => t.status === 'Completed').length
  const overdue = tasks.filter(isOverdue).length
  return { total, inProgress, completed, overdue }
}

export function formatRelativeTime(timestamp) {
  const diffMs = Date.now() - timestamp
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diffMs < minute) return 'just now'
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}m ago`
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`
  if (diffMs < day * 30) return `${Math.floor(diffMs / day)}d ago`
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function sortByDueDate(tasks) {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return parseDate(a.dueDate) - parseDate(b.dueDate)
  })
}
