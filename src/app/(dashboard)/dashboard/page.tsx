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
        <div className="mx-auto max-w-6xl px-6 py-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">Your scan history and analytics</p>
                </div>
                <div className="flex items-center gap-3">
                    <a
                        href="/dashboard/scan/new"
                        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-black transition-all hover:bg-emerald-400"
                    >
                        New Scan
                    </a>
                    <button
                        onClick={handleLogout}
                        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 transition-colors hover:border-white/20 hover:text-white"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex h-60 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                </div>
            ) : scans.length === 0 ? (
                <div className="flex h-60 flex-col items-center justify-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                    <p className="text-4xl">🌱</p>
                    <p className="text-gray-400">No scans yet. Run your first scan!</p>
                    <a
                        href="/dashboard/scan/new"
                        className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-bold text-black"
                    >
                        Scan a Website
                    </a>
                </div>
            ) : (
                <>
                    {/* Stats row */}
                    <div className="mb-8 grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Total Scans</p>
                            <p className="mt-1 text-3xl font-extrabold text-white">{totalScans}</p>
                        </div>
                        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Average Score</p>
                            <p
                                className="mt-1 text-3xl font-extrabold"
                                style={{ color: getRatingColor(avgRating) }}
                            >
                                {avgScore}
                            </p>
                        </div>
                        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Average Rating</p>
                            <p
                                className="mt-1 text-3xl font-extrabold capitalize"
                                style={{ color: getRatingColor(avgRating) }}
                            >
                                {avgRating}
                            </p>
                        </div>
                    </div>

                    {/* Evolution Chart */}
                    <div className="mb-8 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
                            Score Evolution
                        </h2>
                        <EvolutionChart scans={scans} />
                    </div>

                    {/* Scan list */}
                    <div>
                        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
                            Scan History
                        </h2>
                        <div className="space-y-3">
                            {scans.map((scan) => (
                                <ScanCard
                                    key={scan.id}
                                    scan={scan}
                                    onDelete={handleDelete}
                                    onRescan={handleRescan}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
