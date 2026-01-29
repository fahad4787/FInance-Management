const AuthCard = ({ title, children }) => (
  <div className="w-full bg-white rounded-2xl shadow-xl border-l-4 border-primary-500 p-8">
    {title && (
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <div className="w-16 h-0.5 bg-gradient-to-r from-primary-400 to-transparent mt-2" />
      </div>
    )}
    {children}
  </div>
);

export default AuthCard;
