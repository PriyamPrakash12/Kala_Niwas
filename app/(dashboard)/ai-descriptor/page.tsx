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
    explanation: 'Generates a crisp, ready-to-paste product listing — headline, 2-line description, bullet features, and a one-line buyer hook. Perfect for Meesho, Amazon, or WhatsApp catalogues.',
  },
  {
    value: 'loan_summary',
    label: 'Loan Summary',
    color: '#00e5ff',
    icon: '📄',
    explanation: 'Converts your loan details into a short, bank-ready summary paragraph. Use when applying to MUDRA, SBI SME, or any government scheme — copy and paste directly into the application.',
  },
  {
    value: 'business_explanation',
    label: 'Business Pitch',
    color: '#a78bfa',
    icon: '🚀',
    explanation: 'Creates a punchy 5-line elevator pitch — problem, solution, traction, and ask. Ideal for investors, NGOs, wholesale buyers, or MSME grant applications.',
  },
];

const PLACEHOLDERS: Record<string, string> = {
  product:              'E.g., Handwoven Banarasi Silk Saree, red with golden zari work, pure silk, 5.5m, 600g, made by master artisan in Varanasi...',
  loan_summary:         'E.g., Small retail shop, monthly income ₹45,000, requesting ₹2L for inventory expansion, 3 years old, GST filed, credit score 740...',
  business_explanation: 'E.g., Sell handcrafted bamboo furniture from tribal artisans in Assam to urban buyers online. 12 artisans, annual revenue ₹18L, seeking ₹5L expansion capital...',
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
      prompt = `You are a product copywriter for Indian artisans and small businesses. Write a CRISP, CONCISE product listing — easy to copy-paste into any marketplace. 

Product details: ${formData.details}

Output EXACTLY this structure (no extra explanation, no preamble):

**[Product Name]**

[One punchy sentence — what it is, who made it, what makes it special]

**Features:**
• [Material / fabric / base]
• [Dimensions / weight / quantity]
• [Crafting technique or origin]
• [Care or use tip]

**Why buy:** [One sentence — emotional or practical appeal]

Keep the entire output under 80 words. No markdown headers. No extra paragraphs.`;

    } else if (formData.type === 'loan_summary') {
      prompt = `Write a concise loan application summary for an Indian small business. Under 100 words. Ready to copy-paste into a bank form.

Details: ${formData.details}

Output EXACTLY:

**Business:** [Name and type in one line]
**Financials:** [Monthly income, expenses, net flow in one line]
**Loan Ask:** [Amount and purpose in one line]
**Repayment Capacity:** [One sentence on why they can repay]
**Recommended Scheme:** [Best matching govt scheme in one line]

No extra text. No preamble.`;

    } else {
      prompt = `Write a punchy elevator pitch for an Indian small business. Under 80 words. Ready to present or paste.

Details: ${formData.details}

Output EXACTLY:

**Hook:** [One bold opening sentence]
**Problem:** [One sentence — what gap exists]
**Solution:** [One sentence — what you do]
**Traction:** [One sentence — revenue, customers, artisans, or growth]
**Ask:** [One sentence — what you need and why]

No extra text. No preamble.`;
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
    if (result) {
      // Strip markdown for clean copy
      const clean = result.replace(/\*\*/g, '').replace(/\*/g, '').replace(/^#+\s/gm, '');
      navigator.clipboard.writeText(clean);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap');
        .ad-wrap * { font-family:'Barlow',sans-serif; box-sizing:border-box; }
        .ad-type-btn { transition:all 0.2s; }
        .ad-type-btn:hover { transform:translateY(-2px); }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation:fadeUp 0.35s ease forwards; }
        @keyframes spin { to{transform:rotate(360deg)} }

        /* Result box — clean readable output */
        .result-box { background:rgba(13,27,36,0.95); border-radius:6px; padding:20px 22px; font-size:14px; line-height:1.8; color:#cbd5e1; white-space:pre-wrap; word-break:break-word; }
        .result-box strong { color:#fff; font-weight:700; }
        .result-box .label { font-size:10px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:var(--ac); margin-bottom:2px; display:block; margin-top:12px; }
        .result-box .label:first-child { margin-top:0; }

        /* Markdown override — keep it simple */
        .prose-md p { color:#94a3b8; line-height:1.8; margin:4px 0; font-size:14px; }
        .prose-md strong { color:#e2e8f0; }
        .prose-md ul { color:#94a3b8; padding-left:18px; margin:6px 0; }
        .prose-md li { margin:3px 0; font-size:14px; }
      `}</style>

        <div className="ad-wrap min-h-screen p-4 md:p-8 relative overflow-hidden" style={{ background:'#0d1b24' }}>
          <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'360px', height:'360px', borderRadius:'50%', background:'radial-gradient(circle,rgba(249,115,22,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:'280px', height:'280px', borderRadius:'50%', background:'radial-gradient(circle,rgba(0,229,255,0.07) 0%,transparent 70%)', pointerEvents:'none' }} />

          <div style={{ maxWidth:580, margin:'0 auto', position:'relative', zIndex:10 }}>

            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
              <div style={{ width:42, height:42, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(249,115,22,0.15)', border:'1px solid rgba(249,115,22,0.3)', flexShrink:0 }}>
                <Sparkles style={{ width:20, height:20, color:'#f97316' }} />
              </div>
              <div>
                <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:26, textTransform:'uppercase', letterSpacing:'0.04em', color:'#fff', margin:0 }}>AI Descriptor</h1>
                <p style={{ fontSize:12, color:'#64748b', marginTop:2 }}>Crisp, copy-paste ready descriptions in seconds</p>
              </div>
            </div>

            {/* Type selector */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:16 }}>
              {TYPES.map((t) => (
                  <button key={t.value} type="button" className="ad-type-btn"
                          onClick={() => { setFormData({ ...formData, type: t.value }); setShowTip(true); setResult(null); }}
                          style={{ padding:'14px 10px', borderRadius:6, border:`1px solid ${formData.type===t.value?`${t.color}50`:'rgba(255,255,255,0.07)'}`, background: formData.type===t.value?`${t.color}12`:'rgba(255,255,255,0.02)', textAlign:'left', boxShadow: formData.type===t.value?`0 0 14px ${t.color}18`:'none', cursor:'pointer' }}>
                    <div style={{ fontSize:18, marginBottom:6 }}>{t.icon}</div>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', color: formData.type===t.value?t.color:'#64748b' }}>{t.label}</div>
                  </button>
              ))}
            </div>

            {/* Info tip */}
            {showTip && (
                <div style={{ display:'flex', gap:10, padding:'12px 14px', borderRadius:5, background:`${activeType.color}08`, border:`1px solid ${activeType.color}22`, marginBottom:16 }}>
                  <Info style={{ width:14, height:14, color:activeType.color, flexShrink:0, marginTop:1 }} />
                  <p style={{ fontSize:12, color:'#7a9ab4', lineHeight:1.6, margin:0 }}>{activeType.explanation}</p>
                </div>
            )}

            {/* Form */}
            <div style={{ background:'rgba(17,31,42,0.9)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:20 }}>
              <form onSubmit={handleSubmit}>
                <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8, color:activeType.color }}>
                  Describe your {formData.type === 'product' ? 'product' : formData.type === 'loan_summary' ? 'loan details' : 'business'}
                </label>
                <textarea
                    style={{ width:'100%', borderRadius:5, padding:'11px 13px', fontSize:13, color:'white', background:'rgba(13,27,36,0.8)', border:'1px solid rgba(255,255,255,0.08)', minHeight:120, resize:'vertical', lineHeight:1.65, fontFamily:"'Barlow',sans-serif", outline:'none', transition:'border-color 0.18s,box-shadow 0.18s' }}
                    required
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder={PLACEHOLDERS[formData.type]}
                    onFocus={(e) => { e.target.style.borderColor=activeType.color; e.target.style.boxShadow=`0 0 0 3px ${activeType.color}15`; }}
                    onBlur={(e)  => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none'; }}
                />
                <p style={{ fontSize:11, color:'#334155', marginTop:5, marginBottom:14 }}>
                  Include materials, size/weight, origin, and target buyer for best results.
                </p>

                {error && (
                    <div style={{ marginBottom:12, padding:'9px 13px', borderRadius:5, background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.3)', color:'#f87171', fontSize:13 }}>
                      ⚠ {error}
                    </div>
                )}

                <button type="submit" disabled={loading || !formData.details.trim()}
                        style={{ width:'100%', padding:'11px', borderRadius:5, fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:12, letterSpacing:'0.07em', textTransform:'uppercase', display:'flex', alignItems:'center', justifyContent:'center', gap:8, background: loading || !formData.details.trim() ? `${activeType.color}35` : activeType.color, color:'#0d1b24', cursor: loading ? 'not-allowed':'pointer', border:'none', transition:'all 0.18s' }}>
                  {loading
                      ? <><Loader2 style={{ width:15, height:15, animation:'spin 1s linear infinite' }} /> Generating...</>
                      : <><Sparkles style={{ width:15, height:15 }} /> Generate</>
                  }
                </button>
              </form>
            </div>

            {/* Result */}
            {result && (
                <div className="fade-up" style={{ marginTop:16 }}>
                  {/* Header bar */}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', borderRadius:'6px 6px 0 0', background:`${activeType.color}14`, border:`1px solid ${activeType.color}30`, borderBottom:'none' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', background:activeType.color }} />
                      <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:activeType.color }}>Ready to Copy</span>
                    </div>
                    <button onClick={handleCopy}
                            style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 12px', borderRadius:3, fontSize:11, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase', background: copied?'rgba(34,197,94,0.15)':'rgba(255,255,255,0.06)', color: copied?'#4ade80':'#94a3b8', border:`1px solid ${copied?'rgba(34,197,94,0.35)':'rgba(255,255,255,0.1)'}`, cursor:'pointer', fontFamily:"'Barlow',sans-serif", transition:'all 0.15s' }}>
                      {copied ? <><Check style={{ width:12, height:12 }} /> Copied!</> : <><Copy style={{ width:12, height:12 }} /> Copy Text</>}
                    </button>
                  </div>

                  {/* Output box */}
                  <div style={{ background:'rgba(11,18,26,0.97)', border:`1px solid ${activeType.color}28`, borderRadius:'0 0 6px 6px', padding:'18px 20px' }}>
                    <div className="prose-md"><Markdown>{result}</Markdown></div>
                  </div>

                  {/* Character count hint */}
                  <p style={{ fontSize:11, color:'#1e3a47', marginTop:6, textAlign:'right' }}>
                    {result.replace(/\*\*/g,'').replace(/\*/g,'').length} characters
                  </p>
                </div>
            )}
          </div>
        </div>
      </>
  );
}