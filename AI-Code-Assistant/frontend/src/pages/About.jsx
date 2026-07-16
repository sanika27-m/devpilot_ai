import React from 'react';
import { Database, ShieldCheck, Cpu, Code2, Server, HelpCircle, ArrowLeft } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function About({ onNavigate }) {
  const stack = [
    {
      name: 'Frontend Framework',
      tech: 'React.js (Vite)',
      desc: 'Highly responsive Single Page Application with interactive states and layout transitions.',
      icon: Code2,
      color: 'text-cyan-600 dark:text-cyan-400'
    },
    {
      name: 'Design & Styling',
      tech: 'Tailwind CSS',
      desc: 'Custom styling framework configured with glassmorphic variables, dark mode defaults, and layouts.',
      icon: ShieldCheck,
      color: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      name: 'Backend Web Server',
      tech: 'Python Flask',
      desc: 'REST API service handling CORS protocols and modular route bindings for database and AI interactions.',
      icon: Server,
      color: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      name: 'Structured Database',
      tech: 'SQLite3',
      desc: 'Local SQLite database storing chat queries, custom prompt parameters, and full AI structured responses.',
      icon: Database,
      color: 'text-amber-600 dark:text-amber-400'
    },
    {
      name: 'AI Engine Integration',
      tech: 'OpenAI SDK / Google Gemini',
      desc: 'Intelligent AI model client with automatic detection of Gemini developer keys via standard API bindings.',
      icon: Cpu,
      color: 'text-violet-650 dark:text-violet-400'
    }
  ];

  return (
    <div className="space-y-10 py-4 relative">
      {/* Background blobs */}
      <div className="bg-glow-orb w-[300px] h-[300px] bg-violet-600/10 dark:bg-violet-600/15 top-20 right-10" />
      <div className="bg-glow-orb w-[350px] h-[350px] bg-cyan-800/10 dark:bg-cyan-800/15 bottom-10 left-10" />

      {/* Navigation Return Button */}
      {onNavigate && (
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors select-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      )}

      {/* Header */}
      <div className="border-b border-slate-950/5 dark:border-white/5 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">About Code Assistant</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Under the hood of the AI-powered developer toolkit</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Left column: Overview */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              What is AI Code Assistant?
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
              AI Code Assistant is a premium developer platform designed to aid software engineers, students, and system architects. By consolidating multiple coding needs—like error detection, performance optimization, best practices recommendations, and documentation generation—into a single glassmorphic workspace, it streamlines coding workflows and reduces context-switching.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
              The project is designed to be fully self-contained. The React frontend interacts with a Flask web API backend, which maintains a local chat history database in SQLite and connects to top-tier AI LLMs to process prompts.
            </p>
          </GlassCard>

          <GlassCard className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              Universal Key Auto-Detection
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
              The backend includes a smart API handler that automatically identifies the format of your loaded API Key:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-400 pl-2">
              <li>
                <strong className="text-slate-800 dark:text-slate-200">Google Gemini Key Format</strong> (<code className="text-cyan-750 dark:text-cyan-400">AQ.</code> / <code className="text-cyan-750 dark:text-cyan-400">AIzaSy</code>): Configures the client to connect to Google's official OpenAI-compatible endpoint with <code className="text-slate-750 dark:text-slate-300">gemini-3.1-flash-lite</code>.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">OpenAI Key Format</strong> (<code className="text-slate-800 dark:text-slate-200">sk-...</code>): Points directly to OpenAI's official completions endpoint using <code className="text-slate-700 dark:text-slate-300">gpt-4o-mini</code>.
              </li>
            </ul>
            <p className="text-slate-500 dark:text-slate-500 leading-relaxed text-xs">
              This zero-config solution allows you to switch API keys in your <code className="text-slate-700 dark:text-slate-300">.env</code> file without rewriting backend integration code.
            </p>
          </GlassCard>
        </div>

        {/* Right column: Tech Stack list */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-l-2 border-cyan-500 pl-3">Architecture & Stack</h2>
          <div className="space-y-4">
            {stack.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex gap-4 p-4 rounded-xl bg-slate-100/50 dark:bg-white/5 border border-slate-950/5 dark:border-white/5 backdrop-blur-md"
                >
                  <div className={`p-2.5 rounded-lg bg-slate-205/50 dark:bg-white/5 border border-slate-950/10 dark:border-white/10 ${item.color} h-fit`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h4>
                    <span className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 leading-none block">
                      {item.tech}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
