'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Sparkles, LifeBuoy, IndianRupee, Image as ImageIcon,
  Bot, Search, ArrowRight, Lightbulb, ChevronRight,
} from 'lucide-react';
import { useUser } from '@/components/UserContext';

const tools = [
  {
    id: 'ai-descriptor',      href: '/ai-descriptor',
    icon: Sparkles,           iconColor: '#f97316',
    tag: 'AI',                title: 'AI Descriptor',      subtitle: 'Content Generation',
    desc: 'Generate compelling product descriptions, loan summaries, and business pitches instantly with AI.',
    cta: 'Generate',          badge: 'Popular',
  },
  {
    id: 'pricing-suggestion', href: '/pricing-suggestion',
    icon: IndianRupee,        iconColor: '#eab308',
    tag: 'PRICING',           title: 'Pricing AI',          subtitle: 'Market Intelligence',
    desc: 'Get data-driven pricing recommendations calibrated to your local market and competition.',
    cta: 'Get Price',          badge: null,
  },
  {
    id: 'loan-matcher',       href: '/loan-matcher',
    icon: Bot,                iconColor: '#00e5ff',
    tag: 'FINANCE',           title: 'Loan Matcher',        subtitle: 'Govt Schemes',
    desc: 'Match MUDRA, PM SVANidhi, and CGTMSE schemes based on your exact eligibility profile.',
    cta: 'Match Loan',         badge: 'New',
  },
  {
    id: 'image-enhancer',     href: '/image-enhancer',
    icon: ImageIcon,          iconColor: '#38bdf8',
    tag: 'VISUAL',            title: 'Image Enhancer',      subtitle: 'AI Processing',
    desc: 'Improve product photo clarity, brightness, and quality for better listings with one click.',
    cta: 'Enhance',            badge: null,
  },
  {
    id: 'support',            href: '/support',
    icon: LifeBuoy,           iconColor: '#a78bfa',
    tag: 'SUPPORT',           title: 'Help Center',         subtitle: 'Advisor Network',
    desc: 'Access FAQs, connect with a live business advisor, or raise a support ticket anytime.',
    cta: 'Get Help',           badge: null,
  },
];

