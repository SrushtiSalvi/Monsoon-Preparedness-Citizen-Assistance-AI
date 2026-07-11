export interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'warning' | 'danger' | 'success';
}

export function Card({
  title,
  subtitle,
  children,
  className = '',
  variant = 'default',
}: CardProps) {
  const baseStyles = 'rounded-lg border p-6 shadow-sm transition-all duration-200 hover:shadow-md';
  
  const variantStyles = {
    default: 'bg-white border-gray-200',
    primary: 'bg-teal-50 border-teal-200',
    warning: 'bg-amber-50 border-amber-200',
    danger: 'bg-red-50 border-red-200',
    success: 'bg-green-50 border-green-200',
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
