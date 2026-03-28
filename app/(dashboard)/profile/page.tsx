'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/components/UserContext';
import { User, MapPin, Briefcase, Calendar, Mail, CheckCircle2, Edit2, X, Save } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';

const BUSINESS_TYPES = ['Handicrafts Vendor', 'Retailer', 'Wholesaler', 'Manufacturer', 'Service Provider', 'Other'];

function Field({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
      <div className="flex items-start gap-4 p-4 rounded-xl transition-all"
           style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.04)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background:'rgba(0,229,255,0.08)' }}>
          <Icon className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="min-w-0">
          <div className="text-xs text-slate-500 mb-0.5 font-medium uppercase tracking-wider">{label}</div>
          <div className="text-sm text-white font-medium truncate">{value || 'Not specified'}</div>
        </div>
      </div>
  );
}

function EditInput({ label, value, onChange, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color:'#00e5ff' }}>{label}</label>
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required
               onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
               className="w-full text-sm text-white rounded-xl px-4 py-3 outline-none transition-all"
               style={{ background:'rgba(13,27,36,0.7)', border:`1px solid ${focused ? '#00e5ff' : 'rgba(255,255,255,0.08)'}`, boxShadow: focused ? '0 0 0 3px rgba(0,229,255,0.1)':'none', fontFamily:'Sora, sans-serif' }}
        />
      </div>
  );
}

export default function ProfilePage() {
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({ firstName:'', lastName:'', email:'', location:'', businessType:'', dob:'' });

  useEffect(() => {
    if (user) setFormData({ firstName: user.firstName||'', lastName: user.lastName||'', email: user.email||'', location: user.location||'', businessType: user.businessType||'', dob: user.dob||'' });
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); updateUser(formData); setIsEditing(false);
    setSuccessMessage(true); setTimeout(() => setSuccessMessage(false), 3000);
  };

  if (!user) return <div className="p-8 text-slate-500" style={{ fontFamily:'Sora,sans-serif' }}>Loading profile...</div>;

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  return (
      <PageTransition>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');
        .pp-wrap * { font-family:'Sora',sans-serif; box-sizing:border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.35s ease forwards; }
        input[type=date] { color-scheme: dark; }
      `}</style>

        <div className="pp-wrap min-h-screen bg-[#0d1b24] p-4 md:p-8 relative overflow-hidden">
          <div style={{ position:'absolute', top:'-80px', left:'-80px', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle,rgba(0,229,255,0.07) 0%,transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'-60px', right:'-60px', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle,rgba(20,184,166,0.07) 0%,transparent 70%)', pointerEvents:'none' }} />

          <div className="max-w-3xl mx-auto relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'rgba(0,229,255,0.12)', border:'1px solid rgba(0,229,255,0.25)' }}>
                  <User className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Profile</h1>
                  <p className="text-xs text-slate-500 mt-0.5">Manage your account details</p>
                </div>
              </div>

              {!isEditing && (
                  <button onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                          style={{ background:'rgba(0,229,255,0.08)', border:'1px solid rgba(0,229,255,0.2)', color:'#00e5ff' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background='rgba(0,229,255,0.14)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background='rgba(0,229,255,0.08)'; }}>
                    <Edit2 className="w-4 h-4" /> Edit Profile
                  </button>
              )}
            </div>

            {/* Success toast */}
            {successMessage && (
                <div className="fade-up mb-6 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
                     style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.25)', color:'#86efac' }}>
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  Profile updated successfully!
                </div>
            )}

            {/* Avatar + name card */}
            <div className="mb-6" style={{ background:'rgba(17,31,42,0.9)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'20px', padding:'24px' }}>
              <div className="flex items-center gap-5">
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold"
                       style={{ background:'linear-gradient(135deg,rgba(0,229,255,0.2),rgba(0,119,182,0.2))', border:'1px solid rgba(0,229,255,0.2)', color:'#00e5ff' }}>
                    {initials}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background:'#22c55e', border:'2px solid #0d1b24' }}>
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{user.firstName} {user.lastName}</h2>
                  <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background:'rgba(0,229,255,0.1)', color:'#00e5ff', border:'1px solid rgba(0,229,255,0.2)' }}>
                    Verified Business
                  </span>
                    {user.businessType !== 'Not specified' && (
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background:'rgba(255,255,255,0.05)', color:'#64748b', border:'1px solid rgba(255,255,255,0.06)' }}>
                      {user.businessType}
                    </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div style={{ background:'rgba(17,31,42,0.9)', border:'1px solid rgba(0,229,255,0.15)', borderRadius:'20px', padding:'24px' }}>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-sm font-semibold text-white">Edit Information</span>
                      <button type="button" onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-white transition-colors p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                      <EditInput label="First Name" value={formData.firstName} onChange={(v) => setFormData({ ...formData, firstName: v })} />
                      <EditInput label="Last Name" value={formData.lastName} onChange={(v) => setFormData({ ...formData, lastName: v })} />
                      <EditInput label="Email Address" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} />
                      <EditInput label="Location (City, State)" value={formData.location} onChange={(v) => setFormData({ ...formData, location: v })} />
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color:'#00e5ff' }}>Business Type</label>
                        <div className="flex flex-wrap gap-2">
                          {BUSINESS_TYPES.map((bt) => (
                              <button key={bt} type="button" onClick={() => setFormData({ ...formData, businessType: bt })}
                                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                      style={{ background: formData.businessType === bt ? 'rgba(0,229,255,0.12)':'rgba(255,255,255,0.03)', border:`1px solid ${formData.businessType === bt ? 'rgba(0,229,255,0.4)':'rgba(255,255,255,0.07)'}`, color: formData.businessType === bt ? '#00e5ff':'#64748b' }}>
                                {bt}
                              </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color:'#00e5ff' }}>Date of Birth</label>
                        <input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} required
                               className="w-full text-sm text-white rounded-xl px-4 py-3 outline-none transition-all"
                               style={{ background:'rgba(13,27,36,0.7)', border:'1px solid rgba(255,255,255,0.08)', fontFamily:'Sora,sans-serif' }}
                               onFocus={(e) => { e.target.style.borderColor='#00e5ff'; e.target.style.boxShadow='0 0 0 3px rgba(0,229,255,0.1)'; }}
                               onBlur={(e) => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button type="submit" className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                              style={{ background:'#00e5ff', color:'#0d1b24', boxShadow:'0 0 16px rgba(0,229,255,0.25)' }}>
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                      <button type="button" onClick={() => setIsEditing(false)}
                              className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
                              style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#64748b' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
            ) : (
                <div className="fade-up" style={{ background:'rgba(17,31,42,0.9)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'20px', padding:'24px' }}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Account Details</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Field icon={Mail} label="Email Address" value={user.email || ''} />
                    <Field icon={MapPin} label="Location" value={user.location} />
                    <Field icon={Briefcase} label="Business Type" value={user.businessType} />
                    <Field icon={Calendar} label="Date of Birth" value={user.dob} />
                  </div>
                </div>
            )}
          </div>
        </div>
      </PageTransition>
  );
}