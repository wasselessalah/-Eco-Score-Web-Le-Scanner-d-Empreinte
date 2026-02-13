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
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Signup failed');
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center px-6">
                <div className="w-full max-w-sm text-center">
                    <div className="mb-4 text-5xl">✅</div>
                    <h1 className="text-2xl font-bold text-white">Account created!</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Check your email (and spam folder) to confirm your account, or you&apos;ll be redirected automatically.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-6">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-white">Create account</h1>
                    <p className="mt-2 text-sm text-gray-500">Start tracking your website&apos;s carbon footprint</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="signup-email" className="block text-xs font-medium text-gray-400 mb-1.5">
                            Email
                        </label>
                        <input
                            id="signup-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-emerald-500/50"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="signup-password" className="block text-xs font-medium text-gray-400 mb-1.5">
                            Password
                        </label>
                        <PasswordStrengthInput
                            id="signup-password"
                            value={password}
                            onChange={setPassword}
                            required
                            placeholder="Create a strong password (min. 6 chars)"
                        />
                    </div>

                    {error && (
                        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-emerald-500 py-3 text-sm font-bold text-black transition-all hover:bg-emerald-400 disabled:opacity-50"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link href="/login" className="text-emerald-400 hover:text-emerald-300">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
