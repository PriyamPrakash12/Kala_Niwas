import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, prompt, imageBase64, mimeType } = body;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
        }

        // ── Text-only request (AI Descriptor, Loan Matcher, Pricing, Help chat) ──
        if (!type || type === 'text') {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                    }),
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error?.message ?? 'Gemini API error');
            const text =
                data?.candidates?.[0]?.content?.parts
                    ?.filter((p: any) => p.text)
                    ?.map((p: any) => p.text)
                    ?.join('\n') ?? 'No response generated.';
            return NextResponse.json({ text });
        }

        // ── Image analysis (text output from image) ──
        if (type === 'image_analyze') {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [
                                { inline_data: { mime_type: mimeType, data: imageBase64 } },
                                { text: prompt },
                            ],
                        }],
                    }),
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error?.message ?? 'Gemini API error');
            const text =
                data?.candidates?.[0]?.content?.parts?.find((p: any) => p.text)?.text ??
                'No analysis generated.';
            return NextResponse.json({ text });
        }

        // ── Image enhancement (image in → image out) ──
        if (type === 'image_enhance') {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [
                                { inline_data: { mime_type: mimeType, data: imageBase64 } },
                                { text: 'Enhance this product image. Make it look professional, well-lit, high quality, suitable for an e-commerce store. Keep the main product intact but improve the lighting, background, and overall appeal.' },
                            ],
                        }],
                        generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
                    }),
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error?.message ?? 'Gemini API error');
            const parts = data?.candidates?.[0]?.content?.parts ?? [];
            const imgPart = parts.find((p: any) => p.inline_data);
            if (imgPart?.inline_data?.data) {
                return NextResponse.json({ imageBase64: imgPart.inline_data.data });
            }
            // Fallback: if image generation unavailable, return the original with a note
            return NextResponse.json({ error: 'Image enhancement not available for this image. Try a different image.' }, { status: 422 });
        }

        return NextResponse.json({ error: 'Unknown request type' }, { status: 400 });

    } catch (err: any) {
        console.error('AI route error:', err);
        return NextResponse.json({ error: err?.message ?? 'Internal server error' }, { status: 500 });
    }
}
