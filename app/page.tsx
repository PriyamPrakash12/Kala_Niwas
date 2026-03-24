import Link from 'next/link';
import { PageTransition } from '@/components/PageTransition';

export default function WelcomePage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="bg-[#1a1a1a] p-6 md:p-10 rounded-3xl w-full max-w-md flex flex-col items-center shadow-2xl border border-white/5">
          <h1 className="text-3xl font-bold text-white mb-10">Welcome</h1>
          
          <div className="w-full space-y-4">
            <Link 
              href="/signup" 
              className="block w-full bg-[#00e5ff] hover:bg-[#00cce6] text-black font-semibold py-3.5 rounded-xl text-center transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)]"
            >
              Create new account
            </Link>
            
            <Link 
              href="/login" 
              className="block w-full bg-[#00e5ff] hover:bg-[#00cce6] text-black font-semibold py-3.5 rounded-xl text-center transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)]"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
