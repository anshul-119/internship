import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';

/**
 * Reusable dynamic Button utilizing Framer Motion for elegant hover/tap reactions.
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white shadow-lg shadow-primary-500/20 focus:ring-primary-500',
    secondary: 'glass-card hover:bg-dark-600/50 text-white focus:ring-dark-500',
    outline: 'border border-dark-700 hover:border-dark-500 hover:bg-dark-800 text-dark-200 focus:ring-dark-500',
    danger: 'bg-gradient-to-r from-accent-rose to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-accent-rose/20 focus:ring-accent-rose',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <motion.button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      whileHover={!disabled && !isLoading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
}
