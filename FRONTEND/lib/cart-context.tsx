"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface CartItem {
    product: {
        _id: string;
        id?: string;
        name: string;
        price: number;
        image: string;
        category?: string;
    };
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: any) => {
        console.log("Adding product to cart:", product);
        console.log("Product ID:", product._id || product.id);

        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => {
                const itemId = item.product._id || item.product.id;
                const newItemId = product._id || product.id;
                console.log("Comparing:", itemId, "with", newItemId);
                return itemId === newItemId;
            });

            if (existingItem) {
                console.log("Updating quantity for existing item");
                return prevCart.map((item) => {
                    const itemId = item.product._id || item.product.id;
                    const newItemId = product._id || product.id;
                    return itemId === newItemId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item;
                });
            } else {
                console.log("New product, adding to cart");
                return [...prevCart, { product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (productId: string) => {
        setCart((prevCart) =>
            prevCart.filter((item) => {
                const itemId = item.product._id || item.product.id;
                return itemId !== productId;
            })
        );
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart((prevCart) =>
                prevCart.map((item) => {
                    const itemId = item.product._id || item.product.id;
                    return itemId === productId ? { ...item, quantity } : item;
                })
            );
        }
    };

    const clearCart = async () => {
        setCart([]);
        localStorage.removeItem("cart");
    };

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};