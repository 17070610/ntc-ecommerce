"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ProductCarousel } from "@/components/product-carousel";
import { CategoryShowcase } from "@/components/category-showcase";
import { Product } from "@/types/product"; // ✅

interface User {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

interface ClientHomePageProps {
    initialProducts: Product[];
}

export default function ClientHomePage({ initialProducts }: ClientHomePageProps) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Header user={user} />
            <main>
                <HeroSection />
                <div id="products-section">
                    <ProductCarousel products={initialProducts} loading={false} />
                </div>
                <CategoryShowcase />
            </main>
        </div>
    );
}