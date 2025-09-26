"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface Order {
    id: string;
    date: string;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    total: number;
    items: OrderItem[];
}

interface User {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

export default function OrdersPage() {
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                setUser(JSON.parse(userData));
                // Fetch user orders here
                fetchUserOrders();
            } catch (error) {
                router.push("/auth");
            }
        } else {
            router.push("/auth");
        }
    }, [router]);

    const fetchUserOrders = async () => {
        try {
            // Replace this with your actual API call
            // const response = await fetch('/api/orders');
            // const data = await response.json();
            // setOrders(data.orders);

            // Mock data for now
            const mockOrders: Order[] = [
                {
                    id: "ORD-001",
                    date: "2024-01-15",
                    status: "delivered",
                    total: 299.99,
                    items: [
                        {
                            id: "1",
                            name: "Wireless Headphones",
                            price: 299.99,
                            quantity: 1,
                            image: "/api/placeholder/100/100"
                        }
                    ]
                },
                {
                    id: "ORD-002",
                    date: "2024-01-10",
                    status: "processing",
                    total: 599.98,
                    items: [
                        {
                            id: "2",
                            name: "Smartphone",
                            price: 599.98,
                            quantity: 1,
                            image: "/api/placeholder/100/100"
                        }
                    ]
                }
            ];
            setOrders(mockOrders);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: Order["status"]) => {
        switch (status) {
            case "delivered":
                return "bg-green-100 text-green-800";
            case "shipped":
                return "bg-blue-100 text-blue-800";
            case "processing":
                return "bg-yellow-100 text-yellow-800";
            case "pending":
                return "bg-gray-100 text-gray-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
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
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">My Orders</h1>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : orders.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                                <button
                                    onClick={() => router.push("/")}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Start Shopping
                                </button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <Card key={order.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                                                <CardDescription>
                                                    Placed on {new Date(order.date).toLocaleDateString()}
                                                </CardDescription>
                                            </div>
                                            <Badge className={getStatusColor(order.status)}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="flex items-center space-x-4">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium">{item.name}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Quantity: {item.quantity} × ${item.price}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="border-t pt-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold">Total:</span>
                                                    <span className="font-bold text-lg">${order.total}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}