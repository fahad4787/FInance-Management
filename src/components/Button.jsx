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
  const baseStyles = 'font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-card hover:shadow-card-hover inline-flex items-center justify-center gap-2';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const variantStyles =
    variant === 'danger'
      ? 'bg-gradient-to-br from-red-600 to-red-500 text-white focus:ring-red-500/50 border border-red-400/30'
      : variant === 'secondary'
        ? 'bg-slate-200 text-slate-800 border border-slate-300 hover:bg-slate-300 focus:ring-slate-400/50'
        : 'bg-gradient-to-br from-primary-500 to-primary-600 text-white focus:ring-primary-500/50 border border-primary-400/30 hover:from-primary-600 hover:to-primary-700';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizes[size]} ${widthClass} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
