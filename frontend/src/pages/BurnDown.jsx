import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingDown, Plus, Trash2, Calendar, 
  RefreshCw, Check, X, Flame, AlertCircle, Info 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { sprintService } from '@/services/sprintService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Loader from '@/components/ui/Loader';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function BurnDown() {
  const [sprints, setSprints] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSprintName, setNewSprintName] = useState('');
  const [newSprintDuration, setNewSprintDuration] = useState(10);
  const [newSprintEffort, setNewSprintEffort] = useState(50);

  // Hover states for the chart tooltip
  const [hoveredDay, setHoveredDay] = useState(null);
  const svgRef = useRef(null);

  // Local copy of daily remaining values during editing
  const [editingValues, setEditingValues] = useState({});

  const fetchSprints = async (autoSelectId = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await sprintService.getSprints();
      setSprints(data);
      if (data && data.length > 0) {
        // Find sprint to select: either the autoSelectId, or the first one
        const selectSprint = autoSelectId 
          ? data.find(s => s._id === autoSelectId) || data[0]
          : data[0];
        setSelectedSprint(selectSprint);
        initializeEditingValues(selectSprint);
      } else {
        setSelectedSprint(null);
      }
    } catch (err) {
      setError('Failed to fetch Sprints. Check database connectivity or local storage.');
    } finally {
      setLoading(false);
    }
  };

  const initializeEditingValues = (sprint) => {
    if (!sprint || !sprint.dailyRemaining) return;
    const values = {};
    sprint.dailyRemaining.forEach((item) => {
      values[item.day] = item.remaining !== null && item.remaining !== undefined ? item.remaining : '';
    });
    setEditingValues(values);
  };

  useEffect(() => {
    fetchSprints();
  }, []);

  const handleSprintSelect = (e) => {
    const sprintId = e.target.value;
    const sprint = sprints.find((s) => s._id === sprintId);
    setSelectedSprint(sprint);
    initializeEditingValues(sprint);
    setHoveredDay(null);
  };

  const handleCreateSprint = async (e) => {
    e.preventDefault();
    if (!newSprintName.trim()) {
      toast.error('Please enter a sprint name');
      return;
    }

    try {
      const newSprint = await sprintService.createSprint({
        name: newSprintName,
        durationDays: newSprintDuration,
        totalEffort: newSprintEffort
      });
      toast.success('Sprint created successfully!');
      setIsModalOpen(false);
      
      // Reset fields
      setNewSprintName('');
      setNewSprintDuration(10);
      setNewSprintEffort(50);
      
      // Refresh list and select the new sprint
      await fetchSprints(newSprint._id);
    } catch (err) {
      toast.error('Failed to create sprint.');
    }
  };

  const handleDeleteSprint = async () => {
    if (!selectedSprint) return;
    if (!window.confirm(`Are you sure you want to delete "${selectedSprint.name}"?`)) return;

    try {
      await sprintService.deleteSprint(selectedSprint._id);
      toast.success('Sprint deleted.');
      await fetchSprints();
    } catch (err) {
      toast.error('Failed to delete sprint.');
    }
  };

  const handleDailyValueChange = (day, value) => {
    setEditingValues((prev) => ({
      ...prev,
      [day]: value
    }));
  };

  const handleSaveDailyValues = async () => {
    if (!selectedSprint) return;
    setSaving(true);
    try {
      // Map the local inputs back to the API schema
      const updatedDailyRemaining = selectedSprint.dailyRemaining.map((item) => {
        const val = editingValues[item.day];
        return {
          day: item.day,
          remaining: val === '' || val === null || val === undefined ? null : parseInt(val)
        };
      });

      const updatedSprint = await sprintService.updateSprint(selectedSprint._id, {
        dailyRemaining: updatedDailyRemaining
      });

      // Update state
      setSelectedSprint(updatedSprint);
      setSprints((prev) => prev.map((s) => s._id === updatedSprint._id ? updatedSprint : s));
      initializeEditingValues(updatedSprint);
      
      toast.success('Sprint progress updated successfully!');
    } catch (err) {
      toast.error('Failed to save sprint metrics.');
    } finally {
      setSaving(false);
    }
  };

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 340;
  const paddingLeft = 55;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Render chart helper calculations
  const getChartCoordinates = () => {
    if (!selectedSprint) return { idealPoints: [], actualPoints: [] };
    const N = selectedSprint.durationDays;
    const E = selectedSprint.totalEffort;

    // Ideal line points: linearly from Total Effort at Day 0 to 0 at Day N
    const idealPoints = [];
    for (let d = 0; d <= N; d++) {
      const idealVal = E - (d / N) * E;
      const x = paddingLeft + (d / N) * chartWidth;
      const y = paddingTop + (1 - (idealVal / E)) * chartHeight;
      idealPoints.push({ day: d, val: idealVal, x, y });
    }

    // Actual line points: mapped from database values. 
    // We only plot actual points up to the last logged non-null day.
    const actualPoints = [];
    let lastValidDay = -1;
    
    // Find the latest day logged
    selectedSprint.dailyRemaining.forEach((item) => {
      if (item.remaining !== null && item.remaining !== undefined) {
        if (item.day > lastValidDay) lastValidDay = item.day;
      }
    });

    selectedSprint.dailyRemaining.forEach((item) => {
      if (item.day <= lastValidDay) {
        const val = item.remaining !== null && item.remaining !== undefined ? item.remaining : 0;
        const x = paddingLeft + (item.day / N) * chartWidth;
        const y = paddingTop + (1 - (val / E)) * chartHeight;
        actualPoints.push({ day: item.day, val, x, y, isLogged: item.remaining !== null });
      }
    });

    return { idealPoints, actualPoints, lastValidDay };
  };

  const { idealPoints, actualPoints, lastValidDay } = getChartCoordinates();

  // SVG Mouse Hover Tracker
  const handleMouseMove = (e) => {
    if (!selectedSprint || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    // Convert mouseX to percentage within chart coordinates
    const chartX = mouseX - (paddingLeft * (rect.width / svgWidth));
    const chartRatio = chartX / (chartWidth * (rect.width / svgWidth));
    
    const N = selectedSprint.durationDays;
    let day = Math.round(chartRatio * N);
    day = Math.max(0, Math.min(N, day));

    setHoveredDay(day);
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  // Stats derivations
  const getSprintStats = () => {
    if (!selectedSprint) return { scope: 0, completed: 0, remaining: 0, status: 'N/A', statusColor: 'text-dark-400' };
    const scope = selectedSprint.totalEffort;
    const duration = selectedSprint.durationDays;

    // Get latest remaining effort
    let remaining = scope;
    let loggedDay = 0;
    
    selectedSprint.dailyRemaining.forEach((item) => {
      if (item.remaining !== null && item.remaining !== undefined) {
        remaining = item.remaining;
        loggedDay = item.day;
      }
    });

    const completed = scope - remaining;
    
    // Ideal remaining at this logged day
    const idealRemaining = scope - (loggedDay / duration) * scope;
    const delta = remaining - idealRemaining;

    let status = 'On Track';
    let statusColor = 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20';

    if (loggedDay === 0) {
      status = 'Sprint Initialized';
      statusColor = 'text-primary-500 bg-primary-500/10 border-primary-500/20';
    } else if (delta > 0) {
      status = 'Behind Schedule';
      statusColor = 'text-accent-rose bg-accent-rose/10 border-accent-rose/20';
    } else if (delta < 0) {
      status = 'Ahead of Schedule';
      statusColor = 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20';
    }

    const burnRate = loggedDay > 0 ? (completed / loggedDay).toFixed(1) : '0';
    const targetBurnRate = (scope / duration).toFixed(1);

    return {
      scope,
      completed,
      remaining,
      loggedDay,
      delta: Math.abs(delta).toFixed(1),
      status,
      statusColor,
      burnRate,
      targetBurnRate
    };
  };

  const stats = getSprintStats();

  // Draw lines
  const buildSvgPath = (points) => {
    if (points.length === 0) return '';
    return points.reduce((path, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
    }, '');
  };

  const buildAreaPath = (points) => {
    if (points.length === 0) return '';
    const linePath = buildSvgPath(points);
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    const groundY = paddingTop + chartHeight;
    return `${linePath} L ${lastPoint.x} ${groundY} L ${firstPoint.x} ${groundY} Z`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full flex flex-col gap-8 relative z-10 text-left">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-dark-800/60 pb-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white flex items-center gap-3">
            <TrendingDown className="text-primary-500" size={32} />
            <span>Sprint Burn Down Chart</span>
          </h1>
          <p className="text-xs text-dark-300">
            Visualize project velocity, monitor scope changes, and track team burn rates.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {sprints.length > 0 && (
            <div className="flex items-center gap-2">
              <label htmlFor="sprint-select" className="text-xs text-dark-400 font-semibold uppercase tracking-wider">Sprint:</label>
              <select
                id="sprint-select"
                value={selectedSprint?._id || ''}
                onChange={handleSprintSelect}
                className="bg-dark-800 border border-dark-700/60 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary-500/50 transition-all font-medium cursor-pointer"
              >
                {sprints.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchSprints(selectedSprint?._id)}
            className="h-9 w-9 p-0 border-dark-700 hover:bg-dark-800 text-dark-300 hover:text-white"
            aria-label="Refresh Sprints"
          >
            <RefreshCw size={14} />
          </Button>

          {selectedSprint && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteSprint}
              className="h-9 border-dark-700 text-dark-300 hover:text-accent-rose hover:border-accent-rose/30"
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="h-9 text-xs font-semibold gap-1.5"
          >
            <Plus size={14} />
            <span>New Sprint</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <Loader size="lg" text="Loading sprint details..." />
        </div>
      ) : error && sprints.length === 0 ? (
        <div className="min-h-[300px] flex items-center justify-center p-6">
          <ErrorMessage message={error} onRetry={() => fetchSprints()} />
        </div>
      ) : !selectedSprint ? (
        <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center gap-4 max-w-xl mx-auto border-dark-700/40">
          <div className="p-4 bg-primary-600/10 text-primary-500 rounded-full">
            <Flame size={32} />
          </div>
          <h3 className="font-display font-semibold text-lg text-white">No Sprints Configured</h3>
          <p className="text-xs text-dark-300 leading-relaxed">
            Configure your team's first sprint to visualize progress. Define sprint duration and target effort to populate the burn metrics.
          </p>
          <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)} className="mt-2 text-xs">
            <Plus size={14} />
            <span>Create First Sprint</span>
          </Button>
        </div>
      ) : (
        <>
          {/* Stats Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card rounded-2xl p-5 border-dark-700/40 flex flex-col gap-1 text-left relative overflow-hidden shadow-md">
              <span className="text-[10px] text-dark-400 font-bold uppercase tracking-wider">Total Effort</span>
              <span className="font-display font-extrabold text-2xl text-white mt-1">
                {stats.scope} <span className="text-xs font-normal text-dark-400">pts / hrs</span>
              </span>
              <span className="text-[10px] text-dark-300 leading-tight mt-1">Sprint target baseline</span>
            </div>

            <div className="glass-card rounded-2xl p-5 border-dark-700/40 flex flex-col gap-1 text-left relative overflow-hidden shadow-md">
              <span className="text-[10px] text-dark-400 font-bold uppercase tracking-wider">Remaining Effort</span>
              <span className="font-display font-extrabold text-2xl text-white mt-1">
                {stats.remaining} <span className="text-xs font-normal text-dark-400">pts / hrs</span>
              </span>
              <span className="text-[10px] text-dark-300 leading-tight mt-1">
                {stats.completed} burned ({Math.round((stats.completed / stats.scope) * 100)}% complete)
              </span>
            </div>

            <div className="glass-card rounded-2xl p-5 border-dark-700/40 flex flex-col gap-1 text-left relative overflow-hidden shadow-md">
              <span className="text-[10px] text-dark-400 font-bold uppercase tracking-wider">Burn Velocity</span>
              <span className="font-display font-extrabold text-2xl text-white mt-1">
                {stats.burnRate} <span className="text-xs font-normal text-dark-400">pts / day</span>
              </span>
              <span className="text-[10px] text-dark-300 leading-tight mt-1">
                Target: {stats.targetBurnRate} points per day
              </span>
            </div>

            <div className="glass-card rounded-2xl p-5 border-dark-700/40 flex flex-col gap-1 text-left relative overflow-hidden shadow-md">
              <span className="text-[10px] text-dark-400 font-bold uppercase tracking-wider">Sprint Status</span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${stats.statusColor}`}>
                  {stats.status}
                </span>
              </div>
              <span className="text-[10px] text-dark-300 leading-tight mt-2">
                {stats.loggedDay > 0 
                  ? stats.remaining === 0 
                    ? 'Sprint completed successfully!' 
                    : stats.status === 'Behind Schedule'
                      ? `${stats.delta} points behind ideal progress`
                      : `${stats.delta} points ahead of ideal progress`
                  : 'Log Day 1 to calculate deviation'
                }
              </span>
            </div>
          </div>

          {/* Main Visual Panels Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Chart Column */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="glass-card rounded-2xl p-6 border-dark-700/40 flex flex-col shadow-lg">
                <div className="flex items-center justify-between border-b border-dark-800 pb-4 mb-4">
                  <h3 className="font-display font-semibold text-base text-white">Visual Burn Down</h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-dark-400">
                    <div className="flex items-center gap-1.5">
                      <span className="h-0.5 w-6 bg-dark-500 border-t border-dashed" />
                      <span>Ideal Burn</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-4 bg-primary-500 rounded-full" />
                      <span>Actual Burn</span>
                    </div>
                  </div>
                </div>

                {/* SVG Visualizer Container */}
                <div className="relative w-full overflow-hidden bg-dark-900/10 rounded-xl">
                  <svg
                    ref={svgRef}
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    className="w-full h-auto select-none"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    <defs>
                      {/* Actual Area Chart Gradient */}
                      <linearGradient id="actualAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b76f6" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#3b76f6" stopOpacity="0.0" />
                      </linearGradient>

                      {/* Drop shadow filter for Actual Line */}
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#3b76f6" floodOpacity="0.2" />
                      </filter>
                    </defs>

                    {/* Y-Axis Horizontal Gridlines & Values */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                      const effortVal = Math.round(selectedSprint.totalEffort * ratio);
                      const y = paddingTop + (1 - ratio) * chartHeight;
                      return (
                        <g key={index}>
                          <line
                            x1={paddingLeft}
                            y1={y}
                            x2={svgWidth - paddingRight}
                            y2={y}
                            stroke="#27272a"
                            strokeWidth="1"
                            strokeDasharray={index === 0 ? "" : "4 6"}
                          />
                          <text
                            x={paddingLeft - 10}
                            y={y + 4}
                            textAnchor="end"
                            fill="#83858f"
                            fontSize="9"
                            fontFamily="Inter"
                            fontWeight="500"
                          >
                            {effortVal}
                          </text>
                        </g>
                      );
                    })}

                    {/* X-Axis Days Labels */}
                    {Array.from({ length: selectedSprint.durationDays + 1 }).map((_, d) => {
                      const N = selectedSprint.durationDays;
                      const x = paddingLeft + (d / N) * chartWidth;
                      
                      // Show all labels if duration is short, else every few days to avoid clutter
                      const shouldShow = N <= 12 || d === 0 || d === N || d % Math.ceil(N / 6) === 0;

                      return (
                        <g key={d}>
                          <line
                            x1={x}
                            y1={paddingTop}
                            x2={x}
                            y2={paddingTop + chartHeight}
                            stroke="#27272a"
                            strokeWidth="1"
                            strokeOpacity={0.4}
                          />
                          {shouldShow && (
                            <text
                              x={x}
                              y={paddingTop + chartHeight + 20}
                              textAnchor="middle"
                              fill="#83858f"
                              fontSize="9"
                              fontFamily="Inter"
                              fontWeight="600"
                            >
                              Day {d}
                            </text>
                          )}
                        </g>
                      );
                    })}

                    {/* Ideal Burn Line (Dashed) */}
                    <path
                      d={buildSvgPath(idealPoints)}
                      fill="none"
                      stroke="#83858f"
                      strokeWidth="1.5"
                      strokeDasharray="5 5"
                      strokeOpacity="0.75"
                    />

                    {/* Actual Burn Area (Gradient Filled) */}
                    {actualPoints.length > 0 && (
                      <path
                        d={buildAreaPath(actualPoints)}
                        fill="url(#actualAreaGrad)"
                      />
                    )}

                    {/* Actual Burn Line (Solid and glowing) */}
                    {actualPoints.length > 0 && (
                      <path
                        d={buildSvgPath(actualPoints)}
                        fill="none"
                        stroke="#3b76f6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glow)"
                      />
                    )}

                    {/* Ideal Line Hover Marker (Interactive Helper Dot) */}
                    {hoveredDay !== null && idealPoints[hoveredDay] && (
                      <circle
                        cx={idealPoints[hoveredDay].x}
                        cy={idealPoints[hoveredDay].y}
                        r="5"
                        fill="#83858f"
                        stroke="#18181b"
                        strokeWidth="2"
                      />
                    )}

                    {/* Actual Line Hover Marker (Interactive Helper Dot) */}
                    {hoveredDay !== null && actualPoints[hoveredDay] && actualPoints[hoveredDay].isLogged && (
                      <circle
                        cx={actualPoints[hoveredDay].x}
                        cy={actualPoints[hoveredDay].y}
                        r="6"
                        fill="#3b76f6"
                        stroke="#fff"
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                    )}

                    {/* Hover Vertical Guide Line */}
                    {hoveredDay !== null && (
                      <line
                        x1={paddingLeft + (hoveredDay / selectedSprint.durationDays) * chartWidth}
                        y1={paddingTop}
                        x2={paddingLeft + (hoveredDay / selectedSprint.durationDays) * chartWidth}
                        y2={paddingTop + chartHeight}
                        stroke="#3b76f6"
                        strokeWidth="1.5"
                        strokeDasharray="2 3"
                        strokeOpacity="0.7"
                      />
                    )}
                  </svg>

                  {/* HTML Overlay Tooltip inside SVG parent (absolute positioned) */}
                  <AnimatePresence>
                    {hoveredDay !== null && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-dark-800/95 border border-dark-700/80 rounded-xl px-4 py-2.5 flex gap-4 text-xs shadow-xl backdrop-blur-md"
                      >
                        <div className="flex flex-col text-left">
                          <span className="text-[10px] text-dark-400 font-bold uppercase tracking-wider">Point</span>
                          <span className="text-white font-semibold font-display">Day {hoveredDay}</span>
                        </div>
                        <div className="flex flex-col text-left border-l border-dark-700/60 pl-3">
                          <span className="text-[10px] text-dark-400 font-bold uppercase tracking-wider">Ideal</span>
                          <span className="text-dark-300 font-semibold">
                            {idealPoints[hoveredDay] ? idealPoints[hoveredDay].val.toFixed(1) : '0'}
                          </span>
                        </div>
                        <div className="flex flex-col text-left border-l border-dark-700/60 pl-3">
                          <span className="text-[10px] text-dark-400 font-bold uppercase tracking-wider">Actual</span>
                          <span className={`${
                            actualPoints[hoveredDay] && actualPoints[hoveredDay].isLogged 
                              ? 'text-primary-400 font-bold' 
                              : 'text-dark-400 italic'
                          }`}>
                            {actualPoints[hoveredDay] && actualPoints[hoveredDay].isLogged
                              ? actualPoints[hoveredDay].val
                              : 'Not logged'
                            }
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Explanatory Help Card */}
              <div className="glass-card rounded-2xl p-4 border-dark-700/40 bg-dark-800/10 flex items-start gap-3 text-xs leading-relaxed text-dark-300">
                <Info size={16} className="text-primary-500 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 text-left">
                  <span className="font-semibold text-white">How to read this chart</span>
                  <p>
                    The dashed line represents the <strong>Ideal Burn Line</strong>, demonstrating the linear rate needed to complete all sprint items by the deadline. The blue line represents the <strong>Actual Burn Line</strong>. If the blue line resides <strong>above</strong> the dashed line, the team is behind schedule. If it is <strong>below</strong>, you are completing story points faster than required.
                  </p>
                </div>
              </div>
            </div>

            {/* Daily Logger Table Column */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-2xl border-dark-700/40 overflow-hidden flex flex-col shadow-lg sticky top-24">
                
                <div className="p-5 border-b border-dark-800 bg-dark-950/20 flex items-center justify-between">
                  <div className="flex flex-col gap-0.5 text-left">
                    <h3 className="font-display font-semibold text-base text-white">Daily Effort Logger</h3>
                    <p className="text-[10px] text-dark-400 font-medium">Log the remaining effort at the end of each day.</p>
                  </div>
                  
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveDailyValues}
                    isLoading={saving}
                    className="h-8 text-[11px] font-bold px-3 uppercase tracking-wider gap-1"
                  >
                    <Check size={12} />
                    <span>Save Logs</span>
                  </Button>
                </div>

                {/* Day Logs Input Grid */}
                <div className="max-h-[380px] overflow-y-auto divide-y divide-dark-800/50">
                  {selectedSprint.dailyRemaining.map((item) => (
                    <div key={item.day} className="p-4 flex items-center justify-between hover:bg-dark-800/10 transition-colors">
                      <div className="flex flex-col text-left gap-0.5">
                        <span className="text-xs font-semibold text-white">Day {item.day}</span>
                        <span className="text-[10px] text-dark-400">
                          {item.day === 0 ? 'Sprint Launch' : `Sprint progress check`}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min="0"
                          max={selectedSprint.totalEffort * 1.5}
                          value={editingValues[item.day]}
                          placeholder="--"
                          onChange={(e) => handleDailyValueChange(item.day, e.target.value)}
                          className="w-16 h-8 text-center text-xs font-semibold bg-dark-800 border border-dark-700/60 rounded-lg text-white focus:outline-none focus:border-primary-500/50 transition-all"
                          aria-label={`Remaining effort for Day ${item.day}`}
                        />
                        <span className="text-[10px] text-dark-400 font-bold uppercase tracking-wider w-8">
                          {editingValues[item.day] !== '' ? 'pts' : 'empty'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* New Sprint Config Dialog Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
            />

            {/* Modal Card Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="glass-card rounded-2xl w-full max-w-md border-dark-700 shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-6 border-b border-dark-800 flex items-center justify-between bg-dark-900/30">
                <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <Flame className="text-primary-500" size={20} />
                  <span>Configure New Sprint</span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-dark-800 text-dark-400 hover:text-white rounded-lg transition-colors"
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateSprint} className="p-6 flex flex-col gap-5 text-left">
                <Input
                  label="Sprint Name"
                  placeholder="e.g. Sprint 3: Core API Integration"
                  value={newSprintName}
                  onChange={(e) => setNewSprintName(e.target.value)}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Duration (Days)"
                    type="number"
                    min="1"
                    max="60"
                    value={newSprintDuration}
                    onChange={(e) => setNewSprintDuration(parseInt(e.target.value) || 10)}
                    required
                  />

                  <Input
                    label="Total Baseline Effort"
                    type="number"
                    min="1"
                    max="1000"
                    value={newSprintEffort}
                    onChange={(e) => setNewSprintEffort(parseInt(e.target.value) || 50)}
                    required
                    helperText="In hours or story points"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-dark-800 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => setIsModalOpen(false)}
                    className="h-10 text-xs border-dark-700 text-dark-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="h-10 text-xs font-semibold"
                  >
                    Create Sprint
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
