'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    LayoutDashboard, Bot, Sparkles, IndianRupee,
    Image as ImageIcon, Menu, X, ChevronDown,
    User, Settings, LogOut, ChevronRight,
} from 'lucide-react';
import { useUser } from '@/components/UserContext';

const NAV = [
    { href: '/dashboard',          icon: LayoutDashboard, label: 'Home' },
    { href: '/loan-matcher',       icon: Bot,             label: 'Loan Matcher' },
    { href: '/ai-descriptor',      icon: Sparkles,        label: 'AI Descriptor' },
    { href: '/pricing-suggestion', icon: IndianRupee,     label: 'Pricing AI' },
    { href: '/image-enhancer',     icon: ImageIcon,       label: 'Image Enhancer' },
];

export function TopNav() {
    const pathname = usePathname();
    const router   = useRouter();
    const { user } = useUser();
    const [mobileOpen,  setMobileOpen]  = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const initials = user
        ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
        : 'KK';

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@700;800&display=swap');

        .kk-nav * { box-sizing: border-box; }

        /* nav links */
        .kk-link {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 3px;
          font-family: 'Barlow', sans-serif; font-size: 13px; font-weight: 500;
          letter-spacing: 0.025em; text-decoration: none; white-space: nowrap;
          color: #475569; border: 1px solid transparent;
          transition: color 0.15s, background 0.15s, border-color 0.15s;
          position: relative;
        }
        .kk-link:hover { color: #94a3b8; background: rgba(255,255,255,0.04); }
        .kk-link.on {
          color: #e2e8f0;
          background: rgba(0,229,255,0.07);
          border-color: rgba(0,229,255,0.18);
        }
        .kk-link.on svg { color: #00e5ff; }

        /* profile dropdown */
        .kk-profile-drop {
          position: absolute; top: calc(100% + 8px); right: 0;
          min-width: 210px; z-index: 200;
          background: #0b1520;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 4px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
          animation: kkFadeUp 0.15s ease both;
        }
        @keyframes kkFadeUp {
          from { opacity:0; transform:translateY(6px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .kk-drop-btn {
          display: flex; align-items: center; gap: 9px;
          width: 100%; padding: 10px 14px;
          font-family: 'Barlow', sans-serif; font-size: 13px; font-weight: 500;
          color: #475569; background: none; border: none; cursor: pointer;
          text-align: left; transition: color 0.13s, background 0.13s;
        }
        .kk-drop-btn:hover { color: #cbd5e1; background: rgba(255,255,255,0.04); }
        .kk-drop-btn.danger:hover { color: #f87171; background: rgba(248,113,113,0.06); }

        /* mobile drawer */
        .kk-drawer {
          position: fixed; top: 53px; left: 0; right: 0; z-index: 150;
          background: #090e15;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 10px 16px 14px;
          animation: kkSlide 0.18s ease both;
        }
        @keyframes kkSlide {
          from { opacity:0; transform:translateY(-6px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .kk-hb {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 3px; cursor: pointer;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #475569; transition: all 0.15s;
        }
        .kk-hb:hover { background: rgba(0,229,255,0.08); border-color: rgba(0,229,255,0.2); color: #00e5ff; }

        .kk-avatar-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 9px 5px 7px; border-radius: 3px; cursor: pointer;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.15s;
        }
        .kk-avatar-btn:hover,
        .kk-avatar-btn.open {
          background: rgba(0,229,255,0.07);
          border-color: rgba(0,229,255,0.2);
        }
      `}</style>

            <header className="kk-nav" style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'rgba(13,27,36,0.96)',
                backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                flexShrink: 0,
            }}>
                {/* Top accent line */}
                <div style={{ height: 2, background: 'linear-gradient(90deg, transparent 0%, #00e5ff 35%, rgba(0,229,255,0.3) 65%, transparent 100%)' }} />

                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', height: 52, gap: 6 }}>

                    {/* Logo */}
                    <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0, marginRight: 10 }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: 3, background: '#00e5ff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 16px rgba(0,229,255,0.45)',
                        }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <rect x="1" y="1" width="5" height="5" fill="#0a1520" rx="0.5"/>
                                <rect x="8" y="1" width="5" height="5" fill="#0a1520" rx="0.5" opacity="0.6"/>
                                <rect x="1" y="8" width="5" height="5" fill="#0a1520" rx="0.5" opacity="0.6"/>
                                <rect x="8" y="8" width="5" height="5" fill="#0a1520" rx="0.5" opacity="0.3"/>
                            </svg>
                        </div>
                        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 17, letterSpacing: '0.06em', color: '#fff' }}>
              KALA<span style={{ color: '#00e5ff' }}>KIT</span>
            </span>
                    </Link>

                    {/* Divider */}
                    <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.07)', marginRight: 6, flexShrink: 0 }} />

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-0.5" style={{ flex: 1 }}>
                        {NAV.map(({ href, icon: Icon, label }) => {
                            const on = pathname === href || pathname.startsWith(href + '/');
                            return (
                                <Link key={href} href={href} className={`kk-link${on ? ' on' : ''}`}>
                                    <Icon style={{ width: 13, height: 13, flexShrink: 0 }} />
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex md:hidden" style={{ flex: 1 }} />

                    {/* Profile */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <button
                            className={`kk-avatar-btn${profileOpen ? ' open' : ''}`}
                            onClick={() => setProfileOpen(p => !p)}
                        >
                            <div style={{
                                width: 26, height: 26, borderRadius: 3, flexShrink: 0,
                                background: 'rgba(0,229,255,0.15)', border: '1px solid rgba(0,229,255,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
                                fontSize: 11, color: '#00e5ff', letterSpacing: '0.05em',
                            }}>{initials}</div>

                            {user && (
                                <div className="hidden sm:block" style={{ textAlign: 'left' }}>
                                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, color: '#cbd5e1', lineHeight: 1.2 }}>
                                        {user.firstName} {user.lastName}
                                    </div>
                                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {user.businessType}
                                    </div>
                                </div>
                            )}

                            <ChevronDown style={{ width: 12, height: 12, color: '#334155', transition: 'transform 0.15s', transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                        </button>

                        {profileOpen && (
                            <>
                                <div style={{ position: 'fixed', inset: 0, zIndex: 190 }} onClick={() => setProfileOpen(false)} />
                                <div className="kk-profile-drop">
                                    <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>
                                            {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
                                        </div>
                                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#334155', marginTop: 2 }}>
                                            {user?.businessType ?? ''}
                                        </div>
                                    </div>
                                    <div style={{ padding: '6px 0' }}>
                                        <button className="kk-drop-btn" onClick={() => { setProfileOpen(false); router.push('/profile'); }}>
                                            <User style={{ width: 14, height: 14 }} /> My Profile
                                        </button>
                                        <button className="kk-drop-btn" onClick={() => setProfileOpen(false)}>
                                            <Settings style={{ width: 14, height: 14 }} /> Settings
                                        </button>
                                        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '6px 0' }} />
                                        <button className="kk-drop-btn danger" onClick={() => { setProfileOpen(false); router.push('/login'); }}>
                                            <LogOut style={{ width: 14, height: 14 }} /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Hamburger */}
                    <button className="kk-hb md:hidden" onClick={() => setMobileOpen(o => !o)}>
                        {mobileOpen ? <X style={{ width: 15, height: 15 }} /> : <Menu style={{ width: 15, height: 15 }} />}
                    </button>
                </div>

                {/* Mobile drawer */}
                {mobileOpen && (
                    <>
                        <div style={{ position: 'fixed', inset: 0, zIndex: 140, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                             onClick={() => setMobileOpen(false)} />
                        <div className="kk-drawer">
                            {NAV.map(({ href, icon: Icon, label }) => {
                                const on = pathname === href;
                                return (
                                    <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                                          className={`kk-link${on ? ' on' : ''}`}
                                          style={{ display: 'flex', width: '100%', marginBottom: 2 }}>
                                        <Icon style={{ width: 13, height: 13 }} />
                                        {label}
                                        {on && <ChevronRight style={{ width: 12, height: 12, marginLeft: 'auto', color: '#00e5ff' }} />}
                                    </Link>
                                );
                            })}
                        </div>
                    </>
                )}
            </header>
        </>
    );
}