'use client';

import { useState } from 'react';
import { Loader2, Sparkles, Copy, Check, Info } from 'lucide-react';
import dynamic from 'next/dynamic';
const Markdown = dynamic(() => import('react-markdown'), { ssr: false });

const TYPES = [
  {
    value: 'product',
    label: 'Product Description',
    color: '#f97316',
    icon: '🎨',
    explanation: 'Generates compelling, culturally resonant copy for your handmade or retail product — highlights craftsmanship, materials, and buyer appeal. Perfect for marketplaces like Meesho, Amazon, or your own shop.',
  },
  {
    value: 'loan_summary',
    label: 'Loan Summary',
    color: '#00e5ff',
    icon: '📄',
    explanation: 'Converts your raw loan details (income, business type, amount needed) into a professional bank-ready summary. Use this when applying to MUDRA, SBI SME, or any government scheme.',
  },
  {
    value: 'business_explanation',
    label: 'Business Pitch',
    color: '#a78bfa',
    icon: '🚀',
    explanation: 'Creates a concise elevator pitch for your business — ideal for presenting to investors, wholesale buyers, NGOs, or applying for MSME grants. Makes your story trustworthy and memorable.',
  },
];

const PLACEHOLDERS: Record<string, string> = {
  product:              'E.g., Handwoven Banarasi Silk Saree, red color with golden zari work, made by master artisan in Varanasi. Weight 600g, 5.5m length, pure silk...',
  loan_summary:         'E.g., Small retail shop, monthly income ₹45,000, requesting ₹2L business loan for inventory expansion, 3 years in business, GST filed...',
  business_explanation: 'E.g., We sell handcrafted bamboo furniture directly from tribal artisans in Assam to urban buyers. 12 artisans employed, annual revenue ₹18L...',
};

