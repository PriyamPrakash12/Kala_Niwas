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

STRICT RULES:
- Every section = ONE Markdown table. No paragraphs outside tables.
- Table cells must use SHORT bullet points (· symbol, max 6 words each).
- No long sentences inside cells. Split info into 2–3 bullets per cell.
- Status cells: only emoji + 2–3 word label. Example: ✅ Eligible or ❌ Too high income.
- Keep all text crisp, scannable, copy-paste friendly.

Business:
Name: ${formData.businessName} | Type: ${formData.businessType} | Size: ${isSmall?'Small MSME <₹5Cr':'Large MSME >₹5Cr'}
Income: ₹${formData.monthlyIncome} | Expenses: ₹${formData.monthlyExpenses} | EMI: ₹${formData.existingEmi||'0'} | Net: ₹${netFlow??'N/A'}
Loan: ₹${formData.loanAmount} | Age: ${formData.businessAge}yrs | Score: ${formData.creditScore||'N/A'} | GST: ${formData.gstSubmitted?'Yes':'No'} | Collateral: ${formData.collateralProvided?'Yes':'No'}

---

## 📊 1. Financial Snapshot

| Metric | Value | Status |
|--------|-------|--------|
| Monthly Income | ₹${formData.monthlyIncome} | · ${Number(formData.monthlyIncome)>30000?'✅ Adequate':'⚠️ Low income'} |
| Monthly Expenses | ₹${formData.monthlyExpenses} | · ${Number(formData.monthlyExpenses)<Number(formData.monthlyIncome)*0.7?'✅ Manageable':'⚠️ High outflow'} |
| Existing EMI | ₹${formData.existingEmi||'0'} | · ${Number(formData.existingEmi||0)===0?'✅ No burden':'⚠️ Existing debt'} |
| Net Cash Flow | ₹${netFlow??'N/A'} | · ${(netFlow??0)>=0?'✅ Positive flow':'❌ Negative — critical'} |
| FOIR | ${foirPct??'N/A'}% | · ${(foirPct??0)<40?'✅ Below 40% — Good':'⚠️ Above 40% — Review'} |
| Loan Requested | ₹${formData.loanAmount} | · [✅ Reasonable / ⚠️ High for income] |
| Credit Score | ${formData.creditScore||'Not given'} | · [✅ 750+ Excellent / ⚠️ 650–749 Fair / ❌ <650 Poor] |
| Collateral | ${formData.collateralProvided?'Available':'Not available'} | · ${formData.collateralProvided?'✅ Opens more options':'⚠️ Limits choices'} |
| GST Filed | ${formData.gstSubmitted?'Yes':'No'} | · ${formData.gstSubmitted?'✅ Stronger application':'⚠️ File GST first'} |

---

## 🏦 2. Loan Eligibility

| Scheme | Max Amount | Rate | Collateral | Status | Priority |
|--------|-----------|------|-----------|--------|----------|
| PM MUDRA Shishu | ₹50,000 | 8–12% | None | [✅/❌ — 3 words] | [🥇/🥈/🥉/—] |
| PM MUDRA Kishore | ₹5 Lakh | 9–14% | None | [✅/❌ — 3 words] | [🥇/🥈/🥉/—] |
| PM MUDRA Tarun | ₹10 Lakh | 10–14% | Flexible | [✅/❌ — 3 words] | [🥇/🥈/🥉/—] |
| PM SVANidhi | ₹50,000 | 7% | None | [✅/❌ — 3 words] | [🥇/🥈/🥉/—] |
| CGTMSE | ₹2 Crore | Market | None | [✅/❌ — 3 words] | [🥇/🥈/🥉/—] |
| Stand-Up India | ₹10L–₹1Cr | Base+3% | Required | [✅/❌ — 3 words] | [🥇/🥈/🥉/—] |
| PMEGP | ₹25L | Market | Flexible | [✅/❌ — 3 words] | [🥇/🥈/🥉/—] |
| ECLGS | Per existing | Market | None | [✅/❌ — 3 words] | [🥇/🥈/🥉/—] |

---

## 🏆 3. Top Recommended — Apply in This Order

| Rank | Scheme | Why Apply | Where | Documents |
|------|--------|-----------|-------|-----------|
| 🥇 Apply First | [Name] | · [reason 1, 4 words] · [reason 2, 4 words] | [Bank name] | · Aadhaar · PAN · GST · Bank stmt |
| 🥈 Apply Second | [Name] | · [reason 1, 4 words] · [reason 2, 4 words] | [Bank name] | · Aadhaar · PAN · GST |
| 🥉 Backup Option | [Name] | · [reason 1, 4 words] · [reason 2, 4 words] | [Bank name] | · Aadhaar · PAN |

