import React, { useState, useEffect } from 'react';
import { Home as HomeIcon, MessageSquareCode, History as HistoryIcon, Info, Terminal, Menu, X, Sun, Moon, LogOut, User } from 'lucide-react';
import Home from './pages/Home';
import AIChat from './pages/AIChat';
import History from './pages/History';
import About from './pages/About';
import Login from './pages/Login';

const API_BASE_URL = 'http://localhost:5000';

export default function App() {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')) || null);
  const [currentPage, setCurrentPage] = useState('home');
  const [inWorkspaceMode, setInWorkspaceMode] = useState(false);
  const [chatFeature, setChatFeature] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [authPageMode, setAuthPageMode] = useState(false); // false = signin, true = signup

  // Synchronize theme to document body class
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    setInWorkspaceMode(false);
    setCurrentPage('home');
  };

  // Centralized router with auth intercept guard
  const handleNavigate = (pageId, featureId = null, authMode = 'signin') => {
    if (pageId === 'chat' || pageId === 'history') {
      if (!user) {
        // Intercept navigation if unregistered, push to auth page
        setAuthPageMode(authMode === 'signup');
        setCurrentPage('auth');
        return;
      }
      setInWorkspaceMode(true);
    } else if (pageId === 'home') {
      setInWorkspaceMode(false);
    } else if (pageId === 'auth') {
      setAuthPageMode(authMode === 'signup');
    }

    setCurrentPage(pageId);
    if (featureId) {
      setChatFeature(featureId);
    } else {
      setChatFeature(null);
    }
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'chat', label: 'AI Chat', icon: MessageSquareCode },
    { id: 'history', label: 'History', icon: HistoryIcon },
    { id: 'about', label: 'About', icon: Info },
  ];

  // Render dedicated Login/Signup/Forgot screen if active
  if (currentPage === 'auth') {
    return (
      <Login
        onLoginSuccess={(userData) => {
          handleLoginSuccess(userData);
          // Auto launch workspace on successful login
          handleNavigate('chat');
        }}
        onBackToHome={() => handleNavigate('home')}
        initialSignUpMode={authPageMode}
      />
    );
  }

  // Sidebar visibility flags (shown only when authenticated and inside workspace views)
  const showSidebar = user !== null && inWorkspaceMode;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row relative overflow-hidden font-sans transition-colors duration-300">
      {/* Background gradient decorative nodes */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/5 dark:bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/5 dark:bg-indigo-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Sidebar for Desktop (only visible in Workspace Mode) */}
      {showSidebar && (
        <aside className="hidden md:flex flex-col w-64 bg-white/40 dark:bg-slate-950/60 border-r border-slate-950/5 dark:border-white/5 backdrop-blur-xl z-20 shrink-0 select-none">
          {/* Brand Logo Header */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-950/5 dark:border-white/5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white shadow-glow-cyan">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-wider bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent uppercase">
                DevPilot AI
              </h1>
              <span className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest leading-none">
                Workspace v1.0
              </span>
            </div>
          </div>

          {/* User profile summary */}
          <div className="px-6 py-4 flex items-center gap-3 border-b border-slate-950/5 dark:border-white/5">
            <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate leading-tight dark:text-white">{user?.name}</div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</div>
            </div>
          </div>

          {/* Sidebar Nav items */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-slate-200/50 dark:bg-white/10 text-slate-900 dark:text-white border-l-2 border-cyan-500 dark:border-cyan-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom controls panel */}
          <div className="p-4 border-t border-slate-950/5 dark:border-white/5 space-y-2.5">
            {/* Light / Dark Mode switch button */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-slate-950/5 dark:border-white/5 bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200/50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors"
            >
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            {/* User logout control */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-rose-500/10 dark:border-rose-500/5 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 dark:text-rose-400 text-xs font-bold transition-colors"
            >
              <span>Disconnect</span>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Mobile Header Bar (Only visible in Workspace Mode) */}
      {showSidebar && (
        <header className="sticky top-0 md:hidden flex items-center justify-between px-6 py-4 bg-white/40 dark:bg-slate-950/80 border-b border-slate-950/5 dark:border-white/5 backdrop-blur-xl z-30 select-none transition-colors duration-300">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <span className="text-sm font-extrabold tracking-wider text-slate-800 dark:text-white uppercase">DevPilot AI</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-950/5 dark:border-white/10 text-slate-600 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-950/5 dark:border-white/10 text-slate-600 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </header>
      )}

      {/* Mobile Drawer Menu (Only visible in Workspace Mode) */}
      {showSidebar && mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[61px] bg-slate-100/95 dark:bg-slate-950/95 backdrop-blur-xl z-20 flex flex-col p-6 space-y-3 animate-fadeIn">
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-950/5 dark:border-white/5 bg-slate-200/20 dark:bg-white/5">
            <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate leading-tight dark:text-white">{user?.name}</div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</div>
            </div>
          </div>

          <nav className="flex-grow space-y-2 pt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                    isActive ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20' : 'text-slate-500 dark:text-slate-400 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={handleLogout}
              className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-sm font-bold text-rose-500 border border-rose-500/20 bg-rose-500/5 mt-auto"
            >
              <LogOut className="w-5 h-5" />
              <span>Disconnect</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main viewport area */}
      <main className="flex-grow p-6 md:p-8 overflow-y-auto max-w-full relative z-10 flex flex-col min-h-screen">
        <div className="max-w-6xl mx-auto w-full flex-grow">
          {currentPage === 'home' && (
            <Home
              onNavigate={handleNavigate}
              theme={theme}
              user={user}
              onLogout={handleLogout}
              toggleTheme={toggleTheme}
            />
          )}
          {currentPage === 'chat' && (
            <AIChat API_BASE_URL={API_BASE_URL} preselectedFeature={chatFeature} />
          )}
          {currentPage === 'history' && <History API_BASE_URL={API_BASE_URL} />}
          {currentPage === 'about' && <About onNavigate={handleNavigate} />}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 pb-2 border-t border-slate-950/5 dark:border-white/5 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest select-none">
          all rights reserved by the DEVPILOT AI
        </footer>
      </main>
    </div>
  );
}
