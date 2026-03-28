'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Sparkles, IndianRupee, Image as ImageIcon, Bot,
    Send, ChevronDown, Globe, MessageCircle, Book,
    ArrowRight, Mic, X, LifeBuoy,
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

/* ─── Language config ──────────────────────────────────────────── */
type LangKey = 'en' | 'hi' | 'bh' | 'or';

const LANGS: { key: LangKey; label: string; native: string; flag: string }[] = [
    { key: 'en', label: 'English',   native: 'English',   flag: '🇬🇧' },
    { key: 'hi', label: 'Hindi',     native: 'हिन्दी',      flag: '🇮🇳' },
    { key: 'bh', label: 'Bhojpuri',  native: 'भोजपुरी',    flag: '🪔' },
    { key: 'or', label: 'Odia',      native: 'ଓଡ଼ିଆ',      flag: '🌺' },
];

const UI: Record<LangKey, {
    hero: string; heroSub: string; chatTitle: string; chatPlaceholder: string;
    chatWelcome: string; featuresTitle: string; faqTitle: string; sendBtn: string;
    quickTitle: string;
}> = {
    en: {
        hero: 'How can we help you?',
        heroSub: 'Ask anything about कलाNiwas — in your language.',
        chatTitle: 'AI Support Assistant',
        chatPlaceholder: 'Ask about loans, pricing, product descriptions...',
        chatWelcome: "👋 Namaste! I'm your कलाNiwas assistant. Ask me anything about our tools — loan matching, pricing suggestions, AI descriptions, or image enhancement. I'll reply in the language you write in!",
        featuresTitle: 'Our Tools',
        faqTitle: 'Common Questions',
        sendBtn: 'Send',
        quickTitle: 'Quick Questions',
    },
    hi: {
        hero: 'हम आपकी कैसे मदद करें?',
        heroSub: 'कलाNiwas के बारे में कुछ भी पूछें — अपनी भाषा में।',
        chatTitle: 'AI सहायक',
        chatPlaceholder: 'लोन, मूल्य निर्धारण, उत्पाद विवरण के बारे में पूछें...',
        chatWelcome: '👋 नमस्ते! मैं आपका कलाNiwas सहायक हूँ। हमारे टूल्स के बारे में कुछ भी पूछें — लोन मैचिंग, मूल्य सुझाव, AI विवरण, या इमेज एन्हांसमेंट। मैं उसी भाषा में जवाब दूँगा जिसमें आप लिखेंगे!',
        featuresTitle: 'हमारे टूल्स',
        faqTitle: 'सामान्य प्रश्न',
        sendBtn: 'भेजें',
        quickTitle: 'त्वरित प्रश्न',
    },
    bh: {
        hero: 'हम रउरा के कइसे मदद करीं?',
        heroSub: 'कलाNiwas के बारे में कुछो पूछीं — आपन भाषा में।',
        chatTitle: 'AI सहायक',
        chatPlaceholder: 'लोन, दाम, उत्पाद बारे में पूछीं...',
        chatWelcome: '👋 प्रणाम! हम रउरा के कलाNiwas सहायक बानी। हमार टूल्स के बारे में कुछो पूछीं — लोन मैचिंग, दाम सुझाव, AI विवरण, चाहे इमेज सुधार। हम ओही भाषा में जवाब देब जेमें रउरा लिखब!',
        featuresTitle: 'हमार टूल्स',
        faqTitle: 'सामान्य सवाल',
        sendBtn: 'पठाईं',
        quickTitle: 'जल्दी सवाल',
    },
    or: {
        hero: 'ଆମେ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିବୁ?',
        heroSub: 'कलाNiwas ବିଷୟରେ ଯେକୌଣସି ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ — ନିଜ ଭାଷାରେ।',
        chatTitle: 'AI ସହାୟକ',
        chatPlaceholder: 'ଋଣ, ମୂଲ୍ୟ, ଉତ୍ପାଦ ବିବରଣୀ ବିଷୟରେ ପଚାରନ୍ତୁ...',
        chatWelcome: '👋 ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ कलाNiwas ସହାୟକ। ଆମ ଟୁଲ୍ ବିଷୟରେ ଯେକୌଣସି ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ। ଆପଣ ଯେଉଁ ଭାଷାରେ ଲେଖିବେ, ମୁଁ ସେଇ ଭାଷାରେ ଉତ୍ତର ଦେବି!',
        featuresTitle: 'ଆମ ଟୁଲ୍ ସମୂହ',
        faqTitle: 'ସାଧାରଣ ପ୍ରଶ୍ନ',
        sendBtn: 'ପଠାନ୍ତୁ',
        quickTitle: 'ଶୀଘ୍ର ପ୍ରଶ୍ନ',
    },
};

