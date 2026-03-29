'use client';

import { useState, useRef } from 'react';
import { Loader2, Image as ImageIcon, UploadCloud, Sparkles, Tag, Download, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Image from 'next/image';
import dynamic from 'next/dynamic';
const Markdown = dynamic(() => import('react-markdown'), { ssr: false });

export default function ImageEnhancer() {
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setMimeType(file.type);
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result as string);
      setResultImage(null);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files?.[0]; if (file) handleFile(file);
  };

  const handleEnhance = async () => {
    if (!originalImage || !mimeType) return;
    setLoading(true); setResultImage(null); setAnalysisResult(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
      const base64Data = originalImage.split(',')[1];
      const [enhanceResponse, analysisResponse] = await Promise.all([
        ai.models.generateContent({
          model: 'gemini-1.5-flash-image',
          contents: { parts: [{ inlineData: { data: base64Data, mimeType } }, { text: 'Enhance this product image. Make it look professional, well-lit, high quality, suitable for an e-commerce store. Keep the main product intact but improve the lighting, background, and overall appeal.' }] },
        }),
        ai.models.generateContent({
          model: 'gemini-3.1-pro-preview',
          contents: { parts: [{ inlineData: { data: base64Data, mimeType } }, { text: 'Analyze this product image. Provide: 1. A compelling e-commerce product description. 2. A suggested price range in INR (₹) with brief justification. Format clearly using Markdown.' }] },
        }),
      ]);
      const parts = enhanceResponse.candidates?.[0]?.content?.parts;
      const imagePart = parts?.find((p) => p.inlineData);
      if (imagePart?.inlineData) setResultImage(`data:image/png;base64,${imagePart.inlineData.data}`);
      const aParts = analysisResponse.candidates?.[0]?.content?.parts;
      setAnalysisResult(aParts?.find((p) => p.text)?.text || 'No analysis generated.');
    } catch (err) {
      console.error(err); alert('Failed to enhance image. Please try again.');
    } finally { setLoading(false); }
  };

  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap');
        .ie-wrap * { font-family: 'Sora', sans-serif; box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        .loading-shimmer { background: linear-gradient(90deg,rgba(0,229,255,0.05) 25%,rgba(0,229,255,0.12) 50%,rgba(0,229,255,0.05) 75%); background-size:200% auto; animation: shimmer 2s linear infinite; }
        .prose-result h1,.prose-result h2,.prose-result h3 { color:white; margin:1em 0 0.5em; font-weight:700; }
        .prose-result p { color:#94a3b8; line-height:1.8; margin:0.5em 0; }
        .prose-result strong { color:#e2e8f0; }
        .prose-result ul,.prose-result ol { color:#94a3b8; padding-left:1.5em; }
        .prose-result li { margin:0.3em 0; }
      `}</style>

        <div className="ie-wrap min-h-screen bg-[#0d1b24] p-4 md:p-8 relative overflow-hidden">
          <div style={{ position:'absolute', top:'-80px', left:'-80px', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'-60px', right:'-60px', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle,rgba(0,229,255,0.07) 0%,transparent 70%)', pointerEvents:'none' }} />

          <div className="max-w-4xl mx-auto relative z-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'rgba(59,130,246,0.15)', border:'1px solid rgba(59,130,246,0.3)' }}>
                <ImageIcon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Image Enhancer</h1>
                <p className="text-xs text-slate-500 mt-0.5">AI-powered product photo upgrade</p>
              </div>
            </div>

            {/* Main card */}
            <div style={{ background:'rgba(17,31,42,0.9)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'20px', padding:'24px' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Upload */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-4 rounded-full bg-blue-500" />
                    <span className="text-sm font-semibold text-white">Original</span>
                  </div>

                  {!originalImage ? (
                      <div
                          onClick={() => fileInputRef.current?.click()}
                          onDrop={handleDrop}
                          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                          onDragLeave={() => setDragOver(false)}
                          className="relative rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all"
                          style={{
                            height:'240px', border:`2px dashed ${dragOver ? '#3b82f6' : 'rgba(59,130,246,0.3)'}`,
                            background: dragOver ? 'rgba(59,130,246,0.06)' : 'rgba(13,27,36,0.6)',
                          }}>
                        <UploadCloud className="w-10 h-10 mb-3 text-blue-500/60" />
                        <p className="text-sm font-semibold text-slate-300">Drop image or click to upload</p>
                        <p className="text-xs text-slate-600 mt-1">JPG, PNG supported</p>
                      </div>
                  ) : (
                      <div className="relative rounded-xl overflow-hidden group" style={{ height:'240px', background:'rgba(13,27,36,0.6)', border:'1px solid rgba(255,255,255,0.06)' }}>
                        <Image src={originalImage} alt="Original" fill className="object-contain" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background:'rgba(0,0,0,0.5)' }}>
                          <button onClick={() => fileInputRef.current?.click()}
                                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
                                  style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)' }}>
                            <RefreshCw className="w-4 h-4" /> Change
                          </button>
                        </div>
                      </div>
                  )}

                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

                  <button onClick={handleEnhance} disabled={loading || !originalImage}
                          className="w-full mt-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                          style={{ background: !originalImage ? 'rgba(59,130,246,0.25)' : loading ? 'rgba(59,130,246,0.6)' : '#3b82f6', color:'white', cursor: !originalImage || loading ? 'not-allowed' : 'pointer', boxShadow: originalImage && !loading ? '0 0 20px rgba(59,130,246,0.3)' : 'none' }}>
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enhancing...</> : <><Sparkles className="w-4 h-4" /> Enhance Image</>}
                  </button>
                </div>

                {/* Result */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-4 rounded-full" style={{ background: resultImage ? '#00e5ff' : 'rgba(255,255,255,0.1)' }} />
                    <span className="text-sm font-semibold text-white">Enhanced</span>
                    {resultImage && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background:'rgba(0,229,255,0.12)', color:'#00e5ff' }}>Ready</span>}
                  </div>

                  <div className="rounded-xl flex items-center justify-center relative overflow-hidden" style={{ height:'240px', background:'rgba(13,27,36,0.6)', border:`1px solid ${resultImage ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
                    {loading ? (
                        <div className="loading-shimmer absolute inset-0 flex flex-col items-center justify-center">
                          <Sparkles className="w-8 h-8 text-blue-400 animate-pulse mb-2" />
                          <span className="text-xs text-blue-400 font-medium">Applying AI magic...</span>
                        </div>
                    ) : resultImage ? (
                        <Image src={resultImage} alt="Enhanced" fill className="object-contain" />
                    ) : (
                        <div className="flex flex-col items-center text-slate-600">
                          <ImageIcon className="w-8 h-8 mb-2 opacity-40" />
                          <span className="text-xs">Enhanced image will appear here</span>
                        </div>
                    )}
                  </div>

                  {resultImage ? (
                      <a href={resultImage} download="enhanced-product.png"
                         className="w-full mt-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                         style={{ background:'rgba(0,229,255,0.1)', border:'1px solid rgba(0,229,255,0.25)', color:'#00e5ff', display:'flex' }}>
                        <Download className="w-4 h-4" /> Download Enhanced
                      </a>
                  ) : (
                      <div className="mt-4 py-3 rounded-xl text-center text-xs text-slate-600" style={{ border:'1px solid rgba(255,255,255,0.04)', background:'rgba(255,255,255,0.02)' }}>
                        Upload an image to get started
                      </div>
                  )}
                </div>
              </div>
            </div>

            {/* Analysis */}
            {analysisResult && (
                <div className="fade-up mt-6" style={{ background:'rgba(17,31,42,0.9)', border:'1px solid rgba(59,130,246,0.25)', borderRadius:'20px', padding:'24px' }}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:'rgba(59,130,246,0.15)' }}>
                      <Tag className="w-4 h-4 text-blue-400" />
                    </div>
                    <h3 className="text-base font-semibold text-white">AI Product Analysis</h3>
                  </div>
                  <div className="prose-result text-sm"><Markdown>{analysisResult}</Markdown></div>
                </div>
            )}
          </div>
        </div>
      </>
  );
}