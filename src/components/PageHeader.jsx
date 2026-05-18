const PageHeader = ({ title, actions = null, meta = null, className = '' }) => (
  <div
    className={`flex flex-col gap-3 sm:gap-4 md:flex-row md:items-start md:justify-between w-full min-w-0 ${className}`}
  >
    <div className="min-w-0 flex-1">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight leading-tight">
        {title}
      </h1>
      <div className="w-14 sm:w-20 md:w-24 h-0.5 sm:h-1 rounded-full bg-gradient-to-r from-primary-500 to-primary-400/60 mt-2 sm:mt-3" />
    </div>
    {(meta || actions) && (
      <div className="flex flex-col gap-2 w-full md:w-auto md:items-end md:shrink-0 min-w-0">
        {meta ? (
          <div className="text-[11px] sm:text-xs text-slate-500 md:text-right max-w-full md:max-w-[16rem] leading-snug">
            {meta}
          </div>
        ) : null}
        {actions ? (
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 w-full md:w-auto md:justify-end [&_button]:w-full sm:[&_button]:w-auto [&_.flex]:flex-col [&_.flex]:sm:flex-row [&_.flex]:gap-2 [&_.flex]:sm:gap-3 [&_.flex]:w-full [&_.flex]:sm:w-auto">
            {actions}
          </div>
        ) : null}
      </div>
    )}
  </div>
);

export default PageHeader;