const FEATURES = [
    { icon: Bot,          color: '#00e5ff', href: '/loan-matcher',
        en: { title: 'Loan Matcher',     desc: 'Find MUDRA, PM SVANidhi & CGTMSE loans matching your profile.' },
        hi: { title: 'लोन मैचर',          desc: 'अपने प्रोफाइल के अनुसार MUDRA, PM SVANidhi और CGTMSE लोन खोजें।' },
        bh: { title: 'लोन मैचर',          desc: 'आपन प्रोफाइल के हिसाब से सही लोन खोजीं।' },
        or: { title: 'ଋଣ ମ୍ୟାଚର',         desc: 'ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ ଅନୁଯାୟୀ ସଠିକ ଋଣ ଖୋଜନ୍ତୁ।' },
    },
    { icon: Sparkles,     color: '#f97316', href: '/ai-descriptor',
        en: { title: 'AI Descriptor',    desc: 'Generate product descriptions, loan summaries, and business pitches.' },
        hi: { title: 'AI डिस्क्रिप्टर',   desc: 'उत्पाद विवरण, लोन सारांश और बिज़नेस पिच बनाएं।' },
        bh: { title: 'AI डिस्क्रिप्टर',   desc: 'उत्पाद बिबरन, लोन सारांश आ बिजनेस पिच बनाईं।' },
        or: { title: 'AI ବିବରଣୀ',         desc: 'ଉତ୍ପାଦ ବିବରଣୀ, ଋଣ ସାରାଂଶ ଏବଂ ବ୍ୟବସାୟ ପିଚ୍ ତିଆରି କରନ୍ତୁ।' },
    },
    { icon: IndianRupee,  color: '#eab308', href: '/pricing-suggestion',
        en: { title: 'Pricing AI',       desc: 'Get smart price suggestions based on your costs and market.' },
        hi: { title: 'प्राइसिंग AI',      desc: 'अपनी लागत और बाज़ार के आधार पर सही मूल्य सुझाव पाएं।' },
        bh: { title: 'प्राइसिंग AI',      desc: 'आपन लागत आ बाज़ार के हिसाब से सही दाम जानीं।' },
        or: { title: 'ମୂଲ୍ୟ AI',          desc: 'ଆପଣଙ୍କ ଖର୍ଚ ଓ ବଜାର ଅନୁଯାୟୀ ସଠିକ ମୂଲ୍ୟ ଜାଣନ୍ତୁ।' },
    },
    { icon: ImageIcon,    color: '#38bdf8', href: '/image-enhancer',
        en: { title: 'Image Enhancer',   desc: 'Improve product photos for better e-commerce listings.' },
        hi: { title: 'इमेज एन्हांसर',     desc: 'बेहतर ऑनलाइन लिस्टिंग के लिए उत्पाद फोटो सुधारें।' },
        bh: { title: 'इमेज सुधार',        desc: 'बढ़िया ऑनलाइन लिस्टिंग खातिर फोटो सुधारीं।' },
        or: { title: 'ଚିତ୍ର ଉନ୍ନତି',       desc: 'ଭଲ ଅନଲାଇନ ଲିଷ୍ଟିଂ ପାଇଁ ଉତ୍ପାଦ ଫଟୋ ଉନ୍ନତ କରନ୍ତୁ।' },
    },
];

