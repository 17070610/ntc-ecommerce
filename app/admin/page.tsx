"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { ProductsTable } from "@/components/admin/products-table"
import { ProductForm } from "@/components/admin/product-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, DollarSign, TrendingUp, Users } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: "Office" | "School" | "Electronics"
  image: string
  isNew: boolean
  tags: string[]
  createdAt: string
}

// Mock products data
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 89.99,
    originalPrice: 129.99,
    category: "Electronics",
    image: "/wireless-bluetooth-headphones.jpg",
    isNew: true,
    tags: ["wireless", "bluetooth", "audio"],
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    description: "Comfortable office chair with lumbar support",
    price: 299.99,
    category: "Office",
    image: "/ergonomic-office-chair.png",
    isNew: false,
    tags: ["furniture", "ergonomic", "office"],
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Scientific Calculator",
    description: "Advanced calculator for mathematical calculations",
    price: 24.99,
    category: "School",
    image: "/scientific-calculator.jpg",
    isNew: false,
    tags: ["calculator", "math", "school"],
    createdAt: "2024-01-08",
  },
]

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Check if user is admin (mock authentication)
  const isAdmin = true // In real app, this would check actual auth state

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You need admin privileges to access this page.</p>
          </div>
        </main>
      </div>
    )
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== productId))
    }
  }

  const handleSubmitProduct = (productData: Product) => {
    if (editingProduct) {
      // Update existing product
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? productData : p)))
    } else {
      // Add new product
      setProducts((prev) => [...prev, { ...productData, createdAt: new Date().toISOString().split("T")[0] }])
    }
    setShowForm(false)
    setEditingProduct(null)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  // Calculate stats
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">{newProducts} new this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalValue.toFixed(2)}RWF</div>
              <p className="text-xs text-muted-foreground">Across all products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Sale</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{onSaleProducts}</div>
              <p className="text-xs text-muted-foreground">Products with discounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
