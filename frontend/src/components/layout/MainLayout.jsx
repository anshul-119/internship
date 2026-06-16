import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Global Page Layout Wrapper.
 * Provides custom scroll-to-top bindings, decorative backdrop glowing spheres,
 * and high-fidelity Framer Motion page entrance transitions.
 */
export default function MainLayout() {
  const { pathname } = useLocation();

  // Scroll viewport to top on every path navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-dark-900 text-white relative overflow-x-hidden selection:bg-primary-500 selection:text-white">
      {/* Decorative Premium background glowing spheres */}
      <div className="glow-orb glow-orb-primary w-[300px] h-[300px] -top-24 -left-12 animate-pulse-glow" />
      <div 
        className="glow-orb glow-orb-accent w-[350px] h-[350px] bottom-[15%] -right-24 animate-pulse-glow" 
        style={{ animationDelay: '2.5s' }} 
      />

      {/* Sticky Header Nav bar */}
      <Navbar />

      {/* Main viewport with animated AnimatePresence entry transitions */}
      <main className="flex-grow flex flex-col items-center w-full z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full flex-grow flex flex-col items-center"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Structured Footer */}
      <Footer />
    </div>
  );
}
