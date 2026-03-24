'use client';

import Link from 'next/link';
import { Home, Bot, User, LogOut, Sparkles, IndianRupee, Image as ImageIcon, MapPin, Briefcase, Calendar, Settings } from 'lucide-react';
import { useUser } from '@/components/UserContext';

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user } = useUser();

  // Fallback if user is null (e.g. during initial hydration)
  const displayUser = user || {
    firstName: 'Guest',
    lastName: '',
    location: 'Not specified',
    businessType: 'Not specified',
    dob: 'Not specified'
  };

  return (
    <aside className="w-64 bg-slate-900 h-screen flex flex-col border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-teal-400">Kala Kit</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <Link href="/dashboard" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
          <Home className="w-5 h-5 text-orange-400" />
          <span className="font-medium">Dashboard</span>
        </Link>
        <Link href="/loan-matcher" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
          <Bot className="w-5 h-5 text-pink-400" />
          <span className="font-medium">Smart Loan Matcher</span>
        </Link>
        <Link href="/ai-descriptor" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
          <Sparkles className="w-5 h-5 text-orange-400" />
          <span className="font-medium">AI Descriptor</span>
        </Link>
        <Link href="/pricing-suggestion" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
          <IndianRupee className="w-5 h-5 text-yellow-500" />
          <span className="font-medium">Pricing Suggestion</span>
        </Link>
        <Link href="/image-enhancer" onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
          <ImageIcon className="w-5 h-5 text-blue-400" />
          <span className="font-medium">Image Enhancer</span>
        </Link>
      </nav>

      <div className="p-4">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 relative group">
          <Link href="/profile" onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-teal-400 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <Settings className="w-4 h-4" />
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
              <User className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white truncate max-w-[120px]" title={`${displayUser.firstName} ${displayUser.lastName}`}>
                {displayUser.firstName} {displayUser.lastName}
              </h3>
              <p className="text-xs text-slate-400">Verified Seller</p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{displayUser.location}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{displayUser.businessType}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">Born: {displayUser.dob}</span>
            </div>
          </div>

          <Link href="/" className="w-full bg-slate-700/50 hover:bg-slate-700 text-pink-400 font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-600/50">
            <LogOut className="w-4 h-4" />
            Logout
          </Link>
        </div>
      </div>
    </aside>
  );
}
