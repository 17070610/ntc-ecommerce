"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import { Star, ShoppingCart, Search, Filter } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  category: "Office" | "School" | "Electronics"
  isNew?: boolean
  description: string
}

interface ProductGridProps {
  products: Product[]
  category: string
}

export function ProductGrid({ products, category }: ProductGridProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [priceRange, setPriceRange] = useState("all")
  const { dispatch } = useCart()

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "under-5000" && product.price < 5000) ||
        (priceRange === "5000-10000" && product.price >= 5000 && product.price <= 10000) ||
        (priceRange === "over-10000" && product.price > 10000)
      return matchesSearch && matchesPrice
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const addToCart = (product: Product) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      },
    })
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/50">
      <CardContent className="p-4">
        <div className="relative mb-3">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-48 object-cover rounded-md"
          />
          {product.isNew && <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">New</Badge>}
          {product.originalPrice && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              Sale
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-sm text-balance line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>

          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-primary">{product.price} RWF</span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">{product.originalPrice} RWF</span>
              )}
            </div>
          </div>

          <Button
            size="sm"
            className="w-full mt-2 group-hover:bg-accent group-hover:text-accent-foreground transition-colors"
            onClick={() => addToCart(product)}
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={`Search ${category.toLowerCase()} products...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Price range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="under-5000">Under 5,000 RWF</SelectItem>
              <SelectItem value="5000-10000">5,000 RWF - 10,000 RWF</SelectItem>
              <SelectItem value="over-10000">Over 10,000 RWF</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
