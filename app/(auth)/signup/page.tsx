'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageTransition } from '@/components/PageTransition';
import { useUser } from '@/components/UserContext';

export default function SignupPage() {
  const router = useRouter();
  const { updateUser } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    location: '',
    businessType: '',
    dob: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate signup and save user data
    updateUser({
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      location: formData.location || 'Not specified',
      businessType: formData.businessType || 'Not specified',
      dob: formData.dob || 'Not specified',
    });
    router.push('/dashboard');
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a2b35] p-4 py-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-1 h-8 bg-[#00e5ff]"></div>
          <h1 className="text-3xl font-bold text-white">Account Centre</h1>
        </div>

        <div className="bg-[#243642] p-6 md:p-10 rounded-3xl w-full max-w-md shadow-2xl border border-white/5">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">Create your account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password *</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Location (City, State) *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mumbai, Maharashtra"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Business Type *</label>
              <input
                type="text"
                required
                placeholder="e.g. Handicrafts Vendor, Retailer"
                value={formData.businessType}
                onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Date of Birth *</label>
              <input
                type="date"
                required
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:border-[#00e5ff] focus:ring-2 focus:ring-[#00e5ff] transition-all"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#00e5ff] hover:bg-[#00cce6] text-black font-semibold py-3.5 rounded-xl transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)]"
              >
                Create Account
              </button>
            </div>
            
            <div className="text-center pt-4">
              <Link href="/login" className="text-[#00e5ff] hover:underline text-sm">
                Already have an account? Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}
