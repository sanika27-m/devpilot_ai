import React, { useState, useEffect } from 'react';
import { Terminal, Lock, Mail, User, Eye, EyeOff, KeyRound, RefreshCw, CheckCircle2, ArrowLeft } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function Login({ onLoginSuccess, onBackToHome, initialSignUpMode = false }) {
  const [isSignUp, setIsSignUp] = useState(initialSignUpMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Forgot password form states
  const [forgotPassword, setForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryError, setRecoveryError] = useState(null);
  const [recoverySuccess, setRecoverySuccess] = useState(null);

  // Sync state if initialSignUpMode prop changes
  useEffect(() => {
    setIsSignUp(initialSignUpMode);
  }, [initialSignUpMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email || !password || (isSignUp && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Read users array from localStorage
      const users = JSON.parse(localStorage.getItem('devpilot_users') || '[]');

      if (isSignUp) {
        // Sign Up Validation
        const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (userExists) {
          setError('An account with this email already exists.');
          setLoading(false);
          return;
        }

        // Add user
        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem('devpilot_users', JSON.stringify(users));

        setSuccessMessage('Account created successfully! Please sign in with your credentials.');
        setIsSignUp(false); // Flip to login mode
        setPassword('');    // Reset password field for input
        setLoading(false);
      } else {
        // Sign In Validation
        const matchedUser = users.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!matchedUser) {
          setError('Access denied. Incorrect password or email has not been registered yet.');
          setLoading(false);
          return;
        }

        setLoading(false);
        onLoginSuccess({ email: matchedUser.email, name: matchedUser.name });
      }
    }, 1000);
  };

  const handleRecoverPassword = (e) => {
    e.preventDefault();
    setRecoveryError(null);
    setRecoverySuccess(null);

    if (!recoveryEmail) {
      setRecoveryError('Please fill in your email address.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('devpilot_users') || '[]');
      const matchedUser = users.find(u => u.email.toLowerCase() === recoveryEmail.toLowerCase());

      setLoading(false);

      if (!matchedUser) {
        setRecoveryError('No registered account was found with this email address.');
      } else {
        setRecoverySuccess(`Account recovered! Your password is: "${matchedUser.password}"`);
      }
    }, 800);
  };

  const handleModeSwitch = () => {
    setIsSignUp(!isSignUp);
    setForgotPassword(false);
    setError(null);
    setSuccessMessage(null);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Background neon orbs */}
      <div className="bg-glow-orb w-[280px] h-[280px] bg-cyan-700/10 dark:bg-cyan-700/20 top-1/4 left-1/4" />
      <div className="bg-glow-orb w-[300px] h-[300px] bg-indigo-700/10 dark:bg-indigo-700/20 bottom-1/4 right-1/4" />

      <GlassCard className="w-full max-w-md border border-slate-200/5 dark:border-white/5 p-8 rounded-3xl relative z-10 space-y-6 shadow-2xl">
        
        {/* Back navigation button - handles previous page redirects inside authentication flow */}
        <button
          onClick={() => {
            if (forgotPassword) {
              setForgotPassword(false);
              setRecoveryError(null);
              setRecoverySuccess(null);
            } else {
              onBackToHome();
            }
          }}
          className="absolute left-6 top-6 flex items-center gap-1.5 text-xs font-bold text-slate-650 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        {/* Brand header */}
        <div className="text-center space-y-2 select-none pt-4">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white shadow-glow-cyan">
            <Terminal className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-widest bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent uppercase mt-2">
            DEVPILOT AI
          </h1>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
            Workspace Gateway
          </p>
        </div>

        {/* Forgot Password View */}
        {forgotPassword ? (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300">Recover Account Password</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Enter your registered email address below</p>
            </div>

            <form onSubmit={handleRecoverPassword} className="space-y-4">
              {recoveryError && (
                <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-455 font-semibold select-none">
                  {recoveryError}
                </div>
              )}

              {recoverySuccess && (
                <div className="p-3.5 text-xs rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold select-none">
                  {recoverySuccess}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    placeholder="developer@devpilot.ai"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold text-xs transition-all duration-300 shadow-lg"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Find Password</span>}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setForgotPassword(false);
                  setRecoveryError(null);
                  setRecoverySuccess(null);
                }}
                className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                Return to Sign In
              </button>
            </div>
          </div>
        ) : (
          /* Normal Sign In / Sign Up Forms */
          <>
            {/* Tab switchers */}
            <div className="flex border-b border-slate-200/10 dark:border-white/5 pb-px select-none">
              <button
                type="button"
                onClick={() => isSignUp && handleModeSwitch()}
                className={`flex-1 pb-3 text-xs font-bold text-center border-b-2 transition-all duration-300 ${
                  !isSignUp ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-705'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => !isSignUp && handleModeSwitch()}
                className={`flex-1 pb-3 text-xs font-bold text-center border-b-2 transition-all duration-300 ${
                  isSignUp ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-705'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 text-xs rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-455 font-semibold select-none">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 text-xs rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2 select-none">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {isSignUp && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-650 dark:text-slate-400 uppercase tracking-widest">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-650 dark:text-slate-400 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    placeholder="developer@devpilot.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-650 dark:text-slate-400 uppercase tracking-widest">Password</label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => setForgotPassword(true)}
                      className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline uppercase tracking-wider"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold text-xs transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 active:scale-95 disabled:pointer-events-none mt-6"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4.5 h-4.5" />
                    <span>{isSignUp ? 'Initialize Workspace' : 'Unlock Workspace'}</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}

        <div className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-wider select-none border-t border-slate-200/10 dark:border-white/5 pt-4">
          All connection requests are secured
        </div>
      </GlassCard>
    </div>
  );
}
