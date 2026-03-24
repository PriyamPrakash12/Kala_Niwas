'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/components/UserContext';
import { User, MapPin, Briefcase, Calendar, Mail, CheckCircle2 } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';

export default function ProfilePage() {
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    businessType: '',
    dob: '',
  });

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        location: user.location || '',
        businessType: user.businessType || '',
        dob: user.dob || '',
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  if (!user) {
    return <div className="p-8 text-slate-400">Loading profile...</div>;
  }

  return (
    <PageTransition>
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <div className="flex items-center gap-2 md:gap-3">
            <User className="w-6 h-6 md:w-8 md:h-8 text-teal-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Profile Settings</h1>
          </div>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-colors text-sm md:text-base"
            >
              Edit Profile
            </button>
          )}
        </div>

        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 text-sm md:text-base">
            <CheckCircle2 className="w-5 h-5" />
            Profile updated successfully!
          </div>
        )}

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 md:p-8 backdrop-blur-sm">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Location (City, State)</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Business Type</label>
                  <input
                    type="text"
                    required
                    value={formData.businessType}
                    onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-600 text-slate-900 font-semibold py-2.5 px-6 rounded-xl transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-slate-700 hover:bg-slate-600 text-white font-medium py-2.5 px-6 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-teal-500/20 flex items-center justify-center border-2 border-teal-500/30">
                  <span className="text-2xl md:text-3xl font-bold text-teal-400">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
                <div className="mt-2 md:mt-0">
                  <h2 className="text-xl md:text-2xl font-bold text-white">{user.firstName} {user.lastName}</h2>
                  <p className="text-teal-400 font-medium text-sm md:text-base">Verified Business Account</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-700/50">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Email Address</p>
                    <p className="text-white font-medium">{user.email || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Location</p>
                    <p className="text-white font-medium">{user.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Business Type</p>
                    <p className="text-white font-medium">{user.businessType}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Date of Birth</p>
                    <p className="text-white font-medium">{user.dob}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
