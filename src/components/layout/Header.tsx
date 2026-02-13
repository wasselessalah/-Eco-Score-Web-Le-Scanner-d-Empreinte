import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function Header() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <header className="sticky top-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link href="/" className="group flex items-center gap-2 text-lg font-extrabold text-white tracking-tight transition-opacity hover:opacity-90">
                    <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm text-black shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-105">
                        <span className="font-bold">É</span>
                        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
                    </span>
                    <span className="hidden sm:inline-block">Éco-Score</span>
                </Link>

                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            <div className="hidden items-center gap-6 md:flex">
                                <Link
                                    href="/dashboard"
                                    className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/settings" // Assuming settings page exists or will exist
                                    className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
                                >
                                    Settings
                                </Link>
                            </div>

                            <div className="h-4 w-px bg-white/10 hidden md:block" />

                            <Link
                                href="/dashboard/scan/new"
                                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-black transition-all hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                            >
                                <span className="mr-2 transition-transform group-hover:-translate-y-[1px] group-hover:translate-x-[1px]">⚡️</span>
                                New Scan
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="rounded-lg bg-white/10 px-4 py-2 text-sm font-bold text-white shadow-[0_0_10px_rgba(0,0,0,0.2)] transition-all hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]"
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
