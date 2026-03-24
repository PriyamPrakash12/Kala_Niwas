'use client';

import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import dynamic from 'next/dynamic';
const Markdown = dynamic(() => import('react-markdown'), { ssr: false });

export default function AIDescriptor() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'product', // product, loan_summary, business_explanation
    details: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
      
      let prompt = '';
      if (formData.type === 'product') {
        prompt = `You are an expert copywriter for Indian small businesses and artisans. Write a compelling, culturally resonant product description for the following item: ${formData.details}. Highlight its unique features, craftsmanship, and appeal to customers.`;
      } else if (formData.type === 'loan_summary') {
        prompt = `You are a financial advisor. Summarize the following loan details or requirements into a clear, professional summary suitable for a bank application: ${formData.details}.`;
      } else {
        prompt = `You are a business consultant. Write a professional business explanation or elevator pitch based on these details: ${formData.details}. Make it sound professional, trustworthy, and appealing to investors or partners.`;
      }

      const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: prompt,
});

      let text = "No response generated.";

if (response.candidates && response.candidates.length > 0) {
  const parts = response.candidates[0].content?.parts;

  if (parts) {
    text = parts
      .filter((p) => p.text)
      .map((p) => p.text)
      .join("\n");
  }
}

setResult(text);
    } catch (error) {
      console.error('Error generating description:', error);
      setResult('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-center gap-3 mb-6 md:mb-10">
        <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-orange-400" />
        <h1 className="text-2xl md:text-3xl font-bold text-white">AI Descriptor</h1>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 md:p-8 mb-8 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">What do you want to generate?</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
            >
              <option value="product">Product Description</option>
              <option value="loan_summary">Loan Summary</option>
              <option value="business_explanation">Business Explanation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Provide Details</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              required
              rows={5}
              placeholder="E.g., Handwoven Banarasi Silk Saree, red color with golden zari work..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formData.details.trim()}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate'
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 md:p-6">
          <h3 className="text-xl font-semibold text-orange-400 mb-4">Generated Result</h3>
          <div className="markdown-body prose prose-invert prose-orange max-w-none text-slate-300 text-sm leading-relaxed">
            <Markdown>{result}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}
