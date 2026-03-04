import { FiX } from 'react-icons/fi';
import ModernDatePicker from './ModernDatePicker';

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 12 }, (_, i) => currentYear - 5 + i);

/**
 * Date filter UI: Yearly (select year) or Date range (start/end), plus Clear (icon + tooltip).
 * Layout is stable to avoid jumping when switching modes or when Clear appears.
 */
const DateFilterControls = ({
  dateMode,
  setDateMode,
  selectedYear,
  setSelectedYear,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  clearAll,
  className = ''
}) => {
  const hasActiveFilter =
    dateMode === 'yearly' || (dateMode === 'range' && (dateFrom || dateTo));

  return (
    <div className={`flex items-end gap-4 flex-nowrap ${className}`}>
      {/* Date label + mode pills – fixed width so no shift */}
      <div className="flex flex-col gap-2 shrink-0">
        <label className="text-sm font-bold text-slate-700">
          Date
        </label>
        <div className="inline-flex p-1 rounded-xl bg-slate-100/80 border border-slate-200/80">
          <button
            type="button"
            onClick={() => setDateMode('yearly')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shrink-0 ${
              dateMode === 'yearly'
                ? 'bg-white text-primary-700 shadow-card border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Yearly
          </button>
          <button
            type="button"
            onClick={() => setDateMode('range')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shrink-0 ${
              dateMode === 'range'
                ? 'bg-white text-primary-700 shadow-card border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Date range
          </button>
        </div>
      </div>

      {/* Content area – fixed min-width so Year vs Range doesn’t cause jump */}
      <div className="flex items-end gap-3 min-w-[232px] w-[232px] shrink-0">
        {dateMode === 'yearly' ? (
          <div className="flex flex-col gap-2 w-full min-w-0">
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Year</label>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full pl-3 pr-8 py-2.5 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 bg-white text-slate-800 font-semibold appearance-none cursor-pointer text-sm"
              >
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-end gap-2 w-full">
            <ModernDatePicker
              label="Start"
              value={dateFrom}
              onChange={setDateFrom}
              placeholder="Start"
              className="w-[108px] min-w-0 shrink-0"
            />
            <span className="pb-2.5 text-slate-400 font-medium shrink-0">–</span>
            <ModernDatePicker
              label="End"
              value={dateTo}
              onChange={setDateTo}
              placeholder="End"
              className="w-[108px] min-w-0 shrink-0"
            />
          </div>
        )}
      </div>

      {/* Clear – always reserve space so layout doesn’t jump */}
      <div className="w-10 h-10 shrink-0 flex items-center justify-center">
        {hasActiveFilter ? (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
            title="Clear date filter and show all data"
            aria-label="Clear date filter and show all data"
          >
            <FiX className="w-5 h-5" />
          </button>
        ) : (
          <span className="w-10 h-10 block" aria-hidden />
        )}
      </div>
    </div>
  );
};

export default DateFilterControls;
