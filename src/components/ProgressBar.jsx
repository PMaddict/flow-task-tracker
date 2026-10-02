export function ProgressBar({ value, className = '', barClassName = '' }) {
  const pct = Math.max(0, Math.min(100, value || 0))
  const color = pct === 100 ? 'bg-emerald-500' : pct >= 50 ? 'bg-blue-500' : 'bg-amber-500'
  return (
    <div className={`h-1.5 w-full rounded-full bg-gray-100 ${className}`}>
      <div
        className={`h-1.5 rounded-full transition-all ${color} ${barClassName}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
