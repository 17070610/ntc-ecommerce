"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { ProductCarousel } from "@/components/product-carousel";
import { CategoryShowcase } from "@/components/category-showcase";
import { AboutSection } from "@/components/about-section";
import { Product } from "@/types/product";

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
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [searchQuery, setSearchQuery] = useState("");

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

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setProducts(initialProducts);
        } else {
            const filtered = initialProducts.filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setProducts(filtered);
        }
    }, [searchQuery, initialProducts]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header user={user} onSearch={handleSearch} />
            <main>
                <HeroSection />
                <div id="products-section">
                    <ProductCarousel products={products} loading={false} />
                </div>
                <CategoryShowcase />
                <AboutSection />
            </main>
        </div>
    );
}