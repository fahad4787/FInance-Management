import { FiFilter } from 'react-icons/fi';

const FilterBar = ({
  children,
  className = '',
  title = 'Filters',
  subtitle = 'Refine the list below',
  stats = null
}) => (
  <div
    className={`bg-white rounded-2xl shadow-panel border border-slate-200/80 ring-1 ring-slate-200/50 border-t-4 border-t-primary-500 min-w-0 w-full ${className}`}
  >
    <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/80 rounded-t-2xl">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 text-primary-600">
          <FiFilter className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
        </div>
      </div>
    </div>
    <div className="p-4 md:p-5 bg-slate-100/60 rounded-b-2xl flex flex-row flex-wrap gap-4 md:gap-5 items-end justify-end">
      {stats ? (
        <div className="w-full sm:w-auto flex-none sm:mr-auto sm:min-w-[14rem] pb-1 sm:pb-0">
          {stats}
        </div>
      ) : null}
      {children}
    </div>
  </div>
);

export default FilterBar;
