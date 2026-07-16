import React, { useState, useEffect } from 'react';
import { Play, Code, BookOpen, AlertTriangle, ShieldCheck, Zap, Layers, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import CodeViewer from '../components/CodeViewer';

export default function AIChat({ API_BASE_URL, preselectedFeature }) {
  const [feature, setFeature] = useState('generator');
  const [language, setLanguage] = useState('python');
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('code');
  const [error, setError] = useState(null);

  // Sync with home selections
  useEffect(() => {
    if (preselectedFeature) {
      setFeature(preselectedFeature);
      setPrompt('');
      setCode('');
      setResult(null);
      setError(null);
    }
  }, [preselectedFeature]);

  const handleFeatureChange = (featId) => {
    setFeature(featId);
    setResult(null);
    setError(null);
    if (featId === 'generator') {
      setPrompt('Write code for Binary Search');
      setCode('');
    } else if (featId === 'explainer') {
      setPrompt('Explain Merge Sort');
      setCode('');
    } else if (featId === 'syntax_detector') {
      setPrompt('Check this code for errors');
      setCode('if x>5\nprint(x)');
    } else {
      setPrompt('');
      setCode('');
    }
  };

  const languages = [
    { value: 'python', label: 'Python' },
    { value: 'cpp', label: 'C++' },
    { value: 'java', label: 'Java' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'sql', label: 'SQL' }
  ];

  const featuresList = [
    { id: 'generator', label: 'Code Generator', icon: Code, desc: 'Describe what to write' },
    { id: 'fixer', label: 'Bug Fixer', icon: AlertTriangle, desc: 'Find and repair bugs' },
    { id: 'explainer', label: 'Algorithm Explainer', icon: BookOpen, desc: 'Explain & dry run algorithms' },
    { id: 'optimizer', label: 'Code Optimizer', icon: Zap, desc: 'Optimize code performance' },
    { id: 'best_practices', label: 'Best Practices', icon: ShieldCheck, desc: 'Review styling & patterns' },
    { id: 'syntax_detector', label: 'Syntax Detector', icon: Layers, desc: 'Fix indentation & brackets' }
  ];

  const showCodeInput = ['fixer', 'optimizer', 'best_practices', 'syntax_detector'].includes(feature);
  const showPromptInput = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() && !code.trim()) {
      setError('Please provide a prompt or paste some code before submitting.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          feature,
          language,
          prompt,
          code
        })
      });

      if (!res.ok) {
        throw new Error('API server returned an error response.');
      }

      const data = await res.json();
      setResult(data.response);
      
      if (data.response.code) {
        setActiveTab('code');
      } else if (data.response.explanation) {
        setActiveTab('explanation');
      } else {
        setActiveTab('insights');
      }

    } catch (err) {
      setError(err.message || 'Could not connect to Flask API server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 py-4 relative">
      <div className="bg-glow-orb w-[400px] h-[400px] bg-indigo-900/10 dark:bg-indigo-900/10 top-1/4 left-10" />

      {/* Feature Selector Sidebar */}
      <div className="xl:col-span-4 space-y-6 relative z-10">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white border-l-2 border-cyan-500 pl-3 select-none">Select Workspace Feature</h2>
        <div className="grid grid-cols-2 xl:grid-cols-1 gap-3">
          {featuresList.map((feat) => {
            const Icon = feat.icon;
            const isSelected = feature === feat.id;
            return (
              <button
                key={feat.id}
                onClick={() => handleFeatureChange(feat.id)}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-300 ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-500/15 dark:bg-cyan-500/10 text-cyan-700 dark:text-white shadow-glow-cyan'
                    : 'border-slate-950/5 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-950/15 dark:hover:border-white/10'
                }`}
              >
                <div className={`p-2 rounded-lg transition-colors ${
                  isSelected 
                    ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300' 
                    : 'bg-slate-200/50 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold leading-normal truncate">{feat.label}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{feat.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Configuration settings card */}
        <GlassCard className="p-4 space-y-4 border border-slate-950/5 dark:border-white/5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Programming Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-semibold cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </GlassCard>
      </div>

      {/* Input / Output Workspace Panel */}
      <div className="xl:col-span-8 space-y-6 relative z-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <GlassCard className="space-y-4 border border-slate-950/5 dark:border-white/5">
            {showPromptInput && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {feature === 'generator' && 'Code Requirements / Instructions'}
                  {feature === 'explainer' && 'Algorithm / Topic to Explain'}
                  {['fixer', 'optimizer', 'best_practices', 'syntax_detector'].includes(feature) && 'Guidance / Notes (Optional)'}
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    feature === 'generator' ? 'e.g. Write Python code for Binary Search' :
                    feature === 'explainer' ? 'e.g. Explain Merge Sort step-by-step with dry run' :
                    'e.g. Optimize this function to reduce memory use, or explain what is wrong...'
                  }
                  rows={2}
                  className="w-full p-3.5 rounded-xl glass-input text-sm resize-y leading-relaxed"
                />
              </div>
            )}

            {showCodeInput && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Source Code paste area</label>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="// Paste your source code here..."
                  rows={8}
                  className="w-full p-3.5 rounded-xl glass-input text-xs font-mono resize-y leading-relaxed"
                />
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-450 text-xs font-bold select-none">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-950/5 dark:border-white/5">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider select-none">
                Model: Automatic Key Selection
              </span>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 disabled:from-cyan-500/40 disabled:to-indigo-500/40 text-white font-semibold text-xs shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 active:scale-95 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing with AI...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Analyze Code</span>
                  </>
                )}
              </button>
            </div>
          </GlassCard>
        </form>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white/40 dark:bg-white/5 border border-slate-200/40 dark:border-white/5 rounded-2xl backdrop-blur-md">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border border-cyan-500/30 border-t-cyan-500 dark:border-t-cyan-400 animate-spin" />
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400 absolute animate-pulse" />
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-2">Computing structured metrics...</p>
            <p className="text-xs text-slate-500">Retrieving syntax fixes, complexity details, and explanations</p>
          </div>
        )}

        {result && (
          <GlassCard className="space-y-6 border border-cyan-500/20 shadow-glow-cyan">
            <div className="flex items-center justify-between border-b border-slate-950/5 dark:border-white/5 pb-4 select-none">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Analysis Ready</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-cyan-500/35 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                {language}
              </span>
            </div>

            {/* Results Tabs Header */}
            <div className="flex border-b border-slate-950/5 dark:border-white/5 select-none overflow-x-auto gap-2 pb-px scrollbar-none">
              {result.code && (
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-4 py-2 border-b-2 font-bold text-xs transition-colors shrink-0 ${
                    activeTab === 'code' ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Code Output
                </button>
              )}
              {result.explanation && (
                <button
                  onClick={() => setActiveTab('explanation')}
                  className={`px-4 py-2 border-b-2 font-bold text-xs transition-colors shrink-0 ${
                    activeTab === 'explanation' ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Explanation
                </button>
              )}
              {(result.time_complexity || result.space_complexity) && (
                <button
                  onClick={() => setActiveTab('complexity')}
                  className={`px-4 py-2 border-b-2 font-bold text-xs transition-colors shrink-0 ${
                    activeTab === 'complexity' ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Complexity
                </button>
              )}
              {((result.best_practices && result.best_practices !== 'N/A' && result.best_practices !== 'NA') ||
                (result.errors_fixed && result.errors_fixed !== 'N/A' && result.errors_fixed !== 'NA')) && (
                <button
                  onClick={() => setActiveTab('insights')}
                  className={`px-4 py-2 border-b-2 font-bold text-xs transition-colors shrink-0 ${
                    activeTab === 'insights' ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Insights & Review
                </button>
              )}
            </div>

            {/* Tab content area */}
            <div className="pt-2">
              {activeTab === 'code' && result.code && (
                <div className="space-y-3">
                  <CodeViewer code={result.code} language={language} />
                </div>
              )}

              {activeTab === 'explanation' && result.explanation && (
                <div className="p-4 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-950/5 dark:border-white/5 text-sm text-slate-700 dark:text-slate-350 leading-relaxed whitespace-pre-wrap">
                  {result.explanation}
                </div>
              )}

              {activeTab === 'complexity' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.time_complexity && (
                    <div className="p-4 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-950/5 dark:border-white/5 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Time Complexity</span>
                      <div className="text-lg font-bold text-amber-600 dark:text-amber-400 code-font">{result.time_complexity}</div>
                    </div>
                  )}
                  {result.space_complexity && (
                    <div className="p-4 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-950/5 dark:border-white/5 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Space Complexity</span>
                      <div className="text-lg font-bold text-amber-600 dark:text-amber-400 code-font">{result.space_complexity}</div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'insights' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.best_practices && result.best_practices !== 'N/A' && result.best_practices !== 'NA' && (
                    <div className="p-4 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-950/5 dark:border-white/5 space-y-2">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-450 uppercase tracking-wider">Best Practices</span>
                      <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {result.best_practices}
                      </div>
                    </div>
                  )}
                  {result.errors_fixed && result.errors_fixed !== 'N/A' && result.errors_fixed !== 'NA' && (
                    <div className="p-4 rounded-xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-950/5 dark:border-white/5 space-y-2">
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-450 uppercase tracking-wider">Errors Fixed</span>
                      <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {result.errors_fixed}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
