"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-context";

interface Product {
    _id: string;
    name: string;
    price: number;
    description?: string;
    image?: string;
    category?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface ProductCarouselProps {
    products: Product[];
    loading: boolean;
}

export function ProductCarousel({ products, loading }: ProductCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(4);
    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    const [addedToCart, setAddedToCart] = useState<string | null>(null);
    const { addToCart } = useCart();

    // Responsive items
    useEffect(() => {
        const updateItemsToShow = () => {
            if (window.innerWidth >= 1024) setItemsToShow(4);
            else if (window.innerWidth >= 768) setItemsToShow(3);
            else if (window.innerWidth >= 640) setItemsToShow(2);
            else setItemsToShow(1);
        };
        updateItemsToShow();
        window.addEventListener("resize", updateItemsToShow);
        return () => window.removeEventListener("resize", updateItemsToShow);
    }, []);

    const maxIndex = Math.max(0, products.length - itemsToShow);

    const nextSlide = () =>
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    const prevSlide = () =>
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));

    const handleAddToCart = async (product: Product) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login to add items to cart.");
            return;
        }

        try {
            setAddingToCart(product._id);
            console.log("=== ADD TO CART DEBUG ===");
            console.log("Product:", product);
            console.log("Token exists:", !!token);

            await addToCart({
                id: product._id,
                name: product.name,
                price: product.price,
                image: product.image ?? "/placeholder.svg",
                category: product.category ?? "Uncategorized",
            });

            console.log("Successfully added to cart");
            console.log("=========================");
            setAddedToCart(product._id);
            setTimeout(() => setAddedToCart(null), 2000);
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add item to cart. Please try again.");
        } finally {
            setAddingToCart(null);
        }
    };

    const ProductCard = ({ product }: { product: Product }) => {
        const isAdding = addingToCart === product._id;
        const isAdded = addedToCart === product._id;

        return (
            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                <CardContent className="p-4">
                    <div className="relative mb-3">
                        <img
                            src={product.image ?? "/placeholder.svg"}
                            alt={product.name ?? "Unnamed product"}
                            className="w-full h-48 object-cover rounded-md"
                        />
                        {product.createdAt && (
                            <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
                                New
                            </Badge>
                        )}
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {product.name ?? "Unnamed Product"}
                        </h3>

                        <div className="flex items-center justify-between">
                            <span className="font-bold text-primary">{product.price} RWF</span>
                            <Badge variant="secondary" className="text-xs">
                                {product.category ?? "General"}
                            </Badge>
                        </div>

                        <Button
                            size="sm"
                            className="w-full mt-2 group-hover:bg-accent group-hover:text-accent-foreground transition-colors"
                            onClick={() => handleAddToCart(product)}
                            disabled={isAdding || isAdded}
                        >
                            {isAdding ? (
                                <>
                                    <span className="animate-spin mr-1">⏳</span>
                                    Adding...
                                </>
                            ) : isAdded ? (
                                <>
                                    <Check className="h-3 w-3 mr-1" />
                                    Added!
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="h-3 w-3 mr-1" />
                                    Add to Cart
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold">Featured Products</h2>
                        <p className="text-muted-foreground mt-2">
                            Discover our latest and most popular items
                        </p>
                    </div>

                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={prevSlide}
                            disabled={products.length <= itemsToShow}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={nextSlide}
                            disabled={products.length <= itemsToShow}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-muted-foreground">Loading products...</p>
                ) : products.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                        No products available
                    </p>
                ) : (
                    <div className="relative overflow-hidden">
                        <div
                            className="flex transition-transform duration-300 ease-in-out"
                            style={{
                                transform: `translateX(-${
                                    currentIndex * (100 / itemsToShow)
                                }%)`,
                            }}
                        >
                            {products.map((product) => (
                                <div
                                    key={product._id}
                                    className="flex-shrink-0 px-2"
                                    style={{ width: `${100 / itemsToShow}%` }}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}