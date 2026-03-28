'use client';

import { useState } from 'react';
import { Loader2, IndianRupee, TrendingUp, Copy, Check } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import dynamic from 'next/dynamic';
const Markdown = dynamic(() => import('react-markdown'), { ssr: false });

const MARKETS = [
  { value: 'Local Village/Town', label: 'Local / Town', icon: '🏘️' },
  { value: 'Urban Middle Class', label: 'Urban Middle', icon: '🏙️' },
  { value: 'Premium/Boutique', label: 'Premium', icon: '💎' },
  { value: 'Online (E-commerce)', label: 'E-commerce', icon: '🛒' },
  { value: 'Wholesale/B2B', label: 'Wholesale', icon: '📦' },
];

export default function PricingSuggestion() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    productName: '', materialCost: '', laborCost: '', competitorPrice: '', targetMarket: '',
  });

  const totalCost = (Number(formData.materialCost) || 0) + (Number(formData.laborCost) || 0);
  const suggestedMin = totalCost > 0 ? Math.round(totalCost * 1.3) : null;
  const suggestedMax = totalCost > 0 ? Math.round(totalCost * 2.2) : null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setResult(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
      const prompt = `You are an expert pricing strategist for Indian small businesses.
Analyze: Product: ${formData.productName}, Material Cost: ₹${formData.materialCost}, Labor Cost: ₹${formData.laborCost}, Competitor Price: ₹${formData.competitorPrice || 'Unknown'}, Target Market: ${formData.targetMarket}.
Provide: 1. Recommended Price Range (₹). 2. Pricing Strategy rationale. 3. Profit Margin Analysis. 4. Marketing tips to justify the price. Format with Markdown.`;
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      const parts = response.candidates?.[0]?.content?.parts;
      setResult(parts ? parts.filter((p) => p.text).map((p) => p.text).join('\n') : 'No analysis generated.');
    } catch { setResult('An error occurred. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleCopy = () => {
    if (result) { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');
        .ps-wrap * { font-family:'Sora',sans-serif; box-sizing:border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .prose-result h1,.prose-result h2,.prose-result h3 { color:white; margin:1em 0 0.5em; font-weight:700; }
        .prose-result p { color:#94a3b8; line-height:1.8; margin:0.5em 0; }
        .prose-result strong { color:#e2e8f0; }
        .prose-result ul,.prose-result ol { color:#94a3b8; padding-left:1.5em; }
        .prose-result li { margin:0.3em 0; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
        textarea:focus { outline: none; }
      `}</style>

        <div className="ps-wrap min-h-screen bg-[#0d1b24] p-4 md:p-8 relative overflow-hidden">
          <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle,rgba(234,179,8,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'-80px', left:'-80px', width:'350px', height:'350px', borderRadius:'50%', background:'radial-gradient(circle,rgba(249,115,22,0.06) 0%,transparent 70%)', pointerEvents:'none' }} />

          <div className="max-w-2xl mx-auto relative z-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'rgba(234,179,8,0.12)', border:'1px solid rgba(234,179,8,0.3)' }}>
                <IndianRupee className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Pricing Suggestion</h1>
                <p className="text-xs text-slate-500 mt-0.5">Smart pricing strategy for your products</p>
              </div>
            </div>

            {/* Live cost preview */}
            {totalCost > 0 && (
                <div className="fade-up grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: 'Total Cost', value: `₹${totalCost.toLocaleString('en-IN')}`, color: '#94a3b8' },
                    { label: 'Min Price (30% margin)', value: `₹${suggestedMin!.toLocaleString('en-IN')}`, color: '#facc15' },
                    { label: 'Max Price (120% margin)', value: `₹${suggestedMax!.toLocaleString('en-IN')}`, color: '#00e5ff' },
                  ].map((m) => (
                      <div key={m.label} className="rounded-xl p-3" style={{ background:'rgba(17,31,42,0.9)', border:'1px solid rgba(255,255,255,0.06)' }}>
                        <div className="text-xs text-slate-500 mb-1">{m.label}</div>
                        <div className="text-base font-bold" style={{ color: m.color }}>{m.value}</div>
                      </div>
                  ))}
                </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ background:'rgba(17,31,42,0.9)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'20px', padding:'24px' }}>

                {/* Product name */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color:'#facc15' }}>Product Name & Description</label>
                  <textarea name="productName" value={formData.productName} onChange={handleInputChange} required rows={2}
                            placeholder="E.g., Hand-painted terracotta pots (set of 3), traditional Rajasthani motifs..."
                            className="w-full text-sm text-white rounded-xl px-4 py-3 resize-none transition-all"
                            style={{ background:'rgba(13,27,36,0.7)', border:'1px solid rgba(255,255,255,0.07)' }}
                            onFocus={(e) => { e.target.style.borderColor='#facc15'; e.target.style.boxShadow='0 0 0 3px rgba(234,179,8,0.1)'; }}
                            onBlur={(e) => { e.target.style.borderColor='rgba(255,255,255,0.07)'; e.target.style.boxShadow='none'; }}
                  />
                </div>

                {/* Costs */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  {[
                    { name:'materialCost', label:'Material Cost (₹)', placeholder:'150' },
                    { name:'laborCost', label:'Labor / Time Cost (₹)', placeholder:'200' },
                    { name:'competitorPrice', label:'Competitor Price (₹) — Optional', placeholder:'500' },
                  ].map((f) => (
                      <div key={f.name} className={f.name === 'competitorPrice' ? 'col-span-2 md:col-span-1' : ''}>
                        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color:'#facc15' }}>{f.label}</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">₹</span>
                          <input type="number" name={f.name} value={(formData as Record<string, string>)[f.name]} onChange={handleInputChange}
                                 placeholder={f.placeholder} required={f.name !== 'competitorPrice'}
                                 className="w-full text-sm text-white rounded-xl pl-8 pr-4 py-3 outline-none transition-all"
                                 style={{ background:'rgba(13,27,36,0.7)', border:'1px solid rgba(255,255,255,0.07)' }}
                                 onFocus={(e) => { e.target.style.borderColor='#facc15'; e.target.style.boxShadow='0 0 0 3px rgba(234,179,8,0.1)'; }}
                                 onBlur={(e) => { e.target.style.borderColor='rgba(255,255,255,0.07)'; e.target.style.boxShadow='none'; }}
                          />
                        </div>
                      </div>
                  ))}
                </div>

                {/* Target market */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color:'#facc15' }}>Target Market</label>
                  <div className="flex flex-wrap gap-2">
                    {MARKETS.map((m) => (
                        <button key={m.value} type="button" onClick={() => setFormData({ ...formData, targetMarket: m.value })}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                                style={{ background: formData.targetMarket === m.value ? 'rgba(234,179,8,0.12)' : 'rgba(255,255,255,0.03)', border:`1px solid ${formData.targetMarket === m.value ? 'rgba(234,179,8,0.4)' : 'rgba(255,255,255,0.06)'}`, color: formData.targetMarket === m.value ? '#facc15' : '#64748b' }}>
                          <span>{m.icon}</span>{m.label}
                        </button>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading || !formData.productName.trim() || !formData.targetMarket}
                        className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                        style={{ background: loading || !formData.productName.trim() || !formData.targetMarket ? 'rgba(234,179,8,0.3)' : '#eab308', color:'#0d1b24', cursor: loading ? 'not-allowed':'pointer', boxShadow: !loading && formData.productName.trim() ? '0 0 20px rgba(234,179,8,0.2)':'none' }}>
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><TrendingUp className="w-4 h-4" /> Get Pricing Suggestion</>}
                </button>
              </div>
            </form>

            {/* Result */}
            {result && (
                <div className="fade-up mt-6" style={{ background:'rgba(17,31,42,0.9)', border:'1px solid rgba(234,179,8,0.25)', borderRadius:'20px', padding:'24px' }}>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-sm font-semibold text-yellow-400">Pricing Strategy</span>
                    <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                            style={{ background: copied ? 'rgba(0,229,255,0.1)':'rgba(255,255,255,0.05)', color: copied ? '#00e5ff':'#64748b', border:'1px solid rgba(255,255,255,0.06)' }}>
                      {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                    </button>
                  </div>
                  <div className="prose-result text-sm"><Markdown>{result}</Markdown></div>
                </div>
            )}
          </div>
        </div>
      </>
  );
}