import { useMemo } from 'react';
import { FiBarChart2 } from 'react-icons/fi';
import { computeRollingWindowStats } from '../utils/projectRollingStats';

const StatValues = ({ curr, prev, valueClassName = 'text-slate-900', pairTitle }) => {
  const showPrev = prev > 0;
  const title =
    pairTitle ||
    'Onboard: project date in current window / previous 3-month window';
  return (
    <div className="flex items-baseline gap-1.5 tabular-nums" title={title}>
      <span className={`text-xl font-bold tracking-tight leading-none ${valueClassName}`}>{curr}</span>
      {showPrev ? (
        <>
          <span className="text-base text-slate-300 font-light leading-none select-none" aria-hidden>
            /
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-500 leading-none">{prev}</span>
        </>
      ) : null}
    </div>
  );
};

const ProjectInsightsSummaryCard = ({ projects = [] }) => {
  const { rangeLabel, onboardCurr, onboardPrev, endedCurr, endedPrev } = useMemo(
    () => computeRollingWindowStats(projects),
    [projects]
  );

  return (
    <div className="bg-white rounded-2xl shadow-panel border border-slate-200/80 ring-1 ring-slate-200/50 border-t-4 border-t-primary-500 overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 text-primary-600 shrink-0">
              <FiBarChart2 className="w-5 h-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">3-month project activity</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                Onboard and ended project counts for this window vs the previous 3 months.
              </p>
            </div>
          </div>
          <div className="sm:text-right shrink-0 w-full sm:w-auto">
            <p
              className="text-sm font-semibold text-slate-700 tabular-nums tracking-tight"
              title="Current rolling window"
            >
              {rangeLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-4 md:py-5 bg-slate-100/60 border-t border-slate-200/80 rounded-b-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-xl bg-white/90 border border-slate-200/80 shadow-sm ring-1 ring-slate-100/80 pl-3.5 pr-4 py-3.5 border-l-[3px] border-l-primary-500 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500 ring-2 ring-primary-500/25" aria-hidden />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-600">
                Onboard
              </span>
            </div>
            <div className="rounded-lg bg-slate-50/95 border border-slate-100 px-2.5 py-2">
              <StatValues
                curr={onboardCurr}
                prev={onboardPrev}
                valueClassName="text-primary-800"
                pairTitle="Onboard: project date in current window / previous 3-month window"
              />
            </div>
          </div>

          <div className="rounded-xl bg-white/90 border border-slate-200/80 shadow-sm ring-1 ring-slate-100/80 pl-3.5 pr-4 py-3.5 border-l-[3px] border-l-amber-500 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 ring-2 ring-amber-500/25" aria-hidden />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-amber-900/80">Ended</span>
            </div>
            <div className="rounded-lg bg-amber-50/80 border border-amber-100/90 px-2.5 py-2">
              <StatValues
                curr={endedCurr}
                prev={endedPrev}
                valueClassName="text-amber-900"
                pairTitle="Ended: marked Inactive in current window / previous 3 months (inactive date; older rows may use last update)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInsightsSummaryCard;
