'use client';

import { useState } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

import dynamic from 'next/dynamic';
const Markdown = dynamic(() => import('react-markdown'), { ssr: false });

export default function LoanMatcher() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    monthlyIncome: '',
    monthlyExpenses: '',
    existingEmi: '',
    loanAmount: '',
    businessAge: '',
    creditScore: '',
    gstSubmitted: false,
    collateralProvided: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
      
      const prompt = `
        You are an AI financial assistant designed for Indian small business owners, artisans, and local vendors.
        
        Analyze the following business details:
        - Business Name: ${formData.businessName}
        - Business Type: ${formData.businessType}
        - Monthly Income: ₹${formData.monthlyIncome}
        - Monthly Expenses: ₹${formData.monthlyExpenses}
        - Existing EMI: ₹${formData.existingEmi}
        - Loan Amount Required: ₹${formData.loanAmount}
        - Business Age: ${formData.businessAge} years
        - Credit Score: ${formData.creditScore}
        - GST/Tax Returns Submitted: ${formData.gstSubmitted ? 'Yes' : 'No'}
        - Collateral Provided: ${formData.collateralProvided ? 'Yes' : 'No'}

        Based on this information, please provide:
        1. Eligibility Determination: Determine whether the applicant is eligible for a business loan and recommend the most suitable type of loan.
        2. Government Schemes: Identify and suggest relevant Indian government schemes (e.g., Mudra, MSME loans, CGTMSE, Stand-Up India, PM SVANidhi) applicable to the provided business profile. Explain the benefits and application relevance for each suggested scheme.
        3. Professional Explanation: Provide a short professional explanation for your recommendation, highlighting strengths and areas of concern.
        
        Format the response clearly using Markdown.
      `;

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
      console.error('Error checking eligibility:', error);
      setResult('An error occurred while checking eligibility. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-6 md:mb-10">Smart Loan Matcher</h1>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 md:p-8 mb-8 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Business Type</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none"
              >
                <option value="">Select</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Services">Services</option>
                <option value="Artisan/Handicraft">Artisan / Handicraft</option>
                <option value="Agriculture/Allied">Agriculture / Allied</option>
                <option value="Street Vendor">Street Vendor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Monthly Income (₹)</label>
              <input
                type="number"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Monthly Expenses (₹)</label>
              <input
                type="number"
                name="monthlyExpenses"
                value={formData.monthlyExpenses}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Existing EMI (₹)</label>
              <input
                type="number"
                name="existingEmi"
                value={formData.existingEmi}
                onChange={handleInputChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Loan Amount Required (₹)</label>
              <input
                type="number"
                name="loanAmount"
                value={formData.loanAmount}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Business Age (Years)</label>
              <input
                type="number"
                name="businessAge"
                value={formData.businessAge}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Credit Score (300-900)</label>
              <input
                type="number"
                name="creditScore"
                value={formData.creditScore}
                onChange={handleInputChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row items-start md:items-center justify-center gap-4 md:gap-6 pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="gstSubmitted"
                  checked={formData.gstSubmitted}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-slate-600 text-teal-500 focus:ring-teal-500 bg-slate-800"
                />
                <span className="text-sm text-slate-300">GST / Tax Returns Submitted</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="collateralProvided"
                  checked={formData.collateralProvided}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-slate-600 text-teal-500 focus:ring-teal-500 bg-slate-800"
                />
                <span className="text-sm text-slate-300">Collateral Provided</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors mt-8 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Check Eligibility'
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 md:p-6 mb-8">
          <h3 className="text-xl font-semibold text-teal-400 mb-4">Analysis Result</h3>
          <div className="markdown-body prose prose-invert prose-teal max-w-none text-slate-300 text-sm leading-relaxed">
            <Markdown>{result}</Markdown>
          </div>
        </div>
      )}

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 md:p-8 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4">Document Upload</h3>
        <div className="border-2 border-dashed border-teal-500/50 rounded-xl p-6 md:p-10 flex flex-col items-center justify-center text-center hover:bg-slate-800/50 transition-colors cursor-pointer group">
          <UploadCloud className="w-10 h-10 text-teal-500/70 mb-3 group-hover:text-teal-400 transition-colors" />
          <p className="text-slate-300 font-medium">Click or Drag & Drop Files</p>
          <p className="text-slate-500 text-sm mt-1">Upload bank statements, GST returns, or ID proofs</p>
        </div>
      </div>
    </div>
  );
}
