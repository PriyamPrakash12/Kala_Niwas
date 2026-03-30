'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    Search, Star, Filter, Grid3X3, List, ArrowRight,
    ShoppingCart, Heart, ChevronDown, X, SlidersHorizontal,
    Flame, BadgeCheck, Package, Truck, Shield, Plus, Minus,
    User, LogOut,
} from 'lucide-react';
import { useUser } from '@/components/UserContext';

// ── MUST match the key used in Dashboard.tsx ──
const LISTED_PRODUCTS_KEY = 'kalakit_listed_products';

const C = {
    bg:'#0d1b24', bgCard:'rgba(17,31,42,0.85)', bgHover:'rgba(0,229,255,0.03)',
    accent:'#00e5ff', accentDim:'rgba(0,229,255,0.12)', accentBd:'rgba(0,229,255,0.2)',
    text:'#e2e8f0', muted:'#64748b', dim:'#334155',
    border:'rgba(255,255,255,0.06)', borderHov:'rgba(0,229,255,0.25)',
};

// ── Hardcoded seller products ──────────────────────────────────────
const SELLERS = [
    {
        id:1, name:'Meena Crafts', location:'Jaipur, Rajasthan',
        accent:'#f97316', category:'handicraft', rating:4.9,
        products:[
            { id:'mc-1', name:'Blue Pottery Vase',    price:1299, originalPrice:1799, desc:'Hand-thrown blue pottery vase with traditional floral motifs and glazed finish.',   inStock:true,  badge:'Handmade',   tag:'Best Seller', tagColor:'#f97316', icon:'🏺', delivery:'3-5 days' },
            { id:'mc-2', name:'Block Print Dupatta',  price:649,  originalPrice:899,  desc:'Hand block-printed dupatta in natural dyes on soft cotton fabric.',                inStock:true,  badge:'Hand Block', tag:'Limited',     tagColor:'#f97316', icon:'🖼️', delivery:'3-5 days' },
            { id:'mc-3', name:'Lac Bangles Set (12)', price:299,  originalPrice:499,  desc:'Traditional Rajasthani lac bangles, hand-painted with mirror work.',               inStock:false, badge:'Handmade',   tag:null,          tagColor:null,      icon:'💫', delivery:'3-5 days' },
        ],
    },
    {
        id:2, name:'Silk Route Studio', location:'Varanasi, UP',
        accent:'#a78bfa', category:'textile', rating:4.8,
        products:[
            { id:'sr-1', name:'Banarasi Silk Saree', price:8499, originalPrice:12000, desc:'Pure Banarasi silk saree with intricate zari brocade border and pallu.',     inStock:true, badge:'Handwoven', tag:'Trending', tagColor:'#a78bfa', icon:'🧵', delivery:'5-7 days' },
            { id:'sr-2', name:'Brocade Fabric (1m)', price:1499, originalPrice:2000,  desc:'Premium Banarasi brocade fabric per metre, ideal for blouses and dupattas.', inStock:true, badge:'Handwoven', tag:null,       tagColor:null,      icon:'🧣', delivery:'5-7 days' },
            { id:'sr-3', name:'Zari Dupatta',        price:2199, originalPrice:3000,  desc:'Handwoven zari dupatta with gold thread work on georgette base.',            inStock:true, badge:'Handwoven', tag:null,       tagColor:null,      icon:'✨', delivery:'5-7 days' },
        ],
    },
    {
        id:3, name:'Tribal Threads', location:'Bhubaneswar, Odisha',
        accent:'#00e5ff', category:'textile', rating:4.7,
        products:[
            { id:'tt-1', name:'Sambalpuri Ikat Stole',   price:2199, originalPrice:2800, desc:'Hand-woven Sambalpuri ikat stole using traditional double ikat technique.',  inStock:true,  badge:'Tribal Art', tag:'New',  tagColor:'#00e5ff', icon:'🧣', delivery:'4-6 days' },
            { id:'tt-2', name:'Sambalpuri Saree',        price:4999, originalPrice:7000, desc:'Authentic Sambalpuri ikat saree with traditional bandha pattern.',           inStock:true,  badge:'Tribal Art', tag:null,   tagColor:null,      icon:'🧵', delivery:'4-6 days' },
            { id:'tt-3', name:'Handloom Cotton Dupatta', price:899,  originalPrice:1200, desc:'Pure cotton handloom dupatta with block print border. Natural dyes.',        inStock:false, badge:'Handloom',   tag:null,   tagColor:null,      icon:'🧶', delivery:'4-6 days' },
        ],
    },
    {
        id:4, name:'Dhokra Works', location:'Bastar, Chhattisgarh',
        accent:'#eab308', category:'jewellery', rating:4.9,
        products:[
            { id:'dw-1', name:'Dhokra Tribal Necklace',    price:3499, originalPrice:4200, desc:'Authentic Dhokra brass necklace using 4000-year-old lost-wax casting.',       inStock:true,  badge:'Lost-wax', tag:'Rare', tagColor:'#eab308', icon:'📿', delivery:'6-8 days' },
            { id:'dw-2', name:'Tribal Earrings (pair)',    price:599,  originalPrice:899,  desc:'Pair of Dhokra brass earrings with traditional geometric patterns.',           inStock:true,  badge:'Lost-wax', tag:null,   tagColor:null,      icon:'💎', delivery:'6-8 days' },
            { id:'dw-3', name:'Brass Decorative Figurine', price:2499, originalPrice:3200, desc:'Decorative Dhokra brass figurine of a tribal dancer, approx 8 inches tall.', inStock:false, badge:'Lost-wax', tag:null,   tagColor:null,      icon:'🏆', delivery:'6-8 days' },
        ],
    },
    {
        id:5, name:'Mitti & More', location:'Khurja, UP',
        accent:'#22d3ee', category:'pottery', rating:4.6,
        products:[
            { id:'mm-1', name:'Ceramic Mug Set (4pc)', price:1599, originalPrice:2000, desc:'Set of 4 hand-thrown glazed ceramic mugs. Microwave and dishwasher safe.', inStock:true, badge:'Glazed', tag:null, tagColor:null, icon:'☕', delivery:'3-5 days' },
            { id:'mm-2', name:'Glazed Serving Bowl',   price:599,  originalPrice:800,  desc:'Large hand-thrown glazed serving bowl. Food-safe and dishwasher safe.',      inStock:true, badge:'Glazed', tag:null, tagColor:null, icon:'🥣', delivery:'3-5 days' },
            { id:'mm-3', name:'Ceramic Planter Pot',   price:299,  originalPrice:450,  desc:'Glazed ceramic planter with drainage hole, ideal for succulents.',           inStock:true, badge:'Glazed', tag:null, tagColor:null, icon:'🪴', delivery:'3-5 days' },
        ],
    },
    {
        id:6, name:'Spice Trail Co.', location:'Kochi, Kerala',
        accent:'#22c55e', category:'food', rating:4.8,
        products:[
            { id:'st-1', name:'Kerala Pepper 500g', price:499, originalPrice:699, desc:'Single-origin Malabar black pepper. Cold-dried to preserve essential oils.',  inStock:true, badge:'Organic', tag:'Top Rated', tagColor:'#22c55e', icon:'🌶️', delivery:'2-3 days' },
            { id:'st-2', name:'Masala Blend Kit',   price:599, originalPrice:799, desc:'Set of 5 signature masala blends — chai, biryani, garam, sambar, rasam.',     inStock:true, badge:'Organic', tag:null,        tagColor:null,      icon:'🫙', delivery:'2-3 days' },
            { id:'st-3', name:'Cardamom Pods 100g', price:299, originalPrice:399, desc:'Premium green cardamom pods from Idukki. Intense flavour and fragrance.',      inStock:true, badge:'Organic', tag:null,        tagColor:null,      icon:'🌿', delivery:'2-3 days' },
        ],
    },
    {
        id:7, name:'Bihar Kala Kendra', location:'Madhubani, Bihar',
        accent:'#f472b6', category:'handicraft', rating:4.8,
        products:[
            { id:'bk-1', name:'Madhubani Painting (A3)', price:2200, originalPrice:3000, desc:'Hand-painted Madhubani art on cotton cloth. Traditional Bihar folk motifs.',     inStock:true, badge:'Folk Art',  tag:'New', tagColor:'#00e5ff', icon:'🎨', delivery:'5-7 days' },
            { id:'bk-2', name:'Sikki Grass Basket',      price:750,  originalPrice:1000, desc:'Traditional Sikki grass basket with geometric patterns for storage & gifting.', inStock:true, badge:'Handcraft', tag:null,  tagColor:null,      icon:'🧺', delivery:'4-6 days' },
            { id:'bk-3', name:'Painted Silk Dupatta',    price:2499, originalPrice:3500, desc:'Hand-painted Madhubani motifs on pure silk dupatta. One-of-a-kind piece.',      inStock:true, badge:'Folk Art',  tag:null,  tagColor:null,      icon:'🎭', delivery:'5-7 days' },
        ],
    },
];

