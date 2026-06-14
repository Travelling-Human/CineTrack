const config = {
  watching:  { label: 'Watching',          color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  completed: { label: 'Completed',         color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  planning:  { label: 'Planning to Watch', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  stopped:   { label: 'Stopped',           color: 'bg-red-500/20 text-red-400 border-red-500/30' },
}

export default function StatusBadge({ status }) {
  const { label, color } = config[status] || config.planning
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${color}`}>
      {label}
    </span>
  )
}