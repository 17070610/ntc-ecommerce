"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Package, Shield, Truck, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Card, CardContent } from "@/components/ui/card";

interface User {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;

    const [user, setUser] = useState<User | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
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
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/products/${productId}`);
                const data = await res.json();
                if (data.success) {
                    setProduct(data.data);
                } else {
                    console.error("Failed to fetch product:", data.error);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    const handleAddToCart = () => {
        if (product) {
            setAddingToCart(true);

            // Add multiple items to cart
            for (let i = 0; i < quantity; i++) {
                addToCart(product);
            }

            // Show success feedback
            setTimeout(() => {
                setAddingToCart(false);
                setQuantity(1);
                alert(`Added ${quantity} ${product.name}${quantity > 1 ? 's' : ''} to cart!`);
            }, 300);
        }
    };

    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header user={user} onSearch={() => {}} />
                <main className="container mx-auto px-4 py-8">
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="text-muted-foreground mt-4">Loading product...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-background">
                <Header user={user} onSearch={() => {}} />
                <main className="container mx-auto px-4 py-8">
                    <div className="text-center py-20">
                        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
                        <p className="text-muted-foreground mb-6">
                            The product you're looking for doesn't exist or has been removed.
                        </p>
                        <Button onClick={() => router.push("/category")}>
                            Browse All Products
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-background">
            <Header user={user} onSearch={() => {}} />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    className="mb-6 hover:bg-accent"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                {/* Product Detail */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
                    {/* Product Image */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border">
                        <img
                            src={product.image || "/placeholder-product.png"}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        {hasDiscount && (
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                -{discountPercentage}%
                            </div>
                        )}
                        {product.isNew && (
                            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                New
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Category Badge */}
                        <div>
                            <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold">
                                {product.category}
                            </span>
                        </div>

                        {/* Product Name */}
                        <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                            {product.name}
                        </h1>

                        {/* Rating (if available) */}
                        {product.rating && product.rating > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={`text-lg ${
                                                i < Math.floor(product.rating || 0)
                                                    ? "text-yellow-400"
                                                    : "text-gray-300"
                                            }`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    ({product.reviews || 0} reviews)
                                </span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl lg:text-4xl font-bold text-primary">
                                {product.price.toLocaleString()} RWF
                            </span>
                            {hasDiscount && (
                                <span className="text-xl text-muted-foreground line-through">
                                    {product.originalPrice!.toLocaleString()} RWF
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <div className="border-t pt-4">
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Quantity Selector */}
                        <div className="space-y-3 border-t pt-4">
                            <label className="text-sm font-medium">Quantity</label>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10"
                                    onClick={decrementQuantity}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="text-2xl font-semibold w-16 text-center">
                                    {quantity}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-10 w-10"
                                    onClick={incrementQuantity}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                            size="lg"
                            className="w-full h-12 text-lg"
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {addingToCart ? "Adding..." : "Add to Cart"}
                        </Button>

                        {/* Product Features */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                            <div className="flex flex-col items-center text-center space-y-2">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <Package className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-xs text-muted-foreground font-medium">
                                    Quality Products
                                </span>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-2">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <Shield className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-xs text-muted-foreground font-medium">
                                    Secure Payment
                                </span>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-2">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <Truck className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-xs text-muted-foreground font-medium">
                                    Fast Delivery
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <Card className="shadow-sm">
                    <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-4">Product Information</h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Category</p>
                                <p className="font-medium">{product.category}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Product ID</p>
                                <p className="font-medium font-mono text-xs break-all">
                                    {product._id}
                                </p>
                            </div>
                            {product.tags && product.tags.length > 0 && (
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Tags</p>
                                    <div className="flex flex-wrap gap-1">
                                        {product.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}