const FAQS: Record<LangKey, { q: string; a: string }[]> = {
    en: [
        { q: 'What is MUDRA loan?',              a: 'MUDRA loans (up to ₹10L) are for small businesses under Pradhan Mantri MUDRA Yojana. Use our Loan Matcher to check eligibility.' },
        { q: 'How does AI Descriptor work?',     a: 'You enter your product or business details and our AI generates professional copy in seconds.' },
        { q: 'Can I use this in my language?',   a: 'Yes! Our AI chatbot understands and replies in Hindi, Bhojpuri, Odia, and English.' },
        { q: 'Is कलाNiwas free to use?',          a: 'Yes, कलाNiwas is free for all Indian small business owners, artisans, and vendors.' },
    ],
    hi: [
        { q: 'MUDRA लोन क्या है?',               a: 'MUDRA लोन छोटे व्यापारियों के लिए ₹10 लाख तक का लोन है। पात्रता जानने के लिए हमारा Loan Matcher उपयोग करें।' },
        { q: 'AI Descriptor कैसे काम करता है?',  a: 'आप अपने उत्पाद या व्यापार की जानकारी डालें और AI तुरंत पेशेवर विवरण तैयार कर देगा।' },
        { q: 'क्या मैं हिंदी में पूछ सकता हूँ?', a: 'हाँ! हमारा AI चैटबॉट हिंदी, भोजपुरी, ओड़िया और अंग्रेज़ी में बात कर सकता है।' },
        { q: 'क्या कलाNiwas मुफ़्त है?',           a: 'हाँ, कलाNiwas सभी भारतीय छोटे व्यापारियों, कारीगरों और विक्रेताओं के लिए मुफ़्त है।' },
    ],
    bh: [
        { q: 'MUDRA लोन का होला?',               a: 'MUDRA लोन छोट ब्यापारी लोगन खातिर ₹10 लाख तक के लोन हऊए। पात्रता जाने खातिर हमार Loan Matcher उपयोग करीं।' },
        { q: 'AI Descriptor कइसे काम करेला?',    a: 'रउरा उत्पाद के जानकारी डालीं, AI तुरंत बढ़िया विवरण तैयार कर देई।' },
        { q: 'का हम भोजपुरी में पूछ सकत बानी?', a: 'हाँ! हमार AI भोजपुरी, हिंदी, ओड़िया आ अंग्रेज़ी सब बुझेला।' },
        { q: 'कलाNiwas मुफ़्त बा का?',             a: 'हाँ, कलाNiwas सब भारतीय छोट ब्यापारी आ कारीगर लोगन खातिर मुफ़्त बा।' },
    ],
    or: [
        { q: 'MUDRA ଋଣ କ\'ଣ?',                  a: 'MUDRA ଋଣ ଛୋଟ ବ୍ୟବସାୟୀଙ୍କ ପାଇଁ ₹10 ଲକ୍ଷ ପର୍ଯ୍ୟନ୍ତ। ଯୋଗ୍ୟତା ଜାଣିବାକୁ ଆମ Loan Matcher ବ୍ୟବହାର କରନ୍ତୁ।' },
        { q: 'AI Descriptor କିପରି କାମ କରେ?',    a: 'ଆପଣ ଉତ୍ପାଦ ବିବରଣ ଦିଅନ୍ତୁ, AI ତୁରନ୍ତ ଭଲ ବିବରଣୀ ତିଆରି କରିଦେବ।' },
        { q: 'ଓଡ଼ିଆରେ ପଚାରି ହେବ କି?',           a: 'ହଁ! ଆମ AI ଓଡ଼ିଆ, ହିନ୍ଦୀ, ଭୋଜପୁରୀ ଏବଂ ଇଂରାଜୀ ବୁଝେ।' },
        { q: 'कलाNiwas ମାଗଣା କି?',               a: 'ହଁ, कलाNiwas ସମସ୍ତ ଭାରତୀୟ ଛୋଟ ବ୍ୟବସାୟୀ ଓ କାରିଗରଙ୍କ ପାଇଁ ମାଗଣା।' },
    ],
};

