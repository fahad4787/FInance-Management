import { useMemo } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import Modal from './Modal';

const MissingTransactionsFloating = ({
  isOpen,
  onOpen,
  onClose,
  title = 'Missing transactions',
  summary = '',
  rangeLabel = '',
  items = [],
  emptyText = 'No missing transactions in this range.'
}) => {
  const badgeCount = items.reduce((s, it) => s + (Number(it.missing) || 0), 0);

  const headerText = useMemo(() => {
    if (summary) return summary;
    if (!items.length) return emptyText;
    return `${items.length} project${items.length === 1 ? '' : 's'} with missing transactions`;
  }, [summary, items, emptyText]);

  if (!summary && items.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes fhFloatIn {
          0% { transform: translateY(10px) scale(0.98); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes fhPulseRing {
          0% { transform: scale(0.92); opacity: 0.55; }
          70% { transform: scale(1.08); opacity: 0; }
          100% { transform: scale(1.08); opacity: 0; }
        }
        @keyframes fhWiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
          75% { transform: rotate(-4deg); }
        }
      `}</style>
      <button
        type="button"
        onClick={onOpen}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-2xl border border-rose-200/80 bg-white/95 backdrop-blur px-4 py-3 hover:bg-white transition-colors group"
        aria-label="Show missing transactions"
        title="Show missing transactions"
        style={{
          animation: 'fhFloatIn 220ms ease-out both',
          transformOrigin: 'bottom right'
        }}
      >
        <span className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-rose-100 text-rose-700">
          {badgeCount > 0 ? (
            <span
              className="absolute inset-0 rounded-xl border border-rose-300/60"
              style={{ animation: 'fhPulseRing 1.3s ease-out infinite' }}
              aria-hidden
            />
          ) : null}
          <span
            className="relative"
            style={{ animation: badgeCount > 0 ? 'fhWiggle 1.6s ease-in-out infinite' : undefined }}
            aria-hidden
          >
            <FiAlertTriangle className="w-5 h-5" />
          </span>
        </span>
        <div className="text-left min-w-0">
          <p className="text-sm font-bold text-slate-800 leading-none">Missing</p>
          <p className="text-xs text-slate-600 mt-1 leading-none">
            View details
          </p>
        </div>
        {badgeCount > 0 ? (
          <span className="ml-1 inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-full bg-rose-500/15 text-rose-800 border border-rose-400/30 text-xs font-extrabold tabular-nums">
            {badgeCount}
          </span>
        ) : null}
      </button>

      <Modal isOpen={isOpen} onClose={onClose} title={title} panelClassName="max-w-3xl">
        <div className="space-y-4">
          <div className="rounded-xl border border-rose-200/80 bg-rose-50/80 px-4 py-3 text-sm text-rose-900 shadow-card">
            <p className="font-semibold">{headerText}</p>
            {rangeLabel ? (
              <p className="text-xs text-rose-900/70 mt-1">{rangeLabel}</p>
            ) : null}
          </div>

          {items.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-panel overflow-hidden">
              <div className="max-h-[55vh] overflow-auto">
                <table className="w-full min-w-max">
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                        Broker
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                        Project
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                        Payout
                      </th>
                      <th className="py-3 px-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider whitespace-nowrap">
                        Missing
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((m, idx) => (
                      <tr
                        key={m.key || `${m.client}-${m.project}-${idx}`}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                      >
                        <td className="py-3 px-4 text-slate-800 font-semibold whitespace-nowrap">{m.client}</td>
                        <td className="py-3 px-4 text-slate-700 whitespace-nowrap">{m.project}</td>
                        <td className="py-3 px-4 text-slate-700 text-center whitespace-nowrap">{m.cadenceLabel}</td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center justify-center min-w-8 px-2 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-extrabold tabular-nums">
                            {m.missing}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-600 py-10">{emptyText}</div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default MissingTransactionsFloating;

