import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Sparkles, LogOut, LayoutDashboard, Home as HomeIcon, TrendingDown } from 'lucide-react';
import { ROUTES } from '@/constants';
import useAuth from '@/hooks/useAuth';
import Button from '../ui/Button';

/**
 * Premium glassmorphic responsive Navigation Bar.
 * Auto-resolves active states and presents quick user session access.
 */
export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  const navLinks = [
    { label: 'Home', path: ROUTES.HOME, icon: HomeIcon },
    ...(isAuthenticated ? [
      { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
      { label: 'Burn Down', path: ROUTES.BURNDOWN, icon: TrendingDown }
    ] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass-navbar transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo with Sparkle */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
          <div className="p-2 bg-primary-600/10 text-primary-500 rounded-xl group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
            <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
          </div>
          <span className="font-display font-bold text-lg text-white tracking-wide group-hover:text-primary-400 transition-colors">
            Aura<span className="text-primary-500 font-light">Portal</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-white flex items-center gap-1.5 ${
                  isActive ? 'text-primary-500' : 'text-dark-300'
                }`
              }
            >
              <link.icon size={15} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Desktop Session Controls */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'}
                  alt={user.name}
                  className="h-8 w-8 rounded-full border border-dark-700 object-cover ring-2 ring-primary-500/20"
                />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-white leading-tight">{user.name}</span>
                  <span className="text-[10px] text-dark-400 font-medium">{user.email || 'User'}</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout} 
                className="h-9 gap-1.5 border-dark-700 text-dark-300 hover:text-accent-rose hover:border-accent-rose/30"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to={ROUTES.LOGIN}>
                <Button variant="outline" size="sm" className="h-9 text-xs">Sign In</Button>
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button variant="primary" size="sm" className="h-9 text-xs">Register</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle Trigger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-dark-300 hover:text-white hover:bg-dark-800 rounded-xl transition-all"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-dark-900 border-b border-dark-700 py-6 px-6 flex flex-col gap-6 shadow-2xl glass-card">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-semibold flex items-center gap-3 p-3 rounded-xl hover:bg-dark-800 transition-all ${
                    isActive ? 'bg-primary-500/10 text-primary-500' : 'text-dark-200'
                  }`
                }
              >
                <link.icon size={16} />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="border-t border-dark-800 pt-4">
            {isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80'}
                    alt={user.name}
                    className="h-9 w-9 rounded-full border border-dark-700 object-cover"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-white">{user.name}</span>
                    <span className="text-xs text-dark-400">{user.email || 'User'}</span>
                  </div>
                </div>
                <Button 
                  variant="danger" 
                  size="md" 
                  onClick={() => { setMobileOpen(false); handleLogout(); }} 
                  className="w-full gap-2 text-xs"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to={ROUTES.LOGIN} onClick={() => setMobileOpen(false)} className="w-full">
                  <Button variant="outline" size="md" className="w-full text-xs">Sign In</Button>
                </Link>
                <Link to={ROUTES.REGISTER} onClick={() => setMobileOpen(false)} className="w-full">
                  <Button variant="primary" size="md" className="w-full text-xs">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
