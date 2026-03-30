'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import {
  Sparkles, LifeBuoy, IndianRupee, Image as ImageIcon,
  Bot, Search, ArrowRight, Lightbulb, ChevronRight,
  Upload, X, Plus, Minus, CheckCircle2, Camera,
  Tag, Package, MapPin, FileText, ChevronDown,
  Loader2, AlertCircle,
} from 'lucide-react';
import { useUser } from '@/components/UserContext';

const tools = [
  { id:'ai-descriptor',      href:'/ai-descriptor',      icon:Sparkles,    iconColor:'#f97316', tag:'AI',      title:'AI Descriptor',   subtitle:'Content Generation', desc:'Generate compelling product descriptions, loan summaries, and business pitches instantly with AI.', cta:'Generate', badge:'Popular' },
  { id:'pricing-suggestion', href:'/pricing-suggestion', icon:IndianRupee, iconColor:'#eab308', tag:'PRICING', title:'Pricing AI',        subtitle:'Market Intelligence', desc:'Get data-driven pricing recommendations calibrated to your local market and competition.',          cta:'Get Price', badge:null },
  { id:'loan-matcher',       href:'/loan-matcher',       icon:Bot,         iconColor:'#00e5ff', tag:'FINANCE', title:'Loan Matcher',      subtitle:'Govt Schemes',       desc:'Match MUDRA, PM SVANidhi, and CGTMSE schemes based on your exact eligibility profile.',            cta:'Match Loan', badge:'New' },
  { id:'image-enhancer',     href:'/image-enhancer',     icon:ImageIcon,   iconColor:'#38bdf8', tag:'VISUAL',  title:'Image Enhancer',    subtitle:'AI Processing',      desc:'Improve product photo clarity, brightness, and quality for better listings with one click.',        cta:'Enhance', badge:null },
  { id:'support',            href:'/support',            icon:LifeBuoy,    iconColor:'#a78bfa', tag:'SUPPORT', title:'Help Center',        subtitle:'Advisor Network',    desc:'Access FAQs, connect with a live business advisor, or raise a support ticket anytime.',            cta:'Get Help', badge:null },
];

const tips = [
  { label:'Pro Tip',      text:'Add your product category when using AI Descriptor — it generates 3× more relevant copy.' },
  { label:'Did You Know', text:'PM SVANidhi offers up to ₹50,000 with no collateral for street vendors. Check your eligibility today.' },
  { label:'Quick Win',    text:'High-quality product photos increase buyer trust by 60%. Try Image Enhancer on your next listing.' },
  { label:'Tip',          text:'Under-pricing is the #1 mistake new vendors make. Let Pricing AI suggest the right number.' },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const CATEGORIES = ['Handicrafts','Textiles & Sarees','Jewellery','Pottery & Ceramics','Food & Spices','Woodwork','Paintings & Art','Other'];
const CONDITIONS  = ['Brand New','Handmade (New)','Refurbished','Used – Good'];
const DELIVERY    = ['Standard (5–7 days)','Express (2–3 days)','Same Day','Pickup Only'];

// Category → buyer page category id mapping
const CAT_MAP: Record<string,string> = {
  'Handicrafts':'handicraft', 'Textiles & Sarees':'textile', 'Jewellery':'jewellery',
  'Pottery & Ceramics':'pottery', 'Food & Spices':'food', 'Woodwork':'woodwork',
  'Paintings & Art':'handicraft', 'Other':'handicraft',
};

// Storage key shared with buyer page
const LISTED_PRODUCTS_KEY = 'kalakit_listed_products';

function ImageSlot({ index, file, onAdd, onRemove }: { index:number; file:File|null; onAdd:(f:File)=>void; onRemove:()=>void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [hov, setHov] = useState(false);
  const isPrimary = index === 0;

  return (
      <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
           style={{ position:'relative', aspectRatio:'1', borderRadius:4, overflow:'hidden', cursor:'pointer',
             background: file ? 'rgba(0,229,255,0.04)' : 'rgba(13,27,36,0.8)',
             border: `${isPrimary?'2px':'1px'} ${file?'solid rgba(0,229,255,0.4)':'dashed rgba(0,229,255,0.2)'}`,
             transition:'all 0.2s',
           }}
           onClick={()=>!file && ref.current?.click()}>
        <input ref={ref} type="file" accept="image/*" className="hidden"
               onChange={e=>{ const f=e.target.files?.[0]; if(f) onAdd(f); }} />
        {file ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={URL.createObjectURL(file)} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              {hov && (
                  <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                    <button onClick={e=>{e.stopPropagation();ref.current?.click();}} style={{ padding:'6px 10px', borderRadius:3, background:'rgba(0,229,255,0.15)', border:'1px solid rgba(0,229,255,0.4)', color:'#00e5ff', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:"'Barlow',sans-serif" }}>Change</button>
                    <button onClick={e=>{e.stopPropagation();onRemove();}} style={{ padding:'6px 10px', borderRadius:3, background:'rgba(244,63,94,0.15)', border:'1px solid rgba(244,63,94,0.4)', color:'#f43f5e', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:"'Barlow',sans-serif" }}>Remove</button>
                  </div>
              )}
              {isPrimary && <div style={{ position:'absolute', top:6, left:6, fontSize:9, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', padding:'2px 7px', borderRadius:2, background:'#00e5ff', color:'#0a1520' }}>Cover</div>}
            </>
        ) : (
            <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6 }}>
              <Camera style={{ width:20, height:20, color: isPrimary?'#00e5ff':'#2a4a60' }} />
              <span style={{ fontSize:10, fontWeight:600, color: isPrimary?'#3a6a80':'#1a3a50', textAlign:'center', letterSpacing:'0.04em' }}>{isPrimary?'Cover Photo':'Add Photo'}</span>
            </div>
        )}
      </div>
  );
}

function SelectField({ label, value, options, onChange }: { label:string; value:string; options:string[]; onChange:(v:string)=>void }) {
  const [open, setOpen] = useState(false);
  return (
      <div>
        <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#3a6a80', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.07em' }}>{label}</label>
        <div style={{ position:'relative' }}>
          <div onClick={()=>setOpen(o=>!o)}
               style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', borderRadius:3, cursor:'pointer', background:'rgba(0,229,255,0.04)', border:`1px solid ${open?'rgba(0,229,255,0.45)':'rgba(0,229,255,0.18)'}`, color: value?'#e2e8f0':'#2a4a60', fontSize:13, fontFamily:"'Barlow',sans-serif", transition:'all 0.15s' }}>
            <span>{value||`Select ${label}`}</span>
            <ChevronDown style={{ width:14, height:14, color:'#2a4a60', transition:'transform 0.15s', transform:open?'rotate(180deg)':'rotate(0)' }} />
          </div>
          {open && (
              <>
                <div style={{ position:'fixed', inset:0, zIndex:40 }} onClick={()=>setOpen(false)} />
                <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, right:0, background:'#0a1824', border:'1px solid rgba(0,229,255,0.2)', borderRadius:4, overflow:'hidden', zIndex:50, boxShadow:'0 12px 32px rgba(0,0,0,0.5)' }}>
                  {options.map(o=>(
                      <div key={o} onClick={()=>{onChange(o);setOpen(false);}}
                           style={{ padding:'9px 13px', cursor:'pointer', fontSize:13, color: value===o?'#00e5ff':'#5a7a94', background: value===o?'rgba(0,229,255,0.07)':'transparent', transition:'all 0.12s', fontFamily:"'Barlow',sans-serif" }}
                           onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='rgba(0,229,255,0.06)'}
                           onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background=value===o?'rgba(0,229,255,0.07)':'transparent'}>
                        {o}
                      </div>
                  ))}
                </div>
              </>
          )}
        </div>
      </div>
  );
}

