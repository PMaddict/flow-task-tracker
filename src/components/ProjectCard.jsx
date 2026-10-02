import { useNavigate } from 'react-router-dom'
import { formatDate, taskCountsForProject } from '../utils/calculations'
import { HealthBadge } from './StatusBadge'
import { ProgressBar } from './ProgressBar'

export function ProjectCard({ project, tasks }) {
  const navigate = useNavigate()
  const { total, completed, pending, progress } = taskCountsForProject(project.id, tasks)

  return (
    <button
      type="button"
      onClick={() => navigate(`/projects/${project.id}`)}
      className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 text-left transition-shadow hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[15px] font-semibold text-gray-900">{project.name}</h3>
        <HealthBadge health={project.health} />
      </div>
      <p className="mt-1.5 line-clamp-2 text-sm text-gray-500">{project.description}</p>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-gray-400">
          <span>Progress</span>
          <span className="font-medium text-gray-600">{progress}%</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>
          {total} task{total === 1 ? '' : 's'} · {completed} completed · {pending} pending
        </span>
      </div>
      <div className="mt-2 text-xs text-gray-400">Due {formatDate(project.targetDate)}</div>
    </button>
  )
}
