'use client';

import { useState } from 'react';

interface ScanFormProps {
    onScanComplete: (data: Record<string, unknown>) => void;
    onScanStart?: () => void;
}

export default function ScanForm({ onScanComplete, onScanStart }: ScanFormProps) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        let targetUrl = url.trim();
        if (!targetUrl) return;

        // Auto-add https:// if missing
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = `https://${targetUrl}`;
        }

        setLoading(true);
        onScanStart?.();

        try {
            const res = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: targetUrl }),
            });

            const result = await res.json();

            if (!result.success) {
                throw new Error(result.error || 'Scan failed');
            }

            onScanComplete(result.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className="relative flex items-center">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter a URL to scan (e.g. example.com)"
                        disabled={loading}
                        className="
              w-full rounded-l-xl border-2 border-r-0 border-white/10 bg-white/5
              px-6 py-4 text-base text-white placeholder-gray-500
              outline-none backdrop-blur-sm
              transition-all duration-300
              focus:border-emerald-500/50 focus:bg-white/[0.08]
              disabled:opacity-50
            "
                    />
                    {loading && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                        </div>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={loading || !url.trim()}
                    className="
            rounded-r-xl border-2 border-emerald-500 bg-emerald-500
            px-8 py-4 text-base font-bold text-black
            transition-all duration-300
            hover:bg-emerald-400 hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]
            active:scale-[0.98]
            disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none
          "
                >
                    {loading ? 'Scanning...' : 'Scan'}
                </button>
            </div>

            {error && (
                <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                </div>
            )}
        </form>
    );
}
