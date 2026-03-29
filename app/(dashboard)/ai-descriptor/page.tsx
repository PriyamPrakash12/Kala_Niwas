'use client';

import { useState } from 'react';
import { Loader2, Sparkles, Copy, Check } from 'lucide-react';
import dynamic from 'next/dynamic';
const Markdown = dynamic(() => import('react-markdown'), { ssr: false });

const TYPES = [
  { value: 'product',              label: 'Product Description', color: '#f97316', icon: '🎨' },
  { value: 'loan_summary',         label: 'Loan Summary',        color: '#00e5ff', icon: '📄' },
  { value: 'business_explanation', label: 'Business Pitch',      color: '#a78bfa', icon: '🚀' },
];

const PLACEHOLDERS: Record<string, string> = {
  product:              'E.g., Handwoven Banarasi Silk Saree, red color with golden zari work, made by master artisan in Varanasi...',
  loan_summary:         'E.g., Small retail shop, monthly income ₹45,000, requesting ₹2L business loan for inventory expansion...',
  business_explanation: 'E.g., We sell handcrafted bamboo furniture directly from tribal artisans in Assam to urban buyers...',
};

export default function AIDescriptor() {
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<string | null>(null);
  const [copied,  setCopied]  = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [formData, setFormData] = useState({ type: 'product', details: '' });

  const activeType = TYPES.find((t) => t.value === formData.type)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    let prompt = '';
    if (formData.type === 'product') {
      prompt = `You are an expert copywriter for Indian small businesses and artisans. Write a compelling, culturally resonant product description for: ${formData.details}. Highlight unique features, craftsmanship, and customer appeal.`;
    } else if (formData.type === 'loan_summary') {
      prompt = `You are a financial advisor. Summarize the following loan details into a clear, professional summary suitable for a bank application: ${formData.details}.`;
    } else {
      prompt = `You are a business consultant. Write a professional elevator pitch based on these details: ${formData.details}. Make it trustworthy and appealing to investors or partners.`;
    }

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'text', prompt }),
      });
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
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');
        .ad-wrap * { font-family: 'Sora', sans-serif; box-sizing: border-box; }
        .ad-type-btn { transition: all 0.2s; }
        .ad-type-btn:hover { transform: translateY(-1px); }
        .ad-textarea:focus { outline: none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .prose-result h1,.prose-result h2,.prose-result h3 { color: white; margin: 1em 0 0.5em; font-weight: 700; }
        .prose-result p { color: #94a3b8; line-height: 1.8; margin: 0.5em 0; }
        .prose-result strong { color: #e2e8f0; }
        .prose-result ul,.prose-result ol { color: #94a3b8; padding-left: 1.5em; }
        .prose-result li { margin: 0.3em 0; }
      `}</style>

        <div className="ad-wrap min-h-screen bg-[#0d1b24] p-4 md:p-8 relative overflow-hidden">
          <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />

          <div className="max-w-2xl mx-auto relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)' }}>
                <Sparkles className="w-5 h-5" style={{ color: '#f97316' }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AI Descriptor</h1>
                <p className="text-xs text-slate-500 mt-0.5">Generate compelling copy instantly</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {TYPES.map((t) => (
                  <button key={t.value} type="button" onClick={() => setFormData({ ...formData, type: t.value })}
                          className="ad-type-btn p-3 rounded-xl border text-left transition-all"
                          style={{ background: formData.type === t.value ? `${t.color}15` : 'rgba(255,255,255,0.02)', borderColor: formData.type === t.value ? `${t.color}50` : 'rgba(255,255,255,0.06)', boxShadow: formData.type === t.value ? `0 0 16px ${t.color}20` : 'none' }}>
                    <div className="text-lg mb-1">{t.icon}</div>
                    <div className="text-xs leading-tight" style={{ color: formData.type === t.value ? t.color : '#64748b' }}>{t.label}</div>
                  </button>
              ))}
            </div>

            <div style={{ background: 'rgba(17,31,42,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px' }}>
              <form onSubmit={handleSubmit}>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: activeType.color }}>
                  Describe your {formData.type === 'product' ? 'product' : formData.type === 'loan_summary' ? 'loan details' : 'business'}
                </label>
                <textarea
                    className="ad-textarea w-full rounded-xl px-4 py-3 text-sm text-white resize-none transition-all"
                    style={{ background: 'rgba(13,27,36,0.8)', border: '1px solid rgba(255,255,255,0.08)', minHeight: '140px', color: 'white' }}
                    required
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder={PLACEHOLDERS[formData.type]}
                    onFocus={(e) => { e.target.style.borderColor = activeType.color; e.target.style.boxShadow = `0 0 0 3px ${activeType.color}18`; }}
                    onBlur={(e)  => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                />
                {error && (
                    <div className="mt-3 p-3 rounded-lg text-sm" style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', color: '#f87171' }}>
                      ⚠ {error}
                    </div>
                )}
                <button type="submit" disabled={loading || !formData.details.trim()}
                        className="w-full mt-4 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                        style={{ background: loading || !formData.details.trim() ? 'rgba(249,115,22,0.4)' : activeType.color, color: '#0d1b24', cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate</>}
                </button>
              </form>
            </div>

            {result && (
                <div className="fade-up mt-6" style={{ background: 'rgba(17,31,42,0.9)', border: `1px solid ${activeType.color}30`, borderRadius: '20px', padding: '24px' }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold" style={{ color: activeType.color }}>Generated Result</span>
                    <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                            style={{ background: copied ? 'rgba(0,229,255,0.1)' : 'rgba(255,255,255,0.05)', color: copied ? '#00e5ff' : '#64748b', border: '1px solid rgba(255,255,255,0.06)' }}>
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