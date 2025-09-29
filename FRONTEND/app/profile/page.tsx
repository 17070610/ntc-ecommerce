"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface User {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                router.push("/auth");
            }
        } else {
            router.push("/auth");
        }
    }, [router]);

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <Header user={null} />
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header user={user} />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">My Profile</h1>

                    <Card>
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>Your personal details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">First Name</label>
                                    <p className="text-lg">{user.firstName}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Last Name</label>
                                    <p className="text-lg">{user.lastName}</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Email Address</label>
                                <p className="text-lg">{user.email}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">Account Type</label>
                                <p className="text-lg capitalize">{user.role}</p>
                            </div>

                            <div className="pt-4 border-t">
                                <Button variant="outline" className="mr-4">
                                    Edit Profile
                                </Button>
                                <Button variant="outline">
                                    Change Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}