export default function AIDescriptor() {
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState<string | null>(null);
  const [copied,   setCopied]   = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [showTip,  setShowTip]  = useState(true);
  const [formData, setFormData] = useState({ type: 'product', details: '' });

  const activeType = TYPES.find((t) => t.value === formData.type)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    setShowTip(false);

    let prompt = '';
    if (formData.type === 'product') {
      prompt = `You are an expert copywriter for Indian small businesses and artisans. Write a compelling, culturally resonant product description for: ${formData.details}. 
Structure your response with:
1. A punchy headline (bold)
2. A 3–4 sentence description highlighting craftsmanship, materials, and unique appeal
3. Key Features as bullet points (material, dimensions/weight if mentioned, care instructions)
4. A short "Why Buy" section with emotional appeal
Keep tone warm, authentic, and suitable for Indian e-commerce platforms.`;
    } else if (formData.type === 'loan_summary') {
      prompt = `You are a financial advisor specialising in Indian small business loans. Summarize the following details into a clear, professional summary for a bank application: ${formData.details}.
Include: Business overview, financial snapshot, loan purpose, repayment capacity assessment, and recommended loan type with brief justification. Format professionally with headers.`;
    } else {
      prompt = `You are a business consultant. Write a professional elevator pitch based on: ${formData.details}.
Structure: 1. Opening hook (1 sentence). 2. The Problem you solve. 3. Your Solution & Unique Value. 4. Market & Traction. 5. Ask / Call to action. Keep it under 200 words, persuasive and specific.`;
    }

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
        .ad-wrap * { font-family:'Barlow',sans-serif; box-sizing:border-box; }
        .ad-type-btn { transition:all 0.2s; }
        .ad-type-btn:hover { transform:translateY(-2px); }
        .ad-textarea:focus { outline:none; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation:fadeUp 0.4s ease forwards; }
        .prose-result h1,.prose-result h2,.prose-result h3 { color:white; margin:1em 0 0.5em; font-weight:700; font-family:'Barlow Condensed',sans-serif; letter-spacing:0.04em; text-transform:uppercase; }
        .prose-result p { color:#94a3b8; line-height:1.8; margin:0.5em 0; }
        .prose-result strong { color:#e2e8f0; }
        .prose-result ul,.prose-result ol { color:#94a3b8; padding-left:1.5em; }
        .prose-result li { margin:0.3em 0; }
        .prose-result table { width:100%; border-collapse:collapse; margin:1em 0; }
        .prose-result th { background:rgba(0,229,255,0.1); color:#00e5ff; padding:8px 12px; text-align:left; font-size:12px; letter-spacing:0.06em; text-transform:uppercase; border:1px solid rgba(0,229,255,0.2); }
        .prose-result td { padding:8px 12px; color:#94a3b8; font-size:13px; border:1px solid rgba(255,255,255,0.06); }
        .prose-result tr:nth-child(even) td { background:rgba(255,255,255,0.02); }
      `}</style>

        <div className="ad-wrap min-h-screen p-4 md:p-8 relative overflow-hidden" style={{ background:'#0d1b24' }}>
          <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle,rgba(249,115,22,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle,rgba(0,229,255,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />

          <div className="max-w-2xl mx-auto relative" style={{ zIndex:10 }}>

            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
              <div style={{ width:42, height:42, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(249,115,22,0.15)', border:'1px solid rgba(249,115,22,0.3)' }}>
                <Sparkles style={{ width:20, height:20, color:'#f97316' }} />
              </div>
              <div>
                <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:28, textTransform:'uppercase', letterSpacing:'0.04em', color:'#fff', margin:0 }}>AI Descriptor</h1>
                <p style={{ fontSize:12, color:'#64748b', marginTop:2 }}>Generate compelling copy instantly — product listings, loan docs & business pitches</p>
              </div>
            </div>

            {/* Type selector */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:20 }}>
              {TYPES.map((t) => (
                  <button key={t.value} type="button" onClick={() => { setFormData({ ...formData, type: t.value }); setShowTip(true); setResult(null); }}
                          className="ad-type-btn"
                          style={{ padding:'14px 12px', borderRadius:6, border:`1px solid ${formData.type===t.value?`${t.color}50`:'rgba(255,255,255,0.07)'}`, background: formData.type===t.value?`${t.color}12`:'rgba(255,255,255,0.02)', textAlign:'left', boxShadow: formData.type===t.value?`0 0 16px ${t.color}18`:'none', cursor:'pointer' }}>
                    <div style={{ fontSize:20, marginBottom:6 }}>{t.icon}</div>
                    <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color: formData.type===t.value?t.color:'#64748b' }}>{t.label}</div>
                  </button>
              ))}
            </div>

            {/* Feature explanation card */}
            {showTip && (
                <div style={{ display:'flex', gap:12, padding:'14px 16px', borderRadius:6, background:`${activeType.color}08`, border:`1px solid ${activeType.color}25`, marginBottom:20 }}>
                  <Info style={{ width:16, height:16, color:activeType.color, flexShrink:0, marginTop:2 }} />
                  <p style={{ fontSize:13, color:'#7a9ab4', lineHeight:1.65, margin:0 }}>{activeType.explanation}</p>
                </div>
            )}

            {/* Form card */}
            <div style={{ background:'rgba(17,31,42,0.9)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
              <form onSubmit={handleSubmit}>
                <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10, color:activeType.color }}>
                  Describe your {formData.type === 'product' ? 'product' : formData.type === 'loan_summary' ? 'loan details' : 'business'}
                </label>
                <textarea
                    className="ad-textarea"
                    style={{ width:'100%', borderRadius:6, padding:'12px 14px', fontSize:13, color:'white', background:'rgba(13,27,36,0.8)', border:'1px solid rgba(255,255,255,0.08)', minHeight:140, resize:'vertical', lineHeight:1.65, fontFamily:"'Barlow',sans-serif" }}
                    required
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder={PLACEHOLDERS[formData.type]}
                    onFocus={(e) => { e.target.style.borderColor=activeType.color; e.target.style.boxShadow=`0 0 0 3px ${activeType.color}18`; }}
                    onBlur={(e)  => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; }}
                />

                <div style={{ fontSize:11, color:'#334155', marginTop:6, marginBottom:16 }}>
                  Tip: The more detail you provide (materials, dimensions, region, target buyer), the better the output.
                </div>

                {error && (
                    <div style={{ marginBottom:14, padding:'10px 14px', borderRadius:6, background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.3)', color:'#f87171', fontSize:13 }}>
                      ⚠ {error}
                    </div>
                )}

                <button type="submit" disabled={loading || !formData.details.trim()}
                        style={{ width:'100%', padding:'12px', borderRadius:6, fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:13, letterSpacing:'0.06em', textTransform:'uppercase', display:'flex', alignItems:'center', justifyContent:'center', gap:8, background: loading || !formData.details.trim() ? `${activeType.color}40` : activeType.color, color:'#0d1b24', cursor: loading ? 'not-allowed':'pointer', border:'none', boxShadow: !loading && formData.details.trim() ? `0 0 20px ${activeType.color}30`:'none', transition:'all 0.2s' }}>
                  {loading ? <><Loader2 style={{ width:16, height:16, animation:'spin 1s linear infinite' }} /> Generating...</> : <><Sparkles style={{ width:16, height:16 }} /> Generate</>}
                </button>
              </form>
            </div>

            {/* Result */}
            {result && (
                <div className="fade-up" style={{ marginTop:20, background:'rgba(17,31,42,0.9)', border:`1px solid ${activeType.color}30`, borderRadius:12, padding:24 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                    <span style={{ fontSize:13, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color:activeType.color }}>Generated Result</span>
                    <button onClick={handleCopy} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:4, fontSize:12, fontWeight:600, background: copied?'rgba(0,229,255,0.1)':'rgba(255,255,255,0.05)', color: copied?'#00e5ff':'#64748b', border:'1px solid rgba(255,255,255,0.08)', cursor:'pointer', fontFamily:"'Barlow',sans-serif" }}>
                      {copied ? <><Check style={{ width:12, height:12 }} /> Copied</> : <><Copy style={{ width:12, height:12 }} /> Copy</>}
                    </button>
                  </div>
                  <div className="prose-result" style={{ fontSize:14 }}><Markdown>{result}</Markdown></div>
                </div>
            )}
          </div>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </>
  );
}