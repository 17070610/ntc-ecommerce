"use client";

import { useState } from "react";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: any[];
    totalAmount: number;
    userId: string | null;
}

export default function CheckoutModal({
                                          isOpen,
                                          onClose,
                                          cartItems,
                                          totalAmount,
                                          userId,
                                      }: CheckoutModalProps) {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

    if (!isOpen) return null;

    const formatRWF = (amount: number) => `${amount.toLocaleString()} RWF`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const formattedItems = cartItems.map((item) => ({
                productId:
                    item.productId ||
                    item.product?._id ||
                    item.product?.id ||
                    item._id ||
                    item.id,
                name: item.name || item.product?.name,
                price: item.price || item.product?.price,
                quantity: item.quantity,
                image: item.image || item.product?.image,
            }));

            const response = await fetch("http://localhost:5000/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cartItems: formattedItems,
                    totalAmount,
                    userId,
                    phoneNumber,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setPaymentStatus("pending");
                setTimeout(() => {
                    setPaymentStatus("success");
                    setTimeout(() => {
                        onClose();
                        window.location.reload();
                    }, 1500);
                }, 2000);
            } else {
                setError(data.message || "Payment failed");
                setLoading(false);
            }
        } catch (err) {
            setError("Connection failed");
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 999999,
                padding: "16px",
                backdropFilter: "blur(4px)",
                animation: "fadeIn 0.2s ease-out",
            }}
            onClick={onClose}
        >
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { 
                        box-shadow: 0 0 0 0 rgba(255, 204, 0, 0.4);
                    }
                    50% { 
                        box-shadow: 0 0 0 8px rgba(255, 204, 0, 0);
                    }
                }
            `}</style>
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "24px",
                    width: "100%",
                    maxWidth: "380px",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.1)",
                    animation: "slideUp 0.3s ease-out",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {!paymentStatus ? (
                    <>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "20px"
                        }}>
                            <div style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: "#FFCC00",
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "20px",
                                fontWeight: "bold",
                                color: "#000",
                                boxShadow: "0 4px 12px rgba(255, 204, 0, 0.3)"
                            }}>
                                M
                            </div>
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: "18px",
                                    fontWeight: "bold",
                                    color: "#1a1a1a",
                                }}
                            >
                                MTN MoMo Payment
                            </h2>
                        </div>

                        <div
                            style={{
                                padding: "16px",
                                background: "linear-gradient(135deg, #fff9e6 0%, #ffe9a8 100%)",
                                borderRadius: "10px",
                                marginBottom: "18px",
                                border: "2px solid #FFCC00",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <span style={{
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    color: "#854d0e",
                                }}>Amount to Pay:</span>
                                <span style={{
                                    fontSize: "22px",
                                    fontWeight: "bold",
                                    color: "#000",
                                }}>
                                    {formatRWF(totalAmount)}
                                </span>
                            </div>
                        </div>

                        <div style={{
                            marginBottom: "18px",
                            padding: "18px",
                            backgroundColor: "#f8fafc",
                            borderRadius: "10px",
                            border: "3px solid #FFCC00",
                            animation: "pulse 2s infinite",
                        }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "10px",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "#1a1a1a",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                📱 Enter Your MTN Number
                            </label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="25078xxxxxxx"
                                required
                                autoFocus
                                style={{
                                    width: "100%",
                                    padding: "14px 16px",
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    border: "3px solid #cbd5e1",
                                    borderRadius: "8px",
                                    boxSizing: "border-box",
                                    outline: "none",
                                    transition: "all 0.2s",
                                    backgroundColor: "white",
                                    letterSpacing: "1px",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "#FFCC00";
                                    e.target.style.boxShadow = "0 0 0 4px rgba(255, 204, 0, 0.2)";
                                    e.target.style.transform = "scale(1.02)";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "#cbd5e1";
                                    e.target.style.boxShadow = "none";
                                    e.target.style.transform = "scale(1)";
                                }}
                            />
                            <p style={{
                                marginTop: "8px",
                                fontSize: "12px",
                                color: "#64748b",
                                fontWeight: "500",
                            }}>
                                💡 Enter phone number registered with MTN MoMo
                            </p>
                        </div>

                        {error && (
                            <div
                                style={{
                                    padding: "14px 16px",
                                    backgroundColor: "#fee2e2",
                                    borderRadius: "10px",
                                    marginBottom: "20px",
                                    color: "#991b1b",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    border: "2px solid #fecaca",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <span style={{ fontSize: "18px" }}>⚠️</span>
                                {error}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "12px" }}>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    padding: "16px",
                                    border: "2px solid #e5e7eb",
                                    borderRadius: "10px",
                                    backgroundColor: "white",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#374151",
                                    transition: "all 0.2s",
                                    opacity: loading ? 0.5 : 1,
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        e.currentTarget.style.backgroundColor = "#f9fafb";
                                        e.currentTarget.style.borderColor = "#d1d5db";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "white";
                                    e.currentTarget.style.borderColor = "#e5e7eb";
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={loading || !phoneNumber}
                                style={{
                                    flex: 1,
                                    padding: "16px",
                                    border: "none",
                                    borderRadius: "10px",
                                    backgroundColor:
                                        loading || !phoneNumber
                                            ? "#9ca3af"
                                            : "#FFCC00",
                                    color: "#000",
                                    cursor:
                                        loading || !phoneNumber
                                            ? "not-allowed"
                                            : "pointer",
                                    fontSize: "16px",
                                    fontWeight: "700",
                                    transition: "all 0.2s",
                                    boxShadow: loading || !phoneNumber ? "none" : "0 4px 12px rgba(255, 204, 0, 0.4)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading && phoneNumber) {
                                        e.currentTarget.style.backgroundColor = "#f5c400";
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(255, 204, 0, 0.5)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = loading || !phoneNumber ? "#9ca3af" : "#FFCC00";
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = loading || !phoneNumber ? "none" : "0 4px 12px rgba(255, 204, 0, 0.4)";
                                }}
                            >
                                {loading && (
                                    <div style={{
                                        width: "16px",
                                        height: "16px",
                                        border: "2px solid rgba(0,0,0,0.3)",
                                        borderTopColor: "#000",
                                        borderRadius: "50%",
                                        animation: "spin 0.8s linear infinite",
                                    }} />
                                )}
                                {loading ? "Processing..." : "💳 Pay Now"}
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: "center", padding: "40px 20px" }}>
                        {paymentStatus === "pending" && (
                            <>
                                <div style={{
                                    width: "64px",
                                    height: "64px",
                                    border: "4px solid #e5e7eb",
                                    borderTopColor: "#FFCC00",
                                    borderRadius: "50%",
                                    animation: "spin 1s linear infinite",
                                    margin: "0 auto 20px",
                                }} />
                                <p style={{
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    color: "#374151",
                                }}>
                                    Processing payment...
                                </p>
                                <p style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    marginTop: "8px",
                                }}>
                                    Please wait
                                </p>
                            </>
                        )}
                        {paymentStatus === "success" && (
                            <>
                                <div
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        backgroundColor: "#dcfce7",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 20px",
                                        fontSize: "48px",
                                        color: "#16a34a",
                                        boxShadow: "0 8px 24px rgba(22, 163, 74, 0.2)",
                                    }}
                                >
                                    ✓
                                </div>
                                <p
                                    style={{
                                        fontSize: "24px",
                                        fontWeight: "bold",
                                        color: "#16a34a",
                                        marginBottom: "8px",
                                    }}
                                >
                                    Payment Successful!
                                </p>
                                <p style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                }}>
                                    Redirecting...
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}