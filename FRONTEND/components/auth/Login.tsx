"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface LoginProps {
    onToggleRegister?: () => void;
    onLoginSuccess?: (data: any) => void;
}

interface LoginResponse {
    token?: string;
    accessToken?: string;
    jwt?: string;
    user?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
    };
    message?: string;
}

export default function Login({ onToggleRegister, onLoginSuccess }: LoginProps) {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = (): string | null => {
        if (!formData.email.trim()) return "Please enter your email.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            return "Please enter a valid email.";
        if (!formData.password) return "Please enter your password.";
        return null;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            console.log('🔍 Attempting login...');

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Important for cookies
                body: JSON.stringify(formData),
            });

            console.log('🔍 Response status:', res.status);

            if (!res.ok) {
                let serverMsg = "Login failed.";
                try {
                    const json = await res.json();
                    serverMsg = (json as { message?: string }).message || serverMsg;
                } catch {}
                throw new Error(serverMsg);
            }

            const data: LoginResponse = await res.json();
            console.log("✅ Login response:", data);

            // Save token in localStorage (backup)
            const token = data.token || data.accessToken || data.jwt;
            if (token) {
                localStorage.setItem("token", token);
                console.log("✅ Token saved to localStorage");
            }

            // Save user data
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
                console.log("✅ User data saved:", data.user);
            }

            // Call onLoginSuccess callback if provided
            if (typeof onLoginSuccess === "function") {
                onLoginSuccess(data);
            }

            // Redirect based on role
            if (data.user?.role === 'superadmin' || data.user?.role === 'admin') {
                console.log("✅ Redirecting to /admin");
                router.push('/admin');
                // Fallback redirect
                setTimeout(() => {
                    window.location.href = '/admin';
                }, 100);
            } else {
                console.log("✅ Redirecting to home");
                router.push('/');
                setTimeout(() => {
                    window.location.href = '/';
                }, 100);
            }

        } catch (err: any) {
            console.error("❌ Login error:", err);
            setError(err?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm " +
        "focus:border-blue-500 focus:ring focus:ring-blue-200 " +
        "text-gray-900 dark:text-white placeholder-gray-400 caret-blue-600 bg-white dark:bg-gray-800";

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md w-full">
            <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">
                Welcome back
            </h2>

            {error && (
                <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className={inputClass}
                        autoComplete="email"
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Your password"
                        className={inputClass}
                        autoComplete="current-password"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center rounded-lg bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>

            <div className="mt-4 text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <button
                    type="button"
                    onClick={() =>
                        typeof onToggleRegister === "function" && onToggleRegister()
                    }
                    className="text-blue-600 hover:underline font-medium"
                >
                    Register
                </button>
            </div>
        </div>
    );
}