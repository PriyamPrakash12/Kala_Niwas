'use client';

import { useState } from 'react';
import { UploadCloud, Loader2, TrendingUp, ArrowRight, Info } from 'lucide-react';
import dynamic from 'next/dynamic';
const Markdown = dynamic(() => import('react-markdown'), { ssr: false });

const BUSINESS_TYPES = ['Retail','Manufacturing','Services','Artisan/Handicraft','Agriculture/Allied','Street Vendor'];

interface FormData {
  businessName: string; businessType: string; monthlyIncome: string;
  monthlyExpenses: string; existingEmi: string; loanAmount: string;
  businessAge: string; creditScore: string; gstSubmitted: boolean;
  collateralProvided: boolean; businessSize: 'small' | 'large';
}

function FieldInput({ label, name, value, onChange, placeholder = '', type = 'text', prefix = '' }: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; type?: string; prefix?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
      <div>
        <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6, color:'#00e5ff' }}>{label}</label>
        <div style={{ position:'relative' }}>
          {prefix && <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:focused?'#00e5ff':'#475569', fontSize:14, fontWeight:700 }}>{prefix}</span>}
          <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
                 onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                 style={{ width:'100%', padding:prefix?'10px 12px 10px 26px':'10px 12px', borderRadius:4, fontSize:13, color:'white', background:'rgba(13,27,36,0.8)', border:`1px solid ${focused?'#00e5ff':'rgba(255,255,255,0.08)'}`, outline:'none', boxShadow:focused?'0 0 0 3px rgba(0,229,255,0.1)':'none', fontFamily:"'Barlow',sans-serif", transition:'border-color 0.18s,box-shadow 0.18s' }}
          />
        </div>
      </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
      <button type="button" onClick={onChange}
              style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:4, background:checked?'rgba(0,229,255,0.08)':'rgba(255,255,255,0.03)', border:`1px solid ${checked?'rgba(0,229,255,0.3)':'rgba(255,255,255,0.07)'}`, cursor:'pointer', transition:'all 0.15s', width:'100%' }}>
        <div style={{ position:'relative', width:36, height:20, borderRadius:10, background:checked?'#00e5ff':'rgba(255,255,255,0.1)', flexShrink:0, transition:'background 0.2s' }}>
          <div style={{ position:'absolute', top:2, width:16, height:16, borderRadius:'50%', background:'white', left:checked?'calc(100% - 18px)':'2px', transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.3)' }} />
        </div>
        <span style={{ fontSize:13, color:checked?'white':'#64748b' }}>{label}</span>
      </button>
  );
}

