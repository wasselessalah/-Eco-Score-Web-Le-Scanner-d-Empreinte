'use client';

import { useState, useMemo } from 'react';
import { clsx } from 'clsx';

interface PasswordStrengthInputProps {
    value: string;
    onChange: (value: string) => void;
    id?: string;
    placeholder?: string;
    required?: boolean;
}

export default function PasswordStrengthInput({
    value,
    onChange,
    id,
    placeholder,
    required,
}: PasswordStrengthInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    const strength = useMemo(() => {
        let score = 0;
        if (!value) return 0;

        if (value.length > 8) score += 1;
        if (/[A-Z]/.test(value)) score += 1;
        if (/[a-z]/.test(value)) score += 1;
        if (/[0-9]/.test(value)) score += 1;
        if (/[^A-Za-z0-9]/.test(value)) score += 1;

        return Math.min(score, 5);
    }, [value]);

    const strengthColor = useMemo(() => {
        if (strength <= 2) return 'bg-red-500';
        if (strength <= 3) return 'bg-yellow-500';
        return 'bg-emerald-500';
    }, [strength]);

    const strengthLabel = useMemo(() => {
        if (strength === 0) return '';
        if (strength <= 2) return 'Weak';
        if (strength <= 3) return 'Medium';
        return 'Strong';
    }, [strength]);

    return (
        <div className="relative">
            <input
                id={id}
                type="password"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={clsx(
                    "w-full rounded-lg border bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-all duration-300",
                    isFocused
                        ? "border-emerald-500/50 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]"
                        : "border-white/10 hover:border-white/20"
                )}
                placeholder={placeholder ?? "Enter password..."}
            />

            {/* Strength Indicator */}
            <div className={clsx(
                "mt-2 overflow-hidden transition-all duration-500 ease-out",
                value ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="flex items-center justify-between px-1 mb-1.5">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                        Password Strength
                    </span>
                    <span className={clsx(
                        "text-[10px] font-bold uppercase tracking-wider transition-colors duration-300",
                        strength <= 2 ? 'text-red-400' : strength <= 3 ? 'text-yellow-400' : 'text-emerald-400'
                    )}>
                        {strengthLabel}
                    </span>
                </div>

                <div className="flex h-1 w-full gap-1">
                    {[1, 2, 3, 4, 5].map((step) => (
                        <div
                            key={step}
                            className={clsx(
                                "h-full flex-1 rounded-full transition-all duration-500",
                                step <= strength ? strengthColor : "bg-white/10"
                            )}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
