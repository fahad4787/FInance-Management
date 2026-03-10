const StatCard = ({
  label,
  value,
  valueClassName = 'text-primary-600',
  icon,
  iconClassName = 'text-primary-500',
  borderClassName = 'border-primary-500',
  chips = []
}) => (
  <div className={`bg-white rounded-2xl shadow-panel overflow-hidden border-t-4 ${borderClassName} transition-all duration-200 hover:shadow-modal/50`}>
    <div className="p-6 flex flex-col gap-3 min-[1250px]:flex-row min-[1250px]:justify-between min-[1250px]:items-start min-[1250px]:gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          {icon && (
            <span className={`flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100 ${iconClassName}`}>
              {icon}
            </span>
          )}
          <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">{label}</p>
        </div>
        <p className={`mt-4 text-2xl md:text-3xl font-bold tracking-tight ${valueClassName}`}>{value}</p>
      </div>
      {chips.length > 0 && (
        <div className="flex flex-row flex-wrap gap-1.5 relative min-[1250px]:flex-col min-[1250px]:flex-nowrap min-[1250px]:flex-shrink-0 min-[1250px]:gap-3">
          {chips.map((chip) => (
            <span
              key={chip.label}
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap min-[1250px]:justify-end ${chip.className || 'bg-slate-100 text-slate-700'}`}
            >
              {chip.label} {chip.value}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default StatCard;
