import { useState } from 'react'
import { Header } from '../components/Layout/Header'
import { ProgressBar } from '../components/ProgressBar'
import { StatCard } from '../components/StatCard'
import { StatusBadge } from '../components/StatusBadge'
import { TaskDrawer } from '../components/TaskDrawer'
import { TaskModal } from '../components/TaskModal'
import { TaskTable } from '../components/TaskTable'
import { EmptyState } from '../components/EmptyState'
import { useData } from '../context/DataContext'
import {
  dashboardStats,
  formatDate,
  formatRelativeTime,
  isDueSoon,
  isOverdue,
  sortByDueDate,
  taskCountsForProject,
} from '../utils/calculations'

export function Dashboard() {
  const { projects, tasks, activity, addTask } = useData()
  const [activeTaskId, setActiveTaskId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const stats = dashboardStats(tasks)
  const upcoming = sortByDueDate(
    tasks.filter((t) => t.status !== 'Completed' && (isOverdue(t) || isDueSoon(t, 7))),
  ).slice(0, 8)
  const blocked = tasks.filter((t) => t.status === 'Blocked')
  const activeProjects = projects

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="A quick look at everything on your plate."
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

      <div className="space-y-6 px-8 py-6">
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total Tasks" value={stats.total} />
          <StatCard label="In Progress" value={stats.inProgress} accent="text-blue-600" />
          <StatCard label="Completed" value={stats.completed} accent="text-emerald-600" />
          <StatCard label="Overdue" value={stats.overdue} accent="text-red-600" />
        </div>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Today's &amp; Upcoming Tasks</h2>
          {upcoming.length === 0 ? (
            <EmptyState title="Nothing due soon" description="Tasks due in the next week will show up here." />
          ) : (
            <TaskTable tasks={upcoming} projects={projects} onTaskClick={(t) => setActiveTaskId(t.id)} />
          )}
        </section>

        <div className="grid grid-cols-2 gap-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-gray-700">Project Progress</h2>
            <div className="space-y-3">
              {activeProjects.length === 0 && <EmptyState title="No projects yet" />}
              {activeProjects.map((project) => {
                const { total, completed, progress } = taskCountsForProject(project.id, tasks)
                return (
                  <div key={project.id} className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{project.name}</p>
                      <span className="text-xs font-medium text-gray-500">{progress}%</span>
                    </div>
                    <ProgressBar value={progress} className="mt-2" />
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                      <span>
                        {completed}/{total} tasks completed
                      </span>
                      <span>Due {formatDate(project.targetDate)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-gray-700">Blocked Tasks</h2>
            {blocked.length === 0 ? (
              <EmptyState title="Nothing blocked" description="Blocked tasks will show up here." />
            ) : (
              <div className="space-y-2">
                {blocked.map((task) => {
                  const project = projects.find((p) => p.id === task.projectId)
                  return (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => setActiveTaskId(task.id)}
                      className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-3.5 text-left hover:bg-gray-50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">{task.name}</p>
                        <p className="truncate text-xs text-gray-400">{project?.name || 'No project'}</p>
                      </div>
                      <StatusBadge status={task.status} />
                    </button>
                  )
                })}
              </div>
            )}
          </section>
        </div>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Recent Activity</h2>
          {activity.length === 0 ? (
            <EmptyState title="No activity yet" />
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="space-y-3">
                {activity.slice(0, 10).map((a) => (
                  <div key={a.id} className="flex items-center justify-between text-sm">
                    <div className="min-w-0">
                      <span className="text-gray-700">{a.message}</span>
                      <span className="text-gray-400"> · {a.taskName}</span>
                      {a.projectName && <span className="text-gray-300"> · {a.projectName}</span>}
                    </div>
                    <span className="shrink-0 pl-3 text-xs text-gray-400">{formatRelativeTime(a.timestamp)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {activeTaskId && <TaskDrawer taskId={activeTaskId} onClose={() => setActiveTaskId(null)} />}
      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} projects={projects} onCreate={addTask} />
    </div>
  )
}