function ListProductModal({ onClose, sellerName, sellerLocation }: { onClose:()=>void; sellerName:string; sellerLocation:string }) {
  const [step,     setStep]     = useState<1|2|3|4>(1);
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [images,   setImages]   = useState<(File|null)[]>([null,null,null,null,null,null]);
  const [tags,     setTags]     = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [errors,   setErrors]   = useState<Record<string,string>>({});
  const [form, setForm] = useState({
    title:'', category:'', description:'', condition:'Handmade (New)',
    price:'', originalPrice:'', stock:'1', sku:'',
    deliveryOption:'Standard (5–7 days)', deliveryPrice:'0',
    returnPolicy:'7 days return accepted', location:'',
    weight:'', dimensions:'',
  });

  const set = (k:string, v:string) => setForm(f=>({...f,[k]:v}));

  const validate = () => {
    const e: Record<string,string> = {};
    if (step===1) {
      if (!form.title.trim())       e.title='Product title is required';
      if (!form.category)           e.category='Select a category';
      if (!form.description.trim()) e.description='Description is required';
      if (images.filter(Boolean).length===0) e.images='Add at least one product photo';
    }
    if (step===2) {
      if (!form.price || isNaN(Number(form.price))) e.price='Enter a valid price';
      if (!form.stock || isNaN(Number(form.stock))) e.stock='Enter available stock';
    }
    if (step===3) {
      if (!form.location.trim()) e.location='Enter your location';
    }
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const next = () => { if (validate()) setStep(s=>(s+1) as any); };

  const resetForm = () => {
    setSuccess(false); setStep(1);
    setForm({ title:'', category:'', description:'', condition:'Handmade (New)', price:'', originalPrice:'', stock:'1', sku:'', deliveryOption:'Standard (5–7 days)', deliveryPrice:'0', returnPolicy:'7 days return accepted', location:'', weight:'', dimensions:'' });
    setImages([null,null,null,null,null,null]); setTags([]);
  };

  const CATEGORY_ICONS: Record<string,string> = {
    'Handicrafts':'🏺','Textiles & Sarees':'🧵','Jewellery':'📿',
    'Pottery & Ceramics':'☕','Food & Spices':'🌶️','Woodwork':'🪵',
    'Paintings & Art':'🎨','Other':'📦',
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r=>setTimeout(r,1800));

    // ── Save to localStorage so buyer page can show it ──
    const newProduct = {
      id: `listed-${Date.now()}`,
      name: form.title,
      sellerName: sellerName || 'My Shop',
      sellerLocation: form.location || sellerLocation || 'India',
      sellerAccent: '#00e5ff',
      sellerCategory: CAT_MAP[form.category] || 'handicraft',
      sellerRating: 4.5,
      category: CAT_MAP[form.category] || 'handicraft',
      price: Number(form.price),
      originalPrice: Number(form.originalPrice) || Number(form.price),
      desc: form.description,
      inStock: Number(form.stock) > 0,
      badge: form.condition,
      tag: null as string | null,
      tagColor: null as string | null,
      icon: CATEGORY_ICONS[form.category] || '📦',
      delivery: form.deliveryOption.match(/\d+–?\d+ days/)?.[0] || '5-7 days',
      listedAt: Date.now(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem(LISTED_PRODUCTS_KEY) || '[]');
      localStorage.setItem(LISTED_PRODUCTS_KEY, JSON.stringify([...existing, newProduct]));
    } catch {}

    setLoading(false);
    setSuccess(true);
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length<8) { setTags(ts=>[...ts,t]); setTagInput(''); }
  };

  const STEPS = ['Details','Pricing','Shipping','Review'];

  return (
      <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'flex-end', justifyContent:'center' }}
           onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)' }} />
        <div style={{ position:'relative', width:'100%', maxWidth:700, maxHeight:'92vh', display:'flex', flexDirection:'column',
          background:'#0d1e2c', border:'1px solid rgba(0,229,255,0.2)', borderRadius:'12px 12px 0 0',
          boxShadow:'0 -20px 60px rgba(0,0,0,0.6)', animation:'lmSlideUp 0.3s ease both' }}>
          <div style={{ height:2, background:'linear-gradient(90deg,transparent,#00e5ff 40%,rgba(0,229,255,0.3) 70%,transparent)', borderRadius:'12px 12px 0 0' }} />

          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid rgba(0,229,255,0.1)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:3, background:'rgba(0,229,255,0.1)', border:'1px solid rgba(0,229,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Upload style={{ width:15, height:15, color:'#00e5ff' }} />
              </div>
              <div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:18, textTransform:'uppercase', letterSpacing:'0.04em', color:'#fff' }}>List Your Product</div>
                <div style={{ fontSize:11, color:'#2a4a60' }}>Reach buyers across India</div>
              </div>
            </div>
            <button onClick={onClose} style={{ width:30, height:30, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'#3a6a80', cursor:'pointer' }}>
              <X style={{ width:14, height:14 }} />
            </button>
          </div>

          {/* Step indicator */}
          {!success && (
              <div style={{ display:'flex', alignItems:'center', padding:'12px 20px', borderBottom:'1px solid rgba(0,229,255,0.07)', gap:0 }}>
                {STEPS.map((s,i)=>{
                  const done=step>i+1; const active=step===i+1;
                  return (
                      <div key={s} style={{ display:'flex', alignItems:'center', flex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                          <div style={{ width:24, height:24, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, fontFamily:"'Barlow',sans-serif", background: done?'#00e5ff': active?'rgba(0,229,255,0.15)':'rgba(255,255,255,0.04)', color: done?'#0a1520': active?'#00e5ff':'#1a3a50', border: active?'1.5px solid #00e5ff':'1px solid rgba(0,229,255,0.1)', boxShadow: active?'0 0 10px rgba(0,229,255,0.3)':'none', transition:'all 0.3s' }}>
                            {done ? '✓' : i+1}
                          </div>
                          <span style={{ fontSize:11, fontWeight:600, color: active?'#00e5ff': done?'#3a6a80':'#1a3a50', textTransform:'uppercase', letterSpacing:'0.06em' }}>{s}</span>
                        </div>
                        {i<3 && <div style={{ flex:1, height:1, background: done?'rgba(0,229,255,0.4)':'rgba(0,229,255,0.08)', margin:'0 8px', transition:'background 0.4s' }} />}
                      </div>
                  );
                })}
              </div>
          )}

          {/* Body */}
          <div style={{ flex:1, overflowY:'auto', padding:'20px', scrollbarWidth:'thin', scrollbarColor:'rgba(0,229,255,0.2) transparent' }}>

            {/* SUCCESS */}
            {success && (
                <div style={{ textAlign:'center', padding:'40px 20px' }}>
                  <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(34,197,94,0.12)', border:'2px solid rgba(34,197,94,0.35)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'0 0 24px rgba(34,197,94,0.2)' }}>
                    <CheckCircle2 style={{ width:32, height:32, color:'#22c55e' }} />
                  </div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:26, textTransform:'uppercase', color:'#fff', marginBottom:8 }}>Product Listed!</div>
                  <p style={{ fontSize:13, color:'#3a6a80', marginBottom:6 }}>
                    <strong style={{ color:'#c8dcea' }}>{form.title}</strong> is now live on कलाNiwas Marketplace.
                  </p>
                  <p style={{ fontSize:12, color:'#2a4a60', marginBottom:24 }}>Buyers can discover and order your product from the marketplace.</p>
                  <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
                    <button onClick={onClose} style={{ padding:'9px 20px', borderRadius:3, background:'#00e5ff', border:'none', color:'#0a1520', fontSize:12, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', cursor:'pointer', fontFamily:"'Barlow',sans-serif" }}>Done</button>
                    <button onClick={resetForm} style={{ padding:'9px 20px', borderRadius:3, background:'rgba(0,229,255,0.08)', border:'1px solid rgba(0,229,255,0.25)', color:'#00e5ff', fontSize:12, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', cursor:'pointer', fontFamily:"'Barlow',sans-serif" }}>List Another</button>
                  </div>
                </div>
            )}

            {/* STEP 1 */}
            {!success && step===1 && (
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <div>
                    <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#3a6a80', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.07em' }}>Product Title *</label>
                    <input value={form.title} onChange={e=>set('title',e.target.value)} placeholder="e.g., Handwoven Banarasi Silk Saree – Red with Gold Zari"
                           style={{ width:'100%', padding:'10px 12px', borderRadius:3, background:'rgba(0,229,255,0.04)', border:`1px solid ${errors.title?'rgba(244,63,94,0.5)':'rgba(0,229,255,0.18)'}`, color:'#e2e8f0', fontSize:13, outline:'none', fontFamily:"'Barlow',sans-serif" }}
                           onFocus={e=>(e.target as HTMLInputElement).style.borderColor='rgba(0,229,255,0.5)'}
                           onBlur={e=>(e.target as HTMLInputElement).style.borderColor=errors.title?'rgba(244,63,94,0.5)':'rgba(0,229,255,0.18)'}
                    />
                    {errors.title && <div style={{ fontSize:11, color:'#f43f5e', marginTop:4, display:'flex', alignItems:'center', gap:4 }}><AlertCircle style={{ width:11, height:11 }} />{errors.title}</div>}
                  </div>
                  <SelectField label="Category *" value={form.category} options={CATEGORIES} onChange={v=>{set('category',v);setErrors(e=>({...e,category:''}));}} />
                  {errors.category && <div style={{ fontSize:11, color:'#f43f5e', marginTop:-10, display:'flex', alignItems:'center', gap:4 }}><AlertCircle style={{ width:11, height:11 }} />{errors.category}</div>}
                  <div>
                    <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#3a6a80', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.07em' }}>Description *</label>
                    <textarea value={form.description} onChange={e=>set('description',e.target.value)} rows={4} placeholder="Describe your product — materials, craftsmanship, dimensions, colours..."
                              style={{ width:'100%', padding:'10px 12px', borderRadius:3, background:'rgba(0,229,255,0.04)', border:`1px solid ${errors.description?'rgba(244,63,94,0.5)':'rgba(0,229,255,0.18)'}`, color:'#e2e8f0', fontSize:13, outline:'none', resize:'none', fontFamily:"'Barlow',sans-serif", lineHeight:1.6 }}
                              onFocus={e=>(e.target as HTMLTextAreaElement).style.borderColor='rgba(0,229,255,0.5)'}
                              onBlur={e=>(e.target as HTMLTextAreaElement).style.borderColor=errors.description?'rgba(244,63,94,0.5)':'rgba(0,229,255,0.18)'}
                    />
                    {errors.description && <div style={{ fontSize:11, color:'#f43f5e', display:'flex', alignItems:'center', gap:4 }}><AlertCircle style={{ width:11, height:11 }} />{errors.description}</div>}
                  </div>
                  <SelectField label="Condition" value={form.condition} options={CONDITIONS} onChange={v=>set('condition',v)} />
                  <div>
                    <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#3a6a80', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.07em' }}>Search Tags <span style={{ color:'#1a3a50', textTransform:'none', fontSize:10 }}>(up to 8)</span></label>
                    <div style={{ display:'flex', gap:6 }}>
                      <input value={tagInput} onChange={e=>setTagInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),addTag())} placeholder="e.g. handmade, silk, rajasthan"
                             style={{ flex:1, padding:'9px 12px', borderRadius:3, background:'rgba(0,229,255,0.04)', border:'1px solid rgba(0,229,255,0.18)', color:'#e2e8f0', fontSize:13, outline:'none', fontFamily:"'Barlow',sans-serif" }} />
                      <button onClick={addTag} style={{ padding:'0 14px', borderRadius:3, background:'rgba(0,229,255,0.1)', border:'1px solid rgba(0,229,255,0.25)', color:'#00e5ff', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:"'Barlow',sans-serif" }}>Add</button>
                    </div>
                    {tags.length>0 && (
                        <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginTop:8 }}>
                          {tags.map(t=>(
                              <span key={t} style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, padding:'3px 9px', borderRadius:20, background:'rgba(0,229,255,0.08)', border:'1px solid rgba(0,229,255,0.2)', color:'#00e5ff' }}>
                                {t}<button onClick={()=>setTags(ts=>ts.filter(x=>x!==t))} style={{ background:'none', border:'none', cursor:'pointer', color:'#3a6a80', display:'flex', padding:0 }}><X style={{ width:10, height:10 }} /></button>
                              </span>
                          ))}
                        </div>
                    )}
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#3a6a80', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.07em' }}>Product Photos * <span style={{ color:'#1a3a50', textTransform:'none', fontSize:10 }}>(first photo is cover)</span></label>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:8 }}>
                      {images.map((f,i)=>(
                          <ImageSlot key={i} index={i} file={f} onAdd={file=>{const n=[...images]; n[i]=file; setImages(n); setErrors(e=>({...e,images:''}));}} onRemove={()=>{const n=[...images]; n[i]=null; setImages(n);}} />
                      ))}
                    </div>
                    {errors.images && <div style={{ fontSize:11, color:'#f43f5e', marginTop:6, display:'flex', alignItems:'center', gap:4 }}><AlertCircle style={{ width:11, height:11 }} />{errors.images}</div>}
                  </div>
                </div>
            )}

            {/* STEP 2 */}
            {!success && step===2 && (
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    <div>
                      <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#3a6a80', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.07em' }}>Selling Price (₹) *</label>
                      <div style={{ position:'relative' }}>
                        <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'#3a6a80', fontSize:14, fontWeight:700 }}>₹</span>
                        <input type="number" value={form.price} onChange={e=>set('price',e.target.value)} placeholder="599"
                               style={{ width:'100%', padding:'10px 12px 10px 26px', borderRadius:3, background:'rgba(0,229,255,0.04)', border:`1px solid ${errors.price?'rgba(244,63,94,0.5)':'rgba(0,229,255,0.18)'}`, color:'#e2e8f0', fontSize:13, outline:'none', fontFamily:"'Barlow',sans-serif" }} />
                      </div>
                      {errors.price && <div style={{ fontSize:11, color:'#f43f5e', marginTop:4 }}>{errors.price}</div>}
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#3a6a80', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.07em' }}>MRP / Original Price (₹)</label>
                      <div style={{ position:'relative' }}>
                        <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'#3a6a80', fontSize:14, fontWeight:700 }}>₹</span>
                        <input type="number" value={form.originalPrice} onChange={e=>set('originalPrice',e.target.value)} placeholder="899"
                               style={{ width:'100%', padding:'10px 12px 10px 26px', borderRadius:3, background:'rgba(0,229,255,0.04)', border:'1px solid rgba(0,229,255,0.18)', color:'#e2e8f0', fontSize:13, outline:'none', fontFamily:"'Barlow',sans-serif" }} />
                      </div>
                      <div style={{ fontSize:10, color:'#1a3a50', marginTop:3 }}>Shows discount % to buyers</div>
                    </div>
                  </div>
                  {form.price && form.originalPrice && Number(form.price)<Number(form.originalPrice) && (
                      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:3, background:'rgba(34,197,94,0.07)', border:'1px solid rgba(34,197,94,0.2)' }}>
                        <Tag style={{ width:14, height:14, color:'#22c55e' }} />
                        <span style={{ fontSize:13, color:'#22c55e', fontWeight:600 }}>{Math.round((1-Number(form.price)/Number(form.originalPrice))*100)}% discount will be shown to buyers</span>
                      </div>
                  )}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    <div>
                      <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#3a6a80', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.07em' }}>Stock Available *</label>
                      <div style={{ display:'flex', alignItems:'center', border:'1px solid rgba(0,229,255,0.18)', borderRadius:3, overflow:'hidden' }}>
                        <button onClick={()=>set('stock',String(Math.max(1,Number(form.stock)-1)))} style={{ width:38, height:38, background:'rgba(0,229,255,0.06)', border:'none', color:'#00e5ff', cursor:'pointer', fontSize:18, fontWeight:700 }}>−</button>
                        <input type="number" value={form.stock} onChange={e=>set('stock',e.target.value)}
                               style={{ flex:1, textAlign:'center', background:'rgba(0,229,255,0.03)', border:'none', color:'#e2e8f0', fontSize:14, fontWeight:700, outline:'none', fontFamily:"'Barlow',sans-serif", padding:'0 4px' }} />
                        <button onClick={()=>set('stock',String(Number(form.stock)+1))} style={{ width:38, height:38, background:'rgba(0,229,255,0.06)', border:'none', color:'#00e5ff', cursor:'pointer', fontSize:18, fontWeight:700 }}>+</button>
                      </div>
                    </div>
                    <div>
                      <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#3a6a80', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.07em' }}>SKU / Product Code</label>
                      <input value={form.sku} onChange={e=>set('sku',e.target.value)} placeholder="e.g. SAR-RED-001"
                             style={{ width:'100%', padding:'10px 12px', borderRadius:3, background:'rgba(0,229,255,0.04)', border:'1px solid rgba(0,229,255,0.18)', color:'#e2e8f0', fontSize:13, outline:'none', fontFamily:"'Barlow',sans-serif" }} />
                    </div>
                  </div>
                </div>
            )}

            {/* STEP 3 */}
            {!success && step===3 && (
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <div>
                    <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#3a6a80', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.07em' }}>Your Location / Dispatch City *</label>
                    <div style={{ position:'relative' }}>
                      <MapPin style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', width:14, height:14, color:'#2a4a60' }} />
                      <input value={form.location} onChange={e=>set('location',e.target.value)} placeholder="e.g. Jaipur, Rajasthan"
                             style={{ width:'100%', padding:'10px 12px 10px 32px', borderRadius:3, background:'rgba(0,229,255,0.04)', border:`1px solid ${errors.location?'rgba(244,63,94,0.5)':'rgba(0,229,255,0.18)'}`, color:'#e2e8f0', fontSize:13, outline:'none', fontFamily:"'Barlow',sans-serif" }} />
                    </div>
                    {errors.location && <div style={{ fontSize:11, color:'#f43f5e', marginTop:4 }}>{errors.location}</div>}
                  </div>
                  <SelectField label="Delivery Option" value={form.deliveryOption} options={DELIVERY} onChange={v=>set('deliveryOption',v)} />
                  <div>
                    <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#3a6a80', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.07em' }}>Delivery Charge (₹)</label>
                    <div style={{ display:'flex', gap:8 }}>
                      {['0','49','99','149'].map(p=>(
                          <button key={p} onClick={()=>set('deliveryPrice',p)}
                                  style={{ flex:1, padding:'9px', borderRadius:3, cursor:'pointer', fontFamily:"'Barlow',sans-serif", fontSize:12, fontWeight:700, border:`1px solid ${form.deliveryPrice===p?'rgba(0,229,255,0.4)':'rgba(0,229,255,0.12)'}`, background: form.deliveryPrice===p?'rgba(0,229,255,0.1)':'rgba(0,229,255,0.03)', color: form.deliveryPrice===p?'#00e5ff':'#3a6a80', transition:'all 0.15s' }}>
                            {p==='0'?'Free':`₹${p}`}
                          </button>
                      ))}
                    </div>
                    {form.deliveryPrice==='0' && <div style={{ fontSize:11, color:'#22c55e', marginTop:4 }}>🎉 Free delivery attracts 3× more buyers</div>}
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#3a6a80', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.07em' }}>Return Policy</label>
                    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                      {['7 days return accepted','No returns','Exchange only','Returns within 24 hours of delivery'].map(p=>(
                          <div key={p} onClick={()=>set('returnPolicy',p)}
                               style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:3, cursor:'pointer', border:`1px solid ${form.returnPolicy===p?'rgba(0,229,255,0.35)':'rgba(0,229,255,0.1)'}`, background: form.returnPolicy===p?'rgba(0,229,255,0.07)':'rgba(0,229,255,0.02)', transition:'all 0.15s' }}>
                            <div style={{ width:16, height:16, borderRadius:'50%', border:`2px solid ${form.returnPolicy===p?'#00e5ff':'#1a3a50'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                              {form.returnPolicy===p && <div style={{ width:7, height:7, borderRadius:'50%', background:'#00e5ff' }} />}
                            </div>
                            <span style={{ fontSize:13, color: form.returnPolicy===p?'#e2e8f0':'#3a6a80' }}>{p}</span>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>
            )}

            {/* STEP 4 */}
            {!success && step===4 && (
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  {[
                    { title:'Product Details', rows:[{ l:'Title', v:form.title },{ l:'Category', v:form.category },{ l:'Condition', v:form.condition },{ l:'Tags', v:tags.join(', ')||'—' },{ l:'Photos', v:`${images.filter(Boolean).length} uploaded` }] },
                    { title:'Pricing & Stock', rows:[{ l:'Selling Price', v:`₹${Number(form.price).toLocaleString('en-IN')}`, c:'#00e5ff' },{ l:'MRP', v:form.originalPrice?`₹${Number(form.originalPrice).toLocaleString('en-IN')}`:'—' },{ l:'Discount', v:form.price&&form.originalPrice&&Number(form.price)<Number(form.originalPrice)?`${Math.round((1-Number(form.price)/Number(form.originalPrice))*100)}%`:'—', c:'#22c55e' },{ l:'Stock', v:`${form.stock} units` }] },
                    { title:'Shipping', rows:[{ l:'Location', v:form.location },{ l:'Delivery', v:form.deliveryOption },{ l:'Charge', v:form.deliveryPrice==='0'?'Free':`₹${form.deliveryPrice}`, c: form.deliveryPrice==='0'?'#22c55e':undefined },{ l:'Returns', v:form.returnPolicy }] },
                  ].map(section=>(
                      <div key={section.title} style={{ padding:'14px 16px', background:'rgba(0,229,255,0.04)', border:'1px solid rgba(0,229,255,0.15)', borderRadius:3 }}>
                        <div style={{ fontSize:11, fontWeight:700, color:'#2a4a60', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>{section.title}</div>
                        {section.rows.map(r=>(
                            <div key={r.l} style={{ display:'flex', justifyContent:'space-between', fontSize:12, padding:'5px 0', borderBottom:'1px solid rgba(0,229,255,0.05)' }}>
                              <span style={{ color:'#2a4a60' }}>{r.l}</span>
                              <span style={{ color:(r as any).c||'#c8dcea', fontWeight:500, maxWidth:'60%', textAlign:'right' }}>{r.v}</span>
                            </div>
                        ))}
                      </div>
                  ))}
                  <div style={{ padding:'12px 14px', borderRadius:3, background:'rgba(0,229,255,0.04)', border:'1px solid rgba(0,229,255,0.1)', display:'flex', alignItems:'flex-start', gap:8 }}>
                    <FileText style={{ width:14, height:14, color:'#00e5ff', flexShrink:0, marginTop:1 }} />
                    <span style={{ fontSize:12, color:'#3a6a80', lineHeight:1.6 }}>By listing this product you agree to कलाNiwas's seller terms. Ensure your listing is accurate and your product is ready to ship within the stated time.</span>
                  </div>
                </div>
            )}
          </div>

          {/* Footer */}
          {!success && (
              <div style={{ padding:'14px 20px', borderTop:'1px solid rgba(0,229,255,0.1)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
                {step>1
                    ? <button onClick={()=>setStep(s=>(s-1) as any)} style={{ padding:'9px 20px', borderRadius:3, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'#5a7a94', fontSize:12, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', cursor:'pointer', fontFamily:"'Barlow',sans-serif" }}>Back</button>
                    : <div />
                }
                {step<4
                    ? <button onClick={next} style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 24px', borderRadius:3, background:'#00e5ff', border:'none', color:'#0a1520', fontSize:12, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', cursor:'pointer', fontFamily:"'Barlow',sans-serif", boxShadow:'0 0 16px rgba(0,229,255,0.25)' }}>Continue <ArrowRight style={{ width:13, height:13 }} /></button>
                    : <button onClick={submit} disabled={loading} style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 24px', borderRadius:3, background: loading?'rgba(0,229,255,0.3)':'#00e5ff', border:'none', color:'#0a1520', fontSize:12, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', cursor:loading?'not-allowed':'pointer', fontFamily:"'Barlow',sans-serif", boxShadow: loading?'none':'0 0 20px rgba(0,229,255,0.3)' }}>
                      {loading ? <><Loader2 style={{ width:13, height:13 }} className="animate-spin" /> Publishing...</> : <><Package style={{ width:13, height:13 }} /> Publish Listing</>}
                    </button>
                }
              </div>
          )}
        </div>
      </div>
  );
}

export default function Dashboard() {
  const { user }       = useUser();
  const [query,        setQuery]    = useState('');
  const [focused,      setFocused]  = useState(false);
  const [showModal,    setShowModal]= useState(false);

  const tip       = tips[new Date().getDay() % tips.length];
  const filtered  = tools.filter(t =>
      !query || t.title.toLowerCase().includes(query.toLowerCase()) || t.desc.toLowerCase().includes(query.toLowerCase())
  );
  const firstName    = user?.firstName ?? 'there';
  const sellerName   = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : '';
  const sellerLocation = user?.location ?? '';

  return (
      <>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap');
        .db * { box-sizing:border-box; font-family:'Barlow',sans-serif; }
        .db-hero { position:relative; overflow:hidden; background:#112233; border-bottom:1px solid rgba(0,229,255,0.12); padding:52px 24px 48px; }
        .db-hero::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,#00e5ff 40%,rgba(0,229,255,0.3) 70%,transparent); }
        .db-hero-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(0,229,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.05) 1px,transparent 1px); background-size:48px 48px; mask-image:radial-gradient(ellipse 80% 100% at 50% 0%,black 30%,transparent 100%); }
        .db-hero-glow { position:absolute; top:-120px; right:-80px; width:600px; height:400px; border-radius:50%; background:radial-gradient(ellipse,rgba(0,229,255,0.12) 0%,transparent 65%); pointer-events:none; }
        .db-hero-glow2 { position:absolute; bottom:-100px; left:-60px; width:400px; height:300px; border-radius:50%; background:radial-gradient(ellipse,rgba(0,119,182,0.14) 0%,transparent 65%); pointer-events:none; }
        .db-body { background:#0d1b24; }
        .db-search { width:100%; height:42px; padding:0 14px 0 38px; background:rgba(0,229,255,0.05)!important; border:1px solid rgba(0,229,255,0.18)!important; border-radius:3px; color:#e2e8f0!important; font-family:'Barlow',sans-serif!important; font-size:13px!important; outline:none!important; transition:all 0.18s!important; }
        .db-search::placeholder { color:#4a6880!important; }
        .db-search:focus { border-color:rgba(0,229,255,0.5)!important; background:rgba(0,229,255,0.07)!important; box-shadow:0 0 0 3px rgba(0,229,255,0.1)!important; }
        .db-tip { position:relative; overflow:hidden; background:rgba(0,229,255,0.06); border:1px solid rgba(0,229,255,0.18); border-radius:3px; padding:16px 20px; display:flex; align-items:flex-start; gap:14px; transition:border-color 0.18s; }
        .db-tip::before { content:''; position:absolute; top:0; left:0; bottom:0; width:2px; background:linear-gradient(180deg,#00e5ff,rgba(0,229,255,0.2)); }
        .db-tip:hover { border-color:rgba(0,229,255,0.35); }
        .db-section-label { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#4a6880; }
        .db-stat { padding:16px 18px; background:rgba(0,229,255,0.05); border:1px solid rgba(0,229,255,0.15); border-radius:3px; }
        .db-card { position:relative; overflow:hidden; background:rgba(17,34,51,0.9); border:1px solid rgba(255,255,255,0.08); border-radius:3px; display:flex; flex-direction:column; transition:border-color 0.22s,transform 0.22s,background 0.22s; }
        .db-card:hover { background:rgba(20,40,60,0.95); transform:translateY(-3px); }
        .db-card .db-card-bar { position:absolute; top:0; left:0; right:0; height:2px; transform:scaleX(0); transform-origin:left; transition:transform 0.28s ease; }
        .db-card:hover .db-card-bar { transform:scaleX(1); }
        .db-cta { display:inline-flex; align-items:center; gap:6px; font-family:'Barlow',sans-serif; font-weight:600; font-size:11px; letter-spacing:0.08em; text-transform:uppercase; padding:8px 14px; border-radius:2px; text-decoration:none; border:1px solid transparent; transition:transform 0.15s; align-self:flex-start; }
        .db-cta:hover { transform:translateX(2px); }
        .db-cta:hover svg { transform:translateX(3px); }
        .db-cta svg { transition:transform 0.15s; }
        .list-btn { display:flex; align-items:center; gap:8px; padding:11px 20px; border-radius:3px; border:none; cursor:pointer; font-family:'Barlow',sans-serif; font-size:13px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; transition:all 0.2s; background:#00e5ff; color:#0a1520; box-shadow:0 0 20px rgba(0,229,255,0.35); flex-shrink:0; }
        .list-btn:hover { background:#00cfec; transform:translateY(-1px); box-shadow:0 4px 24px rgba(0,229,255,0.45); }
        .list-banner { position:relative; overflow:hidden; background:linear-gradient(135deg,rgba(0,229,255,0.08) 0%,rgba(0,119,182,0.06) 100%); border:1px solid rgba(0,229,255,0.2); border-radius:4px; padding:18px 20px; display:flex; align-items:center; justify-content:space-between; gap:16px; cursor:pointer; transition:all 0.2s; }
        .list-banner:hover { border-color:rgba(0,229,255,0.4); background:linear-gradient(135deg,rgba(0,229,255,0.12) 0%,rgba(0,119,182,0.08) 100%); }
        .list-banner::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#00e5ff,rgba(0,229,255,0.3)); }
        @keyframes dbFu { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .db-fu { animation:dbFu 0.5s ease both; }
        .db-fu1 { animation-delay:0.04s; }
        .db-fu2 { animation-delay:0.12s; }
        .db-fu3 { animation-delay:0.20s; }
        .db-fu4 { animation-delay:0.28s; }
        @keyframes lmSlideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        .animate-spin { animation:spin 1s linear infinite; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

        <div className="db" style={{ minHeight:'100%', background:'#0d1b24' }}>
          <div className="db-hero db-fu db-fu1">
            <div className="db-hero-grid" />
            <div className="db-hero-glow" />
            <div className="db-hero-glow2" />
            <div style={{ maxWidth:1100, margin:'0 auto', position:'relative', zIndex:1 }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16, marginBottom:24 }}>
                <div>
                  <div className="db-section-label" style={{ marginBottom:10 }}>Dashboard</div>
                  <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:'clamp(32px,5vw,52px)', textTransform:'uppercase', letterSpacing:'0.02em', color:'#ffffff', lineHeight:1, margin:0 }}>
                    {greeting()},&nbsp;<span style={{ color:'#00e5ff' }}>{firstName}</span>
                  </h1>
                  <p style={{ fontSize:14, color:'#5a7a94', fontWeight:400, margin:'10px 0 0' }}>
                    Your AI-powered business toolkit · {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}
                  </p>
                </div>
                <button className="list-btn" onClick={()=>setShowModal(true)}>
                  <Upload style={{ width:15, height:15 }} /> List Your Product
                </button>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:10, maxWidth:560, marginBottom:32 }}>
                {[
                  { label:'Tools Available', value:'5',     color:'#00e5ff' },
                  { label:'Govt Schemes',    value:'12+',   color:'#eab308' },
                  { label:'Avg Time Saved',  value:'3 hrs', color:'#a78bfa' },
                ].map(s=>(
                    <div key={s.label} className="db-stat">
                      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:26, color:s.color, lineHeight:1 }}>{s.value}</div>
                      <div style={{ fontSize:11, color:'#4a6880', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', marginTop:5 }}>{s.label}</div>
                    </div>
                ))}
              </div>

              <div style={{ position:'relative', maxWidth:500 }}>
                <Search style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', width:15, height:15, pointerEvents:'none', color:focused?'#00e5ff':'#4a6880', transition:'color 0.18s' }} />
                <input type="text" placeholder="Search tools..." value={query}
                       onChange={e=>setQuery(e.target.value)}
                       onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
                       className="db-search" />
              </div>
            </div>
          </div>

          <div className="db-body" style={{ maxWidth:1100, margin:'0 auto', padding:'28px 24px 60px' }}>
            <div className="list-banner db-fu db-fu1" onClick={()=>setShowModal(true)} style={{ marginBottom:24 }}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:40, height:40, borderRadius:3, background:'rgba(0,229,255,0.1)', border:'1px solid rgba(0,229,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Upload style={{ width:18, height:18, color:'#00e5ff' }} />
                </div>
                <div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:16, textTransform:'uppercase', letterSpacing:'0.04em', color:'#e8f4f8' }}>List Your Products on कलाNiwas Marketplace</div>
                  <p style={{ fontSize:12, color:'#3a6a80', margin:'3px 0 0' }}>Add photos, set your price, choose delivery — reach buyers across India in minutes.</p>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:700, color:'#00e5ff', letterSpacing:'0.06em', textTransform:'uppercase', flexShrink:0 }}>
                Start Listing <ArrowRight style={{ width:13, height:13 }} />
              </div>
            </div>

            <div className="db-tip db-fu db-fu2" style={{ marginBottom:28 }}>
              <div style={{ width:34, height:34, borderRadius:3, flexShrink:0, background:'rgba(0,229,255,0.1)', border:'1px solid rgba(0,229,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Lightbulb style={{ width:15, height:15, color:'#00e5ff' }} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <span style={{ display:'inline-block', marginBottom:7, fontSize:9, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', padding:'3px 8px', borderRadius:2, background:'rgba(0,229,255,0.12)', border:'1px solid rgba(0,229,255,0.28)', color:'#00e5ff' }}>{tip.label}</span>
                <p style={{ fontSize:13, color:'#7a9ab4', lineHeight:1.65, margin:0 }}>{tip.text}</p>
              </div>
              <ChevronRight style={{ width:14, height:14, color:'#2a4255', flexShrink:0, alignSelf:'center' }} />
            </div>

            <div className="db-fu db-fu3" style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
              <span className="db-section-label">AI Tools</span>
              <div style={{ flex:1, height:1, background:'rgba(0,229,255,0.1)' }} />
              <span style={{ fontSize:11, color:'#4a6880', fontWeight:600 }}>{filtered.length} available</span>
            </div>

            <div className="db-fu db-fu4" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:8 }}>
              {filtered.map(tool=>(
                  <div key={tool.id} className="db-card"
                       onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=`${tool.iconColor}50`;}}
                       onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.08)';}}>
                    <div className="db-card-bar" style={{ background:`linear-gradient(90deg,${tool.iconColor},transparent)` }} />
                    <div style={{ padding:'22px 20px 18px' }}>
                      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                          <div style={{ width:40, height:40, borderRadius:3, flexShrink:0, background:`${tool.iconColor}18`, border:`1px solid ${tool.iconColor}35`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <tool.icon style={{ width:17, height:17, color:tool.iconColor }} />
                          </div>
                          <div>
                            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:17, textTransform:'uppercase', letterSpacing:'0.04em', color:'#e8f0f8', lineHeight:1 }}>{tool.title}</div>
                            <div style={{ fontSize:10, color:'#4a6880', fontWeight:600, letterSpacing:'0.07em', textTransform:'uppercase', marginTop:3 }}>{tool.subtitle}</div>
                          </div>
                        </div>
                        <div style={{ display:'flex', gap:5, flexShrink:0 }}>
                          {tool.badge && <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'3px 7px', borderRadius:2, background:`${tool.iconColor}20`, border:`1px solid ${tool.iconColor}40`, color:tool.iconColor }}>{tool.badge}</span>}
                          <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'3px 7px', borderRadius:2, background:'rgba(0,229,255,0.06)', border:'1px solid rgba(0,229,255,0.15)', color:'#4a6880' }}>{tool.tag}</span>
                        </div>
                      </div>
                      <div style={{ height:1, background:'rgba(0,229,255,0.08)', marginBottom:14 }} />
                      <p style={{ fontSize:13, color:'#7a9ab4', lineHeight:1.75, margin:'0 0 18px' }}>{tool.desc}</p>
                      <Link href={tool.href} className="db-cta" style={{ background:`${tool.iconColor}12`, borderColor:`${tool.iconColor}35`, color:tool.iconColor }}>
                        {tool.cta}<ArrowRight style={{ width:12, height:12 }} />
                      </Link>
                    </div>
                  </div>
              ))}
              {filtered.length===0 && (
                  <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'60px 20px' }}>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:22, textTransform:'uppercase', color:'#2a4255', letterSpacing:'0.05em', marginBottom:8 }}>No tools found</div>
                    <p style={{ fontSize:13, color:'#2a4255' }}>Try a different search term</p>
                  </div>
              )}
            </div>
          </div>
        </div>

        {showModal && <ListProductModal onClose={()=>setShowModal(false)} sellerName={sellerName} sellerLocation={sellerLocation} />}
      </>
  );
}