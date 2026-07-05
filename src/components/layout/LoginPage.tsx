'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Sparkles, Lock } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('rahul@algoforce.ai');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden bg-white">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/5"
          animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-secondary/5"
          animate={{ x: [0, -30, 0], y: [0, -40, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-primary/3"
          animate={{ x: [0, 20, -20, 0], y: [0, -20, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative z-10 p-12">
        <div className="max-w-md text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Image src="/logo.jpg" alt="AlgoForce" width={260} height={80} className="mx-auto object-contain" priority />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-3"
          >
            <h1 className="text-3xl font-extrabold text-slate-800 font-heading leading-tight">
              Finance AI<br />
              <span className="text-gradient">Built for Indian Business</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
              Your AI-powered team of CFO, Auditor, GST Expert, and Collections Manager — working 24/7 on your books.
            </p>
          </motion.div>

          {/* Feature Bullets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-3 text-left max-w-xs mx-auto"
          >
            {[
              'Connected to Tally Prime, Zoho Books, BUSY',
              'AI Audit scans 500+ vouchers in seconds',
              'WhatsApp collections with smart follow-ups',
              'GST compliance with 98%+ accuracy',
            ].map((feat, i) => (
              <div key={i} className="flex items-center space-x-2 text-xs text-slate-600 font-medium">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3 text-primary" />
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Image src="/logo.jpg" alt="AlgoForce" width={180} height={55} className="mx-auto object-contain" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Finance AI Core</p>
          </div>

          <div className="bg-white rounded-18px border border-slate-100 shadow-premium p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-800 font-heading">Welcome back</h2>
              <p className="text-xs text-slate-400 font-medium mt-1">Sign in to access your AI finance workspace</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  placeholder="you@company.in"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 pr-10 text-xs text-slate-800 font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`ios-switch-container scale-75 origin-left ${rememberMe ? 'active' : ''}`}
                  >
                    <div className="ios-switch-knob" />
                  </div>
                  <span
                    onClick={() => setRememberMe(!rememberMe)}
                    className="text-[10.5px] text-slate-500 font-semibold select-none cursor-pointer"
                  >
                    Remember me
                  </span>
                </div>
                <button type="button" className="text-[10px] text-primary font-semibold hover:underline">
                  Forgot password?
                </button>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-medium p-2.5 rounded-xl">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Sign in to Finance AI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* SSO divider */}
            <div className="mt-5 flex items-center space-x-3">
              <div className="flex-1 h-px bg-slate-100"></div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">or sign in with</span>
              <div className="flex-1 h-px bg-slate-100"></div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                type="button"
                onClick={onLogin}
                className="border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 py-2 rounded-xl transition-all"
              >
                Google SSO
              </button>
              <button
                type="button"
                onClick={onLogin}
                className="border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 py-2 rounded-xl transition-all"
              >
                Microsoft SSO
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-[9px] text-slate-400 font-medium mt-6">
            Powered by <span className="font-bold text-primary">AlgoForce</span> · Enterprise Security · SOC 2 Compliant
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
