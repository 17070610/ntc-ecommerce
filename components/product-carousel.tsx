"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"

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
}

// Mock product data - in real app this would come from database
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviews: 234,
    image: "/wireless-bluetooth-headphones.jpg",
    category: "Electronics",
    isNew: true,
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    price: 299.99,
    rating: 4.8,
    reviews: 156,
    image: "/ergonomic-office-chair.png",
    category: "Office",
  },
  {
    id: "3",
    name: "Scientific Calculator",
    price: 24.99,
    rating: 4.6,
    reviews: 89,
    image: "/scientific-calculator.jpg",
    category: "School",
  },
  {
    id: "4",
    name: "4K Webcam",
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.7,
    reviews: 312,
    image: "/4k-webcam.png",
    category: "Electronics",
    isNew: true,
  },
  {
    id: "5",
    name: "Standing Desk Converter",
    price: 199.99,
    rating: 4.4,
    reviews: 78,
    image: "/standing-desk-converter.jpg",
    category: "Office",
  },
  {
    id: "6",
    name: "Mechanical Pencil Set",
    price: 12.99,
    rating: 4.3,
    reviews: 45,
    image: "/mechanical-pencil-set.jpg",
    category: "School",
  },
  {
    id: "7",
    name: "Wireless Mouse",
    price: 39.99,
    originalPrice: 59.99,
    rating: 4.5,
    reviews: 167,
    image: "/wireless-computer-mouse.jpg",
    category: "Electronics",
  },
  {
    id: "8",
    name: "Desk Organizer",
    price: 34.99,
    rating: 4.2,
    reviews: 92,
    image: "/desk-organizer.png",
    category: "Office",
  },
  {
    id: "9",
    name: "Notebook Set",
    price: 18.99,
    rating: 4.4,
    reviews: 123,
    image: "/notebook-set.png",
    category: "School",
  },
  {
    id: "10",
    name: "USB-C Hub",
    price: 79.99,
    rating: 4.6,
    reviews: 201,
    image: "/usb-c-hub.jpg",
    category: "Electronics",
    isNew: true,
  },
  {
    id: "11",
    name: "Monitor Stand",
    price: 49.99,
    rating: 4.3,
    reviews: 87,
    image: "/monitor-stand.jpg",
    category: "Office",
  },
  {
    id: "12",
    name: "Highlighter Pack",
    price: 8.99,
    rating: 4.1,
    reviews: 56,
    image: "/highlighter-pack.jpg",
    category: "School",
  },
  {
    id: "13",
    name: "Tablet Stand",
    price: 29.99,
    rating: 4.4,
    reviews: 134,
    image: "/minimalist-wooden-tablet-stand.png",
    category: "Electronics",
  },
  {
    id: "14",
    name: "File Cabinet",
    price: 159.99,
    rating: 4.5,
    reviews: 67,
    image: "/standard-file-cabinet.png",
    category: "Office",
  },
  {
    id: "15",
    name: "Backpack",
    price: 45.99,
    originalPrice: 69.99,
    rating: 4.7,
    reviews: 189,
    image: "/bag.png",
    category: "School",
  },
  {
    id: "16",
    name: "Bluetooth Speaker",
    price: 59.99,
    rating: 4.6,
    reviews: 278,
    image: "/bluetooth-speaker.png",
    category: "Electronics",
  },
]

export function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsToShow, setItemsToShow] = useState(4)
  const { dispatch } = useCart() // Added cart context

  // Dynamic carousel logic based on total products (as per MRD requirements)
  const totalProducts = mockProducts.length
  const maxItemsToShow = totalProducts >= 16 ? 16 : totalProducts >= 12 ? 12 : totalProducts >= 8 ? 8 : 4
  const displayProducts = mockProducts.slice(0, maxItemsToShow)

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth >= 1024) {
        setItemsToShow(4) // lg: 4 items
      } else if (window.innerWidth >= 768) {
        setItemsToShow(3) // md: 3 items
      } else if (window.innerWidth >= 640) {
        setItemsToShow(2) // sm: 2 items
      } else {
        setItemsToShow(1) // mobile: 1 item
      }
    }

    updateItemsToShow()
    window.addEventListener("resize", updateItemsToShow)
    return () => window.removeEventListener("resize", updateItemsToShow)
  }, [])

  const maxIndex = Math.max(0, displayProducts.length - itemsToShow)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

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
              <span className="font-bold text-primary">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
              )}
            </div>
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          </div>

          <Button
            size="sm"
            className="w-full mt-2 group-hover:bg-accent group-hover:text-accent-foreground transition-colors"
            onClick={() => addToCart(product)} // Added cart functionality
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-balance">Featured Products</h2>
            <p className="text-muted-foreground mt-2">Discover our latest and most popular items</p>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={prevSlide} disabled={displayProducts.length <= itemsToShow}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextSlide} disabled={displayProducts.length <= itemsToShow}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
            }}
          >
            {displayProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 px-2" style={{ width: `${100 / itemsToShow}%` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.ceil(displayProducts.length / itemsToShow) }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                Math.floor(currentIndex / itemsToShow) === index ? "bg-primary" : "bg-border"
              }`}
              onClick={() => setCurrentIndex(index * itemsToShow)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
