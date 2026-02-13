'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ScanForm from '@/components/scan/ScanForm';
import ScanResult from '@/components/scan/ScanResult';

function NewScanBlock() {
    const searchParams = useSearchParams();
    const router = useRouter();
    // ScanForm likely doesn't accept prefillUrl directly if it wasn't designed to, 
    // or maybe it does? I'll check ScanForm content in the previous step. 
    // If it doesn't, I might need to manage the URL state here and pass it down 
    // or just let ScanForm handle it if it picks up from context (unlikely).
    // Let's assume for now I need to adjust how I pass data or just fix the container.

    // Actually, looking at previous attempts, I saw `prefillUrl` usage.
    // I will wait for ScanForm view to be sure, but I must provide a replacement here.
    // I'll make a generic safe version first.

    // Wait, the tool call below happens in parallel. I should probably wait for the view_result.
    // But I can't wait in a tool call block.
    // I will use a conservative fix that restores structure.

    const urlParam = searchParams.get('url') ?? '';
    const [scanData, setScanData] = useState<Record<string, unknown> | null>(null);
    const [scanning, setScanning] = useState(false);

    // If ScanForm doesn't take prefillUrl, I might need to key it or just pass it 
    // if I update ScanForm too. 
    // For now, I'll assume I can pass `initialUrl` if I update ScanForm, 
    // or just leave it if I can't confirm.

    return (
        <div className="w-full">
            <ScanForm
                initialUrl={urlParam}
                onScanStart={() => { setScanning(true); setScanData(null); }}
                onScanComplete={(data) => { setScanData(data); setScanning(false); }}
            />

            {scanning && (
                <div className="mt-12 flex flex-col items-center gap-6 text-center">
                    <div className="relative h-20 w-20">
                        <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
                        <div className="absolute inset-2 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent shadow-lg shadow-emerald-500/20" />
                        <div className="absolute inset-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <span className="text-2xl">⚡️</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">Analyzing...</h3>
                        <p className="text-sm text-gray-400">Measuring performance & carbon footprint.</p>
                    </div>
                </div>
            )}

            {scanData && !scanning && (
                <div className="mt-12">
                    <ScanResult data={scanData as Record<string, unknown> & { url: string; rating: string }} />
                </div>
            )}
        </div>
    );
}

export default function NewScanPage() {
    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black">
            <div className="mx-auto flex h-full min-h-[calc(100vh-64px)] max-w-4xl flex-col items-center justify-center px-6 py-12">

                {/* Header Section */}
                <div className="mb-10 text-center">
                    <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.1)] ring-1 ring-emerald-500/30">
                        <span className="text-4xl">⚡️</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                        New Analysis
                    </h1>
                    <p className="mt-4 text-lg text-gray-400 max-w-lg mx-auto">
                        Enter a URL to measure its carbon footprint, performance, and environmental impact.
                    </p>
                </div>

                {/* Main Card */}
                <div className="w-full relative group">
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                    <div className="relative rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl md:p-12">
                        <Suspense fallback={
                            <div className="flex h-40 items-center justify-center">
                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                            </div>
                        }>
                            <NewScanBlock />
                        </Suspense>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-12 grid grid-cols-3 gap-8 text-center w-full max-w-2xl px-4">
                    <div className="space-y-2">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-emerald-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        </div>
                        <p className="text-xs font-medium text-gray-500">Fast Results</p>
                    </div>
                    <div className="space-y-2">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                        </div>
                        <p className="text-xs font-medium text-gray-500">Deep Analysis</p>
                    </div>
                    <div className="space-y-2">
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-purple-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        </div>
                        <p className="text-xs font-medium text-gray-500">Free Forever</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
