'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ScanForm from '@/components/scan/ScanForm';
import ScanResult from '@/components/scan/ScanResult';

function NewScanContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const prefillUrl = searchParams.get('url') ?? '';
    const [scanData, setScanData] = useState<Record<string, unknown> | null>(null);
    const [scanning, setScanning] = useState(false);

    return (
        <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="mb-8">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                >
                    ← Back to Dashboard
                </button>
                <h1 className="mt-3 text-3xl font-extrabold text-white">New Scan</h1>
                <p className="mt-1 text-sm text-gray-500">Enter a URL to analyze its carbon footprint</p>
            </div>

            <ScanForm
                onScanStart={() => { setScanning(true); setScanData(null); }}
                onScanComplete={(data) => { setScanData(data); setScanning(false); }}
            />

            {scanning && (
                <div className="mt-16 flex flex-col items-center gap-4 text-center">
                    <div className="relative h-16 w-16">
                        <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
                        <div className="absolute inset-2 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                    </div>
                    <p className="text-sm text-gray-400">Analyzing website...</p>
                    <p className="text-xs text-gray-600">This may take 15–30 seconds</p>
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
        <Suspense fallback={
            <div className="flex h-60 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
            </div>
        }>
            <NewScanContent />
        </Suspense>
    );
}
