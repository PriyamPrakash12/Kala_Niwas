'use client';

import { useState } from 'react';
import { Loader2, IndianRupee } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import dynamic from 'next/dynamic';
const Markdown = dynamic(() => import('react-markdown'), { ssr: false });

export default function PricingSuggestion() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    productName: '',
    materialCost: '',
    laborCost: '',
    competitorPrice: '',
    targetMarket: '',
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
      
      const prompt = `
        You are an expert pricing strategist for Indian small businesses, artisans, and vendors.
        
        Analyze the following product details to suggest an optimal pricing strategy:
        - Product Name/Description: ${formData.productName}
        - Material Cost (₹): ${formData.materialCost}
        - Labor/Time Cost (₹): ${formData.laborCost}
        - Known Competitor Price (₹): ${formData.competitorPrice || 'Unknown'}
        - Target Market: ${formData.targetMarket}

        Please provide:
        1. Recommended Price Range (₹): Calculate a fair and profitable price range.
        2. Pricing Strategy: Explain the rationale (e.g., cost-plus, value-based, competitive).
        3. Profit Margin Analysis: Estimate the profit margin based on your recommendation.
        4. Marketing Tips: Brief tips on how to justify this price to the target market.
        
        Format the response clearly using Markdown.
      `;

      const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: prompt,
});

      let analysisText = "No analysis generated.";

if (
  analysisResponse.candidates &&
  analysisResponse.candidates.length > 0
) {
  const parts = analysisResponse.candidates[0].content?.parts;

  if (parts) {
    analysisText = parts
      .filter((part) => part.text)
      .map((part) => part.text)
      .join("\n");
  }
}

setAnalysisResult(analysisText);
    } catch (error) {
      console.error('Error generating pricing suggestion:', error);
      setResult('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-center gap-3 mb-6 md:mb-10">
        <IndianRupee className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
        <h1 className="text-2xl md:text-3xl font-bold text-white">Pricing Suggestion</h1>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 md:p-8 mb-8 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Product Name & Description</label>
            <textarea
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              required
              rows={2}
              placeholder="E.g., Hand-painted terracotta pots (set of 3)"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Material Cost (₹)</label>
              <input
                type="number"
                name="materialCost"
                value={formData.materialCost}
                onChange={handleInputChange}
                required
                placeholder="E.g., 150"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Labor/Time Cost (₹)</label>
              <input
                type="number"
                name="laborCost"
                value={formData.laborCost}
                onChange={handleInputChange}
                required
                placeholder="E.g., 200"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Competitor Price (₹) (Optional)</label>
              <input
                type="number"
                name="competitorPrice"
                value={formData.competitorPrice}
                onChange={handleInputChange}
                placeholder="E.g., 500"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Target Market</label>
              <select
                name="targetMarket"
                value={formData.targetMarket}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none"
              >
                <option value="">Select Market</option>
                <option value="Local Village/Town">Local Village / Town</option>
                <option value="Urban Middle Class">Urban Middle Class</option>
                <option value="Premium/Boutique">Premium / Boutique</option>
                <option value="Online (E-commerce)">Online (E-commerce)</option>
                <option value="Wholesale/B2B">Wholesale / B2B</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.productName.trim()}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-8"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Get Pricing Suggestion'
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 md:p-6">
          <h3 className="text-xl font-semibold text-yellow-500 mb-4">Pricing Strategy</h3>
          <div className="markdown-body prose prose-invert prose-yellow max-w-none text-slate-300 text-sm leading-relaxed">
            <Markdown>{result}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}
