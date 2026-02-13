'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import PasswordStrengthInput from '@/components/ui/PasswordStrengthInput';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signUp({ email, password });

            if (error) throw error;

            setSuccess(true);

            // Auto-login after signup
            const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
            if (!loginError) {
                router.push('/dashboard');
                router.refresh();
            }
        } catch (err: any) {
            let message = err instanceof Error ? err.message : 'Signup failed';

            // Handle Rate Limiting (429)
            if (err?.status === 429 || message.includes('429') || message.includes('Too Many Requests')) {
                message = 'Too many signup attempts. Please wait a minute and try again.';
            }

            setError(message);
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center px-6 relative overflow-hidden">
                <style jsx global>{`
                    @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                        100% { transform: translateY(0px); }
                    }
                `}</style>
                <div className="w-full max-w-md text-center relative z-10">
                    {/* Success Card */}
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                        {/* Background Glow */}
                        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

                        {/* Animated Icon */}
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/50" style={{ animation: 'float 3s ease-in-out infinite' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                        </div>

                        <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
                            Check your inbox
                        </h1>

                        <p className="mb-8 text-base text-gray-400">
                            We&apos;ve sent a confirmation link to <span className="font-medium text-white">{email}</span>. Please verify your email to unlock your dashboard.
                        </p>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <a
                                href="https://mail.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3.5 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:shadow-emerald-500/30"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100">
                                    <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
                                    <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
                                </svg>
                                Open Gmail / Outlook
                            </a>

                            <div className="flex items-center justify-center gap-2 pt-4">
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="text-sm text-gray-500 hover:text-white transition-colors"
                                >
                                    Use different email
                                </button>
                                <span className="text-gray-700">•</span>
                                <button
                                    className="text-sm text-gray-500 hover:text-white transition-colors"
                                    onClick={() => {
                                        setSuccess(false);
                                        // Trigger resend logic if needed, but for now just reset UI
                                    }}
                                >
                                    Resend email
                                </button>
                            </div>
                        </div>

                        {/* Spam Warning */}
                        <div className="mt-8 flex items-start gap-3 rounded-xl bg-white/5 p-4 text-left border border-white/5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-yellow-500">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 16v-4" />
                                <path d="M12 8h.01" />
                            </svg>
                            <p className="text-xs text-gray-400">
                                Can&apos;t find it? Check your <strong className="text-gray-300">Spam</strong> or <strong className="text-gray-300">Junk</strong> folder. It usually arrives within 1 minute.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl pointer-events-none">
                <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition-all hover:border-white/20">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 shadow-inner ring-1 ring-white/10">
                            <span className="text-3xl">🚀</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Create an account</h1>
                        <p className="mt-2 text-sm text-gray-400">Start measuring your digital carbon footprint</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label htmlFor="signup-email" className="ml-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-emerald-400 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="20" height="16" x="2" y="4" rx="2" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                </div>
                                <input
                                    id="signup-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-white/10 bg-black/20 pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/5 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)]"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="signup-password" className="ml-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                Password
                            </label>
                            <PasswordStrengthInput
                                id="signup-password"
                                value={password}
                                onChange={setPassword}
                                required
                                placeholder="Create a strong password"
                            />
                        </div>

                        {error && (
                            <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200 animate-in slide-in-from-top-2 fade-in">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-red-500">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" x2="12" y1="8" y2="12" />
                                    <line x1="12" x2="12.01" y1="16" y2="16" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:shadow-emerald-500/30 disabled:opacity-70 disabled:hover:scale-100"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                'Create Free Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link href="/login" className="font-medium text-emerald-400 hover:text-emerald-300 hover:underline decoration-emerald-500/30 underline-offset-4 transition-all">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
