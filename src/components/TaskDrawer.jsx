import { useEffect, useState } from 'react'
import { useData } from '../context/DataContext'
import { formatRelativeTime, isOverdue } from '../utils/calculations'
import { PRIORITIES, STATUSES } from '../utils/constants'
import { ConfirmDialog } from './ConfirmDialog'
import { ProgressBar } from './ProgressBar'
import { OverdueBadge } from './StatusBadge'

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400'
const labelClass = 'mb-1 block text-xs font-medium text-gray-500'

const ACTIVITY_ICON = {
  created: '✦',
  completed: '✓',
  status: '↻',
  progress: '▲',
  subtask: '☐',
  project_created: '✦',
}

export function TaskDrawer({ taskId, onClose, onDeleted }) {
  const { getTask, projects, activity, updateTask, deleteTask, changeStatus, updateProgress, addSubtask, toggleSubtask, deleteSubtask } =
    useData()
  const task = getTask(taskId)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [subtaskText, setSubtaskText] = useState('')
  const [localProgress, setLocalProgress] = useState(task?.progress ?? 0)
  const [draft, setDraft] = useState({ name: '', description: '', notes: '' })

  useEffect(() => {
    if (task) {
      setLocalProgress(task.progress)
    }
  }, [task?.id, task?.progress])

  useEffect(() => {
    if (task) {
      setDraft({ name: task.name, description: task.description, notes: task.notes })
    }
  }, [task?.id])

  if (!task) return null

  const project = projects.find((p) => p.id === task.projectId)
  const taskActivity = activity.filter((a) => a.taskId === task.id)
  const overdue = isOverdue(task)
  const hasSubtasks = task.subtasks.length > 0

  function commitField(field, value) {
    if (value !== task[field]) updateTask(task.id, { [field]: value })
  }

  function handleDelete() {
    deleteTask(task.id)
    setConfirmOpen(false)
    onDeleted?.()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <span className="text-xs font-medium tracking-wide text-gray-400 uppercase">Task</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="rounded-md px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
            >
              Delete
            </button>
            <button type="button" onClick={onClose} className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
                <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <input
            className="w-full border-none p-0 text-lg font-semibold text-gray-900 focus:outline-none"
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            onBlur={(e) => commitField('name', e.target.value.trim() || task.name)}
          />
          <p className="mt-0.5 text-sm text-gray-400">{project?.name || 'No project'}</p>

          {overdue && (
            <div className="mt-2">
              <OverdueBadge />
            </div>
          )}

          <textarea
            className="mt-3 w-full resize-none rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-600 focus:border-gray-300 focus:bg-white focus:outline-none"
            rows={2}
            placeholder="Add a description..."
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            onBlur={(e) => commitField('description', e.target.value)}
          />

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Status</label>
              <select className={inputClass} value={task.status} onChange={(e) => changeStatus(task.id, e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Priority</label>
              <select className={inputClass} value={task.priority} onChange={(e) => commitField('priority', e.target.value)}>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Start date</label>
              <input
                type="date"
                className={inputClass}
                value={task.startDate || ''}
                onChange={(e) => commitField('startDate', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Due date</label>
              <input
                type="date"
                className={inputClass}
                value={task.dueDate || ''}
                onChange={(e) => commitField('dueDate', e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between">
              <label className={labelClass}>Progress</label>
              <span className="text-xs font-medium text-gray-600">{localProgress}%</span>
            </div>
            {hasSubtasks ? (
              <p className="mb-2 text-xs text-gray-400">Calculated from subtasks completed below.</p>
            ) : (
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  className="w-full accent-gray-900"
                  value={localProgress}
                  onChange={(e) => setLocalProgress(Number(e.target.value))}
                  onMouseUp={(e) => updateProgress(task.id, Number(e.target.value))}
                  onTouchEnd={(e) => updateProgress(task.id, Number(e.target.value))}
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-right text-sm"
                  value={localProgress}
                  onChange={(e) => setLocalProgress(Number(e.target.value))}
                  onBlur={(e) => updateProgress(task.id, Number(e.target.value) || 0)}
                />
              </div>
            )}
            <ProgressBar value={localProgress} className="mt-2" />
          </div>

          <div className="mt-5">
            <label className={labelClass}>Subtasks</label>
            <div className="space-y-1.5">
              {task.subtasks.map((st) => (
                <div key={st.id} className="group flex items-center gap-2.5 rounded-lg px-1 py-1 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => toggleSubtask(task.id, st.id)}
                    className="h-4 w-4 shrink-0 rounded border-gray-300 text-gray-900 focus:ring-gray-400"
                  />
                  <span className={`flex-1 text-sm ${st.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{st.text}</span>
                  <button
                    type="button"
                    onClick={() => deleteSubtask(task.id, st.id)}
                    className="shrink-0 text-xs text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {task.subtasks.length === 0 && <p className="py-1 text-sm text-gray-400">No subtasks yet.</p>}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                className={inputClass}
                placeholder="Add a subtask"
                value={subtaskText}
                onChange={(e) => setSubtaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && subtaskText.trim()) {
                    e.preventDefault()
                    addSubtask(task.id, subtaskText)
                    setSubtaskText('')
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (subtaskText.trim()) {
                    addSubtask(task.id, subtaskText)
                    setSubtaskText('')
                  }
                }}
                className="shrink-0 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Add
              </button>
            </div>
          </div>

          <div className="mt-5">
            <label className={labelClass}>Notes</label>
            <textarea
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
              rows={3}
              placeholder="Add notes..."
              value={draft.notes}
              onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
              onBlur={(e) => commitField('notes', e.target.value)}
            />
          </div>

          <div className="mt-5">
            <label className={labelClass}>Activity history</label>
            <div className="space-y-2.5">
              {taskActivity.length === 0 && <p className="text-sm text-gray-400">No activity yet.</p>}
              {taskActivity.map((a) => (
                <div key={a.id} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] text-gray-500">
                    {ACTIVITY_ICON[a.type] || '•'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-600">{a.message}</p>
                    <p className="text-xs text-gray-400">{formatRelativeTime(a.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this task?"
        description="This will permanently remove the task and its subtasks. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}
