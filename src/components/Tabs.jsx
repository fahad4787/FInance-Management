/**
 * Reusable tabs: tab list + panel area. Parent controls active tab and renders panel content.
 * @param {Array<{ id: string, label: string }>} tabs - Tab definitions
 * @param {string} activeId - Currently active tab id
 * @param {(id: string) => void} onChange - Called when tab is selected
 * @param {React.ReactNode} children - Panel content for the active tab
 */
const Tabs = ({ tabs = [], activeId, onChange, children }) => {
  return (
    <div className="w-full">
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-1" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeId === tab.id}
              onClick={() => onChange(tab.id)}
              className={`px-5 py-3 text-sm font-semibold rounded-t-lg transition-colors border-b-2 -mb-px ${
                activeId === tab.id
                  ? 'border-primary-500 text-primary-600 bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div role="tabpanel">{children}</div>
    </div>
  );
};

export default Tabs;
