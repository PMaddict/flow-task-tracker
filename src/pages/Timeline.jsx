import { useState } from 'react'
import { Header } from '../components/Layout/Header'
import { TaskDrawer } from '../components/TaskDrawer'
import { Timeline as TimelineChart } from '../components/Timeline'
import { useData } from '../context/DataContext'

const RANGES = [
  { key: '2weeks', label: '2 Weeks' },
  { key: 'month', label: 'Month' },
  { key: 'quarter', label: 'Quarter' },
]

export function Timeline() {
  const { projects, tasks } = useData()
  const [range, setRange] = useState('month')
  const [activeTaskId, setActiveTaskId] = useState(null)

  return (
    <div>
      <Header title="Timeline" subtitle="A simple view of what's happening when." />

      <div className="space-y-4 px-8 py-6">
        <div className="flex gap-1.5">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                range === r.key ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <TimelineChart projects={projects} tasks={tasks} range={range} onTaskClick={(t) => setActiveTaskId(t.id)} />
      </div>

      {activeTaskId && <TaskDrawer taskId={activeTaskId} onClose={() => setActiveTaskId(null)} />}
    </div>
  )
}
