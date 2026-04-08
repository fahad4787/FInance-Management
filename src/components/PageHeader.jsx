const PageHeader = ({ title, actions = null, meta = null, className = '' }) => (
  <div className={`flex items-start justify-between flex-wrap gap-4 ${className}`}>
    <div className="flex-1 min-w-[200px]">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
        {title}
      </h1>
      <div className="w-24 h-1 rounded-full bg-gradient-to-r from-primary-500 to-primary-400/60 mt-3" />
    </div>
    {(meta || actions) && (
      <div className="flex flex-col items-end gap-2 shrink-0">
        {meta ? <div className="text-xs text-slate-500 text-right max-w-[16rem] leading-snug">{meta}</div> : null}
        {actions ? <div className="flex flex-wrap justify-end gap-3">{actions}</div> : null}
      </div>
    )}
  </div>
);

export default PageHeader;
