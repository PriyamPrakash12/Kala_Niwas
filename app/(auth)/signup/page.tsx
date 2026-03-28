'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Loader2, CheckCircle2, Store, ShoppingBag, ChevronLeft } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';
import { useUser } from '@/components/UserContext';

const SELLER_BUSINESS_TYPES = ['Handicrafts Vendor', 'Retailer', 'Wholesaler', 'Manufacturer', 'Service Provider', 'Other'];
const BUYER_INTERESTS        = ['Handicrafts', 'Textiles', 'Jewellery', 'Pottery', 'Food & Spices', 'Woodwork', 'Other'];

/* ── Password strength ── */
function getStrength(pw: string) {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return { score: s, label: ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][s], color: s <= 1 ? '#ef4444' : s === 2 ? '#eab308' : s === 3 ? '#84cc16' : '#0078f2' };
}

/* ── Epic floating label input ── */
function EpicInput({ id, label, type = 'text', required, value, onChange, focused, setFocused, accent, error, placeholder }: {
    id: string; label: string; type?: string; required?: boolean;
    value: string; onChange: (v: string) => void;
    focused: string | null; setFocused: (v: string | null) => void;
    accent: string; error?: string; placeholder?: string;
}) {
    const isFocused = focused === id;
    const isActive  = isFocused || value.length > 0;

    return (
        <div>
            <div style={{ position: 'relative' }}>
                <label htmlFor={id} style={{
                    position: 'absolute', left: 14, pointerEvents: 'none', fontWeight: 500, zIndex: 1,
                    transition: 'all 0.18s ease',
                    top: isActive ? 8 : '50%',
                    transform: isActive ? 'none' : 'translateY(-50%)',
                    fontSize: isActive ? 10 : 13,
                    letterSpacing: isActive ? '0.1em' : '0.02em',
                    textTransform: isActive ? 'uppercase' as const : 'none' as const,
                    color: error ? '#ef4444' : isFocused ? accent : '#2a3a50',
                }}>{label}</label>
                <input id={id} type={type} required={required} value={value}
                       placeholder={isActive ? placeholder : ''}
                       onFocus={() => setFocused(id)} onBlur={() => setFocused(null)}
                       onChange={e => onChange(e.target.value)}
                       style={{
                           width: '100%', background: 'rgba(255,255,255,0.03)',
                           border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : isFocused ? accent + '80' : 'rgba(255,255,255,0.08)'}`,
                           borderRadius: 4, color: '#e2e8f0', fontSize: 14, outline: 'none',
                           padding: isActive ? '22px 14px 8px' : '14px',
                           boxShadow: error ? '0 0 0 3px rgba(239,68,68,0.1)' : isFocused ? `0 0 0 3px ${accent}18` : 'none',
                           transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
                           fontFamily: "'Barlow',sans-serif",
                       }}
                />
            </div>
            {error && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4, fontWeight: 500 }}>{error}</p>}
        </div>
    );
}

function SignupForm() {
    const router       = useRouter();
    const searchParams = useSearchParams();
    const { updateUser } = useUser();
    const role = searchParams.get('role') as 'buyer' | 'seller' | null;

    const [step,    setStep]    = useState(1);
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState<string | null>(null);
    const [form,    setForm]    = useState({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '', location: '', businessType: '', interests: [] as string[], dob: '' });

    const isBuyer    = role === 'buyer';
    const accent     = isBuyer ? '#a78bfa' : '#0078f2';
    const accentBg   = isBuyer ? 'rgba(167,139,250,0.08)'  : 'rgba(0,120,242,0.08)';
    const accentBd   = isBuyer ? 'rgba(167,139,250,0.22)'  : 'rgba(0,120,242,0.22)';
    const accentGlow = isBuyer ? 'rgba(167,139,250,0.18)'  : 'rgba(0,120,242,0.18)';
    const RoleIcon   = isBuyer ? ShoppingBag : Store;

    const strength   = getStrength(form.password);
    const pwMismatch = form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (pwMismatch) return;
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        updateUser({
            email: form.email, firstName: form.firstName, lastName: form.lastName,
            location: form.location || 'Not specified',
            businessType: form.businessType || (isBuyer ? 'Buyer' : 'Not specified'),
            dob: form.dob || 'Not specified',
        });
        await new Promise(r => setTimeout(r, 1200));
        router.push(isBuyer ? '/buyer' : '/dashboard');
    };

    const toggleInterest = (i: string) => {
        setForm(f => ({ ...f, interests: f.interests.includes(i) ? f.interests.filter(x => x !== i) : [...f.interests, i] }));
    };

    const steps = isBuyer ? ['Credentials', 'About You'] : ['Credentials', 'Business'];

    return (
        <div style={{ minHeight: '100vh', background: '#0f1013', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', position: 'relative', overflow: 'hidden' }}>

            {/* ── Background ── */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(165deg, #0d1829 0%, #0f1013 50%, #0a0c0f 100%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: -160, right: -100, width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(ellipse,${isBuyer ? 'rgba(100,60,200,0.1)' : 'rgba(0,80,200,0.1)'} 0%,transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${accent}60 40%,${accent}30 70%,transparent)`, zIndex: 20, pointerEvents: 'none' }} />

            {/* ── Logo ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, position: 'relative', zIndex: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 3, background: '#0078f2', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(0,120,242,0.5)' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="1" y="1" width="5" height="5" fill="white" rx="0.75"/>
                        <rect x="8" y="1" width="5" height="5" fill="white" rx="0.75" opacity="0.55"/>
                        <rect x="1" y="8" width="5" height="5" fill="white" rx="0.75" opacity="0.55"/>
                        <rect x="8" y="8" width="5" height="5" fill="white" rx="0.75" opacity="0.28"/>
                    </svg>
                </div>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '0.05em' }}>
          कला<span style={{ color: '#0078f2' }}>Niwas</span>
        </span>
            </div>

            {/* ── Role badge ── */}
            {role && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 3, background: accentBg, border: `1px solid ${accentBd}`, marginBottom: 18, position: 'relative', zIndex: 10 }}>
                    <RoleIcon style={{ width: 12, height: 12, color: accent }} />
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent }}>
            Creating {isBuyer ? 'Buyer' : 'Seller'} Account
          </span>
                </div>
            )}

            {/* ── Step indicator ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, position: 'relative', zIndex: 10 }}>
                {steps.map((s, i) => {
                    const n = i + 1;
                    const done    = step > n;
                    const current = step === n;
                    return (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 26, height: 26, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 12, transition: 'all 0.2s ease', background: done ? accent : current ? accentBg : 'rgba(255,255,255,0.03)', border: `1px solid ${done || current ? accent + (done ? '' : '60') : 'rgba(255,255,255,0.08)'}`, color: done ? '#fff' : current ? accent : '#2a3a50', boxShadow: (done || current) ? `0 0 8px ${accentGlow}` : 'none' }}>
                                    {done ? <CheckCircle2 style={{ width: 13, height: 13 }} /> : n}
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: current ? '#94a3b8' : '#2a3a50', transition: 'color 0.2s' }}>{s}</span>
                            </div>
                            {i < steps.length - 1 && (
                                <div style={{ width: 32, height: 1, background: step > n ? accent : 'rgba(255,255,255,0.07)', transition: 'background 0.3s ease' }} />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── Card ── */}
            <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 420 }}>
                <div style={{ position: 'absolute', inset: -1, borderRadius: 9, background: `linear-gradient(135deg,${accent}28,transparent,${accent}14)`, pointerEvents: 'none' }} />

                <div style={{ position: 'relative', background: 'rgba(11,13,16,0.94)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '32px 28px' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${accent},transparent)`, borderRadius: '8px 8px 0 0' }} />

                    {/* Heading */}
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2a3a50', marginBottom: 6 }}>
                            Step {step} of {steps.length}
                        </div>
                        <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 30, textTransform: 'uppercase', letterSpacing: '0.02em', color: '#fff', lineHeight: 1, margin: 0 }}>
                            {step === 1 ? 'Create Account' : isBuyer ? 'Your Interests' : 'Your Business'}
                        </h1>
                        <p style={{ fontSize: 13, color: '#3d4a5c', marginTop: 7, fontWeight: 400 }}>
                            {step === 1
                                ? isBuyer ? 'Set up your buyer account.' : 'Set up your seller credentials.'
                                : isBuyer ? 'Help us personalise your experience.' : 'Tell us about your business.'}
                        </p>
                    </div>

                    {/* ── STEP 1: Credentials ── */}
                    {step === 1 && (
                        <form onSubmit={handleNext}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <EpicInput id="email" label="Email Address" type="email" required
                                           value={form.email} onChange={v => setForm({ ...form, email: v })}
                                           focused={focused} setFocused={setFocused} accent={accent} />

                                <div>
                                    <EpicInput id="password" label="Password" type="password" required
                                               value={form.password} onChange={v => setForm({ ...form, password: v })}
                                               focused={focused} setFocused={setFocused} accent={accent} />
                                    {form.password && (
                                        <div style={{ marginTop: 8 }}>
                                            <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                                                {[0,1,2,3].map(i => (
                                                    <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, background: i < strength.score ? strength.color : 'rgba(255,255,255,0.08)', transition: 'background 0.2s ease' }} />
                                                ))}
                                            </div>
                                            <span style={{ fontSize: 11, fontWeight: 600, color: strength.color }}>{strength.label}</span>
                                        </div>
                                    )}
                                </div>

                                <EpicInput id="confirmPw" label="Confirm Password" type="password" required
                                           value={form.confirmPassword} onChange={v => setForm({ ...form, confirmPassword: v })}
                                           focused={focused} setFocused={setFocused} accent={accent}
                                           error={pwMismatch ? "Passwords don't match" : ''} />

                                <button type="submit"
                                        style={{ width: '100%', height: 46, borderRadius: 4, background: accent, border: 'none', color: '#fff', fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4, boxShadow: `0 4px 20px ${accentGlow}`, transition: 'filter 0.18s' }}
                                        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
                                        onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}>
                                    Continue <ArrowRight style={{ width: 15, height: 15 }} />
                                </button>
                            </div>

                            <div style={{ marginTop: 16, textAlign: 'center' }}>
                                <Link href={`/login${role ? `?role=${role}` : ''}`}
                                      style={{ fontSize: 12, color: '#2a3a50', textDecoration: 'none', transition: 'color 0.15s' }}
                                      onMouseEnter={e => (e.currentTarget.style.color = accent)}
                                      onMouseLeave={e => (e.currentTarget.style.color = '#2a3a50')}>
                                    Already have an account? <span style={{ color: accent, fontWeight: 600 }}>Sign in →</span>
                                </Link>
                            </div>
                        </form>
                    )}

                    {/* ── STEP 2: Profile ── */}
                    {step === 2 && (
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    <EpicInput id="firstName" label="First Name" required value={form.firstName} onChange={v => setForm({ ...form, firstName: v })} focused={focused} setFocused={setFocused} accent={accent} />
                                    <EpicInput id="lastName"  label="Last Name"  required value={form.lastName}  onChange={v => setForm({ ...form, lastName: v })}  focused={focused} setFocused={setFocused} accent={accent} />
                                </div>

                                <EpicInput id="location" label="City, State" required value={form.location} onChange={v => setForm({ ...form, location: v })} focused={focused} setFocused={setFocused} accent={accent} placeholder="e.g. Mumbai, Maharashtra" />

                                {/* Buyer: interests / Seller: business type */}
                                <div>
                                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent, marginBottom: 10 }}>
                                        {isBuyer ? 'Interests' : 'Business Type'}
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                        {(isBuyer ? BUYER_INTERESTS : SELLER_BUSINESS_TYPES).map(opt => {
                                            const selected = isBuyer ? form.interests.includes(opt) : form.businessType === opt;
                                            return (
                                                <button key={opt} type="button"
                                                        onClick={() => isBuyer ? toggleInterest(opt) : setForm({ ...form, businessType: opt })}
                                                        style={{ padding: '6px 12px', borderRadius: 3, fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', cursor: 'pointer', fontFamily: "'Barlow',sans-serif", transition: 'all 0.15s ease', background: selected ? accentBg : 'rgba(255,255,255,0.03)', border: `1px solid ${selected ? accent + '55' : 'rgba(255,255,255,0.07)'}`, color: selected ? accent : '#3d4a5c', boxShadow: selected ? `0 0 8px ${accentGlow}` : 'none' }}>
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* DOB */}
                                <div>
                                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent, marginBottom: 8 }}>Date of Birth</div>
                                    <input type="date" required value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })}
                                           style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, padding: '12px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', fontFamily: "'Barlow',sans-serif", colorScheme: 'dark' as const, transition: 'border-color 0.18s' }}
                                           onFocus={e => { e.target.style.borderColor = accent + '80'; e.target.style.boxShadow = `0 0 0 3px ${accent}18`; }}
                                           onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                                    <button type="button" onClick={() => setStep(1)}
                                            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 18px', height: 46, borderRadius: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#3d4a5c', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Barlow',sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0, transition: 'all 0.15s' }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.14)'; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#3d4a5c'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                                        <ChevronLeft style={{ width: 14, height: 14 }} /> Back
                                    </button>
                                    <button type="submit" disabled={loading}
                                            style={{ flex: 1, height: 46, borderRadius: 4, background: accent, border: 'none', color: '#fff', fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1, boxShadow: `0 4px 20px ${accentGlow}`, transition: 'filter 0.18s' }}
                                            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.1)'; }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)'; }}>
                                        {loading ? <Loader2 style={{ width: 16, height: 16, animation: 'sp-spin 1s linear infinite' }} /> : <><span>{isBuyer ? 'Start Exploring' : 'Create Account'}</span><ArrowRight style={{ width: 15, height: 15 }} /></>}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@700;800&display=swap');
        @keyframes sp-spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}

export default function SignupPage() {
    return (
        <PageTransition>
            <Suspense>
                <SignupForm />
            </Suspense>
        </PageTransition>
    );
}