// Flatten sellers → products
const HARDCODED = SELLERS.flatMap(s =>
    s.products.map(p => ({
        ...p,
        sellerName:     s.name,
        sellerLocation: s.location,
        sellerAccent:   s.accent,
        sellerCategory: s.category,
        sellerRating:   s.rating,
    }))
);

const CATEGORIES = [
    { id:'all',        label:'All' },
    { id:'handicraft', label:'Handicrafts' },
    { id:'textile',    label:'Textiles' },
    { id:'jewellery',  label:'Jewellery' },
    { id:'pottery',    label:'Pottery' },
    { id:'food',       label:'Food & Spices' },
    { id:'woodwork',   label:'Woodwork' },
];

const STATES = [
    'All India','Rajasthan','Uttar Pradesh','Odisha',
    'Chhattisgarh','Kerala','West Bengal','Gujarat','Tamil Nadu','Bihar',
];

const SORT_OPTIONS = [
    { id:'featured',  label:'Featured' },
    { id:'az',        label:'A → Z' },
    { id:'priceasc',  label:'Price ↑' },
    { id:'pricedesc', label:'Price ↓' },
    { id:'newest',    label:'Newest' },
];

type Product = typeof HARDCODED[0] & { listedAt?: number };
type CartItem = { id: string; qty: number };

