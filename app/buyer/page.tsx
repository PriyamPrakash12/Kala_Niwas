'use client';

import { useState, useMemo } from 'react';
import {
    Search, MapPin, Star, MessageCircle, Filter,
    Grid3X3, List, Verified, ArrowRight, ShoppingCart,
    Heart, ChevronDown, X, SlidersHorizontal, Flame,
    BadgeCheck, Package, Truck, Shield, ChevronRight,
    Plus, Minus, Eye
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────
const CATEGORIES = [
    { id: 'all',        label: 'All',           icon: '◈' },
    { id: 'handicraft', label: 'Handicrafts',   icon: '◉' },
    { id: 'textile',    label: 'Textiles',      icon: '◈' },
    { id: 'jewellery',  label: 'Jewellery',     icon: '◆' },
    { id: 'pottery',    label: 'Pottery',       icon: '◉' },
    { id: 'food',       label: 'Food & Spices', icon: '◈' },
    { id: 'woodwork',   label: 'Woodwork',      icon: '◆' },
];

const SORT_OPTIONS = [
    { id: 'featured',    label: 'Featured' },
    { id: 'rating',      label: 'Top Rated' },
    { id: 'reviews',     label: 'Most Reviewed' },
    { id: 'az',          label: 'A → Z' },
];

const PRODUCTS = [
    {
        id: 1, sellerId: 1,
        name: 'Blue Pottery Vase',
        seller: 'Meena Crafts',
        location: 'Jaipur, Rajasthan',
        category: 'handicraft',
        price: 1299, originalPrice: 1799,
        rating: 4.9, reviews: 312,
        tag: 'Best Seller', tagColor: '#f97316',
        accent: '#f97316',
        badge: 'Handmade',
        desc: 'Authentic Jaipur blue pottery vase with intricate floral motifs. Each piece is hand-painted by master craftsmen.',
        delivery: '3-5 days',
        inStock: true,
        images: ['🏺'],
    },
    {
        id: 2, sellerId: 2,
        name: 'Banarasi Silk Saree',
        seller: 'Silk Route Studio',
        location: 'Varanasi, UP',
        category: 'textile',
        price: 8499, originalPrice: 12000,
        rating: 4.8, reviews: 187,
        tag: 'Trending', tagColor: '#a78bfa',
        accent: '#a78bfa',
        badge: 'Handwoven',
        desc: 'Pure Banarasi silk saree with zari brocade work. Traditional design passed down through 5 generations.',
        delivery: '5-7 days',
        inStock: true,
        images: ['🧵'],
    },
    {
        id: 3, sellerId: 3,
        name: 'Sambalpuri Ikat Stole',
        seller: 'Tribal Threads',
        location: 'Bhubaneswar, Odisha',
        category: 'textile',
        price: 2199, originalPrice: 2800,
        rating: 4.7, reviews: 98,
        tag: 'New', tagColor: '#38bdf8',
        accent: '#38bdf8',
        badge: 'Tribal Art',
        desc: 'Hand-woven Sambalpuri ikat stole with traditional double ikat technique. Rich cotton fabric.',
        delivery: '4-6 days',
        inStock: true,
        images: ['🧣'],
    },
    {
        id: 4, sellerId: 4,
        name: 'Dhokra Tribal Necklace',
        seller: 'Dhokra Works',
        location: 'Bastar, Chhattisgarh',
        category: 'jewellery',
        price: 3499, originalPrice: 4200,
        rating: 4.9, reviews: 74,
        tag: 'Rare', tagColor: '#eab308',
        accent: '#eab308',
        badge: 'Lost-wax Cast',
        desc: 'Authentic Dhokra brass necklace made using 4000-year-old lost-wax casting technique.',
        delivery: '6-8 days',
        inStock: true,
        images: ['📿'],
    },
    {
        id: 5, sellerId: 5,
        name: 'Ceramic Mug Set (4pc)',
        seller: 'Mitti & More',
        location: 'Khurja, UP',
        category: 'pottery',
        price: 1599, originalPrice: 2000,
        rating: 4.6, reviews: 143,
        tag: null, tagColor: null,
        accent: '#22d3ee',
        badge: 'Glazed',
        desc: 'Set of 4 hand-thrown and glazed ceramic mugs. Microwave and dishwasher safe.',
        delivery: '3-5 days',
        inStock: true,
        images: ['☕'],
    },
    {
        id: 6, sellerId: 6,
        name: 'Kerala Pepper 500g',
        seller: 'Spice Trail Co.',
        location: 'Kochi, Kerala',
        category: 'food',
        price: 499, originalPrice: 699,
        rating: 4.8, reviews: 421,
        tag: 'Top Rated', tagColor: '#22c55e',
        accent: '#22c55e',
        badge: 'Organic',
        desc: 'Single-origin Malabar black pepper. Cold-dried to preserve essential oils and full aroma.',
        delivery: '2-3 days',
        inStock: true,
        images: ['🌶️'],
    },
    {
        id: 7, sellerId: 3,
        name: 'Handloom Cotton Dupatta',
        seller: 'Tribal Threads',
        location: 'Bhubaneswar, Odisha',
        category: 'textile',
        price: 899, originalPrice: 1200,
        rating: 4.5, reviews: 56,
        tag: null, tagColor: null,
        accent: '#38bdf8',
        badge: 'Handloom',
        desc: 'Lightweight handloom cotton dupatta with block print border. Natural dyes, breathable weave.',
        delivery: '4-6 days',
        inStock: false,
        images: ['🧶'],
    },
    {
        id: 8, sellerId: 1,
        name: 'Block Print Kurta Fabric',
        seller: 'Meena Crafts',
        location: 'Jaipur, Rajasthan',
        category: 'handicraft',
        price: 1850, originalPrice: 2400,
        rating: 4.7, reviews: 89,
        tag: 'Limited', tagColor: '#f97316',
        accent: '#f97316',
        badge: 'Hand Block',
        desc: '2.5m Sanganeri block print fabric. Hand-stamped with natural indigo dye on pure cotton.',
        delivery: '3-5 days',
        inStock: true,
        images: ['🖼️'],
    },
];

const STATES = ['All India', 'Bihar' ,'Rajasthan', 'Uttar Pradesh', 'Odisha', 'Chhattisgarh', 'Kerala', 'West Bengal', 'Gujarat'];

// ─────────────────────────────────────────────────────────────────
// CART STATE (simple in-component, no context needed for display)
// ─────────────────────────────────────────────────────────────────
type CartItem = { id: number; qty: number };

// ─────────────────────────────────────────────────────────────────
// PRODUCT CARD
// ─────────────────────────────────────────────────────────────────
function ProductCard({
                         product, view, cart, onCart, wishlist, onWishlist
                     }: {
    product: typeof PRODUCTS[0];
    view: 'grid' | 'list';
    cart: CartItem[];
    onCart: (id: number) => void;
    wishlist: number[];
    onWishlist: (id: number) => void;
}) {
    const [hovered, setHovered] = useState(false);
    const [msgSent, setMsgSent] = useState(false);
    const inCart = cart.some(c => c.id === product.id);
    const inWish = wishlist.includes(product.id);
    const discount = Math.round((1 - product.price / product.originalPrice) * 100);

    if (view === 'list') {
        return (
            <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
                 style={{ display: 'flex', gap: 20, padding: '18px 20px', borderRadius: 6, background: hovered ? 'rgba(0,149,255,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${hovered ? 'rgba(0,149,255,0.25)' : 'rgba(255,255,255,0.06)'}`, transition: 'all 0.18s ease', position: 'relative', overflow: 'hidden', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg, ${product.accent}, transparent)`, transform: hovered ? 'scaleY(1)' : 'scaleY(0)', transformOrigin: 'top', transition: 'transform 0.22s ease' }} />

                {/* Thumb */}
                <div style={{ width: 72, height: 72, borderRadius: 4, flexShrink: 0, background: `${product.accent}12`, border: `1px solid ${product.accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>
                    {product.images[0]}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#e2e8f0' }}>{product.name}</span>
                        {product.tag && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 2, background: `${product.tagColor}18`, border: `1px solid ${product.tagColor}30`, color: product.tagColor }}>{product.tag}</span>}
                        {!product.inStock && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 2, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>Out of Stock</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, color: '#2a3a50', display: 'flex', alignItems: 'center', gap: 3 }}><MapPin style={{ width: 10, height: 10 }} />{product.seller} · {product.location}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11 }}>
                            <Star style={{ width: 10, height: 10, fill: '#eab308', color: '#eab308' }} />
                            <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{product.rating}</span>
                            <span style={{ color: '#2a3a50' }}>({product.reviews})</span>
                        </span>
                        <span style={{ fontSize: 11, color: '#2a3a50', display: 'flex', alignItems: 'center', gap: 3 }}><Truck style={{ width: 10, height: 10 }} />{product.delivery}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#2a3a50', lineHeight: 1.5, margin: 0 }}>{product.desc}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                    <div>
                        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22, color: '#fff', letterSpacing: '0.02em', lineHeight: 1 }}>₹{product.price.toLocaleString()}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                            <span style={{ fontSize: 11, color: '#2a3a50', textDecoration: 'line-through' }}>₹{product.originalPrice.toLocaleString()}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e' }}>{discount}% off</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => onWishlist(product.id)} style={{ width: 32, height: 32, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', background: inWish ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${inWish ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.08)'}`, cursor: 'pointer', color: inWish ? '#f87171' : '#3d4a5c', transition: 'all 0.15s' }}>
                            <Heart style={{ width: 13, height: 13, fill: inWish ? '#f87171' : 'none' }} />
                        </button>
                        <button onClick={() => onCart(product.id)} disabled={!product.inStock}
                                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 14px', height: 32, borderRadius: 3, background: inCart ? 'rgba(0,149,255,0.15)' : product.inStock ? 'rgba(0,149,255,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${inCart ? 'rgba(0,149,255,0.4)' : product.inStock ? 'rgba(0,149,255,0.25)' : 'rgba(255,255,255,0.06)'}`, color: inCart ? '#60a5fa' : product.inStock ? '#93c5fd' : '#2a3a50', fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', cursor: product.inStock ? 'pointer' : 'not-allowed', transition: 'all 0.15s', fontFamily: "'Barlow',sans-serif" }}>
                            <ShoppingCart style={{ width: 12, height: 12 }} />
                            {inCart ? 'Added' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Grid card
    return (
        <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
             style={{ position: 'relative', overflow: 'hidden', borderRadius: 6, background: hovered ? 'rgba(0,149,255,0.035)' : 'rgba(255,255,255,0.025)', border: `1px solid ${hovered ? 'rgba(0,149,255,0.22)' : 'rgba(255,255,255,0.06)'}`, transition: 'all 0.22s ease', display: 'flex', flexDirection: 'column' }}>

            {/* Top bar on hover */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${product.accent}, transparent)`, transform: hovered ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.28s ease', zIndex: 2 }} />

            {/* Image area */}
            <div style={{ position: 'relative', height: 160, background: `linear-gradient(135deg, ${product.accent}0a, rgba(0,149,255,0.04))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {product.images[0]}
                {/* Badges */}
                <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {product.tag && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 7px', borderRadius: 2, background: `${product.tagColor}22`, border: `1px solid ${product.tagColor}40`, color: product.tagColor, backdropFilter: 'blur(8px)' }}>{product.tag}</span>}
                    {!product.inStock && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 7px', borderRadius: 2, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>Out of Stock</span>}
                </div>
                {/* Discount */}
                <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 10, fontWeight: 700, padding: '3px 7px', borderRadius: 2, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}>{discount}% OFF</div>
                {/* Wishlist */}
                <button onClick={() => onWishlist(product.id)} style={{ position: 'absolute', bottom: 10, right: 10, width: 30, height: 30, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', background: inWish ? 'rgba(239,68,68,0.15)' : 'rgba(0,0,0,0.4)', border: `1px solid ${inWish ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', color: inWish ? '#f87171' : '#6b7a99', transition: 'all 0.15s', backdropFilter: 'blur(8px)' }}>
                    <Heart style={{ width: 13, height: 13, fill: inWish ? '#f87171' : 'none' }} />
                </button>
            </div>

            {/* Content */}
            <div style={{ padding: '16px 16px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
                {/* Badge */}
                <div style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 2, background: `${product.accent}14`, border: `1px solid ${product.accent}28`, color: product.accent }}>{product.badge}</span>
                </div>

                {/* Name */}
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#e2e8f0', lineHeight: 1.1, marginBottom: 6 }}>{product.name}</div>

                {/* Seller + location */}
                <div style={{ fontSize: 11, color: '#2a3a50', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <BadgeCheck style={{ width: 10, height: 10, color: '#0078f2', flexShrink: 0 }} />
                    {product.seller} · {product.location}
                </div>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 10 }}>
                    <div style={{ display: 'flex', gap: 1 }}>
                        {[1,2,3,4,5].map(i => <Star key={i} style={{ width: 10, height: 10, fill: i <= Math.floor(product.rating) ? '#eab308' : 'rgba(234,179,8,0.2)', color: i <= Math.floor(product.rating) ? '#eab308' : 'rgba(234,179,8,0.2)' }} />)}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0' }}>{product.rating}</span>
                    <span style={{ fontSize: 11, color: '#2a3a50' }}>({product.reviews})</span>
                </div>

                <p style={{ fontSize: 11, color: '#2a3a50', lineHeight: 1.6, marginBottom: 12, flex: 1 }}>{product.desc}</p>

                {/* Delivery */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#2a3a50', marginBottom: 12 }}>
                    <Truck style={{ width: 11, height: 11, color: '#22c55e' }} />
                    <span>Delivery in <span style={{ color: '#4ade80', fontWeight: 600 }}>{product.delivery}</span></span>
                </div>

                {/* Price row */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 24, color: '#fff', letterSpacing: '0.02em', lineHeight: 1 }}>₹{product.price.toLocaleString()}</span>
                    <span style={{ fontSize: 12, color: '#2a3a50', textDecoration: 'line-through' }}>₹{product.originalPrice.toLocaleString()}</span>
                </div>

                {/* CTA */}
                <button onClick={() => onCart(product.id)} disabled={!product.inStock}
                        style={{ width: '100%', height: 40, borderRadius: 3, background: inCart ? 'rgba(0,149,255,0.18)' : product.inStock ? 'rgba(0,149,255,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${inCart ? 'rgba(0,149,255,0.45)' : product.inStock ? 'rgba(0,149,255,0.28)' : 'rgba(255,255,255,0.06)'}`, color: inCart ? '#60a5fa' : product.inStock ? '#93c5fd' : '#2a3a50', fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: product.inStock ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all 0.15s ease' }}
                        onMouseEnter={e => { if (product.inStock) (e.currentTarget as HTMLButtonElement).style.background = inCart ? 'rgba(0,149,255,0.22)' : 'rgba(0,149,255,0.18)'; }}
                        onMouseLeave={e => { if (product.inStock) (e.currentTarget as HTMLButtonElement).style.background = inCart ? 'rgba(0,149,255,0.18)' : 'rgba(0,149,255,0.12)'; }}>
                    <ShoppingCart style={{ width: 14, height: 14 }} />
                    {inCart ? 'Added to Cart' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────
// CART DRAWER
// ─────────────────────────────────────────────────────────────────
function CartDrawer({ cart, onClose, onQty, onRemove }: { cart: CartItem[]; onClose: () => void; onQty: (id: number, delta: number) => void; onRemove: (id: number) => void }) {
    const items = cart.map(c => ({ ...c, product: PRODUCTS.find(p => p.id === c.id)! })).filter(c => c.product);
    const total = items.reduce((s, c) => s + c.product.price * c.qty, 0);

    return (
        <>
            <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100 }} />
            <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 360, background: '#0b0d10', borderLeft: '1px solid rgba(0,149,255,0.15)', zIndex: 101, display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 60px rgba(0,0,0,0.6)' }}>
                <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, rgba(0,149,255,0.6), rgba(0,149,255,0.3))' }} />

                {/* Header */}
                <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fff' }}>Cart</div>
                        <div style={{ fontSize: 11, color: '#2a3a50', marginTop: 2 }}>{items.length} item{items.length !== 1 ? 's' : ''}</div>
                    </div>
                    <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', color: '#3d4a5c', transition: 'all 0.15s' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#3d4a5c')}>
                        <X style={{ width: 14, height: 14 }} />
                    </button>
                </div>

                {/* Items */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px' }}>
                    {items.length === 0 ? (
                        <div style={{ textAlign: 'center', paddingTop: 60 }}>
                            <ShoppingCart style={{ width: 32, height: 32, color: '#1e2a3a', margin: '0 auto 12px' }} />
                            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 16, textTransform: 'uppercase', color: '#1e2a3a', letterSpacing: '0.06em' }}>Cart is empty</div>
                        </div>
                    ) : items.map(({ product, qty }) => (
                        <div key={product.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <div style={{ width: 52, height: 52, borderRadius: 4, flexShrink: 0, background: `${product.accent}12`, border: `1px solid ${product.accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{product.images[0]}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#e2e8f0', marginBottom: 2 }}>{product.name}</div>
                                <div style={{ fontSize: 11, color: '#2a3a50', marginBottom: 8 }}>{product.seller}</div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                                        <button onClick={() => onQty(product.id, -1)} style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', border: 'none', cursor: 'pointer', color: '#6b7a99', transition: 'background 0.15s' }}
                                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}>
                                            <Minus style={{ width: 10, height: 10 }} />
                                        </button>
                                        <span style={{ width: 28, textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#e2e8f0', background: 'rgba(255,255,255,0.04)' }}>{qty}</span>
                                        <button onClick={() => onQty(product.id, 1)} style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', border: 'none', cursor: 'pointer', color: '#6b7a99', transition: 'background 0.15s' }}
                                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}>
                                            <Plus style={{ width: 10, height: 10 }} />
                                        </button>
                                    </div>
                                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 16, color: '#fff' }}>₹{(product.price * qty).toLocaleString()}</span>
                                </div>
                            </div>
                            <button onClick={() => onRemove(product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e2a3a', padding: 4, transition: 'color 0.15s', alignSelf: 'flex-start' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
                                    onMouseLeave={e => (e.currentTarget.style.color = '#1e2a3a')}>
                                <X style={{ width: 13, height: 13 }} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                            <span style={{ fontSize: 12, color: '#3d4a5c', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Total</span>
                            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 24, color: '#fff' }}>₹{total.toLocaleString()}</span>
                        </div>
                        <button style={{ width: '100%', height: 46, borderRadius: 4, background: 'rgba(0,149,255,0.15)', border: '1px solid rgba(0,149,255,0.35)', color: '#60a5fa', fontFamily: "'Barlow',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.15s' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,149,255,0.22)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,149,255,0.15)')}>
                            Proceed to Checkout <ArrowRight style={{ width: 15, height: 15 }} />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 10, fontSize: 11, color: '#1e2a3a' }}>
                            <Shield style={{ width: 10, height: 10 }} /> Secure checkout · Free returns
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
    const [query,          setQuery]          = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeState,    setActiveState]    = useState('All India');
    const [view,           setView]           = useState<'grid'|'list'>('grid');
    const [sortBy,         setSortBy]         = useState('featured');
    const [showFilters,    setShowFilters]    = useState(false);
    const [showSort,       setShowSort]       = useState(false);
    const [cartOpen,       setCartOpen]       = useState(false);
    const [cart,           setCart]           = useState<CartItem[]>([]);
    const [wishlist,       setWishlist]       = useState<number[]>([]);
    const [searchFocused,  setSearchFocused]  = useState(false);

    const cartCount = cart.reduce((s, c) => s + c.qty, 0);

    const toggleCart = (id: number) => {
        setCart(c => c.some(x => x.id === id) ? c.filter(x => x.id !== id) : [...c, { id, qty: 1 }]);
    };
    const updateQty = (id: number, delta: number) => {
        setCart(c => c.map(x => x.id === id ? { ...x, qty: Math.max(1, x.qty + delta) } : x));
    };
    const removeFromCart = (id: number) => setCart(c => c.filter(x => x.id !== id));
    const toggleWish = (id: number) => setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);

    const filtered = useMemo(() => {
        let list = PRODUCTS.filter(p => {
            const matchCat   = activeCategory === 'all' || p.category === activeCategory;
            const matchState = activeState === 'All India' || p.location.toLowerCase().includes(activeState.split(' ')[0].toLowerCase());
            const matchQ     = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.seller.toLowerCase().includes(query.toLowerCase()) || p.desc.toLowerCase().includes(query.toLowerCase());
            return matchCat && matchState && matchQ;
        });
        if (sortBy === 'rating')   list = [...list].sort((a, b) => b.rating - a.rating);
        if (sortBy === 'reviews')  list = [...list].sort((a, b) => b.reviews - a.reviews);
        if (sortBy === 'az')       list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        return list;
    }, [query, activeCategory, activeState, sortBy]);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap');
                .bp * { box-sizing: border-box; font-family: 'Barlow', sans-serif; }

                .bp-search {
                    background: rgba(0,149,255,0.04) !important;
                    border: 1px solid rgba(0,149,255,0.12) !important;
                    color: #e2e8f0 !important; outline: none !important;
                    font-family: 'Barlow', sans-serif !important; font-size: 14px !important;
                    transition: all 0.18s ease !important;
                }
                .bp-search::placeholder { color: #1e2a3a !important; }
                .bp-search:focus {
                    border-color: rgba(0,149,255,0.45) !important;
                    background: rgba(0,149,255,0.07) !important;
                    box-shadow: 0 0 0 3px rgba(0,149,255,0.1) !important;
                }

                .cat-pill {
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 6px 14px; border-radius: 3px; cursor: pointer;
                    font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
                    border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.025); color: #2a3a50;
                    transition: all 0.15s ease; font-family: 'Barlow', sans-serif; white-space: nowrap;
                }
                .cat-pill:hover { color: #6b7a99; background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); }
                .cat-pill.active { background: rgba(0,149,255,0.1); border-color: rgba(0,149,255,0.32); color: #60a5fa; }

                .icon-btn {
                    display: flex; align-items: center; justify-content: center;
                    border-radius: 3px; cursor: pointer; transition: all 0.15s ease;
                    border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.025); color: #2a3a50;
                }
                .icon-btn:hover { color: #6b7a99; background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.11); }
                .icon-btn.active { background: rgba(0,149,255,0.1); border-color: rgba(0,149,255,0.3); color: #60a5fa; }

                .section-label {
                    font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 10px;
                    letter-spacing: 0.2em; text-transform: uppercase; color: #1e2a3a;
                }

                @keyframes bp-fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
                .fu-1 { animation: bp-fadeUp 0.4s 0.05s ease both; }
                .fu-2 { animation: bp-fadeUp 0.4s 0.12s ease both; }
                .fu-3 { animation: bp-fadeUp 0.4s 0.18s ease both; }
                .fu-4 { animation: bp-fadeUp 0.4s 0.24s ease both; }
                .fu-5 { animation: bp-fadeUp 0.4s 0.30s ease both; }

                /* Cart drawer scrollbar */
                ::-webkit-scrollbar { width: 3px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(0,149,255,0.2); border-radius: 2px; }
            `}</style>

            <div className="bp" style={{ minHeight: '100vh', background: '#0c0e12' }}>

                {/* ── Unreal-style sticky topbar ── */}
                <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(8,10,14,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,149,255,0.1)', padding: '0 24px' }}>
                    <div style={{ height: 1, position: 'absolute', top: 0, left: 0, right: 0, background: 'linear-gradient(90deg, transparent, rgba(0,149,255,0.5) 35%, rgba(0,198,255,0.3) 65%, transparent)' }} />
                    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, height: 56 }}>

                        {/* Logo */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 3, background: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(167,139,250,0.45)', flexShrink: 0 }}>
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                    <rect x="1" y="1" width="4.5" height="4.5" fill="white" rx="0.6"/>
                                    <rect x="7.5" y="1" width="4.5" height="4.5" fill="white" rx="0.6" opacity="0.55"/>
                                    <rect x="1" y="7.5" width="4.5" height="4.5" fill="white" rx="0.6" opacity="0.55"/>
                                    <rect x="7.5" y="7.5" width="4.5" height="4.5" fill="white" rx="0.6" opacity="0.28"/>
                                </svg>
                            </div>
                            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 17, color: '#fff', letterSpacing: '0.05em' }}>
                                KALA<span style={{ color: '#a78bfa' }}>KIT</span>
                            </span>
                        </div>

                        {/* Search bar — center */}
                        <div style={{ flex: 1, position: 'relative', maxWidth: 580 }}>
                            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, pointerEvents: 'none', color: searchFocused ? '#60a5fa' : '#1e2a3a', transition: 'color 0.18s' }} />
                            <input type="text" placeholder="Search products, sellers, or locations..." value={query}
                                   onChange={e => setQuery(e.target.value)}
                                   onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                                   className="bp-search" style={{ width: '100%', height: 38, borderRadius: 4, padding: '0 36px 0 36px' }} />
                            {query && <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#2a3a50', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 2 }}>×</button>}
                        </div>

                        {/* Right actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                            <button className={`icon-btn${wishlist.length > 0 ? ' active' : ''}`} style={{ width: 36, height: 36, position: 'relative' }} title={`Wishlist (${wishlist.length})`}>
                                <Heart style={{ width: 15, height: 15, fill: wishlist.length > 0 ? '#f87171' : 'none', color: wishlist.length > 0 ? '#f87171' : undefined }} />
                                {wishlist.length > 0 && <div style={{ position: 'absolute', top: -4, right: -4, width: 15, height: 15, borderRadius: '50%', background: '#ef4444', border: '2px solid #0c0e12', fontSize: 8, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>{wishlist.length}</div>}
                            </button>
                            <button className={`icon-btn${cartOpen ? ' active' : ''}`} onClick={() => setCartOpen(true)} style={{ width: 36, height: 36, position: 'relative' }} title={`Cart (${cartCount})`}>
                                <ShoppingCart style={{ width: 15, height: 15 }} />
                                {cartCount > 0 && <div style={{ position: 'absolute', top: -4, right: -4, width: 15, height: 15, borderRadius: '50%', background: '#a78bfa', border: '2px solid #0c0e12', fontSize: 8, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>{cartCount}</div>}
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px 60px' }}>

                    {/* ── Hero banner ── */}
                    <div className="fu-1" style={{ position: 'relative', overflow: 'hidden', borderRadius: 6, marginBottom: 24, padding: '28px 32px', background: 'linear-gradient(135deg, rgba(0,80,160,0.15) 0%, rgba(0,149,255,0.06) 50%, rgba(8,10,14,0) 100%)', border: '1px solid rgba(0,149,255,0.14)' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #0095ff, #00c6ff 40%, transparent)' }} />
                        {/* BG grid */}
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,149,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,149,255,0.04) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
                        {/* Glow orb */}
                        <div style={{ position: 'absolute', right: -40, top: -40, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,149,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

                        <div style={{ position: 'relative', maxWidth: 540 }}>
                            <div className="section-label" style={{ marginBottom: 10 }}>Marketplace · Artisan Goods</div>
                            <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 'clamp(30px,5vw,48px)', textTransform: 'uppercase', letterSpacing: '0.02em', color: '#fff', lineHeight: 0.95, margin: '0 0 10px' }}>
                                Discover<br /><span style={{ color: '#60a5fa' }}>Indian Artisans</span>
                            </h1>
                            <p style={{ fontSize: 13, color: '#3d4a5c', lineHeight: 1.65, margin: '0 0 18px' }}>
                                Shop directly from verified craftspeople — zero middlemen, authentic handmade goods.
                            </p>
                            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                                {[{ v: `${PRODUCTS.length}`, l: 'Products' }, { v: '6', l: 'Sellers' }, { v: '7', l: 'Categories' }].map(s => (
                                    <div key={s.l} style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                                        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, fontSize: 22, color: '#60a5fa', lineHeight: 1 }}>{s.v}</span>
                                        <span style={{ fontSize: 10, color: '#2a3a50', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.l}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Trust bar ── */}
                    <div className="fu-2" style={{ display: 'flex', gap: 0, marginBottom: 24, background: 'rgba(0,149,255,0.03)', border: '1px solid rgba(0,149,255,0.09)', borderRadius: 5, overflow: 'hidden' }}>
                        {[
                            { icon: <Shield style={{ width: 13, height: 13 }} />, label: 'Verified Sellers' },
                            { icon: <Truck style={{ width: 13, height: 13 }} />, label: 'Pan-India Delivery' },
                            { icon: <Package style={{ width: 13, height: 13 }} />, label: 'Secure Packaging' },
                            { icon: <BadgeCheck style={{ width: 13, height: 13 }} />, label: 'Authentic Handmade' },
                        ].map((t, i) => (
                            <div key={t.label} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '10px 8px', borderRight: i < 3 ? '1px solid rgba(0,149,255,0.08)' : 'none', color: '#2a3a50' }}>
                                <span style={{ color: '#0095ff' }}>{t.icon}</span>
                                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{t.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* ── Category pills ── */}
                    <div className="fu-3" style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                        {CATEGORIES.map(c => (
                            <button key={c.id} className={`cat-pill${activeCategory === c.id ? ' active' : ''}`} onClick={() => setActiveCategory(c.id)}>
                                {c.label}
                            </button>
                        ))}
                    </div>

                    {/* ── Filter / sort toolbar ── */}
                    <div className="fu-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {/* Filter */}
                            <button className={`icon-btn${showFilters ? ' active' : ''}`} onClick={() => setShowFilters(!showFilters)}
                                    style={{ height: 32, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: "'Barlow',sans-serif" }}>
                                <SlidersHorizontal style={{ width: 12, height: 12 }} /> Filters
                            </button>
                            {activeState !== 'All India' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 3, background: 'rgba(0,149,255,0.1)', border: '1px solid rgba(0,149,255,0.28)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#60a5fa' }}>
                                    {activeState}
                                    <button onClick={() => setActiveState('All India')} style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', lineHeight: 1, padding: 0, fontSize: 14 }}>×</button>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 11, color: '#1e2a3a', fontWeight: 500 }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
                            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.05)' }} />

                            {/* Sort dropdown */}
                            <div style={{ position: 'relative' }}>
                                <button className={`icon-btn${showSort ? ' active' : ''}`} onClick={() => setShowSort(!showSort)}
                                        style={{ height: 32, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: "'Barlow',sans-serif" }}>
                                    <Filter style={{ width: 12, height: 12 }} />
                                    {SORT_OPTIONS.find(s => s.id === sortBy)?.label}
                                    <ChevronDown style={{ width: 11, height: 11 }} />
                                </button>
                                {showSort && (
                                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, background: '#0b0d10', border: '1px solid rgba(0,149,255,0.18)', borderRadius: 5, overflow: 'hidden', zIndex: 20, minWidth: 150, boxShadow: '0 12px 32px rgba(0,0,0,0.5)' }}>
                                        {SORT_OPTIONS.map(o => (
                                            <button key={o.id} onClick={() => { setSortBy(o.id); setShowSort(false); }}
                                                    style={{ width: '100%', padding: '9px 14px', background: sortBy === o.id ? 'rgba(0,149,255,0.1)' : 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)', color: sortBy === o.id ? '#60a5fa' : '#3d4a5c', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', textAlign: 'left', fontFamily: "'Barlow',sans-serif", transition: 'background 0.12s' }}
                                                    onMouseEnter={e => { if (sortBy !== o.id) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
                                                    onMouseLeave={e => { if (sortBy !== o.id) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                                                {o.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.05)' }} />
                            <button className={`icon-btn${view === 'grid' ? ' active' : ''}`} onClick={() => setView('grid')} style={{ width: 32, height: 32 }}><Grid3X3 style={{ width: 13, height: 13 }} /></button>
                            <button className={`icon-btn${view === 'list' ? ' active' : ''}`} onClick={() => setView('list')} style={{ width: 32, height: 32 }}><List style={{ width: 13, height: 13 }} /></button>
                        </div>
                    </div>

                    {/* ── State filter drawer ── */}
                    {showFilters && (
                        <div className="fu-1" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '14px 16px', background: 'rgba(0,149,255,0.03)', border: '1px solid rgba(0,149,255,0.1)', borderRadius: 5, marginBottom: 18 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1e2a3a', alignSelf: 'center', marginRight: 6 }}>State:</span>
                            {STATES.map(s => (
                                <button key={s} onClick={() => { setActiveState(s); setShowFilters(false); }}
                                        style={{ padding: '5px 12px', borderRadius: 3, cursor: 'pointer', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', border: `1px solid ${activeState === s ? 'rgba(0,149,255,0.35)' : 'rgba(255,255,255,0.06)'}`, background: activeState === s ? 'rgba(0,149,255,0.1)' : 'rgba(255,255,255,0.025)', color: activeState === s ? '#60a5fa' : '#2a3a50', transition: 'all 0.15s', fontFamily: "'Barlow',sans-serif" }}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* ── Section label ── */}
                    <div className="fu-4" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                        <Flame style={{ width: 12, height: 12, color: '#0095ff' }} />
                        <span className="section-label">{activeCategory === 'all' && !query ? 'Featured Products' : 'Results'}</span>
                        <div style={{ flex: 1, height: 1, background: 'rgba(0,149,255,0.08)' }} />
                    </div>

                    {/* ── Product grid / list ── */}
                    <div className="fu-5" style={{
                        display: view === 'grid' ? 'grid' : 'flex',
                        flexDirection: view === 'list' ? 'column' : undefined,
                        gridTemplateColumns: view === 'grid' ? 'repeat(auto-fill, minmax(260px, 1fr))' : undefined,
                        gap: 10
                    }}>
                        {filtered.map(p => (
                            <ProductCard key={p.id} product={p} view={view} cart={cart} onCart={toggleCart} wishlist={wishlist} onWishlist={toggleWish} />
                        ))}
                        {filtered.length === 0 && (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px' }}>
                                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 20, textTransform: 'uppercase', color: '#1e2a3a', letterSpacing: '0.06em', marginBottom: 8 }}>No products found</div>
                                <button onClick={() => { setQuery(''); setActiveCategory('all'); setActiveState('All India'); }}
                                        style={{ marginTop: 12, padding: '8px 20px', borderRadius: 3, background: 'rgba(0,149,255,0.1)', border: '1px solid rgba(0,149,255,0.25)', color: '#60a5fa', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Barlow',sans-serif" }}>
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── Seller CTA ── */}
                    {filtered.length > 0 && (
                        <div style={{ marginTop: 48, padding: '24px 28px', borderRadius: 6, background: 'rgba(0,149,255,0.04)', border: '1px solid rgba(0,149,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                            <div>
                                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1e2a3a', marginBottom: 4 }}>Sell on KalaKit</div>
                                <p style={{ fontSize: 13, color: '#2a3a50', margin: 0 }}>Join thousands of artisans reaching buyers directly across India.</p>
                            </div>
                            <a href="/signup?role=seller" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 3, background: 'rgba(0,149,255,0.12)', border: '1px solid rgba(0,149,255,0.3)', color: '#60a5fa', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.15s', fontFamily: "'Barlow',sans-serif" }}
                               onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,149,255,0.18)')}
                               onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,149,255,0.12)')}>
                                Start Selling <ArrowRight style={{ width: 13, height: 13 }} />
                            </a>
                        </div>
                    )}
                </div>

                {/* ── Cart Drawer ── */}
                {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onQty={updateQty} onRemove={removeFromCart} />}
            </div>
        </>
    );
}