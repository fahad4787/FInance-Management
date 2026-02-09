const Button = ({ 
  children, 
  onClick, 
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  fullWidth = false,
  variant = 'primary'
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-white inline-flex items-center justify-center gap-2';
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const variantStyles = variant === 'danger'
    ? { background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)', border: '2px solid #f87171' }
    : { background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)', border: '2px solid #38bdf8' };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizes[size]} ${widthClass} ${className}`}
      style={variantStyles}
    >
      {children}
    </button>
  );
};

export default Button;
