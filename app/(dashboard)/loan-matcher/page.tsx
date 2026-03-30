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
          {prefix && <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color: focused?'#00e5ff':'#475569', fontSize:14, fontWeight:700 }}>{prefix}</span>}
          <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
                 onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                 style={{ width:'100%', padding: prefix ? '10px 12px 10px 26px' : '10px 12px', borderRadius:4, fontSize:13, color:'white', background:'rgba(13,27,36,0.8)', border:`1px solid ${focused?'#00e5ff':'rgba(255,255,255,0.08)'}`, outline:'none', boxShadow: focused?'0 0 0 3px rgba(0,229,255,0.1)':'none', fontFamily:"'Barlow',sans-serif", transition:'border-color 0.18s,box-shadow 0.18s' }}
          />
        </div>
      </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
      <button type="button" onClick={onChange}
              style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:4, background: checked?'rgba(0,229,255,0.08)':'rgba(255,255,255,0.03)', border:`1px solid ${checked?'rgba(0,229,255,0.3)':'rgba(255,255,255,0.07)'}`, cursor:'pointer', transition:'all 0.15s', width:'100%' }}>
        <div style={{ position:'relative', width:36, height:20, borderRadius:10, background: checked?'#00e5ff':'rgba(255,255,255,0.1)', flexShrink:0, transition:'background 0.2s' }}>
          <div style={{ position:'absolute', top:2, width:16, height:16, borderRadius:'50%', background:'white', left: checked?'calc(100% - 18px)':'2px', transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.3)' }} />
        </div>
        <span style={{ fontSize:13, color: checked?'white':'#64748b' }}>{label}</span>
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
    gstSubmitted: false, collateralProvided: false, businessSize:'small',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const netFlow = formData.monthlyIncome && formData.monthlyExpenses
      ? Number(formData.monthlyIncome) - Number(formData.monthlyExpenses) - Number(formData.existingEmi||0)
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    const isSmall = formData.businessSize === 'small';

    const prompt = `You are an AI financial assistant specialising in Indian small and medium business loans.

Business Profile:
- Name: ${formData.businessName}
- Type: ${formData.businessType}
- Size: ${isSmall ? 'Small Business (turnover < ₹5Cr, or micro/small MSME)' : 'Large Business (turnover > ₹5Cr, or medium/large MSME)'}
- Monthly Income: ₹${formData.monthlyIncome}
- Monthly Expenses: ₹${formData.monthlyExpenses}
- Existing EMI: ₹${formData.existingEmi || '0'}
- Net Monthly Cash Flow: ₹${netFlow ?? 'N/A'}
- Loan Required: ₹${formData.loanAmount}
- Business Age: ${formData.businessAge} years
- Credit Score: ${formData.creditScore || 'Not provided'}
- GST Filed: ${formData.gstSubmitted ? 'Yes' : 'No'}
- Collateral: ${formData.collateralProvided ? 'Available' : 'Not available'}

Provide a comprehensive loan analysis with ALL of the following sections using Markdown:

## 1. Eligibility Assessment
Brief summary of eligibility based on the profile. Mention FOIR (Fixed Obligation to Income Ratio) calculation.

> **FOIR** = (Total EMI obligations / Monthly Income) × 100. Banks prefer FOIR below 40–50%.

## 2. Recommended Loan Type
Suggest the best loan product and explain why.

## 3. Government Schemes — Eligibility Table

| Scheme | Max Loan | Interest Rate | Collateral | Who Can Apply | Apply At |
|--------|----------|---------------|-----------|--------------|----------|
| PM MUDRA Yojana (Shishu) | ₹50,000 | 8–12% | None | Micro businesses | PSU Banks, MFIs |
| PM MUDRA Yojana (Kishore) | ₹5 Lakh | 9–14% | None | Small businesses | PSU Banks |
| PM MUDRA Yojana (Tarun) | ₹10 Lakh | 10–14% | Flexible | Growing businesses | PSU Banks |
| PM SVANidhi | ₹50,000 | 7% (subsidised) | None | Street vendors | Banks, ULBs |
| CGTMSE | ₹2 Crore | Market rate | None | MSMEs | Scheduled Banks |
| Stand-Up India | ₹10 Lakh–₹1 Cr | Base Rate + 3% | Required | SC/ST/Women | Banks |
| PMEGP | ₹25 Lakh (mfg) | Market rate | Flexible | New entrepreneurs | KVIC, Banks |

Based on the profile, highlight which schemes **this business is eligible for** with a ✓ marker.

## 4. Bank Interest Rate Comparison

| Bank | Loan Type | Interest Rate (p.a.) | Processing Fee | Repayment |
|------|-----------|---------------------|----------------|-----------|
| SBI | SME Loan | 8.65–11.15% | 0.5–1% | Up to 7 yrs |
| HDFC Bank | Business Loan | 10–22.5% | Up to 2% | 1–4 yrs |
| Bank of Baroda | MSME Loan | 9.15–11.15% | 0.5% | Up to 7 yrs |
| Canara Bank | SME Loan | 9.25–12% | 0.5% | Up to 5 yrs |
| ICICI Bank | Business Loan | 11–16% | 2% | 1–5 yrs |
| Axis Bank | Business Loan | 11.25–17.5% | 1–2% | 1–5 yrs |
| Punjab National Bank | MSME | 8.85–11.5% | 0.59% | Up to 7 yrs |
| Microfinance (MFI) | Group/Individual | 18–24% | 1–2% | 1–3 yrs |

🏆 **Optimal recommendation** for this profile: [recommend the best option based on the business profile]

## 5. Loan Benefits: Small vs Large Business

### For Small Businesses (Micro/Small MSME, turnover < ₹5 Cr)
- ✅ **MUDRA loans** — no collateral, fast approval, amounts up to ₹10L
- ✅ **Priority sector lending** — banks mandated to lend to small businesses
- ✅ **CGTMSE coverage** — government guarantees up to 85% of loan
- ✅ **Subsidised interest** on select schemes (PM SVANidhi, PMEGP)
- ✅ **Simplified documentation** — GST + bank statement often sufficient
- ❗ Lower loan ceiling, shorter tenure

### For Large Businesses (Medium/Large MSME, turnover > ₹5 Cr)
- ✅ **Higher loan limits** — up to ₹50 Cr+ under MSME credit schemes
- ✅ **Term loans + Working capital** facilities available
- ✅ **ECLGS (Emergency Credit Line Guarantee)** — for existing borrowers
- ✅ **Export promotion schemes** — EXIM Bank, Buyer's Credit
- ✅ **Better interest rate negotiation** with track record
- ❗ Requires audited financials, collateral often mandatory

${isSmall ? '> This business qualifies as a **Small Business**. Focus on MUDRA, CGTMSE, and priority sector schemes.' : '> This business qualifies as a **Large Business**. Explore MSME term loans, working capital facilities, and ECLGS.'}

## 6. Professional Recommendation
3–4 sentences with clear action steps — which scheme to apply for first, what documents to prepare, and one thing to improve (e.g., credit score, GST compliance).

---
*Sources: RBI guidelines, Ministry of Finance MUDRA portal, MSME Ministry, SBI/HDFC/BOB official rate cards. Rates are indicative and subject to change.*`;

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
        @keyframes spin { to{transform:rotate(360deg)} }
        .fade-up { animation:fadeUp 0.4s ease forwards; }
        .prose-result h1,.prose-result h2,.prose-result h3 { color:white; margin:1.2em 0 0.5em; font-weight:800; font-family:'Barlow Condensed',sans-serif; letter-spacing:0.04em; font-size:16px; text-transform:uppercase; border-bottom:1px solid rgba(0,229,255,0.1); padding-bottom:6px; }
        .prose-result h3 { font-size:14px; border:none; color:#00e5ff; }
        .prose-result p { color:#94a3b8; line-height:1.8; margin:0.5em 0; font-size:13px; }
        .prose-result strong { color:#e2e8f0; }
        .prose-result ul,.prose-result ol { color:#94a3b8; padding-left:1.5em; }
        .prose-result li { margin:0.4em 0; font-size:13px; line-height:1.6; }
        .prose-result em { color:#64748b; font-size:11px; }
        .prose-result blockquote { border-left:3px solid #00e5ff; padding:8px 14px; margin:12px 0; background:rgba(0,229,255,0.05); border-radius:0 4px 4px 0; }
        .prose-result blockquote p { color:#7a9ab4; margin:0; font-size:13px; }
        .prose-result hr { border:none; border-top:1px solid rgba(255,255,255,0.08); margin:20px 0; }
        .prose-result table { width:100%; border-collapse:collapse; margin:12px 0; font-size:12px; overflow-x:auto; display:block; }
        .prose-result th { background:rgba(0,229,255,0.1); color:#00e5ff; padding:8px 10px; text-align:left; font-size:10px; letter-spacing:0.08em; text-transform:uppercase; border:1px solid rgba(0,229,255,0.2); font-weight:700; white-space:nowrap; }
        .prose-result td { padding:7px 10px; color:#94a3b8; border:1px solid rgba(255,255,255,0.06); white-space:nowrap; }
        .prose-result tr:nth-child(even) td { background:rgba(255,255,255,0.02); }
        .prose-result tr:hover td { background:rgba(0,229,255,0.03); }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
      `}</style>

        <div className="lm-wrap min-h-screen p-4 md:p-8 relative overflow-hidden" style={{ background:'#0d1b24' }}>
          <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'450px', height:'450px', borderRadius:'50%', background:'radial-gradient(circle,rgba(0,229,255,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'-80px', left:'-80px', width:'350px', height:'350px', borderRadius:'50%', background:'radial-gradient(circle,rgba(20,184,166,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />

          <div className="max-w-3xl mx-auto relative" style={{ zIndex:10 }}>

            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
              <div style={{ width:42, height:42, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,229,255,0.12)', border:'1px solid rgba(0,229,255,0.25)' }}>
                <TrendingUp style={{ width:20, height:20, color:'#00e5ff' }} />
              </div>
              <div>
                <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:28, textTransform:'uppercase', letterSpacing:'0.04em', color:'#fff', margin:0 }}>Smart Loan Matcher</h1>
                <p style={{ fontSize:12, color:'#64748b', marginTop:2 }}>AI eligibility · Govt schemes · Bank rate comparison</p>
              </div>
            </div>

            {/* Info banner */}
            <div style={{ display:'flex', gap:10, padding:'12px 14px', borderRadius:6, background:'rgba(0,229,255,0.05)', border:'1px solid rgba(0,229,255,0.18)', marginBottom:20 }}>
              <Info style={{ width:14, height:14, color:'#00e5ff', flexShrink:0, marginTop:2 }} />
              <p style={{ fontSize:12, color:'#7a9ab4', lineHeight:1.6, margin:0 }}>
                Fill in your business details to get a personalised eligibility report, matching government schemes (MUDRA, CGTMSE, SVANidhi), interest rates from top banks, and a clear breakdown of loan benefits for small vs large businesses.
              </p>
            </div>

            {/* Live cash flow preview */}
            {netFlow !== null && (
                <div className="fade-up" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:20 }}>
                  {[
                    { label:'Monthly Income',   value:`₹${Number(formData.monthlyIncome).toLocaleString('en-IN')}`, color:'#22c55e' },
                    { label:'Total Outgoings',  value:`₹${(Number(formData.monthlyExpenses)+Number(formData.existingEmi||0)).toLocaleString('en-IN')}`, color:'#f97316' },
                    { label:'Net Cash Flow',    value:`₹${netFlow.toLocaleString('en-IN')}`, color: netFlow >= 0 ? '#00e5ff' : '#ef4444' },
                  ].map(m => (
                      <div key={m.label} style={{ padding:'12px 14px', borderRadius:6, background:'rgba(17,31,42,0.9)', border:'1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize:10, color:'#475569', marginBottom:4, fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' }}>{m.label}</div>
                        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:20, color:m.color }}>{m.value}</div>
                      </div>
                  ))}
                </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ background:'rgba(17,31,42,0.9)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24, display:'flex', flexDirection:'column', gap:18 }}>

                {/* Business size selector */}
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8, color:'#00e5ff' }}>Business Size *</label>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    {[
                      { val:'small' as const, label:'Small Business', sub:'Turnover < ₹5 Crore · Micro/Small MSME · Street Vendors', icon:'🏪' },
                      { val:'large' as const, label:'Large Business',  sub:'Turnover > ₹5 Crore · Medium/Large MSME · Established Co.', icon:'🏭' },
                    ].map(opt => (
                        <button key={opt.val} type="button" onClick={() => setFormData(f => ({ ...f, businessSize: opt.val }))}
                                style={{ padding:'14px 16px', borderRadius:6, textAlign:'left', cursor:'pointer', background: formData.businessSize===opt.val?'rgba(0,229,255,0.08)':'rgba(255,255,255,0.02)', border:`1px solid ${formData.businessSize===opt.val?'rgba(0,229,255,0.35)':'rgba(255,255,255,0.07)'}`, transition:'all 0.15s' }}>
                          <div style={{ fontSize:20, marginBottom:6 }}>{opt.icon}</div>
                          <div style={{ fontSize:13, fontWeight:700, color: formData.businessSize===opt.val?'#00e5ff':'#e2e8f0', marginBottom:4 }}>{opt.label}</div>
                          <div style={{ fontSize:11, color:'#475569', lineHeight:1.5 }}>{opt.sub}</div>
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
                          <button key={bt} type="button" onClick={() => setFormData(f => ({ ...f, businessType: bt }))}
                                  style={{ padding:'5px 10px', borderRadius:3, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:"'Barlow',sans-serif", background: formData.businessType===bt?'rgba(0,229,255,0.1)':'rgba(255,255,255,0.03)', border:`1px solid ${formData.businessType===bt?'rgba(0,229,255,0.35)':'rgba(255,255,255,0.07)'}`, color: formData.businessType===bt?'#00e5ff':'#64748b', transition:'all 0.15s' }}>
                            {bt}
                          </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Financial inputs */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <FieldInput label="Monthly Income (₹) *" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} placeholder="45000" type="number" prefix="₹" />
                  <FieldInput label="Monthly Expenses (₹) *" name="monthlyExpenses" value={formData.monthlyExpenses} onChange={handleChange} placeholder="25000" type="number" prefix="₹" />
                  <FieldInput label="Existing EMI (₹)" name="existingEmi" value={formData.existingEmi} onChange={handleChange} placeholder="0" type="number" prefix="₹" />
                  <FieldInput label="Loan Amount Required (₹) *" name="loanAmount" value={formData.loanAmount} onChange={handleChange} placeholder="200000" type="number" prefix="₹" />
                  <FieldInput label="Business Age (Years) *" name="businessAge" value={formData.businessAge} onChange={handleChange} placeholder="3" type="number" />
                  <FieldInput label="Credit Score (300–900)" name="creditScore" value={formData.creditScore} onChange={handleChange} placeholder="750" type="number" />
                </div>

                {/* Toggles */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  <Toggle label="GST / Tax Returns Filed" checked={formData.gstSubmitted} onChange={() => setFormData(f => ({ ...f, gstSubmitted: !f.gstSubmitted }))} />
                  <Toggle label="Collateral Available" checked={formData.collateralProvided} onChange={() => setFormData(f => ({ ...f, collateralProvided: !f.collateralProvided }))} />
                </div>

                {/* FOIR hint */}
                {netFlow !== null && formData.monthlyIncome && (
                    <div style={{ padding:'10px 14px', borderRadius:4, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', fontSize:12, color:'#475569' }}>
                      Your FOIR = <span style={{ color: (Number(formData.existingEmi||0)/Number(formData.monthlyIncome)*100) < 40 ? '#4ade80' : '#f87171', fontWeight:700 }}>
                    {Math.round(Number(formData.existingEmi||0)/Number(formData.monthlyIncome)*100)}%
                  </span>
                      {' '}— Banks prefer FOIR below 40–50%. {(Number(formData.existingEmi||0)/Number(formData.monthlyIncome)*100) < 40 ? '✓ You are in a good range.' : '⚠ Consider reducing existing EMIs.'}
                    </div>
                )}

                {error && (
                    <div style={{ padding:'10px 14px', borderRadius:6, background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.3)', color:'#f87171', fontSize:13 }}>⚠ {error}</div>
                )}

                <button type="submit" disabled={loading}
                        style={{ width:'100%', padding:'13px', borderRadius:6, fontFamily:"'Barlow',sans-serif", fontWeight:700, fontSize:13, letterSpacing:'0.06em', textTransform:'uppercase', display:'flex', alignItems:'center', justifyContent:'center', gap:8, background: loading?'rgba(0,229,255,0.4)':'#00e5ff', color:'#0d1b24', cursor: loading?'not-allowed':'pointer', border:'none', boxShadow: !loading?'0 0 20px rgba(0,229,255,0.25)':'none', transition:'all 0.2s' }}>
                  {loading ? <><Loader2 style={{ width:16, height:16, animation:'spin 1s linear infinite' }} /> Analysing...</> : <><ArrowRight style={{ width:16, height:16 }} /> Check Eligibility & Match Schemes</>}
                </button>
              </div>
            </form>

            {/* Result */}
            {result && (
                <div className="fade-up" style={{ marginTop:20, background:'rgba(17,31,42,0.9)', border:'1px solid rgba(0,229,255,0.2)', borderRadius:12, padding:24 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:'#22c55e', animation:'pulse 1.5s ease infinite' }} />
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:'0.08em', textTransform:'uppercase', color:'#22c55e' }}>Analysis Complete</span>
                  </div>
                  <div className="prose-result"><Markdown>{result}</Markdown></div>
                </div>
            )}

            {/* Document upload */}
            <div style={{ marginTop:20, background:'rgba(17,31,42,0.7)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:20 }}>
              <p style={{ fontSize:13, fontWeight:700, color:'white', marginBottom:12 }}>Document Upload <span style={{ fontSize:11, color:'#475569', fontWeight:400 }}>(optional — for better accuracy)</span></p>
              <div style={{ borderRadius:6, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'28px', border:'2px dashed rgba(0,229,255,0.2)', background:'rgba(0,229,255,0.02)', cursor:'pointer', transition:'border-color 0.15s' }}
                   onMouseEnter={e => (e.currentTarget.style.borderColor='rgba(0,229,255,0.4)')}
                   onMouseLeave={e => (e.currentTarget.style.borderColor='rgba(0,229,255,0.2)')}>
                <UploadCloud style={{ width:28, height:28, marginBottom:8, color:'rgba(0,229,255,0.4)' }} />
                <p style={{ fontSize:13, color:'#64748b', fontWeight:600, margin:'0 0 4px' }}>Click or drag & drop</p>
                <p style={{ fontSize:11, color:'#334155', margin:0 }}>Bank statements · GST returns · ITR · Aadhaar / PAN</p>
              </div>
            </div>
          </div>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:0.6}50%{opacity:1}}`}</style>
      </>
  );
}