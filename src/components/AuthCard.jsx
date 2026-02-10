const AuthCard = ({ title, children }) => (
  <div className="w-full bg-white rounded-2xl shadow-panel overflow-hidden border-t-4 border-primary-500">
    {title && (
      <div className="px-8 pt-8 pb-2">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        <div className="w-16 h-1 rounded-full bg-gradient-to-r from-primary-500 to-primary-400/60 mt-3" />
      </div>
    )}
    <div className="p-8 pt-6">
      {children}
    </div>
  </div>
);

export default AuthCard;
