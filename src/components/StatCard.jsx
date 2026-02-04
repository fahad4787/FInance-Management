
const StatCard = ({
  label,
  value,
  valueClassName = 'text-primary-600',
  icon,
  iconClassName = 'text-primary-500',
  borderClassName = 'border-primary-500'
}) => {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-lg border-l-4 ${borderClassName}`}>
      <div className="flex items-center gap-2">
        {icon && <span className={iconClassName}>{icon}</span>}
        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{label}</p>
      </div>
      <p className={`mt-2 text-2xl font-bold ${valueClassName}`}>{value}</p>
    </div>
  );
};

export default StatCard;