// ─────────────────────────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────────────────────────
function ProductCard({ p, view, cart, onCart, wishlist, onWishlist }: {
    p: Product; view: 'grid' | 'list';
    cart: CartItem[]; onCart: (id: string) => void;
    wishlist: string[]; onWishlist: (id: string) => void;
}) {
    const [hov, setHov] = useState(false);
    const inCart = cart.some(c => c.id === p.id);
    const inWish = wishlist.includes(p.id);
    const disc   = Math.round((1 - p.price / p.originalPrice) * 100);
    const isNew  = !!(p as any).listedAt;

    if (view === 'list') return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
             style={{ display:'flex', gap:18, padding:'16px 20px', borderRadius:6, background:hov?C.bgHover:C.bgCard, border:`1px solid ${hov?C.borderHov:C.border}`, transition:'all 0.18s ease', position:'relative', overflow:'hidden', alignItems:'center' }}>
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:2, background:`linear-gradient(180deg,${p.sellerAccent},transparent)`, transform:hov?'scaleY(1)':'scaleY(0)', transformOrigin:'top', transition:'transform 0.22s ease' }} />
            <div style={{ width:68, height:68, borderRadius:4, flexShrink:0, background:`${p.sellerAccent}15`, border:`1px solid ${p.sellerAccent}28`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, position:'relative' }}>
                {p.icon}
                {isNew && <div style={{ position:'absolute', top:-4, right:-4, fontSize:8, fontWeight:700, padding:'2px 5px', borderRadius:2, background:'#00e5ff', color:'#0d1b24', letterSpacing:'0.06em' }}>NEW</div>}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:4, flexWrap:'wrap' }}>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, textTransform:'uppercase', letterSpacing:'0.04em', color:C.text }}>{p.name}</span>
                    {p.tag && <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'2px 7px', borderRadius:2, background:`${p.tagColor}18`, border:`1px solid ${p.tagColor}30`, color:p.tagColor! }}>{p.tag}</span>}
                    {!p.inStock && <span style={{ fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:2, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', color:'#f87171', letterSpacing:'0.1em', textTransform:'uppercase' }}>Out of Stock</span>}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4, flexWrap:'wrap' }}>
                    <span style={{ fontSize:11, color:C.muted, display:'flex', alignItems:'center', gap:3 }}><BadgeCheck style={{ width:10,height:10,color:C.accent }} />{p.sellerName} · {p.sellerLocation}</span>
                    <span style={{ fontSize:11, color:C.muted, display:'flex', alignItems:'center', gap:3 }}><Truck style={{ width:10,height:10 }} />{p.delivery}</span>
                </div>
                <p style={{ fontSize:12, color:C.dim, lineHeight:1.5, margin:0 }}>{p.desc}</p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8, flexShrink:0 }}>
                <div>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:22, color:C.text, lineHeight:1 }}>₹{p.price.toLocaleString()}</div>
                    <div style={{ display:'flex', gap:6, marginTop:2 }}>
                        <span style={{ fontSize:11, color:C.dim, textDecoration:'line-through' }}>₹{p.originalPrice.toLocaleString()}</span>
                        <span style={{ fontSize:10, fontWeight:700, color:'#4ade80' }}>{disc}% off</span>
                    </div>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                    <button onClick={() => onWishlist(p.id)} style={{ width:32,height:32,borderRadius:3,display:'flex',alignItems:'center',justifyContent:'center',background:inWish?'rgba(239,68,68,0.1)':'rgba(255,255,255,0.03)',border:`1px solid ${inWish?'rgba(239,68,68,0.3)':C.border}`,cursor:'pointer',color:inWish?'#f87171':C.dim,transition:'all 0.15s' }}>
                        <Heart style={{ width:13,height:13,fill:inWish?'#f87171':'none' }} />
                    </button>
                    <button onClick={() => onCart(p.id)} disabled={!p.inStock}
                            style={{ display:'flex',alignItems:'center',gap:5,padding:'0 14px',height:32,borderRadius:3,background:inCart?C.accentDim:'rgba(0,229,255,0.06)',border:`1px solid ${inCart?C.accentBd:'rgba(0,229,255,0.15)'}`,color:inCart?C.accent:'rgba(0,229,255,0.6)',fontSize:11,fontWeight:700,letterSpacing:'0.07em',textTransform:'uppercase',cursor:p.inStock?'pointer':'not-allowed',transition:'all 0.15s',fontFamily:"'Barlow',sans-serif" }}>
                        <ShoppingCart style={{ width:12,height:12 }} />{inCart?'Added':'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
             style={{ position:'relative',overflow:'hidden',borderRadius:6,background:hov?C.bgHover:C.bgCard,border:`1px solid ${hov?C.borderHov:C.border}`,transition:'all 0.22s ease',display:'flex',flexDirection:'column' }}>
            <div style={{ position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${p.sellerAccent},transparent)`,transform:hov?'scaleX(1)':'scaleX(0)',transformOrigin:'left',transition:'transform 0.28s ease',zIndex:2 }} />
            <div style={{ position:'relative',height:150,background:`linear-gradient(135deg,${p.sellerAccent}0a,rgba(0,229,255,0.03))`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:48,borderBottom:`1px solid ${C.border}` }}>
                {p.icon}
                <div style={{ position:'absolute',top:10,left:10,display:'flex',flexDirection:'column',gap:4 }}>
                    {isNew && <span style={{ fontSize:9,fontWeight:700,padding:'3px 7px',borderRadius:2,background:'rgba(0,229,255,0.2)',border:'1px solid rgba(0,229,255,0.4)',color:'#00e5ff',letterSpacing:'0.1em',textTransform:'uppercase' }}>New Listing</span>}
                    {p.tag && <span style={{ fontSize:9,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'3px 7px',borderRadius:2,background:`${p.tagColor}20`,border:`1px solid ${p.tagColor}40`,color:p.tagColor! }}>{p.tag}</span>}
                    {!p.inStock && <span style={{ fontSize:9,fontWeight:700,padding:'3px 7px',borderRadius:2,background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.3)',color:'#f87171',letterSpacing:'0.1em',textTransform:'uppercase' }}>Out of Stock</span>}
                </div>
                <div style={{ position:'absolute',top:10,right:10,fontSize:10,fontWeight:700,padding:'3px 7px',borderRadius:2,background:'rgba(74,222,128,0.12)',border:'1px solid rgba(74,222,128,0.28)',color:'#4ade80' }}>{disc}% OFF</div>
                <button onClick={() => onWishlist(p.id)} style={{ position:'absolute',bottom:10,right:10,width:28,height:28,borderRadius:3,display:'flex',alignItems:'center',justifyContent:'center',background:inWish?'rgba(239,68,68,0.15)':'rgba(0,0,0,0.45)',border:`1px solid ${inWish?'rgba(239,68,68,0.4)':C.border}`,cursor:'pointer',color:inWish?'#f87171':C.muted,transition:'all 0.15s',backdropFilter:'blur(8px)' }}>
                    <Heart style={{ width:12,height:12,fill:inWish?'#f87171':'none' }} />
                </button>
            </div>
            <div style={{ padding:'14px 16px',flex:1,display:'flex',flexDirection:'column' }}>
                <span style={{ fontSize:9,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',padding:'2px 7px',borderRadius:2,background:`${p.sellerAccent}12`,border:`1px solid ${p.sellerAccent}25`,color:p.sellerAccent,marginBottom:8,alignSelf:'flex-start' }}>{p.badge}</span>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15,textTransform:'uppercase',letterSpacing:'0.04em',color:C.text,lineHeight:1.1,marginBottom:6 }}>{p.name}</div>
                <div style={{ fontSize:11,color:C.muted,marginBottom:8,display:'flex',alignItems:'center',gap:4 }}>
                    <BadgeCheck style={{ width:10,height:10,color:C.accent,flexShrink:0 }} />{p.sellerName} · {p.sellerLocation}
                </div>
                <div style={{ display:'flex',alignItems:'center',gap:5,marginBottom:8 }}>
                    <div style={{ display:'flex',gap:1 }}>
                        {[1,2,3,4,5].map(i=><Star key={i} style={{ width:10,height:10,fill:i<=Math.floor(p.sellerRating)?'#eab308':'rgba(234,179,8,0.18)',color:i<=Math.floor(p.sellerRating)?'#eab308':'rgba(234,179,8,0.18)' }} />)}
                    </div>
                    <span style={{ fontSize:11,fontWeight:700,color:C.text }}>{p.sellerRating}</span>
                </div>
                <p style={{ fontSize:11,color:C.dim,lineHeight:1.6,marginBottom:10,flex:1 }}>{p.desc}</p>
                <div style={{ display:'flex',alignItems:'center',gap:5,fontSize:11,color:C.muted,marginBottom:10 }}>
                    <Truck style={{ width:11,height:11,color:'#4ade80' }} />
                    Delivery in <span style={{ color:'#4ade80',fontWeight:600 }}>{p.delivery}</span>
                </div>
                <div style={{ display:'flex',alignItems:'baseline',gap:8,marginBottom:12 }}>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:22,color:C.text,lineHeight:1 }}>₹{p.price.toLocaleString()}</span>
                    <span style={{ fontSize:12,color:C.dim,textDecoration:'line-through' }}>₹{p.originalPrice.toLocaleString()}</span>
                </div>
                <button onClick={() => onCart(p.id)} disabled={!p.inStock}
                        style={{ width:'100%',height:38,borderRadius:3,background:inCart?C.accentDim:'rgba(0,229,255,0.06)',border:`1px solid ${inCart?C.accentBd:'rgba(0,229,255,0.15)'}`,color:inCart?C.accent:'rgba(0,229,255,0.65)',fontFamily:"'Barlow',sans-serif",fontWeight:700,fontSize:12,letterSpacing:'0.08em',textTransform:'uppercase',cursor:p.inStock?'pointer':'not-allowed',display:'flex',alignItems:'center',justifyContent:'center',gap:6,transition:'all 0.15s' }}>
                    <ShoppingCart style={{ width:13,height:13 }} />
                    {inCart?'Added to Cart':p.inStock?'Add to Cart':'Out of Stock'}
                </button>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// CART DRAWER
// ─────────────────────────────────────────────────────────────────
function CartDrawer({ cart, allProducts, onClose, onQty, onRemove }: {
    cart: CartItem[]; allProducts: Product[];
    onClose: () => void; onQty: (id:string,d:number)=>void; onRemove: (id:string)=>void;
}) {
    const items = cart.map(c=>({ ...c, p:allProducts.find(x=>x.id===c.id)! })).filter(c=>c.p);
    const total = items.reduce((s,c)=>s+c.p.price*c.qty,0);
    return (
        <>
            <div onClick={onClose} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',backdropFilter:'blur(4px)',zIndex:100 }} />
            <div style={{ position:'fixed',top:0,right:0,bottom:0,width:340,background:C.bg,borderLeft:`1px solid ${C.accentBd}`,zIndex:101,display:'flex',flexDirection:'column',boxShadow:'-20px 0 60px rgba(0,0,0,0.6)' }}>
                <div style={{ height:2,background:`linear-gradient(90deg,transparent,${C.accent}60,${C.accent}30)` }} />
                <div style={{ padding:'18px 20px 14px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                    <div>
                        <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:18,textTransform:'uppercase',letterSpacing:'0.05em',color:C.text }}>Cart</div>
                        <div style={{ fontSize:11,color:C.dim,marginTop:2 }}>{items.length} item{items.length!==1?'s':''}</div>
                    </div>
                    <button onClick={onClose} style={{ width:30,height:30,borderRadius:3,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(255,255,255,0.04)',border:`1px solid ${C.border}`,cursor:'pointer',color:C.dim }}>
                        <X style={{ width:13,height:13 }} />
                    </button>
                </div>
                <div style={{ flex:1,overflowY:'auto',padding:'10px 20px' }}>
                    {items.length===0
                        ? <div style={{ textAlign:'center',paddingTop:60 }}><ShoppingCart style={{ width:30,height:30,color:C.dim,margin:'0 auto 10px' }} /><div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15,textTransform:'uppercase',color:C.dim }}>Cart is empty</div></div>
                        : items.map(({ p,qty })=>(
                            <div key={p.id} style={{ display:'flex',gap:10,padding:'12px 0',borderBottom:`1px solid ${C.border}` }}>
                                <div style={{ width:48,height:48,borderRadius:4,flexShrink:0,background:`${p.sellerAccent}12`,border:`1px solid ${p.sellerAccent}25`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20 }}>{p.icon}</div>
                                <div style={{ flex:1,minWidth:0 }}>
                                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,textTransform:'uppercase',letterSpacing:'0.04em',color:C.text,marginBottom:2 }}>{p.name}</div>
                                    <div style={{ fontSize:11,color:C.dim,marginBottom:8 }}>{p.sellerName}</div>
                                    <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                                        <div style={{ display:'flex',alignItems:'center',border:`1px solid ${C.border}`,borderRadius:3,overflow:'hidden' }}>
                                            <button onClick={()=>onQty(p.id,-1)} style={{ width:26,height:26,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(255,255,255,0.03)',border:'none',cursor:'pointer',color:C.muted }}><Minus style={{ width:9,height:9 }} /></button>
                                            <span style={{ width:26,textAlign:'center',fontSize:12,fontWeight:700,color:C.text,background:'rgba(255,255,255,0.04)',lineHeight:'26px',display:'block' }}>{qty}</span>
                                            <button onClick={()=>onQty(p.id,1)} style={{ width:26,height:26,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(255,255,255,0.03)',border:'none',cursor:'pointer',color:C.muted }}><Plus style={{ width:9,height:9 }} /></button>
                                        </div>
                                        <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:15,color:C.text }}>₹{(p.price*qty).toLocaleString()}</span>
                                    </div>
                                </div>
                                <button onClick={()=>onRemove(p.id)} style={{ background:'none',border:'none',cursor:'pointer',color:C.dim,padding:4,alignSelf:'flex-start',transition:'color 0.15s' }}
                                        onMouseEnter={e=>(e.currentTarget.style.color='#f87171')}
                                        onMouseLeave={e=>(e.currentTarget.style.color=C.dim)}>
                                    <X style={{ width:12,height:12 }} />
                                </button>
                            </div>
                        ))
                    }
                </div>
                {items.length>0 && (
                    <div style={{ padding:'14px 20px',borderTop:`1px solid ${C.border}` }}>
                        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12 }}>
                            <span style={{ fontSize:11,color:C.muted,fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase' }}>Total</span>
                            <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:22,color:C.text }}>₹{total.toLocaleString()}</span>
                        </div>
                        <button style={{ width:'100%',height:44,borderRadius:4,background:C.accentDim,border:`1px solid ${C.accentBd}`,color:C.accent,fontFamily:"'Barlow',sans-serif",fontWeight:700,fontSize:13,letterSpacing:'0.08em',textTransform:'uppercase',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,transition:'all 0.15s' }}
                                onMouseEnter={e=>((e.currentTarget as HTMLButtonElement).style.background='rgba(0,229,255,0.18)')}
                                onMouseLeave={e=>((e.currentTarget as HTMLButtonElement).style.background=C.accentDim)}>
                            Proceed to Checkout <ArrowRight style={{ width:14,height:14 }} />
                        </button>
                        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:5,marginTop:10,fontSize:11,color:C.dim }}>
                            <Shield style={{ width:10,height:10 }} /> Secure checkout · Free returns
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

// ─────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────
export default function BuyerPage() {
    const { user, logout } = useUser();

    // ── Read seller-listed products from localStorage ──
    const [listedProducts, setListedProducts] = useState<Product[]>([]);
    useEffect(() => {
        try {
            const raw = localStorage.getItem(LISTED_PRODUCTS_KEY);
            if (raw) setListedProducts(JSON.parse(raw));
        } catch {}

        // Poll every 3s so new listings appear without refresh
        const interval = setInterval(() => {
            try {
                const raw = localStorage.getItem(LISTED_PRODUCTS_KEY);
                if (raw) setListedProducts(JSON.parse(raw));
            } catch {}
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Merge: hardcoded first, then seller-listed (dedup by id)
    const allProducts = useMemo(() => {
        const seen = new Set(HARDCODED.map(p => p.id));
        const newOnes = listedProducts.filter(p => !seen.has(p.id));
        return [...HARDCODED, ...newOnes];
    }, [listedProducts]);

    const [query,          setQuery]          = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeState,    setActiveState]    = useState('All India');
    const [view,           setView]           = useState<'grid'|'list'>('grid');
    const [sortBy,         setSortBy]         = useState('featured');
    const [showFilters,    setShowFilters]    = useState(false);
    const [showSort,       setShowSort]       = useState(false);
    const [cartOpen,       setCartOpen]       = useState(false);
    const [cart,           setCart]           = useState<CartItem[]>([]);
    const [wishlist,       setWishlist]       = useState<string[]>([]);
    const [searchFocused,  setSearchFocused]  = useState(false);
    const [showUserMenu,   setShowUserMenu]   = useState(false);

    const cartCount = cart.reduce((s,c)=>s+c.qty,0);
    const initials  = user ? (`${user.firstName?.charAt(0)??''}${user.lastName?.charAt(0)??''}`).toUpperCase()||'GU' : 'GU';

    const toggleCart = (id:string) => setCart(c=>c.some(x=>x.id===id)?c.filter(x=>x.id!==id):[...c,{id,qty:1}]);
    const updateQty  = (id:string,d:number) => setCart(c=>c.map(x=>x.id===id?{...x,qty:Math.max(1,x.qty+d)}:x));
    const removeCart = (id:string) => setCart(c=>c.filter(x=>x.id!==id));
    const toggleWish = (id:string) => setWishlist(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id]);

    const filtered = useMemo(()=>{
        let list = allProducts.filter(p=>{
            const matchCat   = activeCategory==='all'||p.sellerCategory===activeCategory;
            const matchState = activeState==='All India'||p.sellerLocation.toLowerCase().includes(activeState.split(' ')[0].toLowerCase());
            const matchQ     = !query||p.name.toLowerCase().includes(query.toLowerCase())||p.sellerName.toLowerCase().includes(query.toLowerCase())||p.desc.toLowerCase().includes(query.toLowerCase());
            return matchCat&&matchState&&matchQ;
        });
        if (sortBy==='az')        list=[...list].sort((a,b)=>a.name.localeCompare(b.name));
        if (sortBy==='priceasc')  list=[...list].sort((a,b)=>a.price-b.price);
        if (sortBy==='pricedesc') list=[...list].sort((a,b)=>b.price-a.price);
        if (sortBy==='newest')    list=[...list].sort((a,b)=>((b as any).listedAt||0)-((a as any).listedAt||0));
        return list;
    },[query,activeCategory,activeState,sortBy,allProducts]);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap');
                .bp * { box-sizing:border-box; font-family:'Barlow',sans-serif; }
                .bp-search { background:rgba(0,229,255,0.04)!important; border:1px solid rgba(0,229,255,0.1)!important; color:#e2e8f0!important; outline:none!important; font-family:'Barlow',sans-serif!important; font-size:14px!important; transition:all 0.18s ease!important; }
                .bp-search::placeholder { color:#1e3a47!important; }
                .bp-search:focus { border-color:rgba(0,229,255,0.4)!important; background:rgba(0,229,255,0.07)!important; box-shadow:0 0 0 3px rgba(0,229,255,0.08)!important; }
                .cat-pill { display:inline-flex; align-items:center; padding:6px 14px; border-radius:3px; cursor:pointer; font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; border:1px solid rgba(255,255,255,0.06); background:rgba(255,255,255,0.025); color:#334155; transition:all 0.15s ease; font-family:'Barlow',sans-serif; white-space:nowrap; }
                .cat-pill:hover { color:#64748b; background:rgba(255,255,255,0.05); }
                .cat-pill.active { background:rgba(0,229,255,0.1); border-color:rgba(0,229,255,0.3); color:#00e5ff; }
                .icon-btn { display:flex; align-items:center; justify-content:center; border-radius:3px; cursor:pointer; transition:all 0.15s ease; border:1px solid rgba(255,255,255,0.07); background:rgba(255,255,255,0.025); color:#334155; }
                .icon-btn:hover { color:#64748b; background:rgba(255,255,255,0.05); }
                .icon-btn.active { background:rgba(0,229,255,0.1); border-color:rgba(0,229,255,0.28); color:#00e5ff; }
                .sl { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:#1e3a47; }
                @keyframes bp-fu { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
                .fu1{animation:bp-fu 0.4s 0.05s ease both} .fu2{animation:bp-fu 0.4s 0.12s ease both}
                .fu3{animation:bp-fu 0.4s 0.18s ease both} .fu4{animation:bp-fu 0.4s 0.24s ease both}
                .fu5{animation:bp-fu 0.4s 0.30s ease both}
                ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:rgba(0,229,255,0.2);border-radius:2px}
            `}</style>

            <div className="bp" style={{ minHeight:'100vh', background:C.bg }}>

                {/* Nav */}
                <div style={{ position:'sticky',top:0,zIndex:50,background:'rgba(13,27,36,0.95)',backdropFilter:'blur(20px)',borderBottom:`1px solid rgba(0,229,255,0.1)`,padding:'0 24px' }}>
                    <div style={{ height:1,position:'absolute',top:0,left:0,right:0,background:`linear-gradient(90deg,transparent,${C.accent}50 35%,${C.accent}28 65%,transparent)` }} />
                    <div style={{ maxWidth:1200,margin:'0 auto',display:'flex',alignItems:'center',gap:16,height:56 }}>
                        {/* Logo */}
                        <div style={{ display:'flex',alignItems:'center',gap:9,flexShrink:0 }}>
                            <div style={{ width:28,height:28,borderRadius:3,background:'rgba(0,229,255,0.15)',border:`1px solid ${C.accentBd}`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 0 12px rgba(0,229,255,0.25)`,flexShrink:0 }}>
                                <span style={{ fontSize:14,lineHeight:1 }}>🏛️</span>
                            </div>
                            <span style={{ fontSize:18,fontWeight:700,color:C.accent }}>
                                कला<span style={{ color:'#fff',fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,letterSpacing:'0.05em',textTransform:'uppercase' }}>Niwas</span>
                            </span>
                        </div>

                        {/* Search */}
                        <div style={{ flex:1,position:'relative',maxWidth:560 }}>
                            <Search style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:14,height:14,pointerEvents:'none',color:searchFocused?C.accent:'#1e3a47',transition:'color 0.18s' }} />
                            <input type="text" placeholder="Search products, sellers, locations..." value={query}
                                   onChange={e=>setQuery(e.target.value)} onFocus={()=>setSearchFocused(true)} onBlur={()=>setSearchFocused(false)}
                                   className="bp-search" style={{ width:'100%',height:36,borderRadius:4,padding:'0 34px 0 34px' }} />
                            {query && <button onClick={()=>setQuery('')} style={{ position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:C.dim,cursor:'pointer',fontSize:15,lineHeight:1 }}>×</button>}
                        </div>

                        {/* Right */}
                        <div style={{ display:'flex',alignItems:'center',gap:8,flexShrink:0 }}>
                            <button className={`icon-btn${wishlist.length>0?' active':''}`} style={{ width:34,height:34,position:'relative' }}>
                                <Heart style={{ width:14,height:14,fill:wishlist.length>0?'#f87171':'none',color:wishlist.length>0?'#f87171':undefined }} />
                                {wishlist.length>0 && <div style={{ position:'absolute',top:-4,right:-4,width:14,height:14,borderRadius:'50%',background:'#ef4444',border:`2px solid ${C.bg}`,fontSize:8,fontWeight:700,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center' }}>{wishlist.length}</div>}
                            </button>
                            <button className={`icon-btn${cartOpen?' active':''}`} onClick={()=>setCartOpen(true)} style={{ width:34,height:34,position:'relative' }}>
                                <ShoppingCart style={{ width:14,height:14 }} />
                                {cartCount>0 && <div style={{ position:'absolute',top:-4,right:-4,width:14,height:14,borderRadius:'50%',background:'rgba(0,229,255,0.9)',border:`2px solid ${C.bg}`,fontSize:8,fontWeight:700,color:'#0d1b24',display:'flex',alignItems:'center',justifyContent:'center' }}>{cartCount}</div>}
                            </button>
                            <div style={{ width:1,height:20,background:'rgba(255,255,255,0.08)' }} />

                            {/* User pill */}
                            <div style={{ position:'relative' }}>
                                <button onClick={()=>setShowUserMenu(!showUserMenu)}
                                        style={{ display:'flex',alignItems:'center',gap:8,padding:'5px 10px 5px 6px',borderRadius:4,background:showUserMenu?C.accentDim:'rgba(255,255,255,0.03)',border:`1px solid ${showUserMenu?C.accentBd:C.border}`,cursor:'pointer',transition:'all 0.15s' }}>
                                    <div style={{ width:28,height:28,borderRadius:3,background:'rgba(0,229,255,0.15)',border:`1px solid ${C.accentBd}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:12,color:C.accent,letterSpacing:'0.04em',flexShrink:0 }}>{initials}</div>
                                    <div style={{ textAlign:'left' }}>
                                        <div style={{ fontSize:13,fontWeight:600,color:'#cbd5e1',lineHeight:1.1,whiteSpace:'nowrap' }}>{user?.firstName??'Guest'} {user?.lastName??'User'}</div>
                                        <div style={{ fontSize:9,color:C.dim,fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase',marginTop:1 }}>Buyer</div>
                                    </div>
                                    <ChevronDown style={{ width:11,height:11,color:C.dim,flexShrink:0,transform:showUserMenu?'rotate(180deg)':'none',transition:'transform 0.15s' }} />
                                </button>
                                {showUserMenu && (
                                    <div style={{ position:'absolute',top:'calc(100% + 6px)',right:0,background:'#0d1b24',border:`1px solid ${C.accentBd}`,borderRadius:6,overflow:'hidden',zIndex:60,minWidth:180,boxShadow:'0 16px 40px rgba(0,0,0,0.6)' }}>
                                        <div style={{ height:2,background:`linear-gradient(90deg,${C.accent},rgba(0,119,182,0.4),transparent)` }} />
                                        <div style={{ padding:'12px 14px',borderBottom:`1px solid ${C.border}` }}>
                                            <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                                                <div style={{ width:34,height:34,borderRadius:4,background:C.accentDim,border:`1px solid ${C.accentBd}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,color:C.accent,flexShrink:0 }}>{initials}</div>
                                                <div>
                                                    <div style={{ fontSize:13,fontWeight:600,color:C.text }}>{user?.firstName} {user?.lastName}</div>
                                                    <div style={{ fontSize:11,color:C.dim,marginTop:1 }}>{user?.email||'No email set'}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <a href="/profile" style={{ display:'flex',alignItems:'center',gap:10,padding:'10px 14px',color:C.muted,textDecoration:'none',fontSize:13,fontWeight:500,transition:'all 0.12s',borderBottom:`1px solid ${C.border}` }}
                                           onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.background='rgba(255,255,255,0.04)';(e.currentTarget as HTMLAnchorElement).style.color=C.text;}}
                                           onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.background='transparent';(e.currentTarget as HTMLAnchorElement).style.color=C.muted;}}>
                                            <User style={{ width:14,height:14 }} /> My Profile
                                        </a>
                                        <button onClick={()=>{logout?.();setShowUserMenu(false);}}
                                                style={{ width:'100%',display:'flex',alignItems:'center',gap:10,padding:'10px 14px',color:'#f87171',background:'transparent',border:'none',fontSize:13,fontWeight:500,cursor:'pointer',fontFamily:"'Barlow',sans-serif",transition:'all 0.12s' }}
                                                onMouseEnter={e=>((e.currentTarget as HTMLButtonElement).style.background='rgba(239,68,68,0.07)')}
                                                onMouseLeave={e=>((e.currentTarget as HTMLButtonElement).style.background='transparent')}>
                                            <LogOut style={{ width:14,height:14 }} /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth:1200,margin:'0 auto',padding:'28px 24px 60px' }}>

                    {/* Hero */}
                    <div className="fu1" style={{ position:'relative',overflow:'hidden',borderRadius:6,marginBottom:20,padding:'26px 30px',background:C.bgCard,border:`1px solid rgba(0,229,255,0.12)` }}>
                        <div style={{ position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${C.accent},rgba(0,119,182,0.5),transparent)` }} />
                        <div style={{ position:'absolute',inset:0,backgroundImage:`linear-gradient(rgba(0,229,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.025) 1px,transparent 1px)`,backgroundSize:'40px 40px',pointerEvents:'none' }} />
                        <div style={{ position:'absolute',right:-40,top:-40,width:260,height:260,borderRadius:'50%',background:`radial-gradient(circle,rgba(0,229,255,0.08) 0%,transparent 70%)`,pointerEvents:'none' }} />
                        <div style={{ position:'relative',maxWidth:520 }}>
                            <div className="sl" style={{ marginBottom:10 }}>Marketplace · Artisan Goods</div>
                            <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:'clamp(28px,5vw,46px)',textTransform:'uppercase',letterSpacing:'0.02em',color:'#fff',lineHeight:0.95,margin:'0 0 10px' }}>
                                Discover<br /><span style={{ color:C.accent }}>Indian Artisans</span>
                            </h1>
                            <p style={{ fontSize:13,color:C.muted,lineHeight:1.65,margin:'0 0 16px' }}>Shop directly from verified craftspeople — zero middlemen, authentic handmade goods.</p>
                            <div style={{ display:'flex',gap:20,flexWrap:'wrap' }}>
                                {[{v:`${allProducts.length}`,l:'Products'},{v:`${SELLERS.length + listedProducts.length}`,l:'Sellers'},{v:`${CATEGORIES.length-1}`,l:'Categories'}].map(s=>(
                                    <div key={s.l} style={{ display:'flex',alignItems:'baseline',gap:6 }}>
                                        <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:22,color:C.accent,lineHeight:1 }}>{s.v}</span>
                                        <span style={{ fontSize:10,color:C.dim,fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase' }}>{s.l}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Trust bar */}
                    <div className="fu2" style={{ display:'flex',marginBottom:20,background:'rgba(17,31,42,0.7)',border:`1px solid rgba(0,229,255,0.08)`,borderRadius:5,overflow:'hidden' }}>
                        {[{icon:<Shield style={{width:12,height:12}}/>,l:'Verified Sellers'},{icon:<Truck style={{width:12,height:12}}/>,l:'Pan-India Delivery'},{icon:<Package style={{width:12,height:12}}/>,l:'Secure Packaging'},{icon:<BadgeCheck style={{width:12,height:12}}/>,l:'Authentic Handmade'}].map((t,i)=>(
                            <div key={t.l} style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:7,padding:'10px 8px',borderRight:i<3?`1px solid rgba(0,229,255,0.07)`:'none',color:C.dim }}>
                                <span style={{ color:C.accent }}>{t.icon}</span>
                                <span style={{ fontSize:11,fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase',whiteSpace:'nowrap' }}>{t.l}</span>
                            </div>
                        ))}
                    </div>

                    {/* Categories */}
                    <div className="fu3" style={{ display:'flex',gap:6,flexWrap:'wrap',marginBottom:16 }}>
                        {CATEGORIES.map(c=><button key={c.id} className={`cat-pill${activeCategory===c.id?' active':''}`} onClick={()=>setActiveCategory(c.id)}>{c.label}</button>)}
                    </div>

                    {/* Toolbar */}
                    <div className="fu3" style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16,flexWrap:'wrap',gap:8 }}>
                        <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                            <button className={`icon-btn${showFilters?' active':''}`} onClick={()=>setShowFilters(!showFilters)}
                                    style={{ height:30,padding:'0 12px',gap:6,fontSize:11,fontWeight:700,letterSpacing:'0.07em',textTransform:'uppercase',fontFamily:"'Barlow',sans-serif",display:'flex',alignItems:'center' }}>
                                <SlidersHorizontal style={{ width:11,height:11 }} /> Filters
                            </button>
                            {activeState!=='All India' && (
                                <div style={{ display:'flex',alignItems:'center',gap:6,padding:'4px 10px',borderRadius:3,background:C.accentDim,border:`1px solid ${C.accentBd}`,fontSize:11,fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase',color:C.accent }}>
                                    {activeState}
                                    <button onClick={()=>setActiveState('All India')} style={{ background:'none',border:'none',color:C.accent,cursor:'pointer',lineHeight:1,padding:0,fontSize:14 }}>×</button>
                                </div>
                            )}
                        </div>
                        <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                            <span style={{ fontSize:11,color:C.dim,fontWeight:500 }}>{filtered.length} result{filtered.length!==1?'s':''}</span>
                            <div style={{ width:1,height:14,background:C.border }} />
                            <div style={{ position:'relative' }}>
                                <button className={`icon-btn${showSort?' active':''}`} onClick={()=>setShowSort(!showSort)}
                                        style={{ height:30,padding:'0 12px',display:'flex',alignItems:'center',gap:6,fontSize:11,fontWeight:700,letterSpacing:'0.07em',textTransform:'uppercase',fontFamily:"'Barlow',sans-serif" }}>
                                    <Filter style={{ width:11,height:11 }} />{SORT_OPTIONS.find(s=>s.id===sortBy)?.label}<ChevronDown style={{ width:10,height:10 }} />
                                </button>
                                {showSort && (
                                    <div style={{ position:'absolute',top:'100%',right:0,marginTop:4,background:'#0d1b24',border:`1px solid ${C.accentBd}`,borderRadius:5,overflow:'hidden',zIndex:20,minWidth:150,boxShadow:'0 12px 32px rgba(0,0,0,0.5)' }}>
                                        {SORT_OPTIONS.map(o=>(
                                            <button key={o.id} onClick={()=>{setSortBy(o.id);setShowSort(false);}}
                                                    style={{ width:'100%',padding:'9px 14px',background:sortBy===o.id?C.accentDim:'transparent',border:'none',borderBottom:`1px solid ${C.border}`,color:sortBy===o.id?C.accent:C.muted,fontSize:12,fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase',cursor:'pointer',textAlign:'left',fontFamily:"'Barlow',sans-serif",transition:'background 0.12s' }}>
                                                {o.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div style={{ width:1,height:14,background:C.border }} />
                            <button className={`icon-btn${view==='grid'?' active':''}`} onClick={()=>setView('grid')} style={{ width:30,height:30 }}><Grid3X3 style={{ width:12,height:12 }} /></button>
                            <button className={`icon-btn${view==='list'?' active':''}`} onClick={()=>setView('list')} style={{ width:30,height:30 }}><List style={{ width:12,height:12 }} /></button>
                        </div>
                    </div>

                    {/* State filter */}
                    {showFilters && (
                        <div className="fu1" style={{ display:'flex',flexWrap:'wrap',gap:6,padding:'12px 16px',background:'rgba(17,31,42,0.7)',border:`1px solid rgba(0,229,255,0.1)`,borderRadius:5,marginBottom:16 }}>
                            <span style={{ fontSize:10,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:C.dim,alignSelf:'center',marginRight:6 }}>State:</span>
                            {STATES.map(s=>(
                                <button key={s} onClick={()=>{setActiveState(s);setShowFilters(false);}}
                                        style={{ padding:'5px 12px',borderRadius:3,cursor:'pointer',fontSize:11,fontWeight:600,letterSpacing:'0.06em',border:`1px solid ${activeState===s?C.accentBd:C.border}`,background:activeState===s?C.accentDim:'rgba(255,255,255,0.025)',color:activeState===s?C.accent:C.dim,transition:'all 0.15s',fontFamily:"'Barlow',sans-serif" }}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Section label */}
                    <div className="fu4" style={{ display:'flex',alignItems:'center',gap:10,marginBottom:14 }}>
                        <Flame style={{ width:11,height:11,color:C.accent }} />
                        <span className="sl">{activeCategory==='all'&&!query?'All Products':'Results'}</span>
                        <div style={{ flex:1,height:1,background:`rgba(0,229,255,0.07)` }} />
                        <span style={{ fontSize:11,color:C.dim }}>{filtered.length} items</span>
                    </div>

                    {/* Products */}
                    <div className="fu5" style={{ display:view==='grid'?'grid':'flex',flexDirection:view==='list'?'column':undefined,gridTemplateColumns:view==='grid'?'repeat(auto-fill,minmax(260px,1fr))':undefined,gap:10 }}>
                        {filtered.map(p=><ProductCard key={p.id} p={p} view={view} cart={cart} onCart={toggleCart} wishlist={wishlist} onWishlist={toggleWish} />)}
                        {filtered.length===0 && (
                            <div style={{ gridColumn:'1/-1',textAlign:'center',padding:'60px 20px' }}>
                                <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:20,textTransform:'uppercase',color:C.dim,letterSpacing:'0.06em',marginBottom:8 }}>No products found</div>
                                <button onClick={()=>{setQuery('');setActiveCategory('all');setActiveState('All India');}}
                                        style={{ marginTop:12,padding:'8px 20px',borderRadius:3,background:C.accentDim,border:`1px solid ${C.accentBd}`,color:C.accent,fontSize:11,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',cursor:'pointer',fontFamily:"'Barlow',sans-serif" }}>
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Seller CTA */}
                    {filtered.length>0 && (
                        <div style={{ marginTop:44,padding:'22px 26px',borderRadius:6,background:C.bgCard,border:`1px solid rgba(0,229,255,0.1)`,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16 }}>
                            <div>
                                <div className="sl" style={{ marginBottom:4 }}>Sell on कलाNiwas</div>
                                <p style={{ fontSize:13,color:C.muted,margin:0 }}>Join artisans reaching buyers directly across India.</p>
                            </div>
                            <a href="/signup?role=seller" style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'9px 20px',borderRadius:3,background:C.accentDim,border:`1px solid ${C.accentBd}`,color:C.accent,fontSize:12,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',textDecoration:'none',transition:'all 0.15s',fontFamily:"'Barlow',sans-serif" }}
                               onMouseEnter={e=>((e.currentTarget as HTMLAnchorElement).style.background='rgba(0,229,255,0.18)')}
                               onMouseLeave={e=>((e.currentTarget as HTMLAnchorElement).style.background=C.accentDim)}>
                                Start Selling <ArrowRight style={{ width:13,height:13 }} />
                            </a>
                        </div>
                    )}
                </div>

                {cartOpen && <CartDrawer cart={cart} allProducts={allProducts} onClose={()=>setCartOpen(false)} onQty={updateQty} onRemove={removeCart} />}
            </div>
        </>
    );
}