const SectionTitle = ({ title, className = "" }) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="h-1 w-12 bg-primary-500 rounded-full"></div>
        <h2 className="text-4xl font-bold text-gray-800">
          {title}
        </h2>
      </div>
      <div className="w-32 h-0.5 bg-gradient-to-r from-primary-400 to-transparent"></div>
    </div>
  );
};

export default SectionTitle;
