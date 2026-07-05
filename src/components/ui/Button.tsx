import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  let baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed';
  
  let variantClasses = '';
  switch (variant) {
    case 'primary':
      variantClasses = 'bg-primary hover:bg-primary-hover text-white shadow-sm';
      break;
    case 'secondary':
      variantClasses = 'bg-secondary hover:bg-secondary-hover text-white shadow-sm';
      break;
    case 'outline':
      variantClasses = 'border border-slate-200 hover:bg-slate-50 text-slate-700';
      break;
    case 'ghost':
      variantClasses = 'hover:bg-slate-50 text-slate-600';
      break;
  }

  let sizeClasses = '';
  switch (size) {
    case 'sm':
      sizeClasses = 'px-3 py-1.5 text-xs';
      break;
    case 'md':
      sizeClasses = 'px-4 py-2 text-sm';
      break;
    case 'lg':
      sizeClasses = 'px-6 py-3 text-base';
      break;
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
