import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { UserProvider } from '@/components/UserContext';

export const metadata: Metadata = {
  title: 'Kala Kit - Dashboard',
  description: 'AI financial assistant for Indian small business owners, artisans, and local vendors.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-200 min-h-screen font-sans antialiased" suppressHydrationWarning>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
