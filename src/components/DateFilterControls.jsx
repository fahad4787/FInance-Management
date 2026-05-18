import { FiChevronDown } from 'react-icons/fi';
import ModernDatePicker from './ModernDatePicker';

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 12 }, (_, i) => currentYear - 5 + i);

const filterLabelClass = 'text-sm font-semibold mb-2 text-slate-700 capitalize tracking-wide block';

const filterSelectClass =
  'w-full min-w-0 flex-1 px-3 py-2 pr-10 text-sm text-slate-800 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 bg-white appearance-none cursor-pointer';

const datePickerClass = 'filter-date-field w-full min-w-0 md:flex-1';

const DateFilterControls = ({
  dateMode,
  setDateMode,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setMonth,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  className = ''
}) => {
  const pill = (isActive) =>
    `w-full px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 md:w-auto md:whitespace-nowrap ${
      isActive
        ? 'bg-white text-primary-700 shadow-sm border border-slate-200/70'
        : 'text-slate-600 hover:text-slate-800'
    }`;

  return (
    <div className={`flex flex-col min-w-0 w-full ${className}`}>
      <label className={filterLabelClass}>Date</label>

      <div className="flex flex-col gap-2 w-full min-w-0 md:flex-row md:flex-wrap md:items-end md:gap-2">
        <div className="grid grid-cols-3 gap-0.5 p-0.5 w-full rounded-xl bg-slate-100/90 border border-slate-200/80 md:w-auto md:inline-flex md:shrink-0">
          <button type="button" onClick={() => setDateMode('month')} className={pill(dateMode === 'month')}>
            Month
          </button>
          <button type="button" onClick={() => setDateMode('yearly')} className={pill(dateMode === 'yearly')}>
            Yearly
          </button>
          <button type="button" onClick={() => setDateMode('range')} className={pill(dateMode === 'range')}>
            Range
          </button>
        </div>

        {dateMode === 'month' && (
          <ModernDatePicker
            label=""
            value={selectedMonth}
            onChange={setMonth}
            granularity="month"
            placeholder="YYYY-MM"
            className={datePickerClass}
          />
        )}
        {dateMode === 'yearly' && (
          <div className="relative w-full min-w-0 md:flex-1 md:min-w-[6.5rem]">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className={filterSelectClass}
              aria-label="Year"
            >
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FiChevronDown className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        )}
        {dateMode === 'range' && (
          <div className="flex flex-col gap-2 w-full min-w-0 md:flex-row md:flex-1 md:items-end md:gap-2">
            <ModernDatePicker
              label=""
              value={dateFrom}
              onChange={setDateFrom}
              placeholder="Start"
              className={datePickerClass}
            />
            <span className="hidden md:inline pb-2 text-slate-400 text-sm font-medium shrink-0">–</span>
            <ModernDatePicker
              label=""
              value={dateTo}
              onChange={setDateTo}
              placeholder="End"
              className={datePickerClass}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DateFilterControls;
