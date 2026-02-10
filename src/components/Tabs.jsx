/**
 * Reusable tabs: tab list + panel area. Parent controls active tab and renders panel content.
 * @param {Array<{ id: string, label: string, badge?: number }>} tabs - Tab definitions (badge = optional count)
 * @param {string} activeId - Currently active tab id
 * @param {(id: string) => void} onChange - Called when tab is selected
 * @param {React.ReactNode} children - Panel content for the active tab
 */
const Tabs = ({ tabs = [], activeId, onChange, children }) => {
  return (
    <div className="w-full">
      <div className="rounded-2xl bg-slate-100/90 border border-slate-200/80 p-1.5 shadow-sm">
        <nav className="flex gap-1" role="tablist">
          {tabs.map((tab) => {
            const isActive = activeId === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(tab.id)}
                className={`flex items-center gap-2.5 px-5 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-primary-700 shadow-card border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/60 border border-transparent'
                }`}
              >
                {tab.label}
                {tab.badge != null && tab.badge > 0 && (
                  <span
                    className={`min-w-[1.35rem] h-5 px-1.5 flex items-center justify-center text-xs font-bold rounded-full ${
                      isActive ? 'bg-primary-500 text-white' : 'bg-slate-300 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
      <div role="tabpanel" className="pt-6">
        {children}
      </div>
    </div>
  );
};

export default Tabs;