const tips = [
  { label: 'Pro Tip',      text: 'Add your product category when using AI Descriptor — it generates 3× more relevant copy.' },
  { label: 'Did You Know', text: 'PM SVANidhi offers up to ₹50,000 with no collateral for street vendors. Check your eligibility today.' },
  { label: 'Quick Win',    text: 'High-quality product photos increase buyer trust by 60%. Try Image Enhancer on your next listing.' },
  { label: 'Tip',          text: 'Under-pricing is the #1 mistake new vendors make. Let Pricing AI suggest the right number.' },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function Dashboard() {
  const { user } = useUser();
  const [query,   setQuery]   = useState('');
  const [focused, setFocused] = useState(false);

  const tip      = tips[new Date().getDay() % tips.length];
  const filtered = tools.filter(t =>
      !query ||
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.desc.toLowerCase().includes(query.toLowerCase())
  );

  const firstName = user?.firstName ?? 'there';

  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap');

        .db * { box-sizing: border-box; font-family: 'Barlow', sans-serif; }

        /* hero uses slightly lighter teal so it reads as a distinct zone */
        .db-hero {
          position: relative; overflow: hidden;
          background: #112233;
          border-bottom: 1px solid rgba(0,229,255,0.12);
          padding: 52px 24px 48px;
        }
        .db-hero::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #00e5ff 40%, rgba(0,229,255,0.3) 70%, transparent);
        }
        .db-hero-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(0,229,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,229,255,0.05) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 100% at 50% 0%, black 30%, transparent 100%);
        }
        .db-hero-glow {
          position: absolute; top: -120px; right: -80px;
          width: 600px; height: 400px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(0,229,255,0.12) 0%, transparent 65%);
          pointer-events: none;
        }
        .db-hero-glow2 {
          position: absolute; bottom: -100px; left: -60px;
          width: 400px; height: 300px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(0,119,182,0.14) 0%, transparent 65%);
          pointer-events: none;
        }

        /* content area slightly darker than hero */
        .db-body {
          background: #0d1b24;
        }

        .db-search {
          width: 100%; height: 42px; padding: 0 14px 0 38px;
          background: rgba(0,229,255,0.05) !important;
          border: 1px solid rgba(0,229,255,0.18) !important;
          border-radius: 3px; color: #e2e8f0 !important;
          font-family: 'Barlow', sans-serif !important; font-size: 13px !important;
          outline: none !important; transition: all 0.18s !important;
        }
        .db-search::placeholder { color: #4a6880 !important; }
        .db-search:focus {
          border-color: rgba(0,229,255,0.5) !important;
          background: rgba(0,229,255,0.07) !important;
          box-shadow: 0 0 0 3px rgba(0,229,255,0.1) !important;
        }

        .db-tip {
          position: relative; overflow: hidden;
          background: rgba(0,229,255,0.06);
          border: 1px solid rgba(0,229,255,0.18);
          border-radius: 3px; padding: 16px 20px;
          display: flex; align-items: flex-start; gap: 14px;
          transition: border-color 0.18s;
        }
        .db-tip::before {
          content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 2px;
          background: linear-gradient(180deg, #00e5ff, rgba(0,229,255,0.2));
        }
        .db-tip:hover { border-color: rgba(0,229,255,0.35); }

        /* visible section label */
        .db-section-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-size: 11px; letter-spacing: 0.18em;
          text-transform: uppercase; color: #4a6880;
        }

        /* stat cards — enough contrast */
        .db-stat {
          padding: 16px 18px;
          background: rgba(0,229,255,0.05);
          border: 1px solid rgba(0,229,255,0.15);
          border-radius: 3px;
        }

        /* tool cards */
        .db-card {
          position: relative; overflow: hidden;
          background: rgba(17,34,51,0.9);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 3px;
          display: flex; flex-direction: column;
          transition: border-color 0.22s, transform 0.22s, background 0.22s;
        }
        .db-card:hover {
          background: rgba(20,40,60,0.95);
          transform: translateY(-3px);
        }
        .db-card .db-card-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.28s ease;
        }
        .db-card:hover .db-card-bar { transform: scaleX(1); }

        .db-cta {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 11px;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 8px 14px; border-radius: 2px; text-decoration: none;
          border: 1px solid transparent; transition: transform 0.15s;
          align-self: flex-start;
        }
        .db-cta:hover { transform: translateX(2px); }
        .db-cta:hover svg { transform: translateX(3px); }
        .db-cta svg { transition: transform 0.15s; }

        @keyframes dbFu {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .db-fu  { animation: dbFu 0.5s ease both; }
        .db-fu1 { animation-delay: 0.04s; }
        .db-fu2 { animation-delay: 0.12s; }
        .db-fu3 { animation-delay: 0.20s; }
        .db-fu4 { animation-delay: 0.28s; }
      `}</style>

        <div className="db" style={{ minHeight: '100%', background: '#0d1b24' }}>

          {/* ── Hero ── */}
          <div className="db-hero db-fu db-fu1">
            <div className="db-hero-grid" />
            <div className="db-hero-glow" />
            <div className="db-hero-glow2" />

            <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 36 }}>
                <div>
                  {/* visible section label */}
                  <div className="db-section-label" style={{ marginBottom: 10 }}>Dashboard</div>
                  <h1 style={{
                    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
                    fontSize: 'clamp(32px, 5vw, 52px)', textTransform: 'uppercase',
                    letterSpacing: '0.02em', color: '#ffffff', lineHeight: 1, margin: 0,
                  }}>
                    {greeting()},&nbsp;
                    <span style={{ color: '#00e5ff' }}>{firstName}</span>
                  </h1>
                  {/* visible subtitle */}
                  <p style={{ fontSize: 14, color: '#5a7a94', marginTop: 10, fontWeight: 400, margin: '10px 0 0' }}>
                    Your AI-powered business toolkit · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                </div>

                {/* Stat cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, maxWidth: 560 }}>
                  {[
                    { label: 'Tools Available', value: '5',     color: '#00e5ff' },
                    { label: 'Govt Schemes',    value: '12+',   color: '#eab308' },
                    { label: 'Avg Time Saved',  value: '3 hrs', color: '#a78bfa' },
                  ].map(s => (
                      <div key={s.label} className="db-stat">
                        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 26, color: s.color, lineHeight: 1 }}>{s.value}</div>
                        {/* clearly visible label */}
                        <div style={{ fontSize: 11, color: '#4a6880', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 5 }}>{s.label}</div>
                      </div>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div style={{ position: 'relative', maxWidth: 420 }}>
                <Search style={{
                  position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
                  width: 15, height: 15, pointerEvents: 'none',
                  color: focused ? '#00e5ff' : '#4a6880', transition: 'color 0.18s',
                }} />
                <input type="text" placeholder="Search tools..." value={query}
                       onChange={e => setQuery(e.target.value)}
                       onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                       className="db-search"
                />
              </div>
            </div>
          </div>

          {/* ── Content ── */}
          <div className="db-body" style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 24px 60px' }}>

            {/* Tip */}
            <div className="db-tip db-fu db-fu2" style={{ marginBottom: 36 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 3, flexShrink: 0,
                background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Lightbulb style={{ width: 15, height: 15, color: '#00e5ff' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{
                display: 'inline-block', marginBottom: 7,
                fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '3px 8px', borderRadius: 2,
                background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.28)',
                color: '#00e5ff',
              }}>{tip.label}</span>
                {/* clearly visible tip text */}
                <p style={{ fontSize: 13, color: '#7a9ab4', lineHeight: 1.65, margin: 0 }}>{tip.text}</p>
              </div>
              <ChevronRight style={{ width: 14, height: 14, color: '#2a4255', flexShrink: 0, alignSelf: 'center' }} />
            </div>

            {/* Section header */}
            <div className="db-fu db-fu3" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <span className="db-section-label">AI Tools</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(0,229,255,0.1)' }} />
              {/* visible count */}
              <span style={{ fontSize: 11, color: '#4a6880', fontWeight: 600 }}>{filtered.length} available</span>
            </div>

            {/* Cards grid */}
            <div className="db-fu db-fu4" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 8,
            }}>
              {filtered.map(tool => (
                  <div key={tool.id} className="db-card"
                       onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${tool.iconColor}50`; }}
                       onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
                  >
                    <div className="db-card-bar" style={{ background: `linear-gradient(90deg, ${tool.iconColor}, transparent)` }} />

                    <div style={{ padding: '22px 20px 18px' }}>
                      {/* Card header */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: 3, flexShrink: 0,
                            background: `${tool.iconColor}18`, border: `1px solid ${tool.iconColor}35`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <tool.icon style={{ width: 17, height: 17, color: tool.iconColor }} />
                          </div>
                          <div>
                            {/* card title — bright white */}
                            <div style={{
                              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                              fontSize: 17, textTransform: 'uppercase', letterSpacing: '0.04em',
                              color: '#e8f0f8', lineHeight: 1,
                            }}>{tool.title}</div>
                            {/* visible subtitle */}
                            <div style={{
                              fontSize: 10, color: '#4a6880', fontWeight: 600,
                              letterSpacing: '0.07em', textTransform: 'uppercase', marginTop: 3,
                            }}>{tool.subtitle}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                          {tool.badge && (
                              <span style={{
                                fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                                padding: '3px 7px', borderRadius: 2,
                                background: `${tool.iconColor}20`, border: `1px solid ${tool.iconColor}40`,
                                color: tool.iconColor,
                              }}>{tool.badge}</span>
                          )}
                          <span style={{
                            fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                            padding: '3px 7px', borderRadius: 2,
                            background: 'rgba(0,229,255,0.06)', border: '1px solid rgba(0,229,255,0.15)',
                            color: '#4a6880',
                          }}>{tool.tag}</span>
                        </div>
                      </div>

                      <div style={{ height: 1, background: 'rgba(0,229,255,0.08)', marginBottom: 14 }} />

                      {/* clearly readable description */}
                      <p style={{ fontSize: 13, color: '#7a9ab4', lineHeight: 1.75, margin: '0 0 18px' }}>
                        {tool.desc}
                      </p>

                      <Link href={tool.href} className="db-cta"
                            style={{ background: `${tool.iconColor}12`, borderColor: `${tool.iconColor}35`, color: tool.iconColor }}>
                        {tool.cta}
                        <ArrowRight style={{ width: 12, height: 12 }} />
                      </Link>
                    </div>
                  </div>
              ))}

              {filtered.length === 0 && (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{
                      fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 22,
                      textTransform: 'uppercase', color: '#2a4255', letterSpacing: '0.05em', marginBottom: 8,
                    }}>No tools found</div>
                    <p style={{ fontSize: 13, color: '#2a4255' }}>Try a different search term</p>
                  </div>
              )}
            </div>
          </div>
        </div>
      </>
  );
}