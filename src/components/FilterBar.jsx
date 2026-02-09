const FilterBar = ({ children, className = '' }) => (
  <div className={`rounded-xl border border-gray-200 bg-white/80 shadow-sm p-4 md:p-5 ${className}`}>
    <div className="flex flex-row flex-wrap gap-4 md:gap-5 items-end justify-end">
      {children}
    </div>
  </div>
);

export default FilterBar;
