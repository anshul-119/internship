import React, { forwardRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/helpers';

/**
 * Custom modern Input field. ForwardRef-wrapped to bind flawlessly with react-hook-form.
 * Incorporates Framer Motion error message transitions.
 */
const Input = forwardRef(({
  label,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  helperText,
  ...props
}, ref) => {
  const inputId = useId();

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {/* Dynamic Accessible Label */}
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-dark-300 uppercase tracking-wider pl-1">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {/* Leading Icon */}
        {Icon && (
          <div className="absolute left-4 text-dark-400 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        
        <input
          id={inputId}
          ref={ref}
          type={type}
          className={cn(
            'w-full px-4 py-3 rounded-xl text-sm text-white glass-input outline-none transition-all',
            Icon ? 'pl-11' : '',
            error ? 'border-accent-rose/50 focus:border-accent-rose focus:ring-accent-rose/20' : '',
            className
          )}
          {...props}
        />
      </div>
      
      {/* Animated Validation Error Messages */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-accent-rose pl-1 font-medium"
          >
            {error.message || error}
          </motion.p>
        )}
        {!error && helperText && (
          <p className="text-xs text-dark-400 pl-1">
            {helperText}
          </p>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
