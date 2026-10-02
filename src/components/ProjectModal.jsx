import { useEffect, useState } from 'react'
import { PROJECT_HEALTH } from '../utils/constants'
import { Modal } from './Modal'

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400'
const labelClass = 'mb-1 block text-xs font-medium text-gray-500'

const EMPTY_FORM = { name: '', description: '', startDate: '', targetDate: '', health: 'On Track' }

export function ProjectModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM)
      setError('')
    }
  }, [open])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Project name is required.')
      return
    }
    onCreate(form)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Project name *</label>
          <input
            autoFocus
            className={inputClass}
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g. Q4 Onboarding Revamp"
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            className={inputClass}
            rows={3}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="What is this project about?"
          />
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
            <label className={labelClass}>Target date</label>
            <input
              type="date"
              className={inputClass}
              value={form.targetDate}
              onChange={(e) => update('targetDate', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Health</label>
          <select className={inputClass} value={form.health} onChange={(e) => update('health', e.target.value)}>
            {PROJECT_HEALTH.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-gray-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-gray-800">
            Create Project
          </button>
        </div>
      </form>
    </Modal>
  )
}
