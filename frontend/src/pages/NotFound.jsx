import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react';
import { ROUTES } from '@/constants';
import Button from '@/components/ui/Button';

/**
 * Premium 404 NotFound page.
 * Displays interactive warning widgets, floating animations, and a countdown timer
 * that automatically redirects the user back to the Home page.
 */
export default function NotFound() {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(ROUTES.HOME);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12 relative z-10">
      <div className="glass-card rounded-3xl p-8 max-w-md w-full flex flex-col items-center gap-6 text-center border-dark-700/40 relative overflow-hidden shadow-2xl">
        {/* Visual top border styling */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-accent-rose to-accent-violet" />

        {/* Floating warning icon container */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="p-4 bg-accent-rose/10 text-accent-rose rounded-full border border-accent-rose/20 relative"
        >
          <ShieldAlert size={44} />
          {/* Pulsing decoration */}
          <div className="absolute inset-0 rounded-full bg-accent-rose/5 animate-pulse" />
        </motion.div>

        <div className="flex flex-col gap-2">
          <h1 className="font-display font-extrabold text-5xl text-white">404</h1>
          <h2 className="font-display font-bold text-xl text-white">Out of Bounds</h2>
          <p className="text-xs text-dark-300 leading-relaxed max-w-xs">
            The target node or workspace address is unauthorized or does not exist.
          </p>
        </div>

        {/* Countdown Indicator Bar */}
        <div className="p-3 bg-dark-950/40 rounded-2xl border border-dark-800 w-full flex items-center justify-center gap-2.5">
          <RefreshCw size={13} className="text-primary-500 animate-spin" style={{ animationDuration: '3s' }} />
          <span className="text-[10px] text-dark-300 font-medium">
            Redirecting to Home node in <strong className="text-white font-bold">{countdown}s</strong>...
          </span>
        </div>

        {/* CTA Redirection triggers */}
        <div className="flex flex-col gap-3 w-full border-t border-dark-800/80 pt-4">
          <Link to={ROUTES.HOME} className="w-full">
            <Button variant="primary" className="w-full gap-2 text-xs h-10">
              <ArrowLeft size={13} />
              <span>Back to Home Node</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