const QUICK_QUESTIONS: Record<LangKey, string[]> = {
    en: ['How to apply for MUDRA loan?', 'How does pricing AI work?', 'Can I upload my product photo?', 'What is PM SVANidhi?'],
    hi: ['MUDRA लोन कैसे अप्लाई करें?', 'Pricing AI कैसे काम करता है?', 'क्या मैं फोटो अपलोड कर सकता हूँ?', 'PM SVANidhi क्या है?'],
    bh: ['MUDRA लोन कइसे अप्लाई करीं?', 'Pricing AI कइसे काम करेला?', 'का फोटो अपलोड हो सकेला?', 'PM SVANidhi का हऊए?'],
    or: ['MUDRA ଋଣ କିପରି ଆବେଦନ କରିବୁ?', 'Pricing AI କିପରି କାମ କରେ?', 'ଫଟୋ ଅପଲୋଡ ହୋଇପାରିବ କି?', 'PM SVANidhi କ\'ଣ?'],
};

/* ─── Types ─────────────────────────────────────────────────────── */
interface Message { role: 'user' | 'assistant'; text: string; }

/* ─── Component ─────────────────────────────────────────────────── */
export default function HelpCenter() {
    const [lang, setLang]           = useState<LangKey>('en');
    const [langOpen, setLangOpen]   = useState(false);
    const [messages, setMessages]   = useState<Message[]>([]);
    const [input, setInput]         = useState('');
    const [loading, setLoading]     = useState(false);
    const [openFaq, setOpenFaq]     = useState<number | null>(null);
    const [chatVisible, setChatVisible] = useState(true);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef  = useRef<HTMLInputElement>(null);
    const t = UI[lang];

    // Init welcome message when language changes
    useEffect(() => {
        setMessages([{ role: 'assistant', text: t.chatWelcome }]);
    }, [lang]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const send = async (text: string) => {
        if (!text.trim() || loading) return;
        const userMsg: Message = { role: 'user', text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
            const history = [...messages, userMsg]
                .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
                .join('\n');

            const prompt = `You are a helpful support assistant for कलाNiwas — an AI toolkit for Indian small business owners, artisans, and street vendors. कलाNiwas has these features: Loan Matcher (finds MUDRA, PM SVANidhi, CGTMSE loans), AI Descriptor (writes product descriptions and business pitches), Pricing AI (suggests optimal prices), and Image Enhancer (improves product photos).

IMPORTANT: Detect the language the user wrote in and reply in THAT SAME LANGUAGE. If they write in Hindi, reply in Hindi. If Bhojpuri, reply in Bhojpuri. If Odia, reply in Odia. If English, reply in English. Keep answers concise, warm, and practical.

Conversation so far:
${history}

Now reply to the latest user message.`;

            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            const reply = response.candidates?.[0]?.content?.parts?.find(p => p.text)?.text ?? 'Sorry, something went wrong.';
            setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I ran into an error. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    const activeLang = LANGS.find(l => l.key === lang)!;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@700;800&display=swap');
        .hc * { box-sizing: border-box; font-family: 'Barlow', sans-serif; }

        /* hero */
        .hc-hero {
          position: relative; overflow: hidden;
          background: #112233;
          border-bottom: 1px solid rgba(0,229,255,0.12);
          padding: 48px 24px 44px;
        }
        .hc-hero::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #00e5ff 40%, rgba(0,229,255,0.3) 70%, transparent);
        }
        .hc-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 70% 100% at 50% 0%, black 20%, transparent 100%);
        }

        /* lang selector */
        .hc-lang-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 7px 12px; border-radius: 3px; cursor: pointer;
          background: rgba(0,229,255,0.07); border: 1px solid rgba(0,229,255,0.22);
          color: #00e5ff; font-size: 13px; font-weight: 600;
          transition: all 0.15s;
        }
        .hc-lang-btn:hover { background: rgba(0,229,255,0.12); }
        .hc-lang-drop {
          position: absolute; top: calc(100% + 6px); right: 0;
          background: #0a1824; border: 1px solid rgba(0,229,255,0.2);
          border-radius: 4px; overflow: hidden; z-index: 50; min-width: 160px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.5);
          animation: hcFadeUp 0.15s ease both;
        }
        @keyframes hcFadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .hc-lang-item {
          display: flex; align-items: center; gap: 9px;
          padding: 9px 13px; cursor: pointer; font-size: 13px;
          color: #5a7a94; transition: all 0.13s;
        }
        .hc-lang-item:hover { background: rgba(0,229,255,0.07); color: #e2e8f0; }
        .hc-lang-item.active { color: #00e5ff; background: rgba(0,229,255,0.06); }

        /* section label */
        .hc-label {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #4a6880;
        }

        /* feature cards */
        .hc-feat {
          background: rgba(17,34,51,0.9); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 3px; padding: 18px; transition: all 0.2s; text-decoration: none;
          display: block;
        }
        .hc-feat:hover { transform: translateY(-2px); background: rgba(20,40,60,0.95); }

        /* FAQ */
        .hc-faq-item {
          border: 1px solid rgba(0,229,255,0.1); border-radius: 3px;
          overflow: hidden; transition: border-color 0.18s;
          background: rgba(17,34,51,0.7);
        }
        .hc-faq-item.open { border-color: rgba(0,229,255,0.28); }
        .hc-faq-q {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 16px; cursor: pointer; font-size: 14px; font-weight: 500;
          color: #c8dcea; transition: color 0.15s;
        }
        .hc-faq-q:hover { color: #fff; }
        .hc-faq-a {
          padding: 0 16px; font-size: 13px; color: #7a9ab4; line-height: 1.7;
          overflow: hidden; transition: max-height 0.3s ease, padding 0.3s ease;
        }
        .hc-faq-a.open { padding: 0 16px 14px; }

        /* chat */
        .hc-chat-wrap {
          display: flex; flex-direction: column;
          background: rgba(11,24,36,0.95);
          border: 1px solid rgba(0,229,255,0.18);
          border-radius: 4px; overflow: hidden;
          height: 520px;
        }
        .hc-chat-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px;
          background: rgba(0,229,255,0.06);
          border-bottom: 1px solid rgba(0,229,255,0.12);
        }
        .hc-messages {
          flex: 1; overflow-y: auto; padding: 16px;
          display: flex; flex-direction: column; gap: 12px;
          scrollbar-width: thin; scrollbar-color: rgba(0,229,255,0.2) transparent;
        }
        .hc-messages::-webkit-scrollbar { width: 4px; }
        .hc-messages::-webkit-scrollbar-track { background: transparent; }
        .hc-messages::-webkit-scrollbar-thumb { background: rgba(0,229,255,0.2); border-radius: 2px; }

        .hc-bubble-user {
          align-self: flex-end; max-width: 80%;
          background: rgba(0,229,255,0.12); border: 1px solid rgba(0,229,255,0.25);
          border-radius: 12px 12px 3px 12px;
          padding: 10px 14px; font-size: 13px; color: #e2e8f0; line-height: 1.6;
        }
        .hc-bubble-ai {
          align-self: flex-start; max-width: 85%;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 3px 12px 12px 12px;
          padding: 10px 14px; font-size: 13px; color: #a8c4d8; line-height: 1.7;
          white-space: pre-wrap;
        }
        .hc-typing {
          align-self: flex-start;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 3px 12px 12px 12px; padding: 12px 16px;
          display: flex; gap: 5px; align-items: center;
        }
        .hc-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #00e5ff;
          animation: hcBounce 1.2s ease infinite;
        }
        .hc-dot:nth-child(2) { animation-delay: 0.2s; }
        .hc-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes hcBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }

        /* quick questions */
        .hc-quick-btn {
          padding: 7px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;
          background: rgba(0,229,255,0.06); border: 1px solid rgba(0,229,255,0.18);
          color: #5a9ab4; cursor: pointer; transition: all 0.15s; white-space: nowrap;
          font-family: 'Barlow', sans-serif;
        }
        .hc-quick-btn:hover { background: rgba(0,229,255,0.12); color: #00e5ff; border-color: rgba(0,229,255,0.35); }

        /* chat input */
        .hc-input-wrap {
          padding: 12px 14px;
          background: rgba(0,0,0,0.2);
          border-top: 1px solid rgba(0,229,255,0.1);
          display: flex; gap: 8px; align-items: center;
        }
        .hc-input {
          flex: 1; background: rgba(0,229,255,0.05); border: 1px solid rgba(0,229,255,0.18);
          border-radius: 20px; padding: 9px 16px; color: #e2e8f0;
          font-family: 'Barlow', sans-serif; font-size: 13px; outline: none;
          transition: all 0.18s;
        }
        .hc-input::placeholder { color: #3a5a6a; }
        .hc-input:focus { border-color: rgba(0,229,255,0.45); background: rgba(0,229,255,0.07); }
        .hc-send-btn {
          width: 36px; height: 36px; border-radius: 50%; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          background: #00e5ff; color: #0a1520; transition: all 0.15s; flex-shrink: 0;
        }
        .hc-send-btn:hover { background: #00cfec; transform: scale(1.05); }
        .hc-send-btn:disabled { background: rgba(0,229,255,0.25); color: rgba(10,21,32,0.5); cursor: not-allowed; transform: none; }

        @keyframes hcFu { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .hc-fu  { animation: hcFu 0.5s ease both; }
        .hc-fu1 { animation-delay: 0.05s; }
        .hc-fu2 { animation-delay: 0.13s; }
        .hc-fu3 { animation-delay: 0.21s; }
        .hc-fu4 { animation-delay: 0.29s; }
      `}</style>

            <div className="hc" style={{ minHeight: '100%', background: '#0d1b24' }}>

                {/* ── Hero ── */}
                <div className="hc-hero hc-fu hc-fu1">
                    <div className="hc-grid" />
                    <div style={{ position: 'absolute', top: '-100px', right: '-80px', width: '500px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(0,229,255,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />

                    <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                            <div>
                                <div className="hc-label" style={{ marginBottom: 10 }}>Help Center</div>
                                <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 4vw, 46px)', textTransform: 'uppercase', letterSpacing: '0.02em', color: '#fff', lineHeight: 1, margin: 0 }}>
                                    {t.hero}
                                </h1>
                                <p style={{ fontSize: 14, color: '#5a7a94', marginTop: 10, fontWeight: 400 }}>{t.heroSub}</p>
                            </div>

                            {/* Language selector */}
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                <button className="hc-lang-btn" onClick={() => setLangOpen(o => !o)}>
                                    <Globe style={{ width: 14, height: 14 }} />
                                    <span>{activeLang.flag} {activeLang.native}</span>
                                    <ChevronDown style={{ width: 13, height: 13, transition: 'transform 0.15s', transform: langOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                                </button>
                                {langOpen && (
                                    <>
                                        <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setLangOpen(false)} />
                                        <div className="hc-lang-drop">
                                            {LANGS.map(l => (
                                                <div key={l.key} className={`hc-lang-item${lang === l.key ? ' active' : ''}`}
                                                     onClick={() => { setLang(l.key); setLangOpen(false); }}>
                                                    <span style={{ fontSize: 16 }}>{l.flag}</span>
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: 13 }}>{l.native}</div>
                                                        <div style={{ fontSize: 11, opacity: 0.6 }}>{l.label}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Main layout ── */}
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 24px 60px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>

                        {/* LEFT — features + FAQ */}
                        <div>

                            {/* Features */}
                            <div className="hc-fu hc-fu2" style={{ marginBottom: 36 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                    <span className="hc-label">{t.featuresTitle}</span>
                                    <div style={{ flex: 1, height: 1, background: 'rgba(0,229,255,0.1)' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
                                    {FEATURES.map(f => {
                                        const txt = f[lang] as { title: string; desc: string };
                                        return (
                                            <a key={f.href} href={f.href} className="hc-feat"
                                               onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${f.color}40`; }}
                                               onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                                    <div style={{ width: 36, height: 36, borderRadius: 3, background: `${f.color}15`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        <f.icon style={{ width: 16, height: 16, color: f.color }} />
                                                    </div>
                                                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#e2e8f0' }}>
                                                        {txt.title}
                                                    </div>
                                                </div>
                                                <p style={{ fontSize: 12, color: '#5a7a94', lineHeight: 1.65, margin: 0 }}>{txt.desc}</p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 10, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: f.color }}>
                                                    Open <ArrowRight style={{ width: 11, height: 11 }} />
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* FAQ */}
                            <div className="hc-fu hc-fu3">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                    <span className="hc-label">{t.faqTitle}</span>
                                    <div style={{ flex: 1, height: 1, background: 'rgba(0,229,255,0.1)' }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {FAQS[lang].map((faq, i) => (
                                        <div key={i} className={`hc-faq-item${openFaq === i ? ' open' : ''}`}>
                                            <div className="hc-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                                <span>{faq.q}</span>
                                                <ChevronDown style={{ width: 15, height: 15, color: '#4a6880', transition: 'transform 0.25s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)', flexShrink: 0 }} />
                                            </div>
                                            <div className={`hc-faq-a${openFaq === i ? ' open' : ''}`}
                                                 style={{ maxHeight: openFaq === i ? '200px' : '0px' }}>
                                                {faq.a}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT — chat */}
                        <div className="hc-fu hc-fu2" style={{ position: 'sticky', top: 80 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                <span className="hc-label">{t.chatTitle}</span>
                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.6)', animation: 'hcBounce 2s ease infinite' }} />
                            </div>

                            <div className="hc-chat-wrap">
                                {/* Chat header */}
                                <div className="hc-chat-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                        <div style={{ width: 30, height: 30, borderRadius: 3, background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <MessageCircle style={{ width: 14, height: 14, color: '#00e5ff' }} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>कलाNiwas Assistant</div>
                                            <div style={{ fontSize: 10, color: '#3a7a5a', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>● Online</div>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: 11, color: '#2a4255' }}>{activeLang.flag} {activeLang.native}</div>
                                </div>

                                {/* Messages */}
                                <div className="hc-messages">
                                    {messages.map((m, i) => (
                                        <div key={i} className={m.role === 'user' ? 'hc-bubble-user' : 'hc-bubble-ai'}>
                                            {m.text}
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="hc-typing">
                                            <div className="hc-dot" /><div className="hc-dot" /><div className="hc-dot" />
                                        </div>
                                    )}
                                    <div ref={bottomRef} />
                                </div>

                                {/* Quick questions */}
                                {messages.length <= 1 && (
                                    <div style={{ padding: '8px 14px 0', borderTop: '1px solid rgba(0,229,255,0.07)' }}>
                                        <div style={{ fontSize: 10, color: '#2a4255', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 7 }}>{t.quickTitle}</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingBottom: 8 }}>
                                            {QUICK_QUESTIONS[lang].map((q, i) => (
                                                <button key={i} className="hc-quick-btn" onClick={() => send(q)}>{q}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Input */}
                                <div className="hc-input-wrap">
                                    <input ref={inputRef} className="hc-input"
                                           placeholder={t.chatPlaceholder} value={input}
                                           onChange={e => setInput(e.target.value)}
                                           onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
                                           disabled={loading}
                                    />
                                    <button className="hc-send-btn" onClick={() => send(input)} disabled={!input.trim() || loading}>
                                        <Send style={{ width: 14, height: 14 }} />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}