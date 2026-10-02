import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: DashboardIcon, end: true },
  { to: '/tasks', label: 'My Tasks', icon: TasksIcon },
  { to: '/projects', label: 'Projects', icon: ProjectsIcon },
  { to: '/timeline', label: 'Timeline', icon: TimelineIcon },
]

export function Sidebar() {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 text-sm font-semibold text-white">
          F
        </div>
        <span className="text-[15px] font-semibold text-gray-900">Flow</span>
      </div>
      <nav className="flex flex-col gap-0.5 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto px-5 py-4 text-xs text-gray-400">Personal workspace</div>
    </aside>
  )
}

function DashboardIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="3" y="3" width="6" height="7" rx="1.2" />
      <rect x="11" y="3" width="6" height="4" rx="1.2" />
      <rect x="11" y="9" width="6" height="8" rx="1.2" />
      <rect x="3" y="12" width="6" height="5" rx="1.2" />
    </svg>
  )
}

function TasksIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="3" y="3.5" width="14" height="13" rx="2" />
      <path d="M6.5 8l1.5 1.5L10.5 6.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 13h8" strokeLinecap="round" />
    </svg>
  )
}

function ProjectsIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M3 5.5A1.5 1.5 0 0 1 4.5 4h3.17a1.5 1.5 0 0 1 1.17.56l.66.84H15.5A1.5 1.5 0 0 1 17 7v7.5A1.5 1.5 0 0 1 15.5 16h-11A1.5 1.5 0 0 1 3 14.5v-9Z" />
    </svg>
  )
}

function TimelineIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M3 5h14M3 10h9M3 15h12" strokeLinecap="round" />
    </svg>
  )
}
