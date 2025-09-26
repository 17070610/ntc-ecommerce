"use client";

import React, { useState } from "react";

export default function Register({ onToggleLogin, onRegisterSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("handleChange:", name, value); // debug visibility/state
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        if (!formData.name.trim()) return "Please enter your full name.";
        if (!formData.email.trim()) return "Please enter your email.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Please enter a valid email.";
        if (formData.password.length < 6) return "Password must be at least 6 characters.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                let serverMsg = "Failed to register.";
                try {
                    const json = await res.json();
                    serverMsg = json?.message || serverMsg;
                } catch (readErr) {
                    // ignore parse error
                }
                throw new Error(serverMsg);
            }

            const data = await res.json();
            setSuccessMessage("Account created successfully!");
            if (typeof onRegisterSuccess === "function") onRegisterSuccess(data);
        } catch (err) {
            setError(err && err.message ? err.message : "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    // Shared input class: forces visible text + caret across themes
    const inputClass =
        "mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm " +
        "focus:border-blue-500 focus:ring focus:ring-blue-200 " +
        "text-gray-900 dark:text-white placeholder-gray-400 caret-blue-600 bg-white dark:bg-gray-800";

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md w-full">
            <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">Create an account</h2>

            {error && <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
            {successMessage && <div className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{successMessage}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full name</label>
                    <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        type="text"
                        required
                        placeholder="Your full name"
                        className={inputClass}
                        autoComplete="name"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                    <input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        required
                        placeholder="you@example.com"
                        className={inputClass}
                        autoComplete="email"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type="password"
                        required
                        placeholder="At least 6 characters"
                        className={inputClass}
                        autoComplete="new-password"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center rounded-lg bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {loading ? "Creating account..." : "Sign up"}
                </button>
            </form>

            <div className="mt-4 text-sm text-center text-gray-600">
                Already have an account?{" "}
                <button type="button" onClick={() => typeof onToggleLogin === "function" && onToggleLogin()} className="text-blue-600 hover:underline font-medium">
                    Log in
                </button>
            </div>
        </div>
    );
}
