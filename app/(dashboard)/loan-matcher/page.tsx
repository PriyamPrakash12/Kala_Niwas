'use client';

import { useState } from 'react';
import { UploadCloud, Loader2, TrendingUp, ArrowRight } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import dynamic from 'next/dynamic';
const Markdown = dynamic(() => import('react-markdown'), { ssr: false });

const BUSINESS_TYPES = ['Retail', 'Manufacturing', 'Services', 'Artisan/Handicraft', 'Agriculture/Allied', 'Street Vendor'];

interface FormData {
  businessName: string; businessType: string; monthlyIncome: string;
  monthlyExpenses: string; existingEmi: string; loanAmount: string;
  businessAge: string; creditScore: string; gstSubmitted: boolean; collateralProvided: boolean;
}

function CurrencyInput({ label, name, value, onChange, placeholder = '' }: {
  label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#00e5ff' }}>{label}</label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: focused ? '#00e5ff' : '#475569' }}>₹</span>
          <input type="number" name={name} value={value} onChange={onChange} placeholder={placeholder}
                 onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                 className="w-full text-sm text-white rounded-xl pl-8 pr-4 py-3 transition-all outline-none"
                 style={{ background:'rgba(13,27,36,0.7)', border:`1px solid ${focused ? '#00e5ff' : 'rgba(255,255,255,0.07)'}`, boxShadow: focused ? '0 0 0 3px rgba(0,229,255,0.1)' : 'none' }}
          />
        </div>
      </div>
  );
}

