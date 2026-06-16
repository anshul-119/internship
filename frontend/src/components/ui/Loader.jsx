import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';

/**
 * Premium glassmorphic Loader featuring a dual spinning arc and pulsing radial glow.
 */
export default function Loader({
  size = 'md',
  text = 'Loading...',
  className = '',
}) {
  const sizes = {
    sm: { circle: 'w-6 h-6', border: 'border-2' },
    md: { circle: 'w-10 h-10', border: 'border-[3px]' },
    lg: { circle: 'w-16 h-16', border: 'border-4' },
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3.5', className)}>
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing background orb */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className={cn(
            'absolute rounded-full bg-primary-500/10 filter blur-xs',
            sizes[size].circle
          )}
        />
        
        {/* Main spinning gradient arc */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.85, ease: 'linear' }}
          className={cn(
            'rounded-full border-t-primary-500 border-r-primary-500/20 border-b-primary-500/10 border-l-transparent',
            sizes[size].circle,
            sizes[size].border
          )}
        />
      </div>
      
      {/* Animated, pulsing text loader label */}
      {text && (
        <span className="text-[10px] text-dark-400 font-bold tracking-widest uppercase animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
}
