import React, { useEffect, useState } from 'react';
import { Database, Search, Trash2, Calendar, Code, ChevronDown, ChevronUp, AlertCircle, RefreshCw } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import CodeViewer from '../components/CodeViewer';

export default function History({ API_BASE_URL }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [featureFilter, setFeatureFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/history`);
      if (!res.ok) throw new Error('Failed to fetch history logs.');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [API_BASE_URL]);

  const deleteItem = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this history log?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/history/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete item.');
      
      setHistory(history.filter(item => item.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      alert(`Error: {err.message}`);
    }
  };

  const clearAllHistory = async () => {
    if (!window.confirm('WARNING: This will permanently delete ALL items in your database history. Are you sure?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/history`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to clear database.');
      
      setHistory([]);
      setExpandedId(null);
    } catch (err) {
      alert(`Error: {err.message}`);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = 
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.code && item.code.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFeature = featureFilter === 'all' || item.feature === featureFilter;
    
    return matchesSearch && matchesFeature;
  });

  const getFeatureLabel = (feature) => {
    const labels = {
      generator: 'Generator',
      fixer: 'Bug Fixer',
      explainer: 'Explainer',
      optimizer: 'Optimizer',
      best_practices: 'Best Practices',
      syntax_detector: 'Syntax Error'
    };
    return labels[feature] || feature;
  };

  const getFeatureColor = (feature) => {
    const colors = {
      generator: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20 dark:border-cyan-500/30',
      fixer: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 dark:border-rose-500/30',
      explainer: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20 dark:border-violet-500/30',
      optimizer: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30',
      best_practices: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30',
      syntax_detector: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20 dark:border-indigo-500/30'
    };
    return colors[feature] || 'bg-slate-500/10 text-slate-655 dark:text-slate-400 border-slate-500/30';
  };

  return (
    <div className="space-y-6 py-4 relative">
      <div className="bg-glow-orb w-[300px] h-[300px] bg-cyan-900/10 dark:bg-cyan-900/10 bottom-10 left-10" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-950/5 dark:border-white/5 pb-6 animate-fadeIn">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
            Saved History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review past code generations and analysis reports</p>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearAllHistory}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-500 hover:text-white bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 hover:border-rose-500/40 rounded-xl transition-all duration-300 backdrop-blur-sm self-start md:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10 select-none">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search prompt inputs or code snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
          />
        </div>
        <div>
          <select
            value={featureFilter}
            onChange={(e) => setFeatureFilter(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-sm cursor-pointer font-semibold"
          >
            <option value="all">All Features</option>
            <option value="generator">AI Code Generator</option>
            <option value="fixer">Auto Bug Fixer</option>
            <option value="explainer">Algorithm Explainer</option>
            <option value="optimizer">Code Optimizer</option>
            <option value="best_practices">Best Practices</option>
            <option value="syntax_detector">Syntax Error Detector</option>
          </select>
        </div>
      </div>

      {/* History Items */}
      <div className="space-y-4 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <RefreshCw className="w-8 h-8 text-cyan-600 dark:text-cyan-400 animate-spin" />
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">Reading sqlite history table...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-semibold">{error}</p>
            <button
              onClick={fetchHistory}
              className="ml-auto text-xs underline font-bold hover:text-rose-800"
            >
              Retry
            </button>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-slate-950/5 dark:border-white/5 bg-white/40 dark:bg-white/5 backdrop-blur-sm">
            <Database className="w-12 h-12 text-slate-400 dark:text-slate-650 mx-auto mb-3" />
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white">No history items found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {history.length === 0 ? "You haven't run any tasks yet." : "No records match your filters."}
            </p>
          </div>
        ) : (
          filteredHistory.map((item) => {
            const isExpanded = expandedId === item.id;
            const res = item.response;

            return (
              <GlassCard
                key={item.id}
                onClick={() => toggleExpand(item.id)}
                className={`border border-slate-950/5 dark:border-white/5 p-4 transition-all duration-300 ${
                  isExpanded ? 'ring-1 ring-cyan-500/30 border-cyan-500/20 bg-slate-100/50 dark:bg-slate-900/35' : 'glass-panel-hover'
                }`}
              >
                {/* Collapsed Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getFeatureColor(item.feature)}`}>
                      {getFeatureLabel(item.feature)}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-slate-950/10 dark:border-white/10 bg-slate-200/50 dark:bg-white/5 text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      {item.language}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <button
                      onClick={(e) => deleteItem(item.id, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/10 transition-colors"
                      title="Delete log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {item.prompt || `Code analysis in ${item.language}`}
                  </p>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-5 border-t border-slate-950/5 dark:border-white/5 pt-5 space-y-6 animate-fadeIn">
                    {/* Prompt inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User Input Prompt</span>
                        <div className="p-3 rounded-lg bg-slate-100/60 dark:bg-white/5 border border-slate-950/5 dark:border-white/5 text-sm text-slate-700 dark:text-slate-300 font-medium">
                          {item.prompt || <em className="text-slate-500">No text input</em>}
                        </div>
                      </div>
                      {item.code && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Input Source Code</span>
                          <pre className="p-3 rounded-lg bg-slate-100/60 dark:bg-white/5 border border-slate-950/5 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 overflow-x-auto code-font max-h-36">
                            <code>{item.code}</code>
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* AI outputs layout */}
                    <div className="space-y-4">
                      {res.code && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-extrabold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Code className="w-3.5 h-3.5" />
                            Generated / Refactored Output
                          </h4>
                          <CodeViewer code={res.code} language={item.language} />
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {res.explanation && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-extrabold text-violet-600 dark:text-violet-400 uppercase tracking-wider">Explanation & Walkthrough</h4>
                            <div className="p-4 rounded-xl bg-slate-100/60 dark:bg-white/5 border border-slate-950/5 dark:border-white/5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
                              {res.explanation}
                            </div>
                          </div>
                        )}

                        <div className="space-y-4">
                          {/* Complexities */}
                          {(res.time_complexity || res.space_complexity) && (
                            <div className="grid grid-cols-2 gap-4">
                              {res.time_complexity && (
                                <div className="p-3 rounded-xl bg-slate-100/60 dark:bg-white/5 border border-slate-950/5 dark:border-white/5 space-y-1">
                                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Time Complexity</span>
                                  <div className="text-sm font-bold text-amber-600 dark:text-amber-400 code-font">{res.time_complexity}</div>
                                </div>
                              )}
                              {res.space_complexity && (
                                <div className="p-3 rounded-xl bg-slate-100/60 dark:bg-white/5 border border-slate-950/5 dark:border-white/5 space-y-1">
                                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Space Complexity</span>
                                  <div className="text-sm font-bold text-amber-600 dark:text-amber-400 code-font">{res.space_complexity}</div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Quality metrics */}
                          {res.best_practices && res.best_practices !== 'N/A' && res.best_practices !== 'NA' && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-450 uppercase tracking-wider">Best Practices & Guidelines</h4>
                              <div className="p-4 rounded-xl bg-slate-100/60 dark:bg-white/5 border border-slate-950/5 dark:border-white/5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                                {res.best_practices}
                              </div>
                            </div>
                          )}

                          {res.errors_fixed && res.errors_fixed !== 'N/A' && res.errors_fixed !== 'NA' && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-extrabold text-rose-600 dark:text-rose-455 uppercase tracking-wider">Errors Fixed & Findings</h4>
                              <div className="p-4 rounded-xl bg-slate-100/60 dark:bg-white/5 border border-slate-950/5 dark:border-white/5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                                {res.errors_fixed}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
}
