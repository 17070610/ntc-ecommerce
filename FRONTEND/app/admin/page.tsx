"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { ProductsTable } from "@/components/admin/products-table"
import { ProductForm } from "@/components/admin/product-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, DollarSign, TrendingUp, Users } from "lucide-react"
import { AdminProduct, ApiResponse, Product } from "@/types/product"

export default function AdminPage() {
    const [products, setProducts] = useState<AdminProduct[]>([])
    const [editingProduct, setEditingProduct] = useState<AdminProduct | undefined>(undefined)
    const [showForm, setShowForm] = useState(false)

    // ✅ Fetch products from backend
    useEffect(() => {
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
    }, [])

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
            await fetch(`/api/products/${productId}`, { method: "DELETE" })
            setProducts((prev) => prev.filter((p) => p._id !== productId))
        }
    }

    const handleSubmitProduct = async (productData: AdminProduct) => {
        if (editingProduct) {
            // Update existing product
            const res = await fetch(`/api/products/${editingProduct._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData),
            })
            const data: ApiResponse<AdminProduct> = await res.json()
            if (data.success && data.data) {
                setProducts((prev) => prev.map((p) => (p._id === editingProduct._id ? data.data! : p)))
            }
        } else {
            // Add new product
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData),
            })
            const data: ApiResponse<AdminProduct> = await res.json()
            if (data.success && data.data) {
                setProducts((prev) => [...prev, data.data!])
            }
        }
        setShowForm(false)
        setEditingProduct(undefined)
    }

    const handleCancelForm = () => {
        setShowForm(false)
        setEditingProduct(undefined)
    }

    // Stats
    const totalProducts = products.length
    const totalValue = products.reduce((sum, product) => sum + product.price, 0)
    const newProducts = products.filter((p) => p.isNew).length
    const onSaleProducts = products.filter((p) => p.originalPrice).length

    if (showForm) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <ProductForm product={editingProduct} onSubmit={handleSubmitProduct} onCancel={handleCancelForm} />
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage your NTC e-commerce platform</p>
                </div>

                {/* Stats Cards */}
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

                {/* Products Table */}
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