function TextInput({ label, name, value, onChange }: { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const [focused, setFocused] = useState(false);
  return (
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#00e5ff' }}>{label}</label>
        <input type="text" name={name} value={value} onChange={onChange} required
               onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
               className="w-full text-sm text-white rounded-xl px-4 py-3 transition-all outline-none"
               style={{ background:'rgba(13,27,36,0.7)', border:`1px solid ${focused ? '#00e5ff' : 'rgba(255,255,255,0.07)'}`, boxShadow: focused ? '0 0 0 3px rgba(0,229,255,0.1)' : 'none' }}
        />
      </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
      <button type="button" onClick={onChange}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
              style={{ background: checked ? 'rgba(0,229,255,0.08)' : 'rgba(255,255,255,0.03)', border:`1px solid ${checked ? 'rgba(0,229,255,0.3)' : 'rgba(255,255,255,0.06)'}` }}>
        <div className="relative flex-shrink-0 w-9 h-5 rounded-full transition-all" style={{ background: checked ? '#00e5ff' : 'rgba(255,255,255,0.1)' }}>
          <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm" style={{ left: checked ? 'calc(100% - 18px)' : '2px' }} />
        </div>
        <span className="text-sm" style={{ color: checked ? 'white' : '#64748b' }}>{label}</span>
      </button>
  );
}

export default function LoanMatcher() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    businessName: '', businessType: '', monthlyIncome: '', monthlyExpenses: '',
    existingEmi: '', loanAmount: '', businessAge: '', creditScore: '', gstSubmitted: false, collateralProvided: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setResult(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
      const prompt = `You are an AI financial assistant for Indian small business owners. Analyze:
- Business: ${formData.businessName} (${formData.businessType})
- Monthly Income: ₹${formData.monthlyIncome}, Expenses: ₹${formData.monthlyExpenses}, EMI: ₹${formData.existingEmi}
- Loan Required: ₹${formData.loanAmount}, Business Age: ${formData.businessAge} yrs, Credit Score: ${formData.creditScore}
- GST Filed: ${formData.gstSubmitted ? 'Yes' : 'No'}, Collateral: ${formData.collateralProvided ? 'Yes' : 'No'}
Provide: 1. Eligibility & recommended loan type. 2. Relevant Indian govt schemes (Mudra, MSME, CGTMSE, Stand-Up India, PM SVANidhi). 3. Professional recommendation with strengths/concerns. Format with Markdown.`;
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      const parts = response.candidates?.[0]?.content?.parts;
      setResult(parts ? parts.filter((p) => p.text).map((p) => p.text).join('\n') : 'No response generated.');
    } catch { setResult('An error occurred. Please try again.'); }
    finally { setLoading(false); }
  };

  const netFlow = formData.monthlyIncome && formData.monthlyExpenses
      ? Number(formData.monthlyIncome) - Number(formData.monthlyExpenses) - Number(formData.existingEmi || 0) : null;

  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');
        .lm-wrap * { font-family:'Sora',sans-serif; box-sizing:border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .prose-result h1,.prose-result h2,.prose-result h3 { color:white; margin:1em 0 0.5em; font-weight:700; }
        .prose-result p { color:#94a3b8; line-height:1.8; margin:0.5em 0; }
        .prose-result strong { color:#e2e8f0; }
        .prose-result ul,.prose-result ol { color:#94a3b8; padding-left:1.5em; }
        .prose-result li { margin:0.3em 0; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
      `}</style>

        <div className="lm-wrap min-h-screen bg-[#0d1b24] p-4 md:p-8 relative overflow-hidden">
          <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'450px', height:'450px', borderRadius:'50%', background:'radial-gradient(circle,rgba(0,229,255,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'-80px', left:'-80px', width:'350px', height:'350px', borderRadius:'50%', background:'radial-gradient(circle,rgba(20,184,166,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />

          <div className="max-w-3xl mx-auto relative z-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'rgba(0,229,255,0.12)', border:'1px solid rgba(0,229,255,0.25)' }}>
                <TrendingUp className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Smart Loan Matcher</h1>
                <p className="text-xs text-slate-500 mt-0.5">AI eligibility check & scheme recommendations</p>
              </div>
            </div>

            {/* Live preview strip */}
            {netFlow !== null && (
                <div className="fade-up mb-6 grid grid-cols-3 gap-3">
                  {[
                    { label: 'Monthly Income', value: `₹${Number(formData.monthlyIncome).toLocaleString('en-IN')}`, color: '#22c55e' },
                    { label: 'Monthly Expenses', value: `₹${(Number(formData.monthlyExpenses) + Number(formData.existingEmi||0)).toLocaleString('en-IN')}`, color: '#f97316' },
                    { label: 'Net Cash Flow', value: `₹${netFlow.toLocaleString('en-IN')}`, color: netFlow >= 0 ? '#00e5ff' : '#ef4444' },
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

                {/* Business info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <TextInput label="Business Name" name="businessName" value={formData.businessName} onChange={handleInputChange} />
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color:'#00e5ff' }}>Business Type</label>
                    <div className="flex flex-wrap gap-2">
                      {BUSINESS_TYPES.map((bt) => (
                          <button key={bt} type="button" onClick={() => setFormData({ ...formData, businessType: bt })}
                                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                  style={{ background: formData.businessType === bt ? 'rgba(0,229,255,0.12)' : 'rgba(255,255,255,0.03)', border:`1px solid ${formData.businessType === bt ? 'rgba(0,229,255,0.4)' : 'rgba(255,255,255,0.06)'}`, color: formData.businessType === bt ? '#00e5ff' : '#64748b' }}>
                            {bt}
                          </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Financials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <CurrencyInput label="Monthly Income" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleInputChange} placeholder="45000" />
                  <CurrencyInput label="Monthly Expenses" name="monthlyExpenses" value={formData.monthlyExpenses} onChange={handleInputChange} placeholder="25000" />
                  <CurrencyInput label="Existing EMI" name="existingEmi" value={formData.existingEmi} onChange={handleInputChange} placeholder="0" />
                  <CurrencyInput label="Loan Amount Required" name="loanAmount" value={formData.loanAmount} onChange={handleInputChange} placeholder="200000" />
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color:'#00e5ff' }}>Business Age (Years)</label>
                    <input type="number" name="businessAge" value={formData.businessAge} onChange={handleInputChange} required min="0"
                           className="w-full text-sm text-white rounded-xl px-4 py-3 outline-none transition-all"
                           style={{ background:'rgba(13,27,36,0.7)', border:'1px solid rgba(255,255,255,0.07)' }}
                           onFocus={(e) => { e.target.style.borderColor='#00e5ff'; e.target.style.boxShadow='0 0 0 3px rgba(0,229,255,0.1)'; }}
                           onBlur={(e) => { e.target.style.borderColor='rgba(255,255,255,0.07)'; e.target.style.boxShadow='none'; }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color:'#00e5ff' }}>Credit Score</label>
                    <input type="number" name="creditScore" value={formData.creditScore} onChange={handleInputChange} min="300" max="900" placeholder="750"
                           className="w-full text-sm text-white rounded-xl px-4 py-3 outline-none transition-all"
                           style={{ background:'rgba(13,27,36,0.7)', border:'1px solid rgba(255,255,255,0.07)' }}
                           onFocus={(e) => { e.target.style.borderColor='#00e5ff'; e.target.style.boxShadow='0 0 0 3px rgba(0,229,255,0.1)'; }}
                           onBlur={(e) => { e.target.style.borderColor='rgba(255,255,255,0.07)'; e.target.style.boxShadow='none'; }}
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  <Toggle label="GST / Tax Returns Filed" checked={formData.gstSubmitted} onChange={() => setFormData({ ...formData, gstSubmitted: !formData.gstSubmitted })} />
                  <Toggle label="Collateral Available" checked={formData.collateralProvided} onChange={() => setFormData({ ...formData, collateralProvided: !formData.collateralProvided })} />
                </div>

                <button type="submit" disabled={loading}
                        className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                        style={{ background: loading ? 'rgba(0,229,255,0.4)' : '#00e5ff', color:'#0d1b24', cursor: loading ? 'not-allowed':'pointer', boxShadow: loading ? 'none':'0 0 20px rgba(0,229,255,0.25)' }}>
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><ArrowRight className="w-4 h-4" /> Check Eligibility</>}
                </button>
              </div>
            </form>

            {/* Result */}
            {result && (
                <div className="fade-up mt-6" style={{ background:'rgba(17,31,42,0.9)', border:'1px solid rgba(0,229,255,0.2)', borderRadius:'20px', padding:'24px' }}>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-sm font-semibold text-green-400">Analysis Complete</span>
                  </div>
                  <div className="prose-result text-sm"><Markdown>{result}</Markdown></div>
                </div>
            )}

            {/* Document upload */}
            <div className="mt-6" style={{ background:'rgba(17,31,42,0.6)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:'20px', padding:'20px' }}>
              <p className="text-sm font-semibold text-white mb-3">Document Upload</p>
              <div className="rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all py-8"
                   style={{ border:'2px dashed rgba(0,229,255,0.2)', background:'rgba(0,229,255,0.02)' }}
                   onMouseEnter={(e) => (e.currentTarget.style.borderColor='rgba(0,229,255,0.4)')}
                   onMouseLeave={(e) => (e.currentTarget.style.borderColor='rgba(0,229,255,0.2)')}>
                <UploadCloud className="w-8 h-8 mb-2 text-cyan-600" />
                <p className="text-sm text-slate-400 font-medium">Click or drag & drop</p>
                <p className="text-xs text-slate-600 mt-1">Bank statements, GST returns, ID proofs</p>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}