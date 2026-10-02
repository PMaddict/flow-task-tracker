import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmptyState } from '../components/EmptyState'
import { Header } from '../components/Layout/Header'
import { ProgressBar } from '../components/ProgressBar'
import { HealthBadge } from '../components/StatusBadge'
import { TaskDrawer } from '../components/TaskDrawer'
import { TaskModal } from '../components/TaskModal'
import { TaskTable } from '../components/TaskTable'
import { Timeline } from '../components/Timeline'
import { useData } from '../context/DataContext'
import { formatDateLong, isOverdue, sortByDueDate, taskCountsForProject } from '../utils/calculations'
import { PROJECT_HEALTH } from '../utils/constants'

export function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { projects, tasks, addTask, updateProject, deleteProject } = useData()
  const [activeTaskId, setActiveTaskId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const project = projects.find((p) => p.id === id)

  if (!project) {
    return (
      <div className="px-8 py-6">
        <EmptyState title="Project not found" description="It may have been deleted." />
      </div>
    )
  }

  const projectTasks = tasks.filter((t) => t.projectId === project.id)
  const { total, completed, pending, progress } = taskCountsForProject(project.id, tasks)
  const milestones = projectTasks.filter((t) => t.priority === 'High')
  const upcomingDeadlines = sortByDueDate(projectTasks.filter((t) => t.status !== 'Completed' && t.dueDate)).slice(0, 5)

  function handleDelete() {
    deleteProject(project.id)
    navigate('/projects')
  }

  return (
    <div>
      <Header
        title={project.name}
        subtitle={`${completed}/${total} tasks completed`}
        actions={
          <>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-lg bg-gray-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              + New Task
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
            >
              Delete
            </button>
          </>
        }
      />

      <div className="space-y-6 px-8 py-6">
        <button type="button" onClick={() => navigate('/projects')} className="text-sm text-gray-400 hover:text-gray-600">
          ← Back to Projects
        </button>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-600">{project.description || 'No description yet.'}</p>

          <div className="mt-4 flex flex-wrap items-center gap-6 text-sm">
            <div>
              <p className="text-xs text-gray-400">Start date</p>
              <p className="mt-0.5 font-medium text-gray-700">{formatDateLong(project.startDate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Target date</p>
              <p className="mt-0.5 font-medium text-gray-700">{formatDateLong(project.targetDate)}</p>
            </div>
            <div>
              <p className="mb-1 text-xs text-gray-400">Health</p>
              <select
                value={project.health}
                onChange={(e) => updateProject(project.id, { health: e.target.value })}
                className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-gray-400 focus:outline-none"
              >
                {PROJECT_HEALTH.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
            <div className="ml-auto">
              <HealthBadge health={project.health} />
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-xs text-gray-400">
              <span>Overall progress</span>
              <span className="font-medium text-gray-600">{progress}%</span>
            </div>
            <ProgressBar value={progress} />
            <p className="mt-2 text-xs text-gray-400">
              {total} tasks · {completed} completed · {pending} pending
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-gray-700">Milestones</h2>
            {milestones.length === 0 ? (
              <EmptyState title="No milestones" description="High priority tasks will appear here." />
            ) : (
              <div className="space-y-2">
                {milestones.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => setActiveTaskId(task.id)}
                    className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-3.5 text-left hover:bg-gray-50"
                  >
                    <span className="truncate text-sm font-medium text-gray-900">{task.name}</span>
                    <span className={`text-xs ${isOverdue(task) ? 'font-medium text-red-500' : 'text-gray-400'}`}>
                      {formatDateLong(task.dueDate)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-gray-700">Upcoming Deadlines</h2>
            {upcomingDeadlines.length === 0 ? (
              <EmptyState title="Nothing upcoming" />
            ) : (
              <div className="space-y-2">
                {upcomingDeadlines.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => setActiveTaskId(task.id)}
                    className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-3.5 text-left hover:bg-gray-50"
                  >
                    <span className="truncate text-sm font-medium text-gray-900">{task.name}</span>
                    <span className={`text-xs ${isOverdue(task) ? 'font-medium text-red-500' : 'text-gray-400'}`}>
                      {formatDateLong(task.dueDate)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Tasks</h2>
          {projectTasks.length === 0 ? (
            <EmptyState title="No tasks yet" description="Create the first task for this project." />
          ) : (
            <TaskTable tasks={sortByDueDate(projectTasks)} projects={projects} onTaskClick={(t) => setActiveTaskId(t.id)} showProject={false} />
          )}
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Project Timeline</h2>
          <Timeline projects={projects} tasks={projectTasks} range="month" onTaskClick={(t) => setActiveTaskId(t.id)} />
        </section>
      </div>

      {activeTaskId && <TaskDrawer taskId={activeTaskId} onClose={() => setActiveTaskId(null)} />}
      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} projects={projects} onCreate={addTask} defaultProjectId={project.id} />
      <ConfirmDialog
        open={confirmOpen}
        title="Delete this project?"
        description="This will permanently delete the project and all of its tasks. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
