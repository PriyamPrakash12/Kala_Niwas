'use client';

import { useState } from 'react';
import { Loader2, IndianRupee, TrendingUp, Copy, Check, Info, AlignLeft, AlignJustify } from 'lucide-react';
import dynamic from 'next/dynamic';
const Markdown = dynamic(() => import('react-markdown'), { ssr: false });

const MARKETS = [
  { value:'Local Village/Town',  label:'Local / Town',  icon:'🏘️' },
  { value:'Urban Middle Class',  label:'Urban Middle',  icon:'🏙️' },
  { value:'Premium/Boutique',    label:'Premium',       icon:'💎' },
  { value:'Online (E-commerce)', label:'E-commerce',    icon:'🛒' },
  { value:'Wholesale/B2B',       label:'Wholesale',     icon:'📦' },
];

const SEASONS = [
  { value:'All Year',      label:'All Year' },
  { value:'Festive',       label:'Festive Season' },
  { value:'Wedding',       label:'Wedding Season' },
  { value:'Summer',        label:'Summer' },
  { value:'Monsoon',       label:'Monsoon' },
];

type OutputMode = 'short' | 'long';

const MODE_CONFIG = {
  short: {
    label: 'Short',
    sublabel: 'Quick 5-bullet summary',
    icon: AlignLeft,
    color: '#00e5ff',
    description: 'Key numbers only — price range, margin, 3 tips. Done in seconds.',
  },
  long: {
    label: 'Detailed',
    sublabel: 'Full strategy report',
    icon: AlignJustify,
    color: '#eab308',
    description: 'Full analysis — strategy, profit scenarios, sales insights, competitive positioning, marketing tips.',
  },
};

