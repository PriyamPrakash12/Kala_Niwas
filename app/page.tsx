'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PageTransition } from '@/components/PageTransition';
import { Store, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';

type Role = 'seller' | 'buyer' | null;
type Step = 'role' | 'auth';

export default function WelcomePage() {
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<Role>(null);

  function handleRoleSelect(r: Role) {
    setRole(r);
    // Small delay so the card press animation plays before transitioning
    setTimeout(() => setStep('auth'), 180);
  }

  function handleBack() {
    setStep('role');
    setRole(null);
  }

  const roleConfig = {
    seller: {
      label: 'Seller',
      color: '#0078f2',
      glow: 'rgba(0,120,242,0.35)',
      tagline: 'Grow your business with AI tools',
    },
    buyer: {
      label: 'Buyer',
      color: '#a78bfa',
      glow: 'rgba(167,139,250,0.35)',
      tagline: 'Discover verified local artisans',
    },
  };

  const active = role ? roleConfig[role] : null;

  return (
      <PageTransition>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap');
        .wk-root * { box-sizing: border-box; font-family: 'Barlow', sans-serif; }

        /* ── Animations ── */
        @keyframes heroReveal {
          from { opacity: 0; transform: scale(1.03); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes stepSlideIn {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .hero-bg  { animation: heroReveal 1.1s cubic-bezier(0.22,1,0.36,1) both; }
        .fu-1     { animation: fadeUp 0.65s 0.1s ease both; }
        .fu-2     { animation: fadeUp 0.65s 0.22s ease both; }
        .fu-3     { animation: fadeUp 0.65s 0.34s ease both; }
        .fu-4     { animation: fadeUp 0.65s 0.46s ease both; }
        .step-in  { animation: stepSlideIn 0.32s cubic-bezier(0.22,1,0.36,1) both; }

        /* ── Nav ── */
        .wk-nav { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }

        /* ── Role cards ── */
        .role-card {
          position: relative; overflow: hidden;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 8px; padding: 32px 28px;
          cursor: pointer; text-align: left;
          transition: all 0.2s ease;
          display: flex; flex-direction: column; gap: 16px;
          min-width: 200px; flex: 1;
          -webkit-tap-highlight-color: transparent;
        }
        .role-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, var(--rc) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.22s ease;
        }
        .role-card:hover {
          border-color: var(--rb);
          transform: translateY(-3px);
          box-shadow: 0 12px 40px var(--rg);
        }
        .role-card:hover::before { opacity: 1; }
        .role-card:active { transform: translateY(-1px) scale(0.99); }

        .role-card .rc-top-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: var(--rb);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.28s ease;
        }
        .role-card:hover .rc-top-bar { transform: scaleX(1); }

        .role-card.selected {
          border-color: var(--rb) !important;
          background: var(--rc) !important;
        }

        /* ── Auth buttons ── */
        .auth-btn-primary {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 14px 20px; border-radius: 4px;
          font-family: 'Barlow', sans-serif; font-weight: 700; font-size: 14px;
          letter-spacing: 0.06em; text-transform: uppercase; text-decoration: none;
          transition: all 0.18s ease; border: none; cursor: pointer;
          background: var(--ac); color: #fff;
        }
        .auth-btn-primary:hover {
          filter: brightness(1.12);
          transform: translateY(-1px);
          box-shadow: 0 6px 24px var(--ag);
        }

        .auth-btn-ghost {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 13px 20px; border-radius: 4px;
          font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 14px;
          letter-spacing: 0.06em; text-transform: uppercase; text-decoration: none;
          transition: all 0.18s ease; cursor: pointer;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: #94a3b8;
        }
        .auth-btn-ghost:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.18);
          color: #fff; transform: translateY(-1px);
        }

        /* ── Back button ── */
        .back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: #2a3a50;
          background: none; border: none; cursor: pointer;
          padding: 6px 0; transition: color 0.15s ease;
        }
        .back-btn:hover { color: #6b7a99; }

        /* ── Feature pills (role select) ── */
        .feat-pill {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 500; color: #2a3a50;
        }
        .feat-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--rb); opacity: 0.7; }

        /* ── Ticker ── */
        .ticker-track { display: flex; animation: marqueeScroll 28s linear infinite; width: max-content; }
        .ticker-item {
          display: flex; align-items: center; gap: 10px;
          padding: 0 28px; border-right: 1px solid rgba(255,255,255,0.06);
          white-space: nowrap;
        }

        /* ── Role badge in auth step ── */
        .role-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 3px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
        }
      `}</style>

        <div className="wk-root min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#0f1013' }}>

          {/* ── Background ── */}
          <div className="hero-bg absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(165deg, #0d1829 0%, #0f1013 45%, #0a0c0f 100%)' }} />
            <div style={{ position: 'absolute', top: '-200px', left: '-150px', width: '900px', height: '700px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,90,200,0.16) 0%, transparent 70%)' }} />
            <div style={{ position: 'absolute', bottom: '-180px', right: '-100px', width: '700px', height: '600px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(80,40,180,0.1) 0%, transparent 65%)' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(0,0,0,0.65) 100%)' }} />
            {/* Decorative lines */}
            <svg style={{ position: 'absolute', top: 0, right: 0, opacity: 0.1 }} width="400" height="400" viewBox="0 0 400 400" fill="none">
              <line x1="400" y1="0" x2="0" y2="400" stroke="#0078f2" strokeWidth="0.5"/>
              <line x1="400" y1="80" x2="80" y2="400" stroke="#0078f2" strokeWidth="0.5"/>
              <line x1="400" y1="160" x2="160" y2="400" stroke="#0078f2" strokeWidth="0.5"/>
            </svg>
          </div>

          {/* ── Nav ── */}
          <nav className="wk-nav relative z-20 flex items-center justify-between px-6 md:px-10 py-4"
               style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(15,16,19,0.72)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 3, background: '#0078f2', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(0,120,242,0.55)' }}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <rect x="1.5" y="1.5" width="5" height="5" fill="white" rx="0.75"/>
                  <rect x="8.5" y="1.5" width="5" height="5" fill="white" rx="0.75" opacity="0.55"/>
                  <rect x="1.5" y="8.5" width="5" height="5" fill="white" rx="0.75" opacity="0.55"/>
                  <rect x="8.5" y="8.5" width="5" height="5" fill="white" rx="0.75" opacity="0.28"/>
                </svg>
              </div>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '0.05em' }}>
              कला<span style={{ color: '#0078f2' }}>KIT</span>
            </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {['Features', 'Schemes', 'About'].map(l => (
                  <a key={l} href="#" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#2a3a50', textDecoration: 'none', transition: 'color 0.15s' }}
                     onMouseEnter={e => (e.currentTarget.style.color = '#6b7a99')}
                     onMouseLeave={e => (e.currentTarget.style.color = '#2a3a50')}>
                    {l}
                  </a>
              ))}
            </div>
          </nav>

          {/* ── Hero ── */}
          <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 text-center"
               style={{ paddingTop: 64, paddingBottom: 48 }}>

            {/* Badge */}
            <div className="fu-1" style={{ marginBottom: 20 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 3, background: 'rgba(0,120,242,0.1)', border: '1px solid rgba(0,120,242,0.25)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#0078f2', animation: 'glowPulse 2s ease infinite' }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4db3ff' }}>
                AI Platform · Built for Bharat
              </span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="fu-2" style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
              fontSize: 'clamp(48px, 9vw, 100px)', lineHeight: 0.92,
              letterSpacing: '-0.01em', textTransform: 'uppercase',
              color: '#fff', marginBottom: 6, maxWidth: 800
            }}>
              Power Your<br />
              <span style={{ color: '#0078f2' }}>Business</span>
            </h1>
            <p className="fu-3" style={{ fontSize: 16, fontWeight: 300, color: '#3d4a5c', maxWidth: 460, lineHeight: 1.75, marginBottom: 52 }}>
              Write product descriptions, discover govt loan schemes, and price smarter — designed for artisans and vendors across India.
            </p>

            {/* ════════════ STEP: ROLE SELECT ════════════ */}
            {step === 'role' && (
                <div className="fu-4 step-in w-full" style={{ maxWidth: 560 }}>
                  <div style={{ marginBottom: 20 }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2a3a50' }}>
                  I am a —
                </span>
                  </div>

                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {/* Seller card */}
                    <div
                        className={`role-card${role === 'seller' ? ' selected' : ''}`}
                        style={{ '--rc': 'rgba(0,120,242,0.08)', '--rb': 'rgba(0,120,242,0.4)', '--rg': 'rgba(0,120,242,0.18)' } as React.CSSProperties}
                        onClick={() => handleRoleSelect('seller')}
                    >
                      <div className="rc-top-bar" />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 4, background: 'rgba(0,120,242,0.12)', border: '1px solid rgba(0,120,242,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Store style={{ width: 20, height: 20, color: '#0078f2' }} />
                        </div>
                        <div>
                          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 22, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#fff', lineHeight: 1 }}>Seller</div>
                          <div style={{ fontSize: 11, color: '#2a3a50', fontWeight: 500, marginTop: 2 }}>Artisan · Vendor · Shop Owner</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {['AI product descriptions', 'Govt loan matching', 'Smart pricing tools'].map(f => (
                            <div key={f} className="feat-pill" style={{ '--rb': 'rgba(0,120,242,0.7)' } as React.CSSProperties}>
                              <div className="feat-dot" />
                              <span>{f}</span>
                            </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <ArrowRight style={{ width: 14, height: 14, color: '#1e2a3a' }} />
                      </div>
                    </div>

                    {/* Buyer card */}
                    <div
                        className={`role-card${role === 'buyer' ? ' selected' : ''}`}
                        style={{ '--rc': 'rgba(167,139,250,0.08)', '--rb': 'rgba(167,139,250,0.4)', '--rg': 'rgba(167,139,250,0.18)' } as React.CSSProperties}
                        onClick={() => handleRoleSelect('buyer')}
                    >
                      <div className="rc-top-bar" />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 4, background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <ShoppingBag style={{ width: 20, height: 20, color: '#a78bfa' }} />
                        </div>
                        <div>
                          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 22, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#fff', lineHeight: 1 }}>Buyer</div>
                          <div style={{ fontSize: 11, color: '#2a3a50', fontWeight: 500, marginTop: 2 }}>Customer · Reseller · Explorer</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {['Browse verified artisans', 'Discover local products', 'Support small businesses'].map(f => (
                            <div key={f} className="feat-pill" style={{ '--rb': 'rgba(167,139,250,0.7)' } as React.CSSProperties}>
                              <div className="feat-dot" />
                              <span>{f}</span>
                            </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <ArrowRight style={{ width: 14, height: 14, color: '#1e2a3a' }} />
                      </div>
                    </div>
                  </div>
                </div>
            )}

            {/* ════════════ STEP: AUTH ════════════ */}
            {step === 'auth' && active && role && (
                <div className="step-in w-full" style={{ maxWidth: 340 }}>
                  {/* Back */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                    <button className="back-btn" onClick={handleBack}>
                      <ChevronLeft style={{ width: 13, height: 13 }} />
                      Back
                    </button>
                  </div>

                  {/* Role badge */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                    <div className="role-badge" style={{ background: `${active.color}15`, border: `1px solid ${active.color}30`, color: active.color }}>
                      {role === 'seller' ? <Store style={{ width: 12, height: 12 }} /> : <ShoppingBag style={{ width: 12, height: 12 }} />}
                      Continuing as {active.label}
                    </div>
                  </div>

                  {/* Card */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${active.color}28`,
                    borderRadius: 8, padding: '28px 24px',
                    position: 'relative', overflow: 'hidden'
                  }}>
                    {/* Top accent */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${active.color}, transparent)` }} />

                    <div style={{ marginBottom: 20, textAlign: 'center' }}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: active.color, marginBottom: 4 }}>
                        {active.tagline}
                      </div>
                      <div style={{ fontSize: 12, color: '#2a3a50', fontWeight: 400 }}>
                        Choose how you'd like to continue
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <Link
                          href={`/signup?role=${role}`}
                          className="auth-btn-primary"
                          style={{ '--ac': active.color, '--ag': active.glow } as React.CSSProperties}
                      >
                        Create Account
                        <ArrowRight style={{ width: 15, height: 15 }} />
                      </Link>
                      <Link
                          href={`/login?role=${role}`}
                          className="auth-btn-ghost"
                      >
                        Sign In
                      </Link>
                    </div>

                    <div style={{ marginTop: 16, textAlign: 'center', fontSize: 11, color: '#1e2a3a' }}>
                      Free to use · No credit card required
                    </div>
                  </div>
                </div>
            )}
          </div>

          {/* ── Ticker ── */}
          <div style={{ position: 'relative', zIndex: 10, overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,120,242,0.03)', padding: '11px 0' }}>
            <div className="ticker-track" aria-hidden>
              {[...Array(2)].map((_, gi) => (
                  <div key={gi} style={{ display: 'flex' }}>
                    {['AI Product Copy', 'MUDRA Loans', 'GST Assistant', 'Pricing Engine', 'Market Insights', 'Regional Languages', 'Govt Schemes', 'Artisan Tools'].map(t => (
                        <div key={t} className="ticker-item">
                          <svg width="5" height="5" viewBox="0 0 5 5"><circle cx="2.5" cy="2.5" r="2.5" fill="#0078f2"/></svg>
                          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1e2a3a' }}>{t}</span>
                        </div>
                    ))}
                  </div>
              ))}
            </div>
          </div>

          {/* ── Footer ── */}
          <footer style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, padding: '18px 40px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: 11, color: '#1a2535', fontWeight: 500, letterSpacing: '0.05em' }}>© 2026 कलाNiwas · BUILT FOR BHARAT</span>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Privacy', 'Terms', 'Support'].map(l => (
                  <a key={l} href="#" style={{ fontSize: 11, color: '#1a2535', textDecoration: 'none', letterSpacing: '0.05em', fontWeight: 500, transition: 'color 0.15s' }}
                     onMouseEnter={e => (e.currentTarget.style.color = '#3d4a5c')}
                     onMouseLeave={e => (e.currentTarget.style.color = '#1a2535')}>
                    {l}
                  </a>
              ))}
            </div>
          </footer>
        </div>
      </PageTransition>
  );
}