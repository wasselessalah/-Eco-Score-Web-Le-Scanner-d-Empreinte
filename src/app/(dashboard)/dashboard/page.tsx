'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { ScanResult } from '@/types';
import ScanCard from '@/components/scan/ScanCard';
import EvolutionChart from '@/components/charts/EvolutionChart';
import { getRatingColor } from '@/lib/utils';

export default function DashboardPage() {
    const [scans, setScans] = useState<ScanResult[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchScans = useCallback(async () => {
        try {
            const res = await fetch('/api/scans');
            const result = await res.json();
            if (result.success) setScans(result.data ?? []);
        } catch {
            // Silently handle fetch errors
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchScans(); }, [fetchScans]);

    async function handleDelete(id: string) {
        const res = await fetch(`/api/scans?id=${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) {
            setScans(prev => prev.filter(s => s.id !== id));
        }
    }

    function handleRescan(url: string) {
        router.push(`/dashboard/scan/new?url=${encodeURIComponent(url)}`);
    }

    async function handleLogout() {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    }

    // Stats
    const avgScore = scans.length > 0
        ? Math.round(scans.reduce((sum, s) => sum + s.eco_score, 0) / scans.length)
        : 0;

    const avgRating = avgScore >= 70 ? 'green' : avgScore >= 40 ? 'moderate' : 'heavy';
    const totalScans = scans.length;

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black">
            <div className="mx-auto max-w-7xl px-6 py-12">
                {/* Header */}
                <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-white">
                            Dashboard
                            <span className="ml-2 inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </h1>
                        <p className="mt-2 text-base text-gray-400">
                            Monitor your digital carbon footprint and track improvements over time.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLogout}
                            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-400 transition-all hover:bg-white/10 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 transition-opacity group-hover:opacity-100">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" x2="9" y1="12" y2="12" />
                            </svg>
                            Logout
                        </button>
                        <a
                            href="/dashboard/scan/new"
                            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 hover:shadow-emerald-500/30 active:scale-95"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="16" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                            New Scan
                        </a>
                    </div>
                </div>

                {loading ? (
                    <div className="flex h-96 items-center justify-center rounded-3xl border border-white/5 bg-white/[0.02]">
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500/30 border-t-emerald-500" />
                            <p className="text-sm font-medium text-emerald-500/80 animate-pulse">Loading dashboard...</p>
                        </div>
                    </div>
                ) : scans.length === 0 ? (
                    <div className="flex h-[500px] flex-col items-center justify-center gap-6 rounded-3xl border border-emerald-500/10 bg-gradient-to-b from-white/[0.02] to-transparent text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 ring-1 ring-emerald-500/50">
                            <span className="text-4xl">🌱</span>
                        </div>
                        <div className="max-w-md space-y-2">
                            <h2 className="text-2xl font-bold text-white">Start your eco-journey</h2>
                            <p className="text-gray-400">
                                You haven&apos;t scanned any websites yet. Run your first analysis to see your carbon impact.
                            </p>
                        </div>
                        <a
                            href="/dashboard/scan/new"
                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-black transition-transform hover:scale-105 active:scale-95"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                            Scan a Website
                        </a>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-emerald-500/30">
                                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl transition-all group-hover:bg-emerald-500/20" />
                                <p className="text-sm font-medium uppercase tracking-wider text-gray-400">Total Scans</p>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-white tracking-tight">{totalScans}</span>
                                    <span className="text-sm text-gray-500">analyses</span>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-blue-500/30">
                                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition-all group-hover:bg-blue-500/20" />
                                <p className="text-sm font-medium uppercase tracking-wider text-gray-400">Average Score</p>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <span
                                        className="text-4xl font-bold tracking-tight"
                                        style={{ color: getRatingColor(avgRating) }}
                                    >
                                        {avgScore}
                                    </span>
                                    <span className="text-sm text-gray-500">/ 100</span>
                                </div>
                            </div>

                            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-purple-500/30">
                                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl transition-all group-hover:bg-purple-500/20" />
                                <p className="text-sm font-medium uppercase tracking-wider text-gray-400">Global Rating</p>
                                <div className="mt-4 flex items-center gap-3">
                                    <span
                                        className="text-2xl font-bold capitalize tracking-tight"
                                        style={{ color: getRatingColor(avgRating) }}
                                    >
                                        {avgRating}
                                    </span>
                                    <div
                                        className="h-3 w-3 rounded-full shadow-[0_0_10px_currentColor]"
                                        style={{ backgroundColor: getRatingColor(avgRating), color: getRatingColor(avgRating) }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-3">
                            {/* Evolution Chart (Main) */}
                            <div className="rounded-3xl border border-white/10 bg-black/20 p-8 backdrop-blur-xl lg:col-span-2">
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                        </svg>
                                        Performance Trend
                                    </h2>
                                    <div className="flex gap-2">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500" /> Score
                                        </div>
                                    </div>
                                </div>
                                <div className="h-[300px]">
                                    <EvolutionChart scans={scans} />
                                </div>
                            </div>

                            {/* Recent Activity (Sidebar) */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-white">Recent Scans</h2>
                                    <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300">View all</a>
                                </div>

                                <div className="space-y-4">
                                    {scans.slice(0, 4).map((scan) => (
                                        <ScanCard
                                            key={scan.id}
                                            scan={scan}
                                            onDelete={handleDelete}
                                            onRescan={handleRescan}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
