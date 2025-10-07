"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/cart-context";
import { ShoppingCart, Plus, Minus, Trash2, CreditCard } from "lucide-react";
import CheckoutModal from "./CheckoutModal";

export function CartDrawer() {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);

    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce(
        (sum, item) => sum + (item.product.price || 0) * item.quantity,
        0
    );

    const handleCheckout = () => setShowCheckoutModal(true);

    const cartItemsForCheckout = cart.map(item => ({
        productId: item.product?._id || item.product?.id,
        name: item.product?.name || item.name,
        price: item.product?.price || item.price,
        quantity: item.quantity,
        image: item.product?.image || item.image,
    }));

    const getUserId = () => {
        if (typeof window === "undefined") return null;
        const token = localStorage.getItem("token");
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.id;
        } catch {
            return null;
        }
    };

    const formatRWF = (amount: number) => `${amount.toLocaleString()} RWF`;

    return (
        <>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        {itemCount > 0 && (
                            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                {itemCount}
                            </Badge>
                        )}
                    </Button>
                </SheetTrigger>

                <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
                    <SheetHeader>
                        <SheetTitle>Shopping Cart</SheetTitle>
                        <SheetDescription>
                            {itemCount === 0
                                ? "Your cart is empty"
                                : `${itemCount} item(s) in your cart`}
                        </SheetDescription>
                    </SheetHeader>

                    {cart.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">Your cart is empty</p>
                                <Button className="mt-4" onClick={() => setIsOpen(false)}>
                                    Continue Shopping
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Scrollable Items */}
                            <div className="flex-1 overflow-y-auto py-4">
                                <div className="space-y-4">
                                    {cart.map((item, index) => (
                                        <div
                                            key={item.product._id || `cart-item-${index}`}
                                            className="flex items-center space-x-4 p-4 border rounded-lg"
                                        >
                                            <img
                                                src={item.product.image || "/placeholder.svg"}
                                                alt={item.product.name}
                                                className="w-16 h-16 object-cover rounded-md"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-sm line-clamp-2">
                                                    {item.product.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.product.category}
                                                </p>
                                                <p className="font-bold text-primary">
                                                    {formatRWF(item.product.price || 0)}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end space-y-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                                    onClick={() => removeFromCart(item.product._id)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-6 w-6 bg-transparent"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.product._id,
                                                                item.quantity - 1
                                                            )
                                                        }
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="text-sm font-medium w-8 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-6 w-6 bg-transparent"
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.product._id,
                                                                item.quantity + 1
                                                            )
                                                        }
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sticky Checkout Section */}
                            <div className="sticky bottom-0 bg-white border-t mt-2 p-4 shadow-md space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Subtotal ({itemCount} items)
                                    </span>
                                    <span className="font-medium">{formatRWF(total)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span className="text-primary text-lg">
                                        {formatRWF(total)}
                                    </span>
                                </div>

                                <Button className="w-full" onClick={handleCheckout}>
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Checkout
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full bg-transparent"
                                    onClick={clearCart}
                                >
                                    Clear Cart
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>

            <CheckoutModal
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                cartItems={cartItemsForCheckout}
                totalAmount={total}
                userId={getUserId()}
            />
        </>
    );
}
