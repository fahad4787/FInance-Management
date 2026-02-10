const PageHeader = ({ title, actions = null, className = '' }) => (
  <div className={`flex items-center justify-between flex-wrap gap-4 ${className}`}>
    <div className="flex-1 min-w-[200px]">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
        {title}
      </h1>
      <div className="w-24 h-1 rounded-full bg-gradient-to-r from-primary-500 to-primary-400/60 mt-3" />
    </div>
    {actions && (
      <div className="flex-shrink-0 flex gap-3">
        {actions}
      </div>
    )}
  </div>
);

export default PageHeader;
