'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Loader2, Store, ShoppingBag } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';

/* ── Epic-style floating label input ── */
function EpicInput({ id, label, type, required, value, onChange, focused, setFocused, accent, suffix }: {
    id: string; label: string; type: string; required?: boolean;
    value: string; onChange: (v: string) => void;
    focused: string | null; setFocused: (v: string | null) => void;
    accent: string; suffix?: React.ReactNode;
}) {
    const isFocused = focused === id;
    const isActive  = isFocused || value.length > 0;

    return (
        <div style={{ position: 'relative' }}>
            <label htmlFor={id} style={{
                position: 'absolute', left: 14, pointerEvents: 'none', fontWeight: 500, zIndex: 1,
                transition: 'all 0.18s ease',
                top: isActive ? 8 : '50%',
                transform: isActive ? 'none' : 'translateY(-50%)',
                fontSize: isActive ? 10 : 13,
                letterSpacing: isActive ? '0.1em' : '0.02em',
                textTransform: isActive ? 'uppercase' as const : 'none' as const,
                color: isFocused ? accent : '#2a3a50',
            }}>{label}</label>
            <input
                id={id} type={type} required={required} value={value}
                onFocus={() => setFocused(id)} onBlur={() => setFocused(null)}
                onChange={e => onChange(e.target.value)}
                style={{
                    width: '100%', background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isFocused ? accent + '80' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 4, color: '#e2e8f0', fontSize: 14, outline: 'none',
                    padding: isActive ? '22px 14px 8px' : '14px',
                    paddingRight: suffix ? 44 : 14,
                    boxShadow: isFocused ? `0 0 0 3px ${accent}18` : 'none',
                    transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
                    fontFamily: "'Barlow', sans-serif",
                }}
            />
            {suffix && <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>{suffix}</div>}
        </div>
    );
}

