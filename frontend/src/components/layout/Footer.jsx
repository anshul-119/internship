import React from 'react';
import { Sparkles, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

/**
 * Premium structured multi-column Footer with custom dark styling,
 * social connections, and simulated newsletter submission input.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <footer className="w-full border-t border-dark-800 bg-dark-950/60 backdrop-blur-md pt-12 pb-6 px-6">
      {/* Upper columns grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
        {/* Core Description Column */}
        <div className="flex flex-col gap-4">
          <Link to={ROUTES.HOME} className="flex items-center gap-2 group self-start">
            <div className="p-1.5 bg-primary-600/10 text-primary-500 rounded-lg group-hover:bg-primary-500 group-hover:text-white transition-all">
              <Sparkles size={16} />
            </div>
            <span className="font-display font-bold text-base text-white tracking-wide">
              Aura<span className="text-primary-500 font-light">Portal</span>
            </span>
          </Link>
          <p className="text-xs text-dark-300 leading-relaxed">
            Building production-ready, beautifully designed React frontends featuring elegant dark aesthetics, seamless interactions, and state-of-the-art animations.
          </p>
        </div>

        {/* Quick Portal Navigation Links */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
          <Link to={ROUTES.HOME} className="text-xs text-dark-300 hover:text-primary-400 transition-colors">Home</Link>
          <Link to={ROUTES.LOGIN} className="text-xs text-dark-300 hover:text-primary-400 transition-colors">Sign In</Link>
          <Link to={ROUTES.REGISTER} className="text-xs text-dark-300 hover:text-primary-400 transition-colors">Register</Link>
        </div>

        {/* Core Libraries and Tech Stack References */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Resources</h4>
          <a href="https://react.dev" target="_blank" rel="noreferrer" className="text-xs text-dark-300 hover:text-primary-400 transition-colors">React 19 Docs</a>
          <a href="https://tailwindcss.com" target="_blank" rel="noreferrer" className="text-xs text-dark-300 hover:text-primary-400 transition-colors">Tailwind CSS</a>
          <a href="https://framer.com/motion" target="_blank" rel="noreferrer" className="text-xs text-dark-300 hover:text-primary-400 transition-colors">Framer Motion</a>
        </div>

        {/* Newsletter / Keep In Touch form */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Stay Connected</h4>
          <p className="text-xs text-dark-300">Subscribe for custom interface kits and updates.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input
              type="email"
              placeholder="name@email.com"
              className="px-3 py-2 rounded-lg text-xs text-white glass-input outline-none w-full"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Legal / Social row */}
      <div className="max-w-7xl mx-auto border-t border-dark-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Copyright branding */}
        <span className="text-[10px] text-dark-400 font-medium">
          © {currentYear} AuraPortal. All rights reserved. Made with <Heart size={10} className="inline text-accent-rose animate-pulse" /> for developers.
        </span>

        {/* Social connections links */}
        <div className="flex items-center gap-3">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="p-2 bg-dark-800 hover:bg-primary-600 text-dark-300 hover:text-white rounded-lg transition-all duration-300"
            >
              <social.icon size={13} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
