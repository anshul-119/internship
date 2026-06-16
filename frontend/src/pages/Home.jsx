import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Flame, Compass, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import Button from '@/components/ui/Button';

/**
 * Premium Home Landing Page.
 * Displays high-fidelity dark gradient aesthetics, stats panel, features grid,
 * and an interactive FAQ accordion.
 */
export default function Home() {
  const [activeFaq, setActiveFaq] = useState(null);

  const features = [
    { icon: Shield, title: 'Bank-Grade Security', desc: 'Secure token encapsulation with automatic token invalidations on local session timeouts.' },
    { icon: Zap, title: 'Extreme Velocity', desc: 'Pre-bundled asset optimizations via Vite for 100ms cold boots and immediate responsiveness.' },
    { icon: Flame, title: 'Tailwind Styling v3', desc: 'Configured dark-mode class utilities coupled with elegant custom glassmorphic overrides.' },
    { icon: Compass, title: 'Framer Transitions', desc: 'Full page fades, interactive accordion sheets, and micro-press button layouts.' },
  ];

  const faqs = [
    { q: 'Is this production ready?', a: 'Absolutely. The codebase is organized according to absolute industry-standard modular directories, fully typed hooks, and customized error boundaries.' },
    { q: 'How does authentication work?', a: 'It includes local state checking linked directly to the Axios client network interceptors. If a request returns a 401, the system auto-invalidates the session.' },
    { q: 'Is React 19 supported?', a: 'Yes! It utilizes pure React 19 libraries and incorporates clean forwardRefs matching Hook-Form directives.' },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Accent Label */}
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-500 border border-primary-500/20 tracking-wider uppercase animate-pulse-subtle">
            React 19 Enterprise Starter
          </span>

          {/* Heading */}
          <h1 className="font-display font-bold text-4xl sm:text-6xl text-white tracking-tight leading-none max-w-4xl">
            Sleek Aesthetics. <span className="text-gradient-blue">Production Ready.</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-dark-300 max-w-2xl leading-relaxed">
            Unleash rapid development with a professional dark glassmorphic UI system pre-configured with React Router, Axios services, and Framer Motion transitions.
          </p>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <Link to={ROUTES.DASHBOARD}>
              <Button variant="primary" size="lg">Get Started</Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg">Learn More</Button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Key Stats Row */}
      <section className="w-full bg-dark-950/40 border-y border-dark-800 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '100ms', label: 'Average Cold Boot' },
            { value: '99.9%', label: 'Uptime Standard' },
            { value: 'React 19', label: 'Core Integration' },
            { value: 'Tailwind v3', label: 'Engineered Styles' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="font-display font-extrabold text-2xl sm:text-4xl text-white">{stat.value}</span>
              <span className="text-[10px] sm:text-xs text-dark-400 font-bold uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Grid of features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 w-full relative z-10 scroll-mt-16">
        <div className="text-center mb-16 flex flex-col items-center gap-3">
          <h2 className="font-display font-bold text-2xl sm:text-4xl text-white">
            Pre-engineered Modules
          </h2>
          <p className="text-sm sm:text-base text-dark-300 max-w-lg">
            Stop wastefully rewriting basic configuration templates. Everything you need is structured right here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {features.map((feat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="glass-card rounded-2xl p-6 flex flex-col gap-4 border-dark-700/40 hover:border-primary-500/25 transition-colors"
            >
              <div className="p-3 bg-primary-600/10 text-primary-500 rounded-xl self-start">
                <feat.icon size={22} />
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="font-display font-semibold text-white text-base">
                  {feat.title}
                </h3>
                <p className="text-xs text-dark-300 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interactive Accordion FAQs */}
      <section className="max-w-3xl mx-auto px-6 py-12 pb-24 w-full relative z-10 text-left">
        <div className="text-center mb-12 flex flex-col items-center gap-3">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-dark-300">
            Answers to general structural implementation queries.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div key={index} className="glass-card rounded-2xl border-dark-700/40 overflow-hidden">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full p-5 flex items-center justify-between text-left text-sm font-semibold text-white hover:bg-dark-800/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    <ChevronDown size={18} className="text-dark-400" />
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 pt-1 text-xs text-dark-300 leading-relaxed border-t border-dark-800/50">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
