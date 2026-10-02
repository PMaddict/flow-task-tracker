import { formatDate, isOverdue } from '../utils/calculations'
import { ProgressBar } from './ProgressBar'
import { OverdueBadge, PriorityBadge, StatusBadge } from './StatusBadge'

export function TaskTable({ tasks, projects, onTaskClick, showProject = true }) {
  const projectName = (id) => projects.find((p) => p.id === id)?.name || '—'

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs text-gray-400">
            <th className="px-4 py-2.5 font-medium">Task</th>
            {showProject && <th className="px-4 py-2.5 font-medium">Project</th>}
            <th className="px-4 py-2.5 font-medium">Priority</th>
            <th className="px-4 py-2.5 font-medium">Status</th>
            <th className="px-4 py-2.5 font-medium">Due Date</th>
            <th className="px-4 py-2.5 font-medium">Progress</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tasks.map((task) => {
            const overdue = isOverdue(task)
            const done = task.status === 'Completed'
            return (
              <tr
                key={task.id}
                onClick={() => onTaskClick?.(task)}
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${done ? 'opacity-60' : ''}`}
              >
                <td className="max-w-[260px] truncate px-4 py-3 font-medium text-gray-900">
                  <span className={done ? 'line-through' : ''}>{task.name}</span>
                </td>
                {showProject && (
                  <td className="max-w-[160px] truncate px-4 py-3 text-gray-500">{projectName(task.projectId)}</td>
                )}
                <td className="px-4 py-3">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={task.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 whitespace-nowrap text-gray-600">
                    {formatDate(task.dueDate)}
                    {overdue && <OverdueBadge />}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ProgressBar value={task.progress} className="w-16" />
                    <span className="text-xs text-gray-400">{task.progress}%</span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
