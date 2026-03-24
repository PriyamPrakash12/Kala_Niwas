import Link from 'next/link';
import { Sparkles, LifeBuoy, IndianRupee, Image as ImageIcon, Bot, Search } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Welcome back 👋</h2>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search schemes, products, support..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* AI Descriptor */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-full hover:border-teal-500/50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-6 h-6 text-orange-400" />
            <h3 className="text-xl font-semibold text-teal-400">AI Descriptor</h3>
          </div>
          <p className="text-slate-400 text-sm mb-6 flex-1">
            Generate product descriptions, loan summaries, and business explanations using AI.
          </p>
          <Link href="/ai-descriptor" className="inline-block bg-teal-900/40 hover:bg-teal-900/60 text-teal-400 font-medium px-4 py-2 rounded-lg transition-colors w-fit">
            Generate Description
          </Link>
        </div>

        {/* Support */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-full hover:border-teal-500/50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <LifeBuoy className="w-6 h-6 text-pink-500" />
            <h3 className="text-xl font-semibold text-teal-400">Support</h3>
          </div>
          <p className="text-slate-400 text-sm mb-6 flex-1">
            Need help? Contact support, view FAQs, or connect with an advisor.
          </p>
          <Link href="/support" className="inline-block bg-teal-900/40 hover:bg-teal-900/60 text-teal-400 font-medium px-4 py-2 rounded-lg transition-colors w-fit">
            Get Help
          </Link>
        </div>

        {/* Pricing Suggestion */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-full hover:border-teal-500/50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <IndianRupee className="w-6 h-6 text-yellow-500" />
            <h3 className="text-xl font-semibold text-teal-400">Pricing Suggestion</h3>
          </div>
          <p className="text-slate-400 text-sm mb-6 flex-1">
            Get smart pricing recommendations for your product or service based on market data.
          </p>
          <Link href="/pricing-suggestion" className="inline-block bg-teal-900/40 hover:bg-teal-900/60 text-teal-400 font-medium px-4 py-2 rounded-lg transition-colors w-fit">
            Suggest Price
          </Link>
        </div>

        {/* Image Enhancer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-full hover:border-teal-500/50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <ImageIcon className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-semibold text-teal-400">Image Enhancer</h3>
          </div>
          <p className="text-slate-400 text-sm mb-6 flex-1">
            Upload product images and improve clarity, brightness, and quality using AI.
          </p>
          <Link href="/image-enhancer" className="inline-block bg-teal-900/40 hover:bg-teal-900/60 text-teal-400 font-medium px-4 py-2 rounded-lg transition-colors w-fit">
            Enhance Image
          </Link>
        </div>

        {/* Smart Loan Matcher */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-full hover:border-teal-500/50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <Bot className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-teal-400">Smart Loan Matcher</h3>
          </div>
          <p className="text-slate-400 text-sm mb-6 flex-1">
            Find the best loan scheme based on your business type, income, and eligibility.
          </p>
          <Link href="/loan-matcher" className="inline-block bg-teal-900/40 hover:bg-teal-900/60 text-teal-400 font-medium px-4 py-2 rounded-lg transition-colors w-fit">
            Match Loan
          </Link>
        </div>
      </div>
    </div>
  );
}
