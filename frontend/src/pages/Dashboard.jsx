import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Plus, Trash2, Calendar, UserCheck, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '@/hooks/useAuth';
import { formatDate } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Loader from '@/components/ui/Loader';
import ErrorMessage from '@/components/ui/ErrorMessage';

/**
 * Premium authenticated Dashboard.
 * Integrates visual status cards, stats panels, and an interactive CRUD activities logging grid.
 */
export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Fetch & Initialize Mock Activities Console
  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate artificial API load latency
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const mockActivities = [
        { id: 1, name: 'Portal Session Established', type: 'system', timestamp: new Date().toISOString() },
        { id: 2, name: 'Axios Configuration Checked', type: 'network', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 3, name: 'Core Tailwind Compilation Successful', type: 'build', timestamp: new Date(Date.now() - 7200000).toISOString() },
      ];
      setActivities(mockActivities);
    } catch (err) {
      setError('Failed to fetch dashboard metrics. Check server connectivity.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Handle addition of custom activities trace
  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newActivity.trim()) return;

    setIsAdding(true);
    setTimeout(() => {
      const added = {
        id: Date.now(),
        name: newActivity,
        type: 'user',
        timestamp: new Date().toISOString(),
      };
      
      setActivities((prev) => [added, ...prev]);
      setNewActivity('');
      setIsAdding(false);
      
      toast.success('Activity logged successfully!', {
        style: {
          background: '#18181b',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      });
    }, 400);
  };

  // Handle deletion of local activity trace
  const handleDeleteActivity = (id) => {
    setActivities((prev) => prev.filter((act) => act.id !== id));
    
    toast.error('Activity trace removed.', {
      style: {
        background: '#18181b',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader size="lg" text="Loading metrics console..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
        <ErrorMessage message={error} onRetry={fetchActivities} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full flex flex-col gap-8 relative z-10 text-left">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-800/60 pb-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Welcome, {user?.name || 'Administrator'}
          </h1>
          <p className="text-xs text-dark-300">
            Node status online. Authenticated Email: <span className="text-primary-500 font-semibold">{user?.email || 'N/A'}</span>
          </p>
        </div>
        
        {/* Status indicator pulse dot */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent-emerald animate-ping animate-pulse" />
          <span className="text-[10px] text-accent-emerald font-bold uppercase tracking-widest bg-accent-emerald/10 px-2.5 py-1 rounded-full">
            Console Active
          </span>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: Cpu, label: 'CPU Usage', val: '4.2%', desc: 'Optimized node processing load' },
          { icon: UserCheck, label: 'Identity Status', val: 'Verified', desc: 'Secure local storage signature' },
          { icon: Activity, label: 'Activities Trace', val: activities.length, desc: 'Realtime session log counts' },
        ].map((metric, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 flex items-center gap-5 border-dark-700/40 shadow-md">
            <div className="p-3 bg-primary-500/10 text-primary-500 rounded-xl">
              <metric.icon size={22} />
            </div>
            
            <div className="flex flex-col text-left gap-1">
              <span className="text-xs text-dark-400 font-semibold uppercase tracking-wider">{metric.label}</span>
              <span className="font-display font-extrabold text-2xl text-white leading-none">{metric.val}</span>
              <span className="text-[10px] text-dark-300 leading-tight">{metric.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Split: Form & Logs Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Column */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-6 flex flex-col gap-4 border-dark-700/40 sticky top-24 shadow-lg">
            <h3 className="font-display font-bold text-base text-white border-b border-dark-800 pb-3 flex items-center gap-2">
              <Plus size={16} className="text-primary-500" />
              <span>Log Action</span>
            </h3>
            
            <form onSubmit={handleAddActivity} className="flex flex-col gap-4">
              <Input
                label="Action Description"
                placeholder="e.g., Reviewed security panel"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                helperText="Manually log custom tasks into local memory tracker."
              />
              
              <Button
                type="submit"
                isLoading={isAdding}
                className="w-full h-10 text-xs"
              >
                Submit Entry
              </Button>
            </form>
          </div>
        </div>

        {/* Database Table Column */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl border-dark-700/40 overflow-hidden flex flex-col shadow-lg">
            <div className="p-6 border-b border-dark-800/80 bg-dark-950/20">
              <h3 className="font-display font-semibold text-base text-white">
                Live Audit Logs
              </h3>
              <p className="text-[10px] text-dark-400 font-medium">
                Tracks reactive user interactions, systems warnings, and network logs in real-time.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-dark-800 text-dark-400 font-bold uppercase tracking-wider bg-dark-900/40">
                    <th className="p-4">Action</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4 text-right">Clear</th>
                  </tr>
                </thead>
                
                <tbody>
                  <AnimatePresence initial={false}>
                    {activities.length > 0 ? (
                      activities.map((act) => (
                        <motion.tr
                          key={act.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                          className="border-b border-dark-800/50 hover:bg-dark-800/10 transition-colors"
                        >
                          <td className="p-4 font-semibold text-white">{act.name}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              act.type === 'system' ? 'bg-primary-500/10 text-primary-500' :
                              act.type === 'user' ? 'bg-accent-emerald/10 text-accent-emerald' :
                              'bg-accent-violet/10 text-accent-violet'
                            }`}>
                              {act.type}
                            </span>
                          </td>
                          <td className="p-4 text-dark-300 flex items-center gap-1.5 pt-4">
                            <Calendar size={12} className="text-dark-400" />
                            <span>{formatDate(act.timestamp)}</span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteActivity(act.id)}
                              className="p-1.5 hover:bg-accent-rose/10 text-dark-400 hover:text-accent-rose rounded-lg transition-colors"
                              aria-label="Remove audit log"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-dark-400 font-medium italic">
                          No audit activity logs remaining. Submit an action above!
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
