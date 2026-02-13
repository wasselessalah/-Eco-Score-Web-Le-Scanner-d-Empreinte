import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function Header() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-md">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2 text-lg font-extrabold text-white tracking-tight">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm text-black">
                        É
                    </span>
                    Éco-Score
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="text-sm text-gray-400 transition-colors hover:text-white"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/dashboard/scan/new"
                                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-black transition-all hover:bg-emerald-400"
                            >
                                New Scan
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm text-gray-400 transition-colors hover:text-white"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-black transition-all hover:bg-emerald-400"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
