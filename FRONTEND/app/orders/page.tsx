"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface Order {
    _id: string;
    orderId: string;
    items: OrderItem[];
    totalAmount: number;
    paymentStatus: string;
    status: string;
    phoneNumber: string;
    createdAt: string;
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
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (userData && token) {
            try {
                setUser(JSON.parse(userData));
                fetchUserOrders(token);
            } catch (error) {
                console.error("Auth error:", error);
                router.push("/auth");
            }
        } else {
            router.push("/auth");
        }
    }, [router]);

    const fetchUserOrders = async (token: string) => {
        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.status === 401) {
                router.push("/auth");
                return;
            }

            const data = await response.json();

            if (data.success) {
                setOrders(data.data);
            } else {
                setError(data.message || "Failed to fetch orders");
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            setError("Failed to load orders. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        const statusLower = status.toLowerCase();
        switch (statusLower) {
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

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case "SUCCESSFUL":
                return "bg-green-100 text-green-800";
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "FAILED":
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
                    ) : error ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <p className="text-red-500 mb-4">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Retry
                                </button>
                            </CardContent>
                        </Card>
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
                                <Card key={order._id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">Order #{order.orderId}</CardTitle>
                                                <CardDescription>
                                                    Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                                </CardDescription>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Phone: {order.phoneNumber}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Badge className={getStatusColor(order.status)}>
                                                    {order.status}
                                                </Badge>
                                                <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                                                    {order.paymentStatus}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex items-center space-x-4">
                                                    <img
                                                        src={item.image || "/placeholder.svg"}
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium">{item.name}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Quantity: {item.quantity} × ${item.price.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <p className="font-medium">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            ))}
                                            <div className="border-t pt-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold">Total:</span>
                                                    <span className="font-bold text-lg text-green-600">
                                                        ${order.totalAmount.toFixed(2)}
                                                    </span>
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