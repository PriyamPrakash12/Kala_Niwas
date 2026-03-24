'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    router.push('/dashboard');
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a2b35] p-4">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-1 h-8 bg-[#00e5ff]"></div>
          <h1 className="text-3xl font-bold text-white">Account Centre</h1>
        </div>

        <div className="bg-[#243642] p-6 md:p-10 rounded-3xl w-full max-w-md shadow-2xl border border-white/5">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8">One Account. Just for you.</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Username or email address *</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full bg-[#2a3f4c] border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all shadow-[0_0_10px_rgba(0,229,255,0.1)] focus:shadow-[0_0_15px_rgba(0,229,255,0.3)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-[#2a3f4c] border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                className="bg-[#00e5ff] hover:bg-[#00cce6] text-black font-semibold py-2.5 px-8 rounded-xl transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)]"
              >
                Log in
              </button>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                  className="w-4 h-4 rounded border-slate-600 text-[#00e5ff] focus:ring-[#00e5ff] bg-[#2a3f4c]"
                />
                <span className="text-sm text-slate-300">Remember me</span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-6 text-sm">
              <Link href="#" className="text-[#00e5ff] hover:underline">
                Lost your password?
              </Link>
              <Link href="/signup" className="text-[#00e5ff] hover:underline">
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
