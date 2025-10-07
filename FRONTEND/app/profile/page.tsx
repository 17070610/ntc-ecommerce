"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface User {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const router = useRouter();

    // Edit profile form
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    // Change password form
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setFirstName(parsedUser.firstName);
                setLastName(parsedUser.lastName);
            } catch (error) {
                router.push("/auth");
            }
        } else {
            router.push("/auth");
        }
    }, [router]);

    const handleEditProfile = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/updatedetails", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    name: `${firstName} ${lastName}`,
                    email: user?.email,
                }),
            });

            const data = await res.json();

            if (data.success) {
                // Update localStorage
                const updatedUser = { ...user, firstName, lastName };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser as User);
                setIsEditingProfile(false);
                alert("Profile updated successfully!");
            } else {
                alert(data.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Error updating profile");
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            alert("New passwords don't match!");
            return;
        }

        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/auth/updatepassword", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setIsChangingPassword(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                alert("Password changed successfully!");
            } else {
                alert(data.message || "Failed to change password");
            }
        } catch (error) {
            console.error("Password change error:", error);
            alert("Error changing password");
        }
    };

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

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>Your personal details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {isEditingProfile ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label>Email Address</Label>
                                        <p className="text-sm text-muted-foreground mt-1">{user.email} (cannot be changed)</p>
                                    </div>

                                    <div className="flex gap-2 pt-4">
                                        <Button onClick={handleEditProfile}>Save Changes</Button>
                                        <Button variant="outline" onClick={() => {
                                            setIsEditingProfile(false);
                                            setFirstName(user.firstName);
                                            setLastName(user.lastName);
                                        }}>
                                            Cancel
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">First Name</label>
                                            <p className="text-lg">{user.firstName}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Name</label>
                                            <p className="text-lg">{user.lastName}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</label>
                                        <p className="text-lg">{user.email}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Type</label>
                                        <p className="text-lg capitalize">{user.role}</p>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <Button variant="outline" className="mr-4" onClick={() => setIsEditingProfile(true)}>
                                            Edit Profile
                                        </Button>
                                        <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
                                            Change Password
                                        </Button>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {isChangingPassword && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>Update your account password</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input
                                        id="currentPassword"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <Button onClick={handleChangePassword}>Update Password</Button>
                                    <Button variant="outline" onClick={() => {
                                        setIsChangingPassword(false);
                                        setCurrentPassword("");
                                        setNewPassword("");
                                        setConfirmPassword("");
                                    }}>
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}