export default function PricingSuggestion() {
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState<string | null>(null);
  const [copied,     setCopied]     = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [outputMode, setOutputMode] = useState<OutputMode>('short');

  const [formData, setFormData] = useState({
    productName:     '',
    materialCost:    '',
    laborCost:       '',
    overheadCost:    '',
    competitorPrice: '',
    targetMarket:    '',
    materialUsed:    '',
    productSize:     '',
    productWeight:   '',
    monthlySales:    '',
    stockAvailable:  '',
    season:          'All Year',
    uniqueFeature:   '',
  });

  const set = (k: string, v: string) => setFormData(f => ({ ...f, [k]: v }));

  const totalCost    = (Number(formData.materialCost)||0) + (Number(formData.laborCost)||0) + (Number(formData.overheadCost)||0);
  const suggestedMin = totalCost > 0 ? Math.round(totalCost * 1.3)  : null;
  const suggestedMax = totalCost > 0 ? Math.round(totalCost * 2.2)  : null;
  const margin       = formData.competitorPrice && totalCost > 0
      ? Math.round(((Number(formData.competitorPrice) - totalCost) / Number(formData.competitorPrice)) * 100)
      : null;

  const activeColor = outputMode === 'short' ? '#00e5ff' : '#eab308';

  const buildPrompt = () => {
    const base = `Product: ${formData.productName}
Material: ${formData.materialUsed||'N/A'} | Size: ${formData.productSize||'N/A'} | Weight: ${formData.productWeight||'N/A'}
USP: ${formData.uniqueFeature||'N/A'}
Cost: Material ₹${formData.materialCost} + Labor ₹${formData.laborCost} + Overhead ₹${formData.overheadCost||'0'} = Total ₹${totalCost}
Competitor: ₹${formData.competitorPrice||'Unknown'} | Market: ${formData.targetMarket} | Season: ${formData.season}
Sales: ${formData.monthlySales||'N/A'} units/mo | Stock: ${formData.stockAvailable||'N/A'} units`;

    if (outputMode === 'short') {
      return `You are a pricing expert for Indian small businesses.

STRICT RULES — SHORT MODE:
- Output ONLY bullet points. No paragraphs. No tables. No headers except the 3 below.
- Max 8 words per bullet. One fact per bullet.
- Use ₹ for prices. Use ✅ ⚠️ for status.
- Total output: under 200 words.

${base}

Output exactly these 3 sections:

## 💰 Recommended Price
- Minimum: ₹[value] — [1 reason, 4 words]
- Recommended: ₹[value] — [1 reason, 4 words]
- Maximum: ₹[value] — [1 reason, 4 words]
- Margin at recommended: [X]% [✅/⚠️]

## ⚡ Key Pricing Tips
- [tip 1, 8 words max]
- [tip 2, 8 words max]
- [tip 3, 8 words max]
- [tip 4, 8 words max]
- [tip 5 — seasonal/stock tip, 8 words max]

## 🎯 One Action
- [Single most important thing to do right now, 10 words]`;
    }

    return `You are an expert pricing strategist for Indian small businesses and artisans.

RULES — DETAILED MODE:
- Use bullet points inside sections. Max 10 words per bullet.
- Sections can have short intro lines (1 sentence max) followed by bullets.
- Use ₹ for prices. Bold (**) key numbers and scheme names only.
- No tables. Clean, readable, scannable.

${base}

Generate the following 6 sections:

## 💰 1. Recommended Price Range
- Minimum viable: ₹[X] — [reason]
- Recommended sell price: ₹[X] — [reason]  
- Premium positioning: ₹[X] — [reason]
- Gross margin at recommended: [X]% [✅ healthy / ⚠️ tight]
- Break-even units/month: [X] units at recommended price

## 📊 2. Profit Scenarios
Three scenarios — one bullet each:
- **Conservative** (₹[price]): ₹[margin]% margin · ₹[monthly profit] est. monthly profit
- **Recommended** (₹[price]): ₹[margin]% margin · ₹[monthly profit] est. monthly profit  
- **Premium** (₹[price]): ₹[margin]% margin · ₹[monthly profit] est. monthly profit

## 🧠 3. Pricing Strategy
- Best model for this product: [cost-plus / value-based / competitive] — [1 reason]
- [strategy bullet 1]
- [strategy bullet 2]
- [strategy bullet 3]

## 📈 4. Sales Insights
- **Seasonal:** [tip for ${formData.season} peak, 8 words]
- **Bundle:** [bundle/discount idea to move stock, 8 words]
- **Psychology:** [price ending tip e.g. ₹499 vs ₹500, 8 words]
- **Online vs Offline:** [pricing difference tip, 8 words]
- **Stock tip:** ${formData.stockAvailable ? `With ${formData.stockAvailable} units` : 'General stock'} — [move stock tip, 8 words]

## 🏆 5. Competitive Positioning vs ₹${formData.competitorPrice||'competitors'}
- [how to justify higher price — material/craft angle, 8 words]
- [story/origin angle, 8 words]
- [quality signal buyers look for, 8 words]
- [one differentiator to highlight in listing, 8 words]

## 📣 6. Marketing Tips to Justify Price
- **Tip 1:** [concrete tactic, 8 words]
- **Tip 2:** [concrete tactic, 8 words]
- **Tip 3:** [concrete tactic, 8 words]

*Prices in INR (₹). Based on Indian market conditions.*`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res  = await fetch('/api/ai', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type:'text', prompt: buildPrompt() }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Server error');
      setResult(data.text);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.replace(/\*\*/g,'').replace(/\*/g,''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap');
        .ps-wrap * { font-family:'Barlow',sans-serif; box-sizing:border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        .fade-up { animation:fadeUp 0.4s ease forwards; }

        /* ── Result styles ── */
        .prose-result h2 {
          font-family:'Barlow Condensed',sans-serif;
          font-weight:800; font-size:15px; text-transform:uppercase;
          letter-spacing:0.06em; color:var(--ac, #eab308);
          margin:24px 0 8px; padding-bottom:5px;
          border-bottom:1px solid rgba(234,179,8,0.15);
        }
        .prose-result h3 {
          font-family:'Barlow Condensed',sans-serif;
          font-weight:700; font-size:13px; color:#7a9ab4;
          margin:12px 0 5px; text-transform:uppercase; letter-spacing:0.05em;
        }

        /* Bullet lists */
        .prose-result ul {
          list-style:none; margin:0 0 4px; padding:0;
        }
        .prose-result ul li {
          position:relative; padding:4px 0 4px 18px;
          font-size:13px; color:#94a3b8; line-height:1.55;
          border-bottom:1px solid rgba(255,255,255,0.035);
        }
        .prose-result ul li:last-child { border-bottom:none; }
        .prose-result ul li::before {
          content:'▸'; position:absolute; left:0; top:5px;
          color:var(--ac, #eab308); font-size:10px; line-height:1;
        }

        /* Sub-bullets */
        .prose-result ul ul { margin:3px 0 1px; padding:0; }
        .prose-result ul ul li {
          font-size:12px; color:#64748b;
          padding:2px 0 2px 14px; border-bottom:none;
        }
        .prose-result ul ul li::before {
          content:'·'; color:#334155; font-size:14px; top:2px;
        }

        /* Inline text */
        .prose-result strong { color:#e2e8f0; font-weight:700; }
        .prose-result p { color:#475569; font-size:12px; line-height:1.6; margin:6px 0; }
        .prose-result em { color:#334155; font-size:11px; }
        .prose-result hr { border:none; border-top:1px solid rgba(255,255,255,0.06); margin:16px 0; }

        input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
        textarea:focus { outline:none; }

        /* Mode toggle buttons */
        .mode-btn { transition:all 0.18s ease; }
        .mode-btn:hover { transform:translateY(-1px); }
      `}</style>

        <div className="ps-wrap min-h-screen p-4 md:p-8 relative overflow-hidden" style={{ background:'#0d1b24' }}>
          <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle,rgba(234,179,8,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'-80px', left:'-80px', width:'350px', height:'350px', borderRadius:'50%', background:'radial-gradient(circle,rgba(249,115,22,0.06) 0%,transparent 70%)', pointerEvents:'none' }} />

          <div style={{ maxWidth:680, margin:'0 auto', position:'relative', zIndex:10 }}>

            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
              <div style={{ width:42, height:42, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(234,179,8,0.12)', border:'1px solid rgba(234,179,8,0.3)', flexShrink:0 }}>
                <IndianRupee style={{ width:20, height:20, color:'#eab308' }} />
              </div>
              <div>
                <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:28, textTransform:'uppercase', letterSpacing:'0.04em', color:'#fff', margin:0 }}>Pricing Suggestion</h1>
                <p style={{ fontSize:12, color:'#64748b', marginTop:2 }}>AI-powered pricing — short summary or full strategy</p>
              </div>
            </div>

            {/* ── Output Mode Toggle ── */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#475569', marginBottom:8 }}>Output Format</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {(['short', 'long'] as OutputMode[]).map(mode => {
                  const cfg = MODE_CONFIG[mode];
                  const Icon = cfg.icon;
                  const active = outputMode === mode;
                  return (
                      <button key={mode} type="button" className="mode-btn"
                              onClick={() => { setOutputMode(mode); setResult(null); }}
                              style={{ padding:'14px 16px', borderRadius:6, textAlign:'left', cursor:'pointer', background:active?`${cfg.color}10`:'rgba(255,255,255,0.02)', border:`1px solid ${active?`${cfg.color}40`:'rgba(255,255,255,0.07)'}`, boxShadow:active?`0 0 14px ${cfg.color}14`:'none', transition:'all 0.18s' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                          <div style={{ width:28, height:28, borderRadius:4, background:active?`${cfg.color}18`:'rgba(255,255,255,0.04)', border:`1px solid ${active?`${cfg.color}30`:'rgba(255,255,255,0.07)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <Icon style={{ width:14, height:14, color:active?cfg.color:'#475569' }} />
                          </div>
                          <div>
                            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, textTransform:'uppercase', letterSpacing:'0.04em', color:active?cfg.color:'#94a3b8', lineHeight:1 }}>{cfg.label}</div>
                            <div style={{ fontSize:10, color:'#334155', marginTop:2, fontWeight:600, letterSpacing:'0.04em' }}>{cfg.sublabel}</div>
                          </div>
                        </div>
                        <p style={{ fontSize:11, color:active?'#7a9ab4':'#2a3a50', margin:0, lineHeight:1.5 }}>{cfg.description}</p>
                      </button>
                  );
                })}
              </div>
            </div>

            {/* Info banner */}
            <div style={{ display:'flex', gap:10, padding:'11px 14px', borderRadius:5, background:`${activeColor}08`, border:`1px solid ${activeColor}20`, marginBottom:20 }}>
              <Info style={{ width:14, height:14, color:activeColor, flexShrink:0, marginTop:2 }} />
              <p style={{ fontSize:12, color:'#7a9ab4', lineHeight:1.6, margin:0 }}>
                {outputMode === 'short'
                    ? 'Short mode: recommended price + 5 key tips + one action. Under 200 words. Quick to read and act on.'
                    : 'Detailed mode: full pricing strategy with profit scenarios, sales insights, competitive positioning, and marketing tips.'}
              </p>
            </div>

            {/* Live cost preview */}
            {totalCost > 0 && (
                <div className="fade-up" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:16 }}>
                  {[
                    { label:'Total Cost',            value:`₹${totalCost.toLocaleString('en-IN')}`,     color:'#94a3b8' },
                    { label:'Min Price (30% margin)', value:`₹${suggestedMin!.toLocaleString('en-IN')}`, color:'#facc15' },
                    { label:'Max Price (120% margin)',value:`₹${suggestedMax!.toLocaleString('en-IN')}`, color:'#00e5ff' },
                  ].map(m => (
                      <div key={m.label} style={{ padding:'11px 14px', borderRadius:5, background:'rgba(17,31,42,0.9)', border:'1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize:10, color:'#475569', marginBottom:3, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' }}>{m.label}</div>
                        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:19, color:m.color }}>{m.value}</div>
                      </div>
                  ))}
                </div>
            )}
            {margin !== null && (
                <div style={{ padding:'8px 14px', borderRadius:5, background:margin>=20?'rgba(34,197,94,0.07)':'rgba(239,68,68,0.07)', border:`1px solid ${margin>=20?'rgba(34,197,94,0.25)':'rgba(239,68,68,0.25)'}`, marginBottom:16, fontSize:12, color:margin>=20?'#4ade80':'#f87171' }}>
                  {margin>=20?'✓':'⚠'} At competitor price ₹{formData.competitorPrice}, your margin is <strong>{margin}%</strong> — {margin>=30?'healthy':margin>=20?'acceptable':'too thin — raise price or cut costs'}
                </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ background:'rgba(17,31,42,0.9)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:22, display:'flex', flexDirection:'column', gap:16 }}>

                {/* Product description */}
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6, color:activeColor }}>Product Name & Description *</label>
                  <textarea value={formData.productName} onChange={e => set('productName', e.target.value)} required rows={2}
                            placeholder="E.g., Hand-painted terracotta pots (set of 3), traditional Rajasthani motifs, home décor..."
                            style={{ width:'100%', padding:'10px 12px', borderRadius:4, fontSize:13, color:'white', background:'rgba(13,27,36,0.8)', border:'1px solid rgba(255,255,255,0.08)', resize:'vertical', lineHeight:1.65, fontFamily:"'Barlow',sans-serif", transition:'border-color 0.18s', outline:'none' }}
                            onFocus={e => { e.target.style.borderColor=activeColor; e.target.style.boxShadow=`0 0 0 3px ${activeColor}15`; }}
                            onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; }}
                  />
                </div>

                {/* Material + size + weight */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
                  {[
                    { k:'materialUsed',  l:'Material Used',     ph:'e.g. Pure silk, Clay' },
                    { k:'productSize',   l:'Size / Dimensions', ph:'e.g. 30×20cm, 5.5m' },
                    { k:'productWeight', l:'Weight / Volume',   ph:'e.g. 500g, 1L' },
                  ].map(f => (
                      <div key={f.k}>
                        <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:5, color:activeColor }}>{f.l}</label>
                        <input value={(formData as Record<string,string>)[f.k]} onChange={e => set(f.k, e.target.value)} placeholder={f.ph}
                               style={{ width:'100%', padding:'9px 12px', borderRadius:4, fontSize:13, color:'white', background:'rgba(13,27,36,0.8)', border:'1px solid rgba(255,255,255,0.08)', outline:'none', fontFamily:"'Barlow',sans-serif", transition:'border-color 0.18s' }}
                               onFocus={e => { e.target.style.borderColor=activeColor; e.target.style.boxShadow=`0 0 0 3px ${activeColor}12`; }}
                               onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; }}
                        />
                      </div>
                  ))}
                </div>

                {/* USP */}
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:5, color:activeColor }}>Unique Feature / USP</label>
                  <input value={formData.uniqueFeature} onChange={e => set('uniqueFeature', e.target.value)} placeholder="e.g. GI-tagged, handmade by tribal artisan, 100% natural dye"
                         style={{ width:'100%', padding:'9px 12px', borderRadius:4, fontSize:13, color:'white', background:'rgba(13,27,36,0.8)', border:'1px solid rgba(255,255,255,0.08)', outline:'none', fontFamily:"'Barlow',sans-serif", transition:'border-color 0.18s' }}
                         onFocus={e => { e.target.style.borderColor=activeColor; e.target.style.boxShadow=`0 0 0 3px ${activeColor}12`; }}
                         onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; }}
                  />
                </div>

                {/* Cost inputs */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
                  {[
                    { k:'materialCost', l:'Material Cost (₹) *', ph:'150', req:true },
                    { k:'laborCost',    l:'Labor Cost (₹) *',    ph:'200', req:true },
                    { k:'overheadCost', l:'Overhead (₹)',         ph:'50',  req:false },
                  ].map(f => (
                      <div key={f.k}>
                        <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:5, color:activeColor }}>{f.l}</label>
                        <div style={{ position:'relative' }}>
                          <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#475569', fontSize:14, fontWeight:700 }}>₹</span>
                          <input type="number" value={(formData as Record<string,string>)[f.k]} onChange={e => set(f.k, e.target.value)} placeholder={f.ph} required={f.req}
                                 style={{ width:'100%', padding:'9px 12px 9px 26px', borderRadius:4, fontSize:13, color:'white', background:'rgba(13,27,36,0.8)', border:'1px solid rgba(255,255,255,0.08)', outline:'none', fontFamily:"'Barlow',sans-serif", transition:'border-color 0.18s' }}
                                 onFocus={e => { e.target.style.borderColor=activeColor; e.target.style.boxShadow=`0 0 0 3px ${activeColor}12`; }}
                                 onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; }}
                          />
                        </div>
                      </div>
                  ))}
                </div>

                {/* Competitor + sales + stock */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
                  {[
                    { k:'competitorPrice', l:'Competitor Price (₹)', ph:'500',  prefix:true },
                    { k:'monthlySales',    l:'Monthly Sales (units)', ph:'50',   prefix:false },
                    { k:'stockAvailable',  l:'Stock Available',       ph:'200',  prefix:false },
                  ].map(f => (
                      <div key={f.k}>
                        <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:5, color:activeColor }}>{f.l}</label>
                        <div style={{ position:'relative' }}>
                          {f.prefix && <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#475569', fontSize:14, fontWeight:700 }}>₹</span>}
                          <input type="number" value={(formData as Record<string,string>)[f.k]} onChange={e => set(f.k, e.target.value)} placeholder={f.ph}
                                 style={{ width:'100%', padding:`9px 12px 9px ${f.prefix?'26px':'12px'}`, borderRadius:4, fontSize:13, color:'white', background:'rgba(13,27,36,0.8)', border:'1px solid rgba(255,255,255,0.08)', outline:'none', fontFamily:"'Barlow',sans-serif", transition:'border-color 0.18s' }}
                                 onFocus={e => { e.target.style.borderColor=activeColor; e.target.style.boxShadow=`0 0 0 3px ${activeColor}12`; }}
                                 onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; }}
                          />
                        </div>
                      </div>
                  ))}
                </div>

                {/* Season */}
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6, color:activeColor }}>Peak Selling Season</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {SEASONS.map(s => (
                        <button key={s.value} type="button" onClick={() => set('season', s.value)}
                                style={{ padding:'6px 14px', borderRadius:3, fontSize:12, fontWeight:600, letterSpacing:'0.05em', cursor:'pointer', fontFamily:"'Barlow',sans-serif", background:formData.season===s.value?`${activeColor}12`:'rgba(255,255,255,0.03)', border:`1px solid ${formData.season===s.value?`${activeColor}40`:'rgba(255,255,255,0.07)'}`, color:formData.season===s.value?activeColor:'#64748b', transition:'all 0.15s' }}>
                          {s.label}
                        </button>
                    ))}
                  </div>
                </div>

                {/* Target market */}
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6, color:activeColor }}>Target Market *</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {MARKETS.map(m => (
                        <button key={m.value} type="button" onClick={() => set('targetMarket', m.value)}
                                style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:3, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'Barlow',sans-serif", background:formData.targetMarket===m.value?`${activeColor}12`:'rgba(255,255,255,0.03)', border:`1px solid ${formData.targetMarket===m.value?`${activeColor}40`:'rgba(255,255,255,0.07)'}`, color:formData.targetMarket===m.value?activeColor:'#64748b', transition:'all 0.15s' }}>
                          <span>{m.icon}</span>{m.label}
                        </button>
                    ))}
                  </div>
                </div>

                {error && (
                    <div style={{ padding:'9px 13px', borderRadius:5, background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.3)', color:'#f87171', fontSize:13 }}>⚠ {error}</div>
                )}

                <button type="submit" disabled={loading || !formData.productName.trim() || !formData.targetMarket}
                        style={{ width:'100%', padding:'13px', borderRadius:5, fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:13, letterSpacing:'0.06em', textTransform:'uppercase', display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:loading||!formData.productName.trim()||!formData.targetMarket?`${activeColor}35`:activeColor, color:'#0d1b24', cursor:loading?'not-allowed':'pointer', border:'none', boxShadow:!loading&&formData.productName.trim()?`0 0 20px ${activeColor}20`:'none', transition:'all 0.2s' }}>
                  {loading
                      ? <><Loader2 style={{ width:16, height:16, animation:'spin 1s linear infinite' }} /> Analyzing...</>
                      : <><TrendingUp style={{ width:16, height:16 }} /> Get {outputMode === 'short' ? 'Quick' : 'Detailed'} Pricing Strategy</>
                  }
                </button>
              </div>
            </form>

            {/* Result */}
            {result && (
                <div className="fade-up" style={{ marginTop:20, background:'rgba(17,31,42,0.9)', border:`1px solid ${activeColor}28`, borderRadius:10, padding:22 }}>
                  {/* Header */}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, paddingBottom:12, borderBottom:`1px solid ${activeColor}15` }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', background:activeColor }} />
                      <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:'0.08em', textTransform:'uppercase', color:activeColor }}>
                    {outputMode === 'short' ? 'Quick Summary' : 'Full Strategy'}
                  </span>
                    </div>
                    <button onClick={handleCopy}
                            style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 12px', borderRadius:3, fontSize:11, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', background:copied?'rgba(34,197,94,0.12)':'rgba(255,255,255,0.05)', color:copied?'#4ade80':'#64748b', border:`1px solid ${copied?'rgba(34,197,94,0.3)':'rgba(255,255,255,0.08)'}`, cursor:'pointer', fontFamily:"'Barlow',sans-serif", transition:'all 0.15s' }}>
                      {copied ? <><Check style={{ width:12, height:12 }} /> Copied</> : <><Copy style={{ width:12, height:12 }} /> Copy</>}
                    </button>
                  </div>

                  {/* Output with dynamic accent color */}
                  <style>{`.prose-result { --ac: ${activeColor}; }`}</style>
                  <div className="prose-result">
                    <Markdown>{result}</Markdown>
                  </div>
                </div>
            )}
          </div>
        </div>
      </>
  );
}