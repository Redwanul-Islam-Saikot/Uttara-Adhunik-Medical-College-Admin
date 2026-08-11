'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (email && password) {
      if (rememberMe) {
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        sessionStorage.setItem('isAuthenticated', 'true');
      }

      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 text-gray-800 p-4 sm:p-8 relative overflow-hidden font-sans">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#008751]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FFC107]/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-lg bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-2xl z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 p-2 mb-3 shadow-inner">
            <img src="/Nav.png" alt="UAMC Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 leading-tight">
            Uttara Adhunik Medical College
          </h1>
          <p className="text-xs sm:text-sm text-[#008751] font-bold tracking-widest uppercase mt-1">
            Admin Control Portal
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium">
            <AlertCircle size={20} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@uamc.edu.bd"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-11 pr-5 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#008751] focus:ring-2 focus:ring-[#008751]/20 transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={19} />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-11 pr-5 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#008751] focus:ring-2 focus:ring-[#008751]/20 transition-all text-sm font-medium"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
              * Password must be minimum 6 characters long
            </p>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-gray-600 font-medium select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#008751] focus:ring-[#008751] accent-[#008751] cursor-pointer"
              />
              <span>Remember me</span>
            </label>

            <a href="#" className="font-semibold text-gray-700 hover:text-[#008751] hover:underline transition-colors">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-[#008751] hover:bg-[#007043] text-white font-bold py-3.5 rounded-xl text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-5 flex items-center justify-center gap-1.5 text-xs text-gray-400 font-medium">
          <ShieldCheck size={16} className="text-[#008751]" />
          <span>Authorized UAMC Administrative Access Only</span>
        </div>
      </div>
    </div>
  );
}