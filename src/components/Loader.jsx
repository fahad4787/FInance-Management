const Loader = ({ className = "" }) => {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-primary-500 rounded-full opacity-20"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