export default function LoanMatcher() {
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<string | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    businessName:'', businessType:'', monthlyIncome:'', monthlyExpenses:'',
    existingEmi:'', loanAmount:'', businessAge:'', creditScore:'',
    gstSubmitted:false, collateralProvided:false, businessSize:'small',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const netFlow = formData.monthlyIncome && formData.monthlyExpenses
      ? Number(formData.monthlyIncome) - Number(formData.monthlyExpenses) - Number(formData.existingEmi||0)
      : null;

  const foirPct = formData.monthlyIncome && formData.existingEmi
      ? Math.round(Number(formData.existingEmi) / Number(formData.monthlyIncome) * 100)
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    const isSmall = formData.businessSize === 'small';

    const prompt = `You are an AI financial analyst for Indian small businesses.

STRICT OUTPUT RULES:
- Use ONLY bullet points and section headings. NO tables. NO paragraphs.
- Every bullet = max 8 words. One fact per bullet.
- Use emoji at start of each section heading.
- Sub-bullets allowed (indent with 2 spaces). Max 2 levels deep.
- Bold (**text**) only for scheme names and key numbers.
- Use ✅ ⚠️ ❌ for status indicators inline.

Business Profile:
Name: ${formData.businessName} | Type: ${formData.businessType}
Size: ${isSmall?'Small MSME <₹5Cr':'Large MSME >₹5Cr'}
Income: ₹${formData.monthlyIncome} | Expenses: ₹${formData.monthlyExpenses} | EMI: ₹${formData.existingEmi||'0'}
Net Flow: ₹${netFlow??'N/A'} | Loan: ₹${formData.loanAmount}
Age: ${formData.businessAge}yrs | Score: ${formData.creditScore||'N/A'} | GST: ${formData.gstSubmitted?'Yes':'No'} | Collateral: ${formData.collateralProvided?'Yes':'No'}

Generate the following 7 sections. Each section = heading + bullet list only.

---

## 📊 Financial Snapshot

- Income: ₹${formData.monthlyIncome} ${Number(formData.monthlyIncome)>30000?'✅ Adequate':'⚠️ Low'}
- Expenses: ₹${formData.monthlyExpenses} ${Number(formData.monthlyExpenses)<Number(formData.monthlyIncome)*0.7?'✅ Manageable':'⚠️ High'}
- EMI: ₹${formData.existingEmi||'0'} ${Number(formData.existingEmi||0)===0?'✅ No burden':'⚠️ Existing debt'}
- Net Cash Flow: ₹${netFlow??'N/A'} ${(netFlow??0)>=0?'✅ Positive':'❌ Negative — critical issue'}
- FOIR: ${foirPct??'N/A'}% ${(foirPct??0)<40?'✅ Below 40% — bank preferred':'⚠️ Above 40% — review needed'}
- Loan Requested: ₹${formData.loanAmount} [✅ Feasible / ⚠️ High relative to income — assess]
- Credit Score: ${formData.creditScore||'Not given'} [✅ 750+ / ⚠️ 650–749 / ❌ <650 — fill in status]
- Collateral: ${formData.collateralProvided?'✅ Available — more options':'⚠️ None — use collateral-free schemes'}
- GST: ${formData.gstSubmitted?'✅ Filed — stronger application':'⚠️ Not filed — file before applying'}

---

## 🏦 Loan Eligibility

For each scheme: status + 1 reason bullet.

- **PM MUDRA Shishu** (₹50K, 8–12%, no collateral) — [✅ Eligible / ❌ reason in 4 words]
- **PM MUDRA Kishore** (₹5L, 9–14%, no collateral) — [✅ Best match / ❌ reason]
- **PM MUDRA Tarun** (₹10L, 10–14%, flexible) — [✅ / ❌ reason]
- **PM SVANidhi** (₹50K, 7%, street vendors) — [✅ / ❌ reason]
- **CGTMSE** (₹2Cr, market, govt guarantee) — [✅ / ❌ reason]
- **Stand-Up India** (₹10L–₹1Cr, SC/ST/Women) — [✅ / ❌ reason]
- **PMEGP** (₹25L, subsidy available) — [✅ / ❌ reason]
- **ECLGS** (existing borrowers only) — [✅ / ❌ reason]

---

## 🏆 Top Recommended — Apply in This Order

- 🥇 **[Scheme name]** — apply first
  - [reason, 5 words]
  - Apply at: [bank/institution]
  - Docs: Aadhaar · PAN · GST · 6-mo bank stmt

- 🥈 **[Scheme name]** — apply second
  - [reason, 5 words]
  - Apply at: [bank/institution]
  - Docs: Aadhaar · PAN · GST

- 🥉 **[Scheme name]** — backup option
  - [reason, 5 words]
  - Apply at: [bank/institution]
  - Docs: Aadhaar · PAN

---

## 🏦 Best Banks for This Profile

- ⭐⭐⭐ **SBI** — 8.65–11.15% · 7yr tenure · Best for MSMEs
- ⭐⭐⭐ **PNB** — 8.85–11.5% · 7yr tenure · Small business focus
- ⭐⭐⭐ **Bank of Baroda** — 9.15–11.15% · 7yr · Stable rates
- ⭐⭐ **Canara Bank** — 9.25–12% · 5yr · Good for artisans
- ⭐⭐ **ICICI Bank** — 11–16% · 5yr · Fast processing
- ⭐ **HDFC Bank** — 10–22.5% · 4yr · High rate risk
- ⭐ **Axis Bank** — 11.25–17.5% · 5yr · High rate risk
- ⚠️ **MFI/NBFC** — 18–24% · last resort only

- 🏆 Best for **${formData.businessName||'this business'}**: [bank + product + 1 reason, 6 words]

---

## 📈 Sales Boost by Scheme

- **MUDRA Kishore** → +20–40% revenue
  - More inventory → more orders
  - Timeline: 3–6 months

- **CGTMSE** → +15–30% margin
  - Bulk buying → lower unit cost
  - Timeline: 6–12 months

- **PMEGP** → +25% sales reach
  - Subsidy frees cash for marketing
  - Timeline: 6 months

- **SVANidhi** → +10–20% orders
  - Digital payments → new customers
  - Timeline: 1–3 months

- **SBI SME Loan** → +30–50% capacity
  - Equipment upgrade → more output
  - Timeline: 6–12 months

- **Stand-Up India** → +40–60% revenue
  - New location or product line
  - Timeline: 12–18 months

- 🎯 **For ${formData.businessName||'this business'}**: [which scheme boosts sales most, 8 words]

---

## 📋 Small vs Large Business Benefits

**Small Business (<₹5Cr) — ${isSmall?'✅ This applies to you':'❌ Not applicable'}**
- ✅ MUDRA — up to ₹10L, no collateral
- ✅ Priority sector — banks must lend
- ✅ CGTMSE — 85% govt guarantee
- ✅ Subsidised rates — SVANidhi 7%, PMEGP subsidy
- ✅ Simple docs — GST + bank statement
- ⚠️ Lower ceiling — max ₹10L under MUDRA

**Large Business (>₹5Cr) — ${!isSmall?'✅ This applies to you':'❌ Not applicable'}**
- ✅ Higher limits — up to ₹50Cr+
- ✅ ECLGS — emergency credit line
- ✅ Export schemes — EXIM Bank, Buyer's Credit
- ✅ Better rate negotiation possible
- ⚠️ Audited financials required
- ⚠️ Collateral often mandatory

---

## ✅ Action Plan

- **Step 1 — This week:**
  - [Apply for top scheme — 5 words]
  - Docs: Aadhaar · PAN · GST · bank stmt · business proof

- **Step 2 — Next 2–4 weeks:**
  - [Fix one weakness — 5 words]
  - [Relevant document or action]

- **Step 3 — 1–2 months:**
  - [Second loan application — 5 words]
  - [Key docs needed]

- **Step 4 — After disbursal:**
  - [How to use loan for sales — 6 words]

---
*Sources: RBI · mudra.org.in · msme.gov.in · svanidhi.mohua.gov.in · Bank rate cards (indicative)*`;

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

  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap');
        .lm-wrap * { font-family:'Barlow',sans-serif; box-sizing:border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes pulse  { 0%,100%{opacity:0.6} 50%{opacity:1} }
        .fade-up { animation:fadeUp 0.4s ease forwards; }

        /* ── Result styles ── */
        .prose-result { }

        /* Section headings */
        .prose-result h2 {
          font-family:'Barlow Condensed',sans-serif;
          font-weight:800; font-size:15px;
          text-transform:uppercase; letter-spacing:0.07em; color:#00e5ff;
          margin:28px 0 10px; padding-bottom:5px;
          border-bottom:1px solid rgba(0,229,255,0.15);
        }
        .prose-result h3 {
          font-family:'Barlow Condensed',sans-serif;
          font-weight:700; font-size:13px;
          text-transform:uppercase; letter-spacing:0.05em; color:#7a9ab4;
          margin:14px 0 6px;
        }

        /* Top-level bullet list */
        .prose-result ul {
          list-style:none;
          margin:0 0 6px;
          padding:0;
        }
        .prose-result ul li {
          position:relative;
          padding:4px 0 4px 18px;
          font-size:13px;
          color:#94a3b8;
          line-height:1.55;
          border-bottom:1px solid rgba(255,255,255,0.04);
        }
        .prose-result ul li:last-child { border-bottom:none; }

        /* Cyan dot bullet */
        .prose-result ul li::before {
          content:'▸';
          position:absolute; left:0; top:5px;
          color:#00e5ff;
          font-size:10px;
          line-height:1;
        }

        /* Sub-bullets (nested ul) */
        .prose-result ul ul {
          margin:4px 0 2px;
          padding:0;
        }
        .prose-result ul ul li {
          font-size:12px;
          color:#64748b;
          padding:2px 0 2px 16px;
          border-bottom:none;
        }
        .prose-result ul ul li::before {
          content:'·';
          color:#334155;
          font-size:14px;
          top:2px;
        }

        /* Inline bold */
        .prose-result strong { color:#e2e8f0; font-weight:700; }

        /* Horizontal rule */
        .prose-result hr {
          border:none;
          border-top:1px solid rgba(255,255,255,0.06);
          margin:20px 0;
        }

        /* Blockquote — not used but kept */
        .prose-result blockquote {
          border-left:3px solid #00e5ff;
          padding:7px 13px; margin:6px 0 14px;
          background:rgba(0,229,255,0.05);
          border-radius:0 4px 4px 0;
        }
        .prose-result blockquote p { color:#7a9ab4; margin:0; font-size:12px; }

        /* Citations / italics */
        .prose-result p {
          color:#334155; font-size:11px;
          line-height:1.6; margin:8px 0 0;
        }
        .prose-result em { font-size:11px; color:#334155; }

        input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
      `}</style>

        <div className="lm-wrap min-h-screen p-4 md:p-8 relative overflow-hidden" style={{ background:'#0d1b24' }}>
          <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'450px', height:'450px', borderRadius:'50%', background:'radial-gradient(circle,rgba(0,229,255,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'-80px', left:'-80px', width:'350px', height:'350px', borderRadius:'50%', background:'radial-gradient(circle,rgba(20,184,166,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />

          <div style={{ maxWidth:720, margin:'0 auto', position:'relative', zIndex:10 }}>

            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
              <div style={{ width:42, height:42, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,229,255,0.12)', border:'1px solid rgba(0,229,255,0.25)', flexShrink:0 }}>
                <TrendingUp style={{ width:20, height:20, color:'#00e5ff' }} />
              </div>
              <div>
                <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:28, textTransform:'uppercase', letterSpacing:'0.04em', color:'#fff', margin:0 }}>Smart Loan Matcher</h1>
                <p style={{ fontSize:12, color:'#64748b', marginTop:2 }}>Bullet-point analysis · 7 sections · Crisp & actionable</p>
              </div>
            </div>

            {/* Info */}
            <div style={{ display:'flex', gap:10, padding:'11px 14px', borderRadius:5, background:'rgba(0,229,255,0.05)', border:'1px solid rgba(0,229,255,0.16)', marginBottom:20 }}>
              <Info style={{ width:14, height:14, color:'#00e5ff', flexShrink:0, marginTop:2 }} />
              <p style={{ fontSize:12, color:'#7a9ab4', lineHeight:1.6, margin:0 }}>
                Get a crisp bullet-point report — financial snapshot, eligibility, top schemes, bank rates, sales impact, small vs large benefits, and a step-by-step action plan.
              </p>
            </div>

            {/* Live metrics */}
            {netFlow !== null && (
                <div className="fade-up" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:20 }}>
                  {[
                    { l:'Monthly Income',  v:`₹${Number(formData.monthlyIncome).toLocaleString('en-IN')}`, c:'#22c55e' },
                    { l:'Total Outgoings', v:`₹${(Number(formData.monthlyExpenses)+Number(formData.existingEmi||0)).toLocaleString('en-IN')}`, c:'#f97316' },
                    { l:'Net Cash Flow',   v:`₹${netFlow.toLocaleString('en-IN')}`, c:netFlow>=0?'#00e5ff':'#ef4444' },
                    { l:'FOIR',            v:foirPct!=null?`${foirPct}%`:'—', c:(foirPct??0)<40?'#4ade80':'#f87171' },
                  ].map(m => (
                      <div key={m.l} style={{ padding:'11px 14px', borderRadius:5, background:'rgba(17,31,42,0.9)', border:'1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize:10, color:'#475569', marginBottom:3, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' }}>{m.l}</div>
                        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:18, color:m.c }}>{m.v}</div>
                      </div>
                  ))}
                </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ background:'rgba(17,31,42,0.9)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:24, display:'flex', flexDirection:'column', gap:16 }}>

                {/* Business size */}
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8, color:'#00e5ff' }}>Business Size *</label>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    {[
                      { val:'small' as const, label:'Small Business', sub:'Turnover < ₹5 Cr · Micro/Small MSME', icon:'🏪' },
                      { val:'large' as const, label:'Large Business',  sub:'Turnover > ₹5 Cr · Medium/Large MSME', icon:'🏭' },
                    ].map(opt => (
                        <button key={opt.val} type="button" onClick={() => setFormData(f => ({ ...f, businessSize:opt.val }))}
                                style={{ padding:'12px 14px', borderRadius:5, textAlign:'left', cursor:'pointer', background:formData.businessSize===opt.val?'rgba(0,229,255,0.08)':'rgba(255,255,255,0.02)', border:`1px solid ${formData.businessSize===opt.val?'rgba(0,229,255,0.32)':'rgba(255,255,255,0.07)'}`, transition:'all 0.15s' }}>
                          <div style={{ fontSize:18, marginBottom:5 }}>{opt.icon}</div>
                          <div style={{ fontSize:12, fontWeight:700, color:formData.businessSize===opt.val?'#00e5ff':'#e2e8f0', marginBottom:3 }}>{opt.label}</div>
                          <div style={{ fontSize:11, color:'#475569', lineHeight:1.4 }}>{opt.sub}</div>
                        </button>
                    ))}
                  </div>
                </div>

                {/* Name + type */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <FieldInput label="Business Name *" name="businessName" value={formData.businessName} onChange={handleChange} />
                  <div>
                    <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8, color:'#00e5ff' }}>Business Type *</label>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                      {BUSINESS_TYPES.map(bt => (
                          <button key={bt} type="button" onClick={() => setFormData(f => ({ ...f, businessType:bt }))}
                                  style={{ padding:'5px 10px', borderRadius:3, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:"'Barlow',sans-serif", background:formData.businessType===bt?'rgba(0,229,255,0.1)':'rgba(255,255,255,0.03)', border:`1px solid ${formData.businessType===bt?'rgba(0,229,255,0.35)':'rgba(255,255,255,0.07)'}`, color:formData.businessType===bt?'#00e5ff':'#64748b', transition:'all 0.15s' }}>
                            {bt}
                          </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Financial fields */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <FieldInput label="Monthly Income (₹) *"       name="monthlyIncome"   value={formData.monthlyIncome}   onChange={handleChange} placeholder="45000"  type="number" prefix="₹" />
                  <FieldInput label="Monthly Expenses (₹) *"     name="monthlyExpenses" value={formData.monthlyExpenses} onChange={handleChange} placeholder="25000"  type="number" prefix="₹" />
                  <FieldInput label="Existing EMI (₹)"           name="existingEmi"     value={formData.existingEmi}     onChange={handleChange} placeholder="0"       type="number" prefix="₹" />
                  <FieldInput label="Loan Amount Required (₹) *" name="loanAmount"      value={formData.loanAmount}      onChange={handleChange} placeholder="200000" type="number" prefix="₹" />
                  <FieldInput label="Business Age (Years) *"     name="businessAge"     value={formData.businessAge}     onChange={handleChange} placeholder="3"       type="number" />
                  <FieldInput label="Credit Score (300–900)"     name="creditScore"     value={formData.creditScore}     onChange={handleChange} placeholder="750"     type="number" />
                </div>

                {/* Toggles */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  <Toggle label="GST / Tax Returns Filed" checked={formData.gstSubmitted}      onChange={() => setFormData(f => ({ ...f, gstSubmitted:!f.gstSubmitted }))} />
                  <Toggle label="Collateral Available"    checked={formData.collateralProvided} onChange={() => setFormData(f => ({ ...f, collateralProvided:!f.collateralProvided }))} />
                </div>

                {/* FOIR hint */}
                {foirPct !== null && (
                    <div style={{ padding:'9px 14px', borderRadius:4, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', fontSize:12, color:'#475569' }}>
                      FOIR = <span style={{ color:foirPct<40?'#4ade80':'#f87171', fontWeight:700 }}>{foirPct}%</span>
                      {' '}— Banks prefer below 40–50%.{' '}
                      {foirPct < 40 ? '✅ Good standing.' : '⚠️ Consider reducing EMIs before applying.'}
                    </div>
                )}

                {error && (
                    <div style={{ padding:'9px 13px', borderRadius:5, background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.3)', color:'#f87171', fontSize:13 }}>⚠ {error}</div>
                )}

                <button type="submit" disabled={loading}
                        style={{ width:'100%', padding:'13px', borderRadius:5, fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:13, letterSpacing:'0.06em', textTransform:'uppercase', display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:loading?'rgba(0,229,255,0.35)':'#00e5ff', color:'#0d1b24', cursor:loading?'not-allowed':'pointer', border:'none', boxShadow:!loading?'0 0 20px rgba(0,229,255,0.22)':'none', transition:'all 0.2s' }}>
                  {loading
                      ? <><Loader2 style={{ width:16, height:16, animation:'spin 1s linear infinite' }} /> Generating Analysis...</>
                      : <><ArrowRight style={{ width:16, height:16 }} /> Generate Full Analysis</>
                  }
                </button>
              </div>
            </form>

            {/* Result */}
            {result && (
                <div className="fade-up" style={{ marginTop:20, background:'rgba(17,31,42,0.9)', border:'1px solid rgba(0,229,255,0.18)', borderRadius:10, padding:'20px 24px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18, paddingBottom:12, borderBottom:'1px solid rgba(0,229,255,0.1)' }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:'#22c55e', animation:'pulse 1.5s ease infinite' }} />
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:'0.08em', textTransform:'uppercase', color:'#22c55e' }}>Analysis Complete — 7 Sections</span>
                  </div>
                  <div className="prose-result">
                    <Markdown>{result}</Markdown>
                  </div>
                </div>
            )}

            {/* Document upload */}
            <div style={{ marginTop:20, background:'rgba(17,31,42,0.7)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10, padding:18 }}>
              <p style={{ fontSize:13, fontWeight:700, color:'white', margin:'0 0 10px' }}>
                Document Upload <span style={{ fontSize:11, color:'#475569', fontWeight:400 }}>(optional)</span>
              </p>
              <div style={{ borderRadius:5, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'22px', border:'2px dashed rgba(0,229,255,0.18)', background:'rgba(0,229,255,0.02)', cursor:'pointer', transition:'border-color 0.15s' }}
                   onMouseEnter={e => (e.currentTarget.style.borderColor='rgba(0,229,255,0.38)')}
                   onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(0,229,255,0.18)')}>
                <UploadCloud style={{ width:24, height:24, marginBottom:7, color:'rgba(0,229,255,0.38)' }} />
                <p style={{ fontSize:13, color:'#64748b', fontWeight:600, margin:'0 0 3px' }}>Click or drag & drop</p>
                <p style={{ fontSize:11, color:'#334155', margin:0 }}>Bank statements · GST returns · ITR · Aadhaar / PAN</p>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}