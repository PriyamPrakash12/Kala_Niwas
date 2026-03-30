'use client';

import { useState } from 'react';
import { Loader2, IndianRupee, TrendingUp, Copy, Check, Info } from 'lucide-react';
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
  { value:'All Year',   label:'All Year' },
  { value:'Festive',    label:'Festive Season' },
  { value:'Wedding',    label:'Wedding Season' },
  { value:'Summer',     label:'Summer' },
  { value:'Monsoon',    label:'Monsoon' },
];

export default function PricingSuggestion() {
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<string | null>(null);
  const [copied,  setCopied]  = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const [formData, setFormData] = useState({
    productName:      '',
    materialCost:     '',
    laborCost:        '',
    overheadCost:     '',
    competitorPrice:  '',
    targetMarket:     '',
    // New fields
    materialUsed:     '',
    productSize:      '',
    productWeight:    '',
    monthlySales:     '',
    stockAvailable:   '',
    season:           'All Year',
    uniqueFeature:    '',
  });

  const set = (k: string, v: string) => setFormData(f => ({ ...f, [k]: v }));

  const totalCost    = (Number(formData.materialCost)||0) + (Number(formData.laborCost)||0) + (Number(formData.overheadCost)||0);
  const suggestedMin = totalCost > 0 ? Math.round(totalCost * 1.3)  : null;
  const suggestedMax = totalCost > 0 ? Math.round(totalCost * 2.2)  : null;
  const margin       = formData.competitorPrice && totalCost > 0
      ? Math.round(((Number(formData.competitorPrice) - totalCost) / Number(formData.competitorPrice)) * 100)
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    const prompt = `You are an expert pricing strategist for Indian small businesses and artisans.

Product Details:
- Name/Description: ${formData.productName}
- Material Used: ${formData.materialUsed || 'Not specified'}
- Size/Dimensions: ${formData.productSize || 'Not specified'}
- Weight/Volume: ${formData.productWeight || 'Not specified'}
- Unique Feature/USP: ${formData.uniqueFeature || 'Not specified'}

Cost Breakdown:
- Material Cost: ₹${formData.materialCost}
- Labor/Time Cost: ₹${formData.laborCost}
- Overhead Cost: ₹${formData.overheadCost || '0'}
- Total Cost: ₹${totalCost}

Market Context:
- Competitor Price: ₹${formData.competitorPrice || 'Unknown'}
- Target Market: ${formData.targetMarket}
- Peak Season: ${formData.season}
- Monthly Sales Volume: ${formData.monthlySales || 'Not specified'} units
- Current Stock: ${formData.stockAvailable || 'Not specified'} units

Provide a comprehensive pricing analysis with the following sections using Markdown:

## 1. Recommended Price Range
Give a specific ₹ min–max range with clear reasoning.

## 2. Pricing Strategy
Explain the pricing model (cost-plus, value-based, competitive) best suited for this product and market.

## 3. Profit Margin Analysis
| Scenario | Price | Gross Margin | Monthly Profit (est.) |
|---|---|---|---|
Show 3 scenarios: Conservative, Recommended, Premium.

## 4. Sales Insights
- Seasonal pricing tips (peak vs off-season)
- Bundle/discount strategy to move stock faster
- Price psychology tips (e.g., ₹499 vs ₹500)
- Online vs offline pricing difference

## 5. Competitive Positioning
How to justify your price vs competitors — focus on materials, craftsmanship, story.

## 6. Marketing Tips to Justify the Price
3 concrete tactics to help buyers feel the price is fair.

*Note: Analysis based on Indian market conditions. Prices in INR (₹).*`;

    try {
      const res  = await fetch('/api/ai', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type:'text', prompt }) });
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
    if (result) { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap');
        .ps-wrap * { font-family:'Barlow',sans-serif; box-sizing:border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation:fadeUp 0.4s ease forwards; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .prose-result h1,.prose-result h2,.prose-result h3 { color:white; margin:1em 0 0.5em; font-weight:700; font-family:'Barlow Condensed',sans-serif; letter-spacing:0.04em; font-size:16px; text-transform:uppercase; }
        .prose-result p { color:#94a3b8; line-height:1.8; margin:0.5em 0; font-size:14px; }
        .prose-result strong { color:#e2e8f0; }
        .prose-result ul,.prose-result ol { color:#94a3b8; padding-left:1.5em; }
        .prose-result li { margin:0.3em 0; font-size:13px; }
        .prose-result em { color:#64748b; font-size:12px; }
        .prose-result table { width:100%; border-collapse:collapse; margin:1em 0; font-size:13px; }
        .prose-result th { background:rgba(234,179,8,0.12); color:#facc15; padding:8px 12px; text-align:left; font-size:11px; letter-spacing:0.08em; text-transform:uppercase; border:1px solid rgba(234,179,8,0.25); font-weight:700; }
        .prose-result td { padding:8px 12px; color:#94a3b8; border:1px solid rgba(255,255,255,0.06); }
        .prose-result tr:nth-child(even) td { background:rgba(255,255,255,0.02); }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
        textarea:focus { outline:none; }
        .ps-input { width:100%; padding:10px 12px; borderRadius:4px; fontSize:13px; color:white; background:rgba(13,27,36,0.8); border:1px solid rgba(255,255,255,0.08); outline:none; transition:border-color 0.18s,box-shadow 0.18s; font-family:'Barlow',sans-serif; }
        .ps-input:focus { border-color:#eab308; box-shadow:0 0 0 3px rgba(234,179,8,0.1); }
        .ps-label { display:block; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:6px; color:#eab308; }
      `}</style>

        <div className="ps-wrap min-h-screen p-4 md:p-8 relative overflow-hidden" style={{ background:'#0d1b24' }}>
          <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle,rgba(234,179,8,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'-80px', left:'-80px', width:'350px', height:'350px', borderRadius:'50%', background:'radial-gradient(circle,rgba(249,115,22,0.06) 0%,transparent 70%)', pointerEvents:'none' }} />

          <div className="max-w-2xl mx-auto relative" style={{ zIndex:10 }}>

            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
              <div style={{ width:42, height:42, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(234,179,8,0.12)', border:'1px solid rgba(234,179,8,0.3)' }}>
                <IndianRupee style={{ width:20, height:20, color:'#eab308' }} />
              </div>
              <div>
                <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:28, textTransform:'uppercase', letterSpacing:'0.04em', color:'#fff', margin:0 }}>Pricing Suggestion</h1>
                <p style={{ fontSize:12, color:'#64748b', marginTop:2 }}>AI-powered pricing strategy with market insights</p>
              </div>
            </div>

            {/* Info banner */}
            <div style={{ display:'flex', gap:10, padding:'12px 14px', borderRadius:6, background:'rgba(234,179,8,0.06)', border:'1px solid rgba(234,179,8,0.2)', marginBottom:20 }}>
              <Info style={{ width:14, height:14, color:'#eab308', flexShrink:0, marginTop:2 }} />
              <p style={{ fontSize:12, color:'#7a9ab4', lineHeight:1.6, margin:0 }}>
                Fill in material details, size, and sales volume for more accurate pricing. The AI uses cost-plus, value-based, and competitive analysis to suggest the optimal price for your market.
              </p>
            </div>

            {/* Live cost preview */}
            {totalCost > 0 && (
                <div className="fade-up" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:20 }}>
                  {[
                    { label:'Total Cost',           value:`₹${totalCost.toLocaleString('en-IN')}`,     color:'#94a3b8' },
                    { label:'Min Price (30% margin)',value:`₹${suggestedMin!.toLocaleString('en-IN')}`, color:'#facc15' },
                    { label:'Max Price (120% margin)',value:`₹${suggestedMax!.toLocaleString('en-IN')}`,color:'#00e5ff' },
                  ].map((m) => (
                      <div key={m.label} style={{ padding:'12px 14px', borderRadius:6, background:'rgba(17,31,42,0.9)', border:'1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize:10, color:'#475569', marginBottom:4, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' }}>{m.label}</div>
                        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:20, color:m.color }}>{m.value}</div>
                      </div>
                  ))}
                </div>
            )}
            {margin !== null && (
                <div style={{ padding:'8px 14px', borderRadius:6, background: margin >= 20 ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)', border:`1px solid ${margin >= 20 ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`, marginBottom:20, fontSize:12, color: margin >= 20 ? '#4ade80' : '#f87171' }}>
                  {margin >= 20 ? '✓' : '⚠'} At competitor price ₹{formData.competitorPrice}, your margin is <strong>{margin}%</strong> — {margin >= 30 ? 'healthy' : margin >= 20 ? 'acceptable' : 'too thin, consider cutting costs or raising price'}
                </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ background:'rgba(17,31,42,0.9)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24, display:'flex', flexDirection:'column', gap:18 }}>

                {/* Product info */}
                <div>
                  <label className="ps-label">Product Name & Description</label>
                  <textarea value={formData.productName} onChange={e => set('productName', e.target.value)} required rows={2}
                            placeholder="E.g., Hand-painted terracotta pots (set of 3), traditional Rajasthani motifs, used for home décor..."
                            style={{ width:'100%', padding:'10px 12px', borderRadius:4, fontSize:13, color:'white', background:'rgba(13,27,36,0.8)', border:'1px solid rgba(255,255,255,0.08)', outline:'none', resize:'vertical', lineHeight:1.65, fontFamily:"'Barlow',sans-serif", transition:'border-color 0.18s' }}
                            onFocus={e => { e.target.style.borderColor='#eab308'; e.target.style.boxShadow='0 0 0 3px rgba(234,179,8,0.1)'; }}
                            onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; }}
                  />
                </div>

                {/* Material + size + weight */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
                  <div>
                    <label className="ps-label">Material Used</label>
                    <input value={formData.materialUsed} onChange={e => set('materialUsed', e.target.value)} placeholder="e.g. Pure silk, Bamboo, Clay"
                           style={{ width:'100%', padding:'10px 12px', borderRadius:4, fontSize:13, color:'white', background:'rgba(13,27,36,0.8)', border:'1px solid rgba(255,255,255,0.08)', outline:'none', fontFamily:"'Barlow',sans-serif", transition:'border-color 0.18s' }}
                           onFocus={e => { e.target.style.borderColor='#eab308'; e.target.style.boxShadow='0 0 0 3px rgba(234,179,8,0.1)'; }}
                           onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; }}
                    />
                  </div>
                  <div>
                    <label className="ps-label">Size / Dimensions</label>
                    <input value={formData.productSize} onChange={e => set('productSize', e.target.value)} placeholder="e.g. 30×20cm, 5.5m"
                           style={{ width:'100%', padding:'10px 12px', borderRadius:4, fontSize:13, color:'white', background:'rgba(13,27,36,0.8)', border:'1px solid rgba(255,255,255,0.08)', outline:'none', fontFamily:"'Barlow',sans-serif", transition:'border-color 0.18s' }}
                           onFocus={e => { e.target.style.borderColor='#eab308'; e.target.style.boxShadow='0 0 0 3px rgba(234,179,8,0.1)'; }}
                           onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; }}
                    />
                  </div>
                  <div>
                    <label className="ps-label">Weight / Volume</label>
                    <input value={formData.productWeight} onChange={e => set('productWeight', e.target.value)} placeholder="e.g. 500g, 1L"
                           style={{ width:'100%', padding:'10px 12px', borderRadius:4, fontSize:13, color:'white', background:'rgba(13,27,36,0.8)', border:'1px solid rgba(255,255,255,0.08)', outline:'none', fontFamily:"'Barlow',sans-serif", transition:'border-color 0.18s' }}
                           onFocus={e => { e.target.style.borderColor='#eab308'; e.target.style.boxShadow='0 0 0 3px rgba(234,179,8,0.1)'; }}
                           onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; }}
                    />
                  </div>
                </div>

                {/* Unique feature */}
                <div>
                  <label className="ps-label">Unique Feature / USP</label>
                  <input value={formData.uniqueFeature} onChange={e => set('uniqueFeature', e.target.value)} placeholder="e.g. GI-tagged, handmade by tribal artisan, 100% natural dye"
                         style={{ width:'100%', padding:'10px 12px', borderRadius:4, fontSize:13, color:'white', background:'rgba(13,27,36,0.8)', border:'1px solid rgba(255,255,255,0.08)', outline:'none', fontFamily:"'Barlow',sans-serif", transition:'border-color 0.18s' }}
                         onFocus={e => { e.target.style.borderColor='#eab308'; e.target.style.boxShadow='0 0 0 3px rgba(234,179,8,0.1)'; }}
                         onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; }}
                  />
                </div>

                {/* Cost inputs */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
                  {[
                    { k:'materialCost',    l:'Material Cost (₹) *', ph:'150', req:true },
                    { k:'laborCost',       l:'Labor Cost (₹) *',     ph:'200', req:true },
                    { k:'overheadCost',    l:'Overhead (₹)',          ph:'50',  req:false },
                  ].map(f => (
                      <div key={f.k}>
                        <label className="ps-label">{f.l}</label>
                        <div style={{ position:'relative' }}>
                          <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#475569', fontSize:14, fontWeight:700 }}>₹</span>
                          <input type="number" value={(formData as Record<string,string>)[f.k]} onChange={e => set(f.k, e.target.value)} placeholder={f.ph} required={f.req}
                                 style={{ width:'100%', padding:'10px 12px 10px 26px', borderRadius:4, fontSize:13, color:'white', background:'rgba(13,27,36,0.8)', border:'1px solid rgba(255,255,255,0.08)', outline:'none', fontFamily:"'Barlow',sans-serif", transition:'border-color 0.18s' }}
                                 onFocus={e => { e.target.style.borderColor='#eab308'; e.target.style.boxShadow='0 0 0 3px rgba(234,179,8,0.1)'; }}
                                 onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; }}
                          />
                        </div>
                      </div>
                  ))}
                </div>

                {/* Competitor + sales volume + stock */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
                  <div>
                    <label className="ps-label">Competitor Price (₹)</label>
                    <div style={{ position:'relative' }}>
                      <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#475569', fontSize:14, fontWeight:700 }}>₹</span>
                      <input type="number" value={formData.competitorPrice} onChange={e => set('competitorPrice', e.target.value)} placeholder="500"
                             style={{ width:'100%', padding:'10px 12px 10px 26px', borderRadius:4, fontSize:13, color:'white', background:'rgba(13,27,36,0.8)', border:'1px solid rgba(255,255,255,0.08)', outline:'none', fontFamily:"'Barlow',sans-serif", transition:'border-color 0.18s' }}
                             onFocus={e => { e.target.style.borderColor='#eab308'; e.target.style.boxShadow='0 0 0 3px rgba(234,179,8,0.1)'; }}
                             onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="ps-label">Monthly Sales (units)</label>
                    <input type="number" value={formData.monthlySales} onChange={e => set('monthlySales', e.target.value)} placeholder="50"
                           style={{ width:'100%', padding:'10px 12px', borderRadius:4, fontSize:13, color:'white', background:'rgba(13,27,36,0.8)', border:'1px solid rgba(255,255,255,0.08)', outline:'none', fontFamily:"'Barlow',sans-serif", transition:'border-color 0.18s' }}
                           onFocus={e => { e.target.style.borderColor='#eab308'; e.target.style.boxShadow='0 0 0 3px rgba(234,179,8,0.1)'; }}
                           onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; }}
                    />
                  </div>
                  <div>
                    <label className="ps-label">Stock Available</label>
                    <input type="number" value={formData.stockAvailable} onChange={e => set('stockAvailable', e.target.value)} placeholder="200"
                           style={{ width:'100%', padding:'10px 12px', borderRadius:4, fontSize:13, color:'white', background:'rgba(13,27,36,0.8)', border:'1px solid rgba(255,255,255,0.08)', outline:'none', fontFamily:"'Barlow',sans-serif", transition:'border-color 0.18s' }}
                           onFocus={e => { e.target.style.borderColor='#eab308'; e.target.style.boxShadow='0 0 0 3px rgba(234,179,8,0.1)'; }}
                           onBlur={e  => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; }}
                    />
                  </div>
                </div>

                {/* Peak season */}
                <div>
                  <label className="ps-label">Peak Selling Season</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {SEASONS.map(s => (
                        <button key={s.value} type="button" onClick={() => set('season', s.value)}
                                style={{ padding:'6px 14px', borderRadius:3, fontSize:12, fontWeight:600, letterSpacing:'0.05em', cursor:'pointer', fontFamily:"'Barlow',sans-serif", background: formData.season===s.value?'rgba(234,179,8,0.12)':'rgba(255,255,255,0.03)', border:`1px solid ${formData.season===s.value?'rgba(234,179,8,0.4)':'rgba(255,255,255,0.07)'}`, color: formData.season===s.value?'#facc15':'#64748b', transition:'all 0.15s' }}>
                          {s.label}
                        </button>
                    ))}
                  </div>
                </div>

                {/* Target market */}
                <div>
                  <label className="ps-label">Target Market *</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {MARKETS.map(m => (
                        <button key={m.value} type="button" onClick={() => set('targetMarket', m.value)}
                                style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:3, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'Barlow',sans-serif", background: formData.targetMarket===m.value?'rgba(234,179,8,0.12)':'rgba(255,255,255,0.03)', border:`1px solid ${formData.targetMarket===m.value?'rgba(234,179,8,0.4)':'rgba(255,255,255,0.07)'}`, color: formData.targetMarket===m.value?'#facc15':'#64748b', transition:'all 0.15s' }}>
                          <span>{m.icon}</span>{m.label}
                        </button>
                    ))}
                  </div>
                </div>

                {error && (
                    <div style={{ padding:'10px 14px', borderRadius:6, background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.3)', color:'#f87171', fontSize:13 }}>⚠ {error}</div>
                )}

                <button type="submit" disabled={loading || !formData.productName.trim() || !formData.targetMarket}
                        style={{ width:'100%', padding:'13px', borderRadius:6, fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:13, letterSpacing:'0.06em', textTransform:'uppercase', display:'flex', alignItems:'center', justifyContent:'center', gap:8, background: loading || !formData.productName.trim() || !formData.targetMarket ? 'rgba(234,179,8,0.3)' : '#eab308', color:'#0d1b24', cursor: loading?'not-allowed':'pointer', border:'none', boxShadow: !loading && formData.productName.trim() ? '0 0 20px rgba(234,179,8,0.2)':'none', transition:'all 0.2s' }}>
                  {loading ? <><Loader2 style={{ width:16, height:16, animation:'spin 1s linear infinite' }} /> Analyzing...</> : <><TrendingUp style={{ width:16, height:16 }} /> Get Pricing Strategy</>}
                </button>
              </div>
            </form>

            {/* Result */}
            {result && (
                <div className="fade-up" style={{ marginTop:20, background:'rgba(17,31,42,0.9)', border:'1px solid rgba(234,179,8,0.25)', borderRadius:12, padding:24 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:'0.08em', textTransform:'uppercase', color:'#facc15' }}>Pricing Strategy</span>
                    <button onClick={handleCopy} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:4, fontSize:12, fontWeight:600, background: copied?'rgba(0,229,255,0.1)':'rgba(255,255,255,0.05)', color: copied?'#00e5ff':'#64748b', border:'1px solid rgba(255,255,255,0.08)', cursor:'pointer', fontFamily:"'Barlow',sans-serif" }}>
                      {copied ? <><Check style={{ width:12, height:12 }} /> Copied</> : <><Copy style={{ width:12, height:12 }} /> Copy</>}
                    </button>
                  </div>
                  <div className="prose-result"><Markdown>{result}</Markdown></div>
                </div>
            )}
          </div>
        </div>
      </>
  );
}