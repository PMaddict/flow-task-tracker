import { useMemo, useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { Header } from '../components/Layout/Header'
import { TaskDrawer } from '../components/TaskDrawer'
import { TaskModal } from '../components/TaskModal'
import { TaskTable } from '../components/TaskTable'
import { useData } from '../context/DataContext'
import { isOverdue, sortByDueDate } from '../utils/calculations'
import { PRIORITIES, STATUS_FILTERS } from '../utils/constants'

export function Tasks() {
  const { projects, tasks, addTask } = useData()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [projectFilter, setProjectFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [activeTaskId, setActiveTaskId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = useMemo(() => {
    let result = tasks

    if (statusFilter === 'Overdue') {
      result = result.filter(isOverdue)
    } else if (statusFilter !== 'All') {
      result = result.filter((t) => t.status === statusFilter)
    }

    if (projectFilter !== 'All') {
      result = result.filter((t) => t.projectId === projectFilter)
    }

    if (priorityFilter !== 'All') {
      result = result.filter((t) => t.priority === priorityFilter)
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter((t) => t.name.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q))
    }

    return sortByDueDate(result)
  }, [tasks, statusFilter, projectFilter, priorityFilter, search])

  return (
    <div>
      <Header
        title="My Tasks"
        subtitle={`${tasks.length} task${tasks.length === 1 ? '' : 's'} total`}
        actions={
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-lg bg-gray-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            + New Task
          </button>
        }
      />

      <div className="space-y-4 px-8 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-gray-400">
              <circle cx="9" cy="9" r="6" />
              <path d="M17 17l-4-4" strokeLinecap="round" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-3 pl-8 text-sm focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 focus:border-gray-400 focus:outline-none"
          >
            <option value="All">All projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 focus:border-gray-400 focus:outline-none"
          >
            <option value="All">All priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p} priority
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === s ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No tasks match your filters"
            description="Try adjusting your search or filters, or create a new task."
            action={
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="rounded-lg bg-gray-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                + New Task
              </button>
            }
          />
        ) : (
          <TaskTable tasks={filtered} projects={projects} onTaskClick={(t) => setActiveTaskId(t.id)} />
        )}
      </div>

      {activeTaskId && <TaskDrawer taskId={activeTaskId} onClose={() => setActiveTaskId(null)} />}
      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} projects={projects} onCreate={addTask} />
    </div>
  )
}
