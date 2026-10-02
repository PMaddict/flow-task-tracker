import { formatDate, parseDate, startOfToday } from '../utils/calculations'

const STATUS_BAR_COLOR = {
  'Not Started': 'bg-gray-300',
  'In Progress': 'bg-blue-500',
  Blocked: 'bg-red-400',
  Completed: 'bg-emerald-500',
}

const RANGE_DAYS = { '2weeks': 14, month: 30, quarter: 90 }

export function Timeline({ projects, tasks, range, onTaskClick }) {
  const totalDays = RANGE_DAYS[range] || 30
  const windowStart = new Date(startOfToday())
  windowStart.setDate(windowStart.getDate() - Math.round(totalDays * 0.15))
  const windowEnd = new Date(windowStart)
  windowEnd.setDate(windowEnd.getDate() + totalDays)
  const windowMs = windowEnd.getTime() - windowStart.getTime()

  const tickCount = range === 'quarter' ? 6 : range === 'month' ? 5 : 7
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => {
    const d = new Date(windowStart.getTime() + (windowMs * i) / tickCount)
    return d
  })

  const todayOffset = ((startOfToday().getTime() - windowStart.getTime()) / windowMs) * 100

  const tasksWithDates = tasks.filter((t) => t.startDate || t.dueDate)
  const rows = tasksWithDates.map((task) => {
    const project = projects.find((p) => p.id === task.projectId)
    const start = parseDate(task.startDate) || parseDate(task.dueDate)
    const end = parseDate(task.dueDate) || parseDate(task.startDate)
    let left = ((start.getTime() - windowStart.getTime()) / windowMs) * 100
    let width = ((end.getTime() - start.getTime()) / windowMs) * 100
    if (width < 1.5) width = 1.5
    if (left < 0) {
      width += left
      left = 0
    }
    if (left + width > 100) width = 100 - left
    return { task, project, left, width }
  })

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex border-b border-gray-200 text-xs text-gray-400">
        <div className="w-56 shrink-0 px-4 py-2.5 font-medium">Task</div>
        <div className="relative flex-1 px-2 py-2.5">
          <div className="flex justify-between">
            {ticks.map((d, i) => (
              <span key={i}>{formatDate(d.toISOString().slice(0, 10))}</span>
            ))}
          </div>
        </div>
      </div>

      {rows.length === 0 && <div className="px-4 py-10 text-center text-sm text-gray-400">No tasks with dates to show.</div>}

      <div className="divide-y divide-gray-50">
        {rows.map(({ task, project, left, width }) => (
          <div key={task.id} className="flex items-center hover:bg-gray-50">
            <div className="w-56 shrink-0 truncate px-4 py-3 text-sm">
              <button type="button" onClick={() => onTaskClick?.(task)} className="truncate font-medium text-gray-800 hover:underline">
                {task.name}
              </button>
              <p className="truncate text-xs text-gray-400">{project?.name || 'No project'}</p>
            </div>
            <div className="relative h-9 flex-1 px-2">
              <div className="absolute top-0 bottom-0 w-px bg-gray-100" style={{ left: `${Math.min(100, Math.max(0, todayOffset))}%` }} />
              <button
                type="button"
                onClick={() => onTaskClick?.(task)}
                className={`absolute top-1/2 h-2.5 -translate-y-1/2 rounded-full ${STATUS_BAR_COLOR[task.status]} transition-opacity hover:opacity-80`}
                style={{ left: `${left}%`, width: `${width}%` }}
                title={`${task.name} · ${formatDate(task.startDate)} – ${formatDate(task.dueDate)}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