---

## 🏦 4. Bank Rate Comparison

| Bank | Product | Rate (p.a.) | Fee | Tenure | Rating |
|------|---------|------------|-----|--------|--------|
| SBI | SME Loan | 8.65–11.15% | 0.5–1% | 7 yrs | ⭐⭐⭐ Best |
| PNB | MSME | 8.85–11.5% | 0.59% | 7 yrs | ⭐⭐⭐ Best |
| Bank of Baroda | MSME | 9.15–11.15% | 0.5% | 7 yrs | ⭐⭐⭐ Good |
| Canara Bank | SME | 9.25–12% | 0.5% | 5 yrs | ⭐⭐ Good |
| ICICI Bank | Business | 11–16% | 2% | 5 yrs | ⭐⭐ Average |
| HDFC Bank | Business | 10–22.5% | 2% | 4 yrs | ⭐ High rate |
| Axis Bank | Business | 11.25–17.5% | 1–2% | 5 yrs | ⭐ High rate |
| MFI/NBFC | Micro | 18–24% | 2% | 3 yrs | ⚠️ Last resort |

> 🏆 **Best for this profile:** [Bank + product + 1 reason in 6 words]

---

## 📈 5. Sales Boost by Scheme

| Scheme | Sales Impact | How | Timeline |
|--------|-------------|-----|----------|
| MUDRA Kishore | +20–40% revenue | · More inventory · Serve more orders | 3–6 months |
| CGTMSE | +15–30% margin | · Bulk buying · Lower unit cost | 6–12 months |
| PMEGP | +25% reach | · Subsidy → cash for marketing | 6 months |
| SVANidhi | +10–20% orders | · Digital payments · New customers | 1–3 months |
| SBI SME | +30–50% capacity | · Equipment upgrade · More output | 6–12 months |
| Stand-Up India | +40–60% revenue | · New location · New product line | 12–18 months |

> **For ${formData.businessName||'this business'}:** [1 sentence — which scheme boosts sales most for their specific type]

---

## 📋 6. Small vs Large — Benefits

| Benefit | Small (<₹5Cr) | Large (>₹5Cr) | This Business |
|---------|--------------|--------------|--------------|
| MUDRA | ✅ Up to ₹10L | ❌ Not eligible | ${isSmall?'✅ Yes':'❌ No'} |
| CGTMSE | ✅ 85% guarantee | ✅ 75% guarantee | ✅ Yes |
| Priority Sector | ✅ Mandatory lending | ❌ Not priority | ${isSmall?'✅ Yes':'❌ No'} |
| Subsidised rate | ✅ SVANidhi 7% | ❌ Market only | ${isSmall?'✅ Yes':'❌ No'} |
| Loan limit | ⚠️ Max ₹10L | ✅ Up to ₹50Cr+ | — |
| Documentation | ✅ GST + stmt | ❌ Audited books | ${isSmall?'✅ Simpler':'⚠️ Complex'} |
| ECLGS | ⚠️ If existing | ✅ Full access | Depends |
| Export schemes | ❌ Limited | ✅ EXIM, Buyer's Credit | ${isSmall?'❌ No':'✅ Yes'} |
| Rate negotiation | ⚠️ Standard | ✅ Negotiable | ${isSmall?'⚠️ Limited':'✅ Yes'} |

---

## ✅ 7. Action Plan

