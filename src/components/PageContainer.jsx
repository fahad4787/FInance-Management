const PageContainer = ({ children, className = '' }) => (
  <div className={`p-6 md:p-8 w-full ${className}`}>
    <div className="w-full space-y-8">
      {children}
    </div>
  </div>
);

export default PageContainer;
