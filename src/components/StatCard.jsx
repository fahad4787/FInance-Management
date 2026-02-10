const StatCard = ({
  label,
  value,
  valueClassName = 'text-primary-600',
  icon,
  iconClassName = 'text-primary-500',
  borderClassName = 'border-primary-500'
}) => (
  <div className={`bg-white rounded-2xl shadow-panel overflow-hidden border-t-4 ${borderClassName} transition-all duration-200 hover:shadow-modal/50`}>
    <div className="p-6">
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
  </div>
);

export default StatCard;