| Step | Do This | By When | Documents |
|------|---------|---------|-----------|
| 1 | [Apply for scheme — 5 words] | This week | · Aadhaar · PAN · GST · 6-mo bank stmt |
| 2 | [Fix one weakness — 5 words] | 2–4 weeks | · [relevant docs] |
| 3 | [Second loan to apply — 5 words] | 1–2 months | · [relevant docs] |
| 4 | [Use loan for sales — 5 words] | After disbursal | · — |

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

        /* ── Result area — scrollable table container ── */
        .prose-result { overflow-x:auto; }

        .prose-result h2 {
          font-family:'Barlow Condensed',sans-serif;
          font-weight:800; font-size:14px; text-transform:uppercase;
          letter-spacing:0.07em; color:#00e5ff;
          margin:28px 0 8px; padding-bottom:5px;
          border-bottom:1px solid rgba(0,229,255,0.15);
        }

        /* Table */
        .prose-result table {
          width:100%; border-collapse:collapse;
          margin:0 0 6px; font-size:12px;
          min-width:480px;
        }
        .prose-result th {
          background:rgba(0,229,255,0.09);
          color:#00e5ff; padding:7px 10px;
          text-align:left; font-size:10px;
          letter-spacing:0.09em; text-transform:uppercase;
          border:1px solid rgba(0,229,255,0.18);
          font-weight:700; white-space:nowrap;
        }
        .prose-result td {
          padding:6px 10px;
          color:#94a3b8;
          border:1px solid rgba(255,255,255,0.06);
          vertical-align:top;
          line-height:1.55;
          font-size:12px;
        }
        /* First column — metric name — slightly brighter */
        .prose-result td:first-child {
          color:#cbd5e1; font-weight:600;
          white-space:nowrap; min-width:90px;
        }
        .prose-result tr:nth-child(even) td { background:rgba(255,255,255,0.022); }
        .prose-result tr:hover td { background:rgba(0,229,255,0.035); transition:background 0.12s; }

        /* ── Bullet points inside cells ──
           The AI outputs "· item" text. We style lines starting with · */
        .prose-result td p {
          margin:0; padding:0;
          color:#94a3b8; font-size:12px; line-height:1.55;
        }

        /* Actual <ul>/<li> lists inside cells */
        .prose-result td ul,
        .prose-result td ol {
          margin:0; padding-left:14px;
          list-style:none;
        }
        .prose-result td li {
          font-size:12px; color:#94a3b8;
          line-height:1.55; margin:1px 0;
          padding-left:2px;
        }
        .prose-result td li::before {
          content:'·';
          color:#00e5ff;
          font-weight:700;
          margin-right:5px;
        }

        /* Blockquote */
        .prose-result blockquote {
          border-left:3px solid #00e5ff;
          padding:7px 13px; margin:6px 0 14px;
          background:rgba(0,229,255,0.05);
          border-radius:0 4px 4px 0;
        }
        .prose-result blockquote p {
          color:#7a9ab4; margin:0; font-size:12px; line-height:1.55;
        }

        /* Standalone paragraphs (citations etc) */
        .prose-result > p {
          color:#475569; font-size:11px;
          line-height:1.6; margin:6px 0;
        }
        .prose-result strong { color:#e2e8f0; }
        .prose-result hr {
          border:none;
          border-top:1px solid rgba(255,255,255,0.07);
          margin:18px 0;
        }
        .prose-result em { font-size:11px; color:#475569; }

        input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
      `}</style>

        <div className="lm-wrap min-h-screen p-4 md:p-8 relative overflow-hidden" style={{ background:'#0d1b24' }}>
          <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'450px', height:'450px', borderRadius:'50%', background:'radial-gradient(circle,rgba(0,229,255,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'-80px', left:'-80px', width:'350px', height:'350px', borderRadius:'50%', background:'radial-gradient(circle,rgba(20,184,166,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />

          <div style={{ maxWidth:880, margin:'0 auto', position:'relative', zIndex:10 }}>

            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
              <div style={{ width:42, height:42, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,229,255,0.12)', border:'1px solid rgba(0,229,255,0.25)', flexShrink:0 }}>
                <TrendingUp style={{ width:20, height:20, color:'#00e5ff' }} />
              </div>
              <div>
                <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:28, textTransform:'uppercase', letterSpacing:'0.04em', color:'#fff', margin:0 }}>Smart Loan Matcher</h1>
                <p style={{ fontSize:12, color:'#64748b', marginTop:2 }}>Table format · Bullet points · 7-section analysis</p>
              </div>
            </div>

            {/* Info banner */}
            <div style={{ display:'flex', gap:10, padding:'11px 14px', borderRadius:5, background:'rgba(0,229,255,0.05)', border:'1px solid rgba(0,229,255,0.16)', marginBottom:20 }}>
              <Info style={{ width:14, height:14, color:'#00e5ff', flexShrink:0, marginTop:2 }} />
              <p style={{ fontSize:12, color:'#7a9ab4', lineHeight:1.6, margin:0 }}>
                Enter your details to get 7 crisp tables — financial snapshot, eligibility, top loans, bank rates, sales boost per scheme, small vs large benefits, and action plan.
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
                      ? <><Loader2 style={{ width:16, height:16, animation:'spin 1s linear infinite' }} /> Generating Tables...</>
                      : <><ArrowRight style={{ width:16, height:16 }} /> Generate Full Analysis</>
                  }
                </button>
              </div>
            </form>

            {/* Result */}
            {result && (
                <div className="fade-up" style={{ marginTop:20, background:'rgba(17,31,42,0.9)', border:'1px solid rgba(0,229,255,0.18)', borderRadius:10, padding:'20px 24px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18, paddingBottom:14, borderBottom:'1px solid rgba(0,229,255,0.1)' }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:'#22c55e', animation:'pulse 1.5s ease infinite' }} />
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:'0.08em', textTransform:'uppercase', color:'#22c55e' }}>Analysis Complete — 7 Tables</span>
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