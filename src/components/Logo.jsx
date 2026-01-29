const Logo = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border-2 relative group"
        style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
          borderColor: '#38bdf8'
        }}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          <path 
            d="M3 18L9 12L13 16L21 8" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M21 8H15L13 10" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        <div 
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md"
          style={{ backgroundColor: '#0369a1' }}
        >
          <svg 
            width="10" 
            height="10" 
            viewBox="0 0 10 10" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M5 2V8M3 4H7M3 6H7" 
              stroke="white" 
              strokeWidth="1.2" 
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-gray-800 leading-tight tracking-tight">Finance</span>
        <span className="text-xs font-semibold text-primary-600 leading-tight uppercase tracking-wider">Management</span>
      </div>
    </div>
  );
};

export default Logo;
