"use client";

import { Search, User, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import Image from "next/image";
import logo from "./logo/ntc-logo.jpeg";
import { useState } from "react";

interface UserType {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

interface HeaderProps {
    user: UserType | null;
    onSearch?: (query: string) => void;
}

export function Header({ user, onSearch }: HeaderProps) {
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
    };

    const handleOutsideClick = () => {
        setShowUserDropdown(false);
        setShowMobileMenu(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (onSearch) {
            onSearch(query);
        }
    };

    return (
        <>
            {(showUserDropdown || showMobileMenu) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={handleOutsideClick}
                />
            )}

            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center">
                            <Image
                                src={logo}
                                alt="NTC Logo"
                                width={40}
                                height={40}
                                className="rounded"
                            />
                            <span className="ml-2 text-sm text-muted-foreground hidden sm:block">
                                New Technology Center
                            </span>
                        </Link>

                        <div className="flex-1 max-w-md mx-4 hidden md:block">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search products..."
                                    className="pl-10 pr-4"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>

                        <nav className="hidden lg:flex items-center space-x-6">
                            <Link href="/category/office" className="hover:text-primary transition-colors">
                                Office
                            </Link>
                            <Link href="/category/school" className="hover:text-primary transition-colors">
                                School
                            </Link>
                            <Link href="/category/electronics" className="hover:text-primary transition-colors">
                                Electronics
                            </Link>
                            <Link href="/contact" className="hover:text-primary transition-colors">
                                Contact
                            </Link>
                        </nav>

                        <div className="flex items-center space-x-2">
                            <ThemeToggle />

                            <div className="relative">
                                <button
                                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <User className="h-5 w-5" />
                                </button>

                                {showUserDropdown && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border rounded-lg shadow-lg py-1 z-50">
                                        {user ? (
                                            <>
                                                <div className="px-4 py-2 text-sm text-gray-500 border-b">
                                                    Hello, {user.firstName}
                                                </div>
                                                <Link
                                                    href="/profile"
                                                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    onClick={() => setShowUserDropdown(false)}
                                                >
                                                    My Account
                                                </Link>
                                                <Link
                                                    href="/orders"
                                                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    onClick={() => setShowUserDropdown(false)}
                                                >
                                                    My Orders
                                                </Link>
                                                {user.role === "superadmin" && (
                                                    <Link
                                                        href="/admin"
                                                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                        onClick={() => setShowUserDropdown(false)}
                                                    >
                                                        Admin Dashboard
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 transition-colors"
                                                >
                                                    Logout
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    href="/auth"
                                                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    onClick={() => setShowUserDropdown(false)}
                                                >
                                                    Sign In
                                                </Link>
                                                <Link
                                                    href="/auth?tab=register"
                                                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    onClick={() => setShowUserDropdown(false)}
                                                >
                                                    Sign Up
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <CartDrawer />

                            <div className="relative lg:hidden">
                                <button
                                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <Menu className="h-5 w-5" />
                                </button>

                                {showMobileMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border rounded-lg shadow-lg py-1 z-50">
                                        <Link
                                            href="/category/office"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            Office
                                        </Link>
                                        <Link
                                            href="/category/school"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            School
                                        </Link>
                                        <Link
                                            href="/category/electronics"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            Electronics
                                        </Link>
                                        <Link
                                            href="/contact"
                                            className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            onClick={() => setShowMobileMenu(false)}
                                        >
                                            Contact
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}