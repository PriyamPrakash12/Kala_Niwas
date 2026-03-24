'use client';

import { useState, useRef } from 'react';
import { Loader2, Image as ImageIcon, UploadCloud, Sparkles, Tag } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type);
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result as string);
      setResultImage(null); // Reset result when new image is uploaded
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleEnhance = async () => {
    if (!originalImage || !mimeType) return;
    
    setLoading(true);
    setResultImage(null);
    setAnalysisResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
      
      // Extract base64 data without the data URL prefix
      const base64Data = originalImage.split(',')[1];

      // Run image enhancement and analysis in parallel
      const [enhanceResponse, analysisResponse] = await Promise.all([
        ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: mimeType,
                },
              },
              {
                text: 'Enhance this product image. Make it look professional, well-lit, high quality, and suitable for an e-commerce store. Keep the main product intact but improve the lighting, background, and overall appeal.',
              },
            ],
          },
        }),
        ai.models.generateContent({
          model: 'gemini-3.1-pro-preview',
          contents: {
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: mimeType,
                },
              },
              {
                text: 'Analyze this product image. Please provide: 1. A compelling product description suitable for an e-commerce store. 2. A suggested price range in INR (₹) based on the visual quality and typical market rates for such items in India, along with a brief justification. Format the response clearly using Markdown.',
              },
            ],
          },
        })
      ]);

      let foundImage = false;
      if (enhanceResponse.candidates && enhanceResponse.candidates.length > 0) {
        const parts = enhanceResponse.candidates[0].content?.parts;
        if (parts) {
          for (const part of parts) {
            if (part.inlineData) {
              const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
              setResultImage(imageUrl);
              foundImage = true;
              break;
            }
          }
        }
      }

      if (!foundImage) {
        throw new Error('No image returned from the model.');
      }

      let analysisText = 'No analysis generated.';

if (
  analysisResponse.candidates &&
  analysisResponse.candidates.length > 0
) {
  const parts = analysisResponse.candidates[0].content?.parts;
  if (parts) {
    for (const part of parts) {
      if (part.text) {
        analysisText = part.text;
        break;
      }
    }
  }
}

setAnalysisResult(analysisText);
    } catch (error) {
      console.error('Error enhancing image:', error);
      alert('Failed to enhance image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-center gap-3 mb-6 md:mb-10">
        <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
        <h1 className="text-2xl md:text-3xl font-bold text-white">Image Enhancer</h1>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 md:p-8 mb-8 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Upload Section */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4">Original Image</h3>
            
            {!originalImage ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-500/50 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-slate-800/50 transition-colors cursor-pointer group h-64"
              >
                <UploadCloud className="w-10 h-10 text-blue-500/70 mb-3 group-hover:text-blue-400 transition-colors" />
                <p className="text-slate-300 font-medium">Click to Upload Product Image</p>
                <p className="text-slate-500 text-sm mt-1">Supports JPG, PNG</p>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 h-64 bg-slate-900 flex items-center justify-center group">
                <Image 
                  src={originalImage} 
                  alt="Original Product" 
                  fill 
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            <button
              onClick={handleEnhance}
              disabled={loading || !originalImage}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Enhance Image
                </>
              )}
            </button>
          </div>

          {/* Result Section */}
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4">Enhanced Result</h3>
            
            <div className="border border-slate-700 rounded-xl h-64 bg-slate-900 flex items-center justify-center relative overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center text-blue-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <span className="text-sm font-medium">Applying AI Magic...</span>
                </div>
              ) : resultImage ? (
                <Image 
                  src={resultImage} 
                  alt="Enhanced Product" 
                  fill 
                  className="object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-slate-500 text-sm flex flex-col items-center">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <span>Enhanced image will appear here</span>
                </div>
              )}
            </div>

            {resultImage && (
              <a 
                href={resultImage} 
                download="enhanced-product.png"
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
              >
                Download Image
              </a>
            )}
          </div>

        </div>
      </div>

      {analysisResult && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 md:p-8">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <Tag className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
            <h3 className="text-lg md:text-xl font-semibold text-white">AI Product Analysis</h3>
          </div>
          <div className="markdown-body prose prose-invert prose-blue max-w-none text-slate-300 text-sm leading-relaxed">
            <Markdown>{analysisResult}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}
