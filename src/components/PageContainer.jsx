const PageContainer = ({ children, className = '' }) => (
  <div className={`p-3 sm:p-5 md:p-8 w-full min-w-0 ${className}`}>
    <div className="w-full min-w-0 space-y-5 md:space-y-8">
      {children}
    </div>
  </div>
);

export default PageContainer;
