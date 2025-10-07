"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Product } from "@/types/product";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";

interface User {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

const categories = [
    { id: "office", name: "Office", icon: "📎" },
    { id: "school", name: "School", icon: "📚" },
    { id: "electronics", name: "Electronics", icon: "💻" },
];

export default function CategoryPage() {
    const [user, setUser] = useState<User | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

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
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                if (data.success) {
                    setProducts(data.data || []);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts =
        selectedCategory === "all"
            ? products
            : products.filter(
                (product) =>
                    product.category.toLowerCase() === selectedCategory.toLowerCase()
            );

    const handleAddToCart = (product: Product) => {
        addToCart(product);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header user={user} onSearch={() => {}} />

            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Browse Categories</h1>
                    <p className="text-muted-foreground">
                        Explore our wide range of products organized by category
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <Button
                        variant={selectedCategory === "all" ? "default" : "outline"}
                        onClick={() => setSelectedCategory("all")}
                    >
                        All Products
                    </Button>
                    {categories.map((category) => (
                        <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? "default" : "outline"}
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            <span className="mr-2">{category.icon}</span>
                            {category.name}
                        </Button>
                    ))}
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Loading products...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No products found in this category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardHeader className="p-0">
                                    <div className="aspect-square relative overflow-hidden bg-muted">
                                        <img
                                            src={product.image || "/placeholder-product.png"}
                                            alt={product.name}
                                            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="mb-2">
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                            {product.category}
                                        </span>
                                    </div>
                                    <CardTitle className="text-lg mb-2 line-clamp-1">
                                        {product.name}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-primary">
                                            {product.price} RWF
                                        </span>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 flex gap-2">
                                    <Button
                                        className="flex-1"
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        Add to Cart
                                    </Button>
                                    <Link href={`/product/${product._id}`}>
                                        <Button variant="outline">View</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}