function LoginForm() {
    const router       = useRouter();
    const searchParams = useSearchParams();
    const role         = searchParams.get('role') as 'buyer' | 'seller' | null;

    const [showPwd,  setShowPwd]  = useState(false);
    const [loading,  setLoading]  = useState(false);
    const [focused,  setFocused]  = useState<string | null>(null);
    const [form,     setForm]     = useState({ username: '', password: '', remember: false });

    const isBuyer    = role === 'buyer';
    const accent     = isBuyer ? '#a78bfa' : '#0078f2';
    const accentBg   = isBuyer ? 'rgba(167,139,250,0.08)'  : 'rgba(0,120,242,0.08)';
    const accentBd   = isBuyer ? 'rgba(167,139,250,0.22)'  : 'rgba(0,120,242,0.22)';
    const accentGlow = isBuyer ? 'rgba(167,139,250,0.18)'  : 'rgba(0,120,242,0.18)';
    const RoleIcon   = isBuyer ? ShoppingBag : Store;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(r => setTimeout(r, 1200));
        router.push(isBuyer ? '/buyer' : '/dashboard');
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0f1013', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16, position: 'relative', overflow: 'hidden' }}>

            {/* ── Background atmosphere ── */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(165deg, #0d1829 0%, #0f1013 50%, #0a0c0f 100%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: -180, left: -120, width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(ellipse, ${isBuyer ? 'rgba(100,60,200,0.12)' : 'rgba(0,80,200,0.12)'} 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
            <svg style={{ position: 'absolute', top: 0, right: 0, opacity: 0.08, pointerEvents: 'none' }} width="340" height="340" viewBox="0 0 340 340" fill="none">
                <line x1="340" y1="0" x2="0" y2="340" stroke={accent} strokeWidth="0.5"/>
                <line x1="340" y1="80" x2="80" y2="340" stroke={accent} strokeWidth="0.5"/>
                <line x1="340" y1="160" x2="160" y2="340" stroke={accent} strokeWidth="0.5"/>
            </svg>
            {/* Top accent line */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${accent}60 40%,${accent}30 70%,transparent)`, zIndex: 20, pointerEvents: 'none' }} />

            {/* ── Logo ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, position: 'relative', zIndex: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 3, background: '#0078f2', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(0,120,242,0.5)' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="1" y="1" width="5" height="5" fill="white" rx="0.75"/>
                        <rect x="8" y="1" width="5" height="5" fill="white" rx="0.75" opacity="0.55"/>
                        <rect x="1" y="8" width="5" height="5" fill="white" rx="0.75" opacity="0.55"/>
                        <rect x="8" y="8" width="5" height="5" fill="white" rx="0.75" opacity="0.28"/>
                    </svg>
                </div>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '0.05em' }}>
          कला<span style={{ color: '#0078f2' }}>KIT</span>
        </span>
            </div>

            {/* ── Role badge ── */}
            {role && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 3, background: accentBg, border: `1px solid ${accentBd}`, marginBottom: 20, position: 'relative', zIndex: 10 }}>
                    <RoleIcon style={{ width: 12, height: 12, color: accent }} />
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: accent }}>
            Signing in as {isBuyer ? 'Buyer' : 'Seller'}
          </span>
                </div>
            )}

            {/* ── Card ── */}
            <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 400 }}>
                {/* Glow border */}
                <div style={{ position: 'absolute', inset: -1, borderRadius: 9, background: `linear-gradient(135deg,${accent}28,transparent,${accent}14)`, pointerEvents: 'none' }} />

                <div style={{ position: 'relative', background: 'rgba(11,13,16,0.94)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '32px 28px' }}>
                    {/* Top bar */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${accent},transparent)`, borderRadius: '8px 8px 0 0' }} />

                    {/* Heading */}
                    <div style={{ marginBottom: 26 }}>
                        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2a3a50', marginBottom: 6 }}>Sign In</div>
                        <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 34, textTransform: 'uppercase', letterSpacing: '0.02em', color: '#fff', lineHeight: 1, margin: 0 }}>Welcome Back</h1>
                        <p style={{ fontSize: 13, color: '#3d4a5c', marginTop: 7, fontWeight: 400, lineHeight: 1.5 }}>
                            {isBuyer ? 'Continue discovering artisans across India.' : 'Access your seller dashboard and AI tools.'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <EpicInput id="username" label="Username or Email" type="text" required
                                       value={form.username} onChange={v => setForm({ ...form, username: v })}
                                       focused={focused} setFocused={setFocused} accent={accent} />

                            <EpicInput id="password" label="Password" type={showPwd ? 'text' : 'password'} required
                                       value={form.password} onChange={v => setForm({ ...form, password: v })}
                                       focused={focused} setFocused={setFocused} accent={accent}
                                       suffix={
                                           <button type="button" onClick={() => setShowPwd(!showPwd)}
                                                   style={{ background: 'none', border: 'none', color: '#2a3a50', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
                                                   onMouseEnter={e => (e.currentTarget.style.color = accent)}
                                                   onMouseLeave={e => (e.currentTarget.style.color = '#2a3a50')}>
                                               {showPwd ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                                           </button>
                                       }
                            />

                            {/* Remember me */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <button type="button" onClick={() => setForm({ ...form, remember: !form.remember })}
                                        style={{ width: 18, height: 18, borderRadius: 2, border: `1px solid ${form.remember ? accent : 'rgba(255,255,255,0.12)'}`, background: form.remember ? accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s', boxShadow: form.remember ? `0 0 8px ${accentGlow}` : 'none' }}>
                                    {form.remember && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                </button>
                                <span style={{ fontSize: 12, color: '#3d4a5c', cursor: 'pointer', userSelect: 'none' }} onClick={() => setForm({ ...form, remember: !form.remember })}>
                  Remember me
                </span>
                            </div>

                            {/* Submit */}
                            <button type="submit" disabled={loading}
                                    style={{ width: '100%', height: 46, borderRadius: 4, background: accent, border: 'none', color: '#fff', fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.7 : 1, marginTop: 4, boxShadow: `0 4px 20px ${accentGlow}`, transition: 'all 0.18s ease' }}
                                    onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.1)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)'; }}>
                                {loading ? <Loader2 style={{ width: 16, height: 16, animation: 'lp-spin 1s linear infinite' }} /> : <><span>Sign In</span><ArrowRight style={{ width: 15, height: 15 }} /></>}
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Link href="#" style={{ fontSize: 12, color: '#2a3a50', textDecoration: 'none', transition: 'color 0.15s' }}
                              onMouseEnter={e => (e.currentTarget.style.color = '#6b7a99')}
                              onMouseLeave={e => (e.currentTarget.style.color = '#2a3a50')}>
                            Forgot password?
                        </Link>
                        <Link href={`/signup${role ? `?role=${role}` : ''}`}
                              style={{ fontSize: 12, fontWeight: 600, color: accent, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                              onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                            Create account <ArrowRight style={{ width: 12, height: 12 }} />
                        </Link>
                    </div>

                    {/* Switch role */}
                    {role && (
                        <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                            <Link href={`/login?role=${isBuyer ? 'seller' : 'buyer'}`}
                                  style={{ fontSize: 11, color: '#1e2a3a', textDecoration: 'none', letterSpacing: '0.03em', transition: 'color 0.15s' }}
                                  onMouseEnter={e => (e.currentTarget.style.color = '#3d4a5c')}
                                  onMouseLeave={e => (e.currentTarget.style.color = '#1e2a3a')}>
                                Continue as {isBuyer ? 'Seller' : 'Buyer'} instead →
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@700;800&display=swap');
        @keyframes lp-spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}

export default function LoginPage() {
    return (
        <PageTransition>
            <Suspense>
                <LoginForm />
            </Suspense>
        </PageTransition>
    );
}