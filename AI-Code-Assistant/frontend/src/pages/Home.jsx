import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sun, Moon, User, LogOut, Terminal, BookOpen } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import PremiumCodeCanvas from '../components/PremiumCodeCanvas';
import TechIcon from '../components/TechIcon';

function DecorativeCodeBlock({ lines, className }) {
  return (
    <pre className={`hidden lg:flex font-mono text-[9px] leading-relaxed absolute pointer-events-none select-none border border-slate-950/5 dark:border-white/5 bg-white/20 dark:bg-white/5 p-3 rounded-lg backdrop-blur-xs transition-colors duration-300 z-0 ${className}`}>
      {/* Line Numbers */}
      <div className="text-slate-400 dark:text-slate-650 text-right pr-2 border-r border-slate-950/10 dark:border-white/5 mr-2 shrink-0 select-none">
        {lines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      {/* Code Text */}
      <div className="text-slate-700 dark:text-slate-300">
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </pre>
  );
}

export default function Home({ onNavigate, theme, user, onLogout, toggleTheme }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cardTilts, setCardTilts] = useState({});

  // Capture mouse coordinates for follow glow light
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Perform card 3D tilt calculations
  const handleCardMouseMove = (id, e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const rotateX = ((rect.height / 2 - y) / (rect.height / 2)) * 10;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;

    setCardTilts(prev => ({
      ...prev,
      [id]: { rotateX, rotateY }
    }));
  };

  const handleCardMouseLeave = (id) => {
    setCardTilts(prev => ({
      ...prev,
      [id]: { rotateX: 0, rotateY: 0 }
    }));
  };

  // Handle CTA navigations checking user login status
  const handleCtaClick = (targetPage, featureId = null) => {
    if (!user) {
      // Redirect to Auth SignIn page
      onNavigate('auth', null, 'signin');
    } else {
      // Access Workspace AI Chat directly
      onNavigate(targetPage, featureId);
    }
  };

  const features = [
    {
      id: 'generator',
      title: 'AI Code Generator',
      description: 'Generate optimized, commented code in any language from natural language descriptions.',
      color: 'text-cyan-600 dark:text-cyan-400 border-slate-200/60 dark:border-white/5 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 shadow-sm dark:hover:shadow-glow-cyan',
      gradient: 'from-cyan-500/10 dark:from-cyan-500/15 to-indigo-500/5',
      badge: 'Create'
    },
    {
      id: 'fixer',
      title: 'Auto Bug Fixer',
      description: 'Paste broken code and let the AI find the bug, explain what was wrong, and fix it instantly.',
      color: 'text-rose-600 dark:text-rose-400 border-slate-200/60 dark:border-white/5 hover:border-rose-500/50 dark:hover:border-rose-400/50 shadow-sm dark:hover:shadow-glow-indigo',
      gradient: 'from-rose-500/10 dark:from-rose-500/15 to-red-500/5',
      badge: 'Debug'
    },
    {
      id: 'explainer',
      title: 'Algorithm Explainer',
      description: 'Get step-by-step explanations, dry runs, complexities, and real-world applications of algorithms.',
      color: 'text-violet-600 dark:text-violet-400 border-slate-200/60 dark:border-white/5 hover:border-violet-500/50 dark:hover:border-violet-400/50 shadow-sm',
      gradient: 'from-violet-500/10 dark:from-violet-500/15 to-purple-500/5',
      badge: 'Learn'
    },
    {
      id: 'optimizer',
      title: 'Code Optimizer',
      description: 'Analyze execution bottlenecks and generate high-performance equivalents with comparisons.',
      color: 'text-amber-600 dark:text-amber-400 border-slate-200/60 dark:border-white/5 hover:border-amber-500/50 dark:hover:border-amber-400/50 shadow-sm',
      gradient: 'from-amber-500/10 dark:from-amber-500/15 to-orange-500/5',
      badge: 'Optimize'
    },
    {
      id: 'best_practices',
      title: 'Best Practices',
      description: 'Ensure code quality by checking variable naming, duplicate logic, SOLID design, and exceptions.',
      color: 'text-emerald-600 dark:text-emerald-400 border-slate-200/60 dark:border-white/5 hover:border-emerald-500/50 dark:hover:border-emerald-400/50 shadow-sm',
      gradient: 'from-emerald-500/10 dark:from-emerald-500/15 to-teal-500/5',
      badge: 'Review'
    },
    {
      id: 'syntax_detector',
      title: 'Syntax Error Detector',
      description: 'Detect missing semicolons, incorrect indentation, matching braces, and fix syntax errors.',
      color: 'text-indigo-600 dark:text-indigo-400 border-slate-200/60 dark:border-white/5 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 shadow-sm',
      gradient: 'from-indigo-500/10 dark:from-indigo-500/15 to-blue-500/5',
      badge: 'Detect'
    }
  ];

  // Raw lines for backdrop layout decorative panels
  const pythonBS = [
    '# Python',
    'def binary_search(arr, target):',
    '    low, high = 0, len(arr) - 1',
    '    while low <= high:',
    '        mid = (low + high) // 2',
    '        if arr[mid] == target:',
    '            return mid',
    '        elif arr[mid] < target:',
    '            low = mid + 1',
    '        else:',
    '            high = mid - 1',
    '    return -1'
  ];

  const cppFact = [
    '// C++',
    '#include <iostream>',
    'using namespace std;',
    'int main() {',
    '    int n, fact = 1;',
    '    cout << "Enter a number: ";',
    '    cin >> n;',
    '    for(int i = 1; i <= n; ++i) {',
    '        fact *= i;',
    '    }',
    '    cout << fact << endl;',
    '}'
  ];

  const javaHW = [
    '/* Java */',
    'public class HelloWorld {',
    '    public static void main(String[] args) {',
    '        System.out.println("Hello, World!");',
    '    }',
    '}'
  ];

  const jsFib = [
    '// JavaScript',
    'function fibonacci(n) {',
    '    if (n <= 1) return n;',
    '    return fibonacci(n - 1) + fibonacci(n - 2);',
    '}',
    'console.log(fibonacci(10));'
  ];

  const cppVector = [
    '#include <bits/stdc++.h>',
    'using namespace std;',
    'int main() {',
    '    int n;',
    '    cin >> n;',
    '    vector<int> v(n);',
    '    for(int i = 0; i < n; i++)',
    '        cin >> v[i];',
    '    sort(v.begin(), v.end());',
    '    return 0;',
    '}'
  ];

  const sqlQuery = [
    '-- SQL Query',
    'SELECT name, salary',
    'FROM employees',
    'WHERE salary > 50000',
    'ORDER BY salary DESC;'
  ];

  const pythonLoop = [
    '# Python',
    'for i in range(1, 6):',
    '    for j in range(1, i + 1):',
    '        print("*", end=" ")',
    '    print()'
  ];

  // Framer Motion entry coordinates
  const navbarVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  const titleVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.65, ease: 'easeOut' }
    }
  };

  const subtitleVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.65, ease: 'easeOut', delay: 0.25 }
    }
  };

  const buttonGroupVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut', delay: 0.45 }
    }
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 14 }
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="space-y-16 py-4 relative min-h-screen flex flex-col"
    >
      {/* Premium Code Canvas background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 rounded-3xl">
        <PremiumCodeCanvas theme={theme} />
      </div>

      {/* Mouse Follow Glow radial lighting overlay */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 transition-opacity duration-500 opacity-60 dark:opacity-100 rounded-3xl"
        style={{
          background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, ${
            theme === 'dark' ? 'rgba(99, 102, 241, 0.09)' : 'rgba(99, 102, 241, 0.04)'
          }, transparent 50%)`
        }}
      />

      {/* Sticky Glassmorphic Top Navbar */}
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 rounded-2xl glass-panel border border-slate-950/10 dark:border-white/10 shadow-sm"
      >
        <div className="flex items-center gap-2 select-none cursor-pointer" onClick={() => onNavigate('home')}>
          <Terminal className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <span className="text-sm font-extrabold tracking-wider text-slate-800 dark:text-white uppercase">DevPilot AI</span>
        </div>

        {/* Navigation Sections */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('about')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors uppercase tracking-wider"
          >
            <BookOpen className="w-4 h-4" />
            <span>About</span>
          </button>
        </div>

        {/* Auth & Mode Controls */}
        <div className="flex items-center gap-3">
          {/* Mode Switch Button at the top */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100/50 hover:bg-slate-200/50 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-950/10 dark:border-white/10 text-slate-655 dark:text-slate-300 transition-all active:scale-95"
            title="Toggle theme mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>

          {user ? (
            /* User profile indicator if signed in */
            <div className="flex items-center gap-3.5 pl-3 border-l border-slate-950/10 dark:border-white/10">
              <div className="flex items-center gap-2 p-1.5 px-3.5 rounded-xl border border-slate-950/10 dark:border-white/10 bg-slate-200/30 dark:bg-white/5 text-slate-700 dark:text-slate-300">
                <User className="w-3.5 h-3.5" />
                <span className="text-xs font-bold truncate max-w-[85px]">{user.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 text-rose-500 transition-all active:scale-95"
                title="Disconnect"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Sign In / Sign Up controls if unregistered */
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-950/10 dark:border-white/10">
              <button
                onClick={() => onNavigate('auth', null, 'signin')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('auth', null, 'signup')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 transition-all shadow-md active:scale-95"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </motion.nav>

      {/* Floating Tech Icons bobbing around the hero area (higher contrast opacity inside Light Mode) */}
      <TechIcon name="Python" className="top-[18%] left-[8%] animate-float-1 opacity-65 dark:opacity-80" />
      <TechIcon name="Java" className="top-[32%] left-[3%] animate-float-3 opacity-65 dark:opacity-80" />
      <TechIcon name="C++" className="top-[18%] right-[10%] animate-float-2 opacity-65 dark:opacity-80" />
      <TechIcon name="JavaScript" className="top-[34%] right-[4%] animate-float-4 opacity-65 dark:opacity-80" />
      <TechIcon name="React" className="top-[48%] left-[4%] animate-float-2 opacity-65 dark:opacity-80" />
      <TechIcon name="Node.js" className="top-[46%] right-[6%] animate-float-1 opacity-65 dark:opacity-80" />
      <TechIcon name="Flask" className="bottom-[18%] left-[25%] animate-float-3 opacity-65 dark:opacity-80" />
      <TechIcon name="Git" className="bottom-[15%] right-[22%] animate-float-4 opacity-65 dark:opacity-80" />
      <TechIcon name="GitHub" className="top-[12%] left-[45%] animate-float-4 opacity-65 dark:opacity-80" />
      <TechIcon name="Docker" className="bottom-[6%] left-[12%] animate-float-1 opacity-65 dark:opacity-80" />
      <TechIcon name="TensorFlow" className="bottom-[10%] right-[12%] animate-float-2 opacity-65 dark:opacity-80" />
      <TechIcon name="OpenAI" className="top-[38%] left-[48%] animate-float-3 opacity-65 dark:opacity-80" />

      {/* Floating Code Panels (higher opacity inside Light Mode) */}
      <DecorativeCodeBlock
        lines={pythonBS}
        className="top-[18%] left-[2%] text-cyan-600 dark:text-cyan-400 opacity-40 dark:opacity-25 animate-float-1"
      />
      <DecorativeCodeBlock
        lines={cppFact}
        className="top-[20%] right-[2%] text-emerald-600 dark:text-emerald-400 opacity-40 dark:opacity-25 animate-float-2"
      />
      <DecorativeCodeBlock
        lines={javaHW}
        className="top-[44%] left-[2%] text-rose-600 dark:text-rose-400 opacity-35 dark:opacity-20 animate-float-3"
      />
      <DecorativeCodeBlock
        lines={jsFib}
        className="top-[48%] right-[2%] text-amber-600 dark:text-amber-400 opacity-35 dark:opacity-20 animate-float-4"
      />
      <DecorativeCodeBlock
        lines={cppVector}
        className="bottom-[18%] left-[2%] text-cyan-600 dark:text-cyan-400 opacity-40 dark:opacity-25 animate-float-2"
      />
      <DecorativeCodeBlock
        lines={sqlQuery}
        className="bottom-[8%] left-[34%] text-sky-600 dark:text-sky-400 opacity-40 dark:opacity-25 animate-float-1"
      />
      <DecorativeCodeBlock
        lines={pythonLoop}
        className="bottom-[12%] right-[2%] text-emerald-700 dark:text-lime-400 opacity-40 dark:opacity-25 animate-float-3"
      />

      {/* Subtle neon backdrop meshes */}
      <div className="bg-glow-orb w-[300px] h-[300px] bg-cyan-500/10 dark:bg-cyan-600/10 top-10 left-10 -z-20" />
      <div className="bg-glow-orb w-[350px] h-[350px] bg-indigo-500/10 dark:bg-indigo-600/10 bottom-10 right-10 -z-20" />

      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto relative z-10 select-none pt-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={titleVariants}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 dark:bg-white/5 border border-slate-950/10 dark:border-white/10 backdrop-blur-md shadow-sm"
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-705 dark:text-slate-300 tracking-wider uppercase">Next-Gen Code Companion</span>
        </motion.div>
        
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={titleVariants}
          className="text-5xl md:text-6xl font-extrabold tracking-wide bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent drop-shadow-sm"
        >
          Code Smarter, Faster, and Better
        </motion.h1>
        
        <motion.p
          initial="hidden"
          animate="visible"
          variants={subtitleVariants}
          className="text-base md:text-lg text-slate-700 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto"
        >
          An intelligent engineering assistant designed to generate, debug, explain, optimize, and review code across multiple languages with premium visual analysis.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={buttonGroupVariants}
          className="flex justify-center gap-4 pt-4"
        >
          {/* Launch workspace button */}
          <button
            onClick={() => handleCtaClick('chat')}
            className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-cyan-500/20 hover:scale-105 active:scale-95"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
          
          <button
            onClick={() => onNavigate('about')}
            className="px-6 py-3 rounded-xl bg-slate-200/50 hover:bg-slate-200/80 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-950/10 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 backdrop-blur-md hover:scale-105 active:scale-95"
          >
            Explore Tech Stack
          </button>
        </motion.div>
      </div>

      {/* Feature Grid */}
      <div className="space-y-6 relative z-10 flex-grow">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-950/5 dark:border-white/5 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Features Dashboard</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Select a specialized model feature to begin your task</p>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={gridVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feat) => {
            const tilt = cardTilts[feat.id] || { rotateX: 0, rotateY: 0 };
            return (
              <motion.div
                key={feat.id}
                variants={cardVariants}
                className="perspective-1000"
              >
                <GlassCard
                  onClick={() => handleCtaClick('chat', feat.id)}
                  onMouseMove={(e) => handleCardMouseMove(feat.id, e)}
                  onMouseLeave={() => handleCardMouseLeave(feat.id)}
                  style={{
                    transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                    transition: 'transform 0.15s ease-out, border-color 0.3s, background-color 0.3s'
                  }}
                  className={`relative group overflow-hidden border ${feat.color}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
                  
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-slate-900/5 dark:bg-white/5 border border-slate-950/10 dark:border-white/10 text-slate-550 dark:text-slate-400 px-2 py-0.5 rounded-full">
                      {feat.badge}
                    </span>
                  </div>

                  <div className="mt-5 space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
