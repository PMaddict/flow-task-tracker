import { useEffect, useState } from 'react'
import { PRIORITIES, STATUSES } from '../utils/constants'
import { makeId } from '../utils/storage'
import { Modal } from './Modal'

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400'
const labelClass = 'mb-1 block text-xs font-medium text-gray-500'

const EMPTY_FORM = {
  name: '',
  projectId: '',
  description: '',
  status: 'Not Started',
  priority: 'Medium',
  startDate: '',
  dueDate: '',
  progress: 0,
  notes: '',
}

export function TaskModal({ open, onClose, projects, onCreate, defaultProjectId }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [subtasks, setSubtasks] = useState([])
  const [subtaskText, setSubtaskText] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setForm({ ...EMPTY_FORM, projectId: defaultProjectId || projects[0]?.id || '' })
      setSubtasks([])
      setSubtaskText('')
      setError('')
    }
  }, [open, defaultProjectId, projects])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function addSubtask() {
    if (!subtaskText.trim()) return
    setSubtasks((s) => [...s, { id: makeId('sub'), text: subtaskText.trim(), completed: false }])
    setSubtaskText('')
  }

  function removeSubtask(id) {
    setSubtasks((s) => s.filter((st) => st.id !== id))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Task name is required.')
      return
    }
    onCreate({ ...form, progress: Number(form.progress) || 0, subtasks })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Task name *</label>
          <input
            autoFocus
            className={inputClass}
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g. Design onboarding flow"
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>

        <div>
          <label className={labelClass}>Project</label>
          <select className={inputClass} value={form.projectId} onChange={(e) => update('projectId', e.target.value)}>
            <option value="">No project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            className={inputClass}
            rows={2}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Optional details"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Status</label>
            <select className={inputClass} value={form.status} onChange={(e) => update('status', e.target.value)}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Priority</label>
            <select className={inputClass} value={form.priority} onChange={(e) => update('priority', e.target.value)}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Start date</label>
            <input
              type="date"
              className={inputClass}
              value={form.startDate}
              onChange={(e) => update('startDate', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Due date</label>
            <input
              type="date"
              className={inputClass}
              value={form.dueDate}
              onChange={(e) => update('dueDate', e.target.value)}
            />
          </div>
        </div>

        {subtasks.length === 0 && (
          <div>
            <label className={labelClass}>Progress ({form.progress}%)</label>
            <input
              type="range"
              min={0}
              max={100}
              className="w-full accent-gray-900"
              value={form.progress}
              onChange={(e) => update('progress', e.target.value)}
            />
          </div>
        )}

        <div>
          <label className={labelClass}>Subtasks</label>
          {subtasks.length > 0 && <p className="mb-1.5 text-xs text-gray-400">Progress will be calculated from subtasks completed.</p>}
          <div className="space-y-1.5">
            {subtasks.map((st) => (
              <div key={st.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-2.5 py-1.5 text-sm">
                <span className="text-gray-700">{st.text}</span>
                <button type="button" onClick={() => removeSubtask(st.id)} className="text-xs text-gray-400 hover:text-red-500">
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-1.5 flex gap-2">
            <input
              className={inputClass}
              placeholder="Add a subtask"
              value={subtaskText}
              onChange={(e) => setSubtaskText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addSubtask()
                }
              }}
            />
            <button
              type="button"
              onClick={addSubtask}
              className="shrink-0 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Add
            </button>
          </div>
        </div>

        <div>
          <label className={labelClass}>Notes</label>
          <textarea
            className={inputClass}
            rows={2}
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
            placeholder="Optional notes"
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-gray-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-gray-800">
            Create Task
          </button>
        </div>
      </form>
    </Modal>
  )
}
