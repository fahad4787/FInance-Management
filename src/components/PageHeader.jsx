const PageHeader = ({ title, actions = null, className = "" }) => {
  return (
    <div className={`flex items-center justify-between flex-wrap gap-4 mb-8 ${className}`}>
      <div className="flex-1 min-w-[300px]">
        <h2 className="text-4xl font-bold text-gray-800">
          {title}
        </h2>
        <div className="w-32 h-0.5 bg-gradient-to-r from-primary-400 to-transparent mt-3"></div>
      </div>
      {actions ? (
        <div className="flex-shrink-0 flex gap-3">
          {actions}
        </div>
      ) : null}
    </div>
  );
};

export default PageHeader;
