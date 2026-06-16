import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { cn } from '@/utils/helpers';
import Button from './Button';

/**
 * Customizable visual ErrorMessage card.
 * Renders glassmorphic red boundaries and provides support for a Retry action button.
 */
export default function ErrorMessage({
  message = 'An unexpected error occurred.',
  title = 'System Warning',
  onRetry,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'glass-card rounded-2xl p-5 max-w-md w-full flex flex-col gap-4 text-left border-accent-rose/20 relative overflow-hidden',
        className
      )}
    >
      {/* Visual top indicator border */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-accent-rose to-red-500" />
      
      <div className="flex gap-4">
        {/* Warning Icon Badge */}
        <div className="p-3 bg-accent-rose/10 text-accent-rose rounded-xl self-start">
          <AlertTriangle size={22} />
        </div>
        
        {/* Message block */}
        <div className="flex flex-col gap-1">
          <h3 className="font-display font-semibold text-white text-base">
            {title}
          </h3>
          <p className="text-sm text-dark-300 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      {/* Conditional Retry Call */}
      {onRetry && (
        <div className="flex justify-end pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="flex items-center gap-1.5 border-accent-rose/30 hover:border-accent-rose/50 text-accent-rose hover:bg-accent-rose/5"
          >
            <RotateCcw size={13} />
            <span>Try Again</span>
          </Button>
        </div>
      )}
    </motion.div>
  );
}
