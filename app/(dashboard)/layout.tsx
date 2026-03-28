import { TopNav } from '@/components/TopNav';
import { PageTransition } from '@/components/PageTransition';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ minHeight: '100vh', background: '#0d1b24', display: 'flex', flexDirection: 'column' }}>
            <TopNav />
            <main style={{ flex: 1 }}>
                <PageTransition>
                    {children}
                </PageTransition>
            </main>
        </div>
    );
}