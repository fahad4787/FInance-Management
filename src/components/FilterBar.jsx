import { FiFilter } from 'react-icons/fi';

const FilterBar = ({ children, className = '' }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white shadow-panel overflow-hidden ${className}`}>
    <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 border-b border-slate-200/80">
      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 text-primary-600">
        <FiFilter className="w-4 h-4" />
      </span>
      <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Filters</span>
    </div>
    <div className="flex flex-row flex-wrap gap-4 md:gap-5 items-end justify-end p-4 md:p-5">
      {children}
    </div>
  </div>
);

export default FilterBar;
