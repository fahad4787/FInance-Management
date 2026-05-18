const AuthCard = ({ title, subtitle, children }) => (
  <div className="w-full bg-white rounded-xl sm:rounded-2xl shadow-panel overflow-hidden border border-slate-200/80 border-t-4 border-t-primary-500">
    {title && (
      <div className="px-4 pt-5 pb-1 sm:px-6 sm:pt-6 sm:pb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
        {subtitle ? <p className="text-xs sm:text-sm text-slate-600 mt-1.5">{subtitle}</p> : null}
        <div className="w-12 sm:w-14 h-1 rounded-full bg-primary-500 mt-3" />
      </div>
    )}
    <div className="px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">{children}</div>
  </div>
);

export default AuthCard;
