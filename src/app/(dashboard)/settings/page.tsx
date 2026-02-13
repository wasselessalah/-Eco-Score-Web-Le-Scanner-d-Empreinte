'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [fullName, setFullName] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);
            setFullName(user.user_metadata?.full_name || '');
            setLoading(false);
        };
        getUser();
    }, [router, supabase]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: fullName }
            });

            if (error) throw error;
            setMessage({ type: 'success', text: 'Profile updated successfully' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setUpdating(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-6 py-10">
            <h1 className="text-3xl font-extrabold text-white mb-2">Settings</h1>
            <p className="text-gray-400 mb-8">Manage your account preferences and profile.</p>

            <div className="grid gap-8 md:grid-cols-[1fr_250px]">
                <div className="space-y-6">
                    {/* Profile Section */}
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                        <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={user?.email}
                                    disabled
                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-gray-400 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-600 ml-1">Email cannot be changed via settings.</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/5 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)]"
                                    placeholder="Enter your name"
                                />
                            </div>

                            {message && (
                                <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {message.text}
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-black transition-all hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {updating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Security Section */}
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                        <h2 className="text-xl font-bold text-white mb-6">Security</h2>
                        <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-black/20">
                            <div>
                                <h3 className="text-sm font-medium text-white">Password</h3>
                                <p className="text-xs text-gray-500 mt-1">Last updated recently</p>
                            </div>
                            <button
                                onClick={() => router.push('/update-password')}
                                className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Accont Actions</h3>
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
