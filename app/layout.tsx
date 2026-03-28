import type { Metadata } from 'next';
import './globals.css';
import { UserProvider } from '@/components/UserContext';

export const metadata: Metadata = {
    title: 'कलाNiwas - Dashboard',
    description: 'AI financial assistant for Indian small business owners, artisans, and local vendors.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap" rel="stylesheet" />
        </head>
        <body
            className="min-h-screen antialiased"
            style={{ background: '#0d1b24', color: '#e2e8f0', fontFamily: "'Sora', sans-serif" }}
            suppressHydrationWarning
        >
        <UserProvider>
            {children}
        </UserProvider>
        </body>
        </html>
    );
}