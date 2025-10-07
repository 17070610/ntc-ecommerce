"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function AuthPage() {
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get("tab") === "register" ? "register" : "login";

    const [activeTab, setActiveTab] = useState(defaultTab);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        console.log('Attempting login with:', email);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log('Login response:', data);

            if (response.ok && data.token) {
                // Store token and user info
                localStorage.setItem("token", data.token);
                if (data.user) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                }

                setMessage("Login successful! Redirecting...");

                // Redirect based on role
                setTimeout(() => {
                    if (data.user?.role === 'admin' || data.user?.role === 'superadmin') {
                        window.location.href = "/admin";
                    } else {
                        window.location.href = "/";
                    }
                }, 1000);
            } else {
                setMessage(data.message || "Invalid credentials");
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage("Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        const formData = new FormData(e.currentTarget);
        const userData = {
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        };

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Registration successful! Please login.");
                setActiveTab("login");
                (e.target as HTMLFormElement).reset();
            } else {
                setMessage(data.message || "Registration failed");
            }
        } catch (error) {
            setMessage("Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <Link href="/" className="text-blue-600 text-sm hover:underline">
                        ← Back to Home
                    </Link>
                    <h2 className="mt-4 text-3xl font-bold text-gray-900">
                        Welcome to NTC
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Your Technology Center
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Authentication</CardTitle>
                        <CardDescription>
                            Sign in to your account or create a new one
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {message && (
                            <div className={`mb-4 p-3 rounded text-sm ${
                                message.includes("successful") || message.includes("Redirecting")
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}>
                                {message}
                            </div>
                        )}

                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Sign In</TabsTrigger>
                                <TabsTrigger value="register">Sign Up</TabsTrigger>
                            </TabsList>

                            <TabsContent value="login">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div>
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="superadmin@ntc.com"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            name="password"
                                            type="password"
                                            placeholder="Password"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Signing in..." : "Sign In"}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="register">
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            name="firstName"
                                            placeholder="First Name"
                                            required
                                        />
                                        <Input
                                            name="lastName"
                                            placeholder="Last Name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="Email"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            name="password"
                                            type="password"
                                            placeholder="Password (min 6 characters)"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Creating Account..." : "Create Account"}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}