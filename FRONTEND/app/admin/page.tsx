"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ProductsTable } from "@/components/admin/products-table"
import { ProductForm } from "@/components/admin/product-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, DollarSign, TrendingUp, Users } from "lucide-react"
import { AdminProduct, ApiResponse, Product } from "@/types/product"

export default function AdminPage() {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [products, setProducts] = useState<AdminProduct[]>([])
    const [editingProduct, setEditingProduct] = useState<AdminProduct | undefined>(undefined)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userStr = localStorage.getItem("user")

                if (!userStr) {
                    router.push("/auth/login")
                    return
                }

                const user = JSON.parse(userStr)

                if (user.role !== "superadmin") {
                    alert("Access Denied: You must be a super admin to access this page.")
                    router.push("/")
                    return
                }

                const res = await fetch("/api/auth/verify", {
                    credentials: 'include',
                })

                if (!res.ok) {
                    localStorage.removeItem("user")
                    router.push("/auth/login")
                    return
                }

                setIsAuthorized(true)
            } catch (err) {
                console.error("Auth check failed:", err)
                router.push("/auth/login")
            } finally {
                setIsLoading(false)
            }
        }

        checkAuth()
    }, [router])

    useEffect(() => {
        if (!isAuthorized) return

        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products")
                const data: ApiResponse<Product[]> = await res.json()
                if (data.success && data.data) {
                    setProducts(data.data as AdminProduct[])
                }
            } catch (err) {
                console.error("Failed to fetch products:", err)
            }
        }
        fetchProducts()
    }, [isAuthorized])

    const handleAddProduct = () => {
        setEditingProduct(undefined)
        setShowForm(true)
    }

    const handleEditProduct = (product: AdminProduct) => {
        setEditingProduct(product)
        setShowForm(true)
    }

    const handleDeleteProduct = async (productId: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
                    method: "DELETE",
                    credentials: 'include',
                })

                if (res.ok) {
                    setProducts((prev) => prev.filter((p) => p._id !== productId))
                    alert("Product deleted successfully!")
                    router.refresh()
                } else {
                    alert("Failed to delete product")
                }
            } catch (error) {
                console.error("Delete error:", error)
                alert("Error deleting product")
            }
        }
    }

    const handleSubmitProduct = async (productData: AdminProduct) => {
        try {
            if (editingProduct) {
                const res = await fetch(`http://localhost:5000/api/products/${editingProduct._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include',
                    body: JSON.stringify(productData),
                })
                const data: ApiResponse<AdminProduct> = await res.json()
                if (data.success && data.data) {
                    setProducts((prev) => prev.map((p) => (p._id === editingProduct._id ? data.data! : p)))
                    alert("Product updated successfully!")
                }
            } else {
                const res = await fetch("http://localhost:5000/api/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include',
                    body: JSON.stringify(productData),
                })
                const data: ApiResponse<AdminProduct> = await res.json()
                if (data.success && data.data) {
                    setProducts((prev) => [...prev, data.data!])
                    alert("Product added successfully!")
                }
            }
            setShowForm(false)
            setEditingProduct(undefined)
        } catch (error) {
            console.error("Submit error:", error)
            alert("Error saving product")
        }
    }

    const handleCancelForm = () => {
        setShowForm(false)
        setEditingProduct(undefined)
    }

    const totalProducts = products.length
    const totalValue = products.reduce((sum, product) => sum + product.price, 0)
    const newProducts = products.filter((p) => p.isNew).length
    const onSaleProducts = products.filter((p) => p.originalPrice).length

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Verifying access...</p>
                </div>
            </div>
        )
    }

    if (!isAuthorized) {
        return null
    }

    if (showForm) {
        return (
            <div className="min-h-screen bg-background">
                <Header user={null} />
                <main className="container mx-auto px-4 py-8">
                    <ProductForm product={editingProduct} onSubmit={handleSubmitProduct} onCancel={handleCancelForm} />
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Header user={null} />
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage your NTC e-commerce platform</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalProducts}</div>
                            <p className="text-xs text-muted-foreground">{newProducts} new this month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalValue.toFixed(2)} RWF</div>
                            <p className="text-xs text-muted-foreground">Across all products</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">On Sale</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{onSaleProducts}</div>
                            <p className="text-xs text-muted-foreground">Products with discounts</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Categories</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3</div>
                            <p className="text-xs text-muted-foreground">Office, School, Electronics</p>
                        </CardContent>
                    </Card>
                </div>

                <ProductsTable
                    products={products}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                    onAdd={handleAddProduct}
                />
            </main>
        </div>
    )
}