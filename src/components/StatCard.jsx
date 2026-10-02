export function StatCard({ label, value, accent = 'text-gray-900' }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-1.5 text-2xl font-semibold ${accent}`}>{value}</p>
    </div>
  )
}
