import { Header } from "@/components/header"
import { ProductGrid } from "@/components/category/product-grid"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Briefcase, GraduationCap, Smartphone } from "lucide-react"
import Link from "next/link"

// Mock product data - in real app this would come from database
const allProducts = [
  // Office Products
  {
    id: "2",
    name: "Ergonomic Office Chair",
    price: 299.99,
    rating: 4.8,
    reviews: 156,
    image: "/ergonomic-office-chair.png",
    category: "Office" as const,
    description: "Comfortable office chair with lumbar support and adjustable height",
  },
  {
    id: "5",
    name: "Standing Desk Converter",
    price: 199.99,
    rating: 4.4,
    reviews: 78,
    image: "/standing-desk-converter.jpg",
    category: "Office" as const,
    description: "Transform any desk into a standing desk with this adjustable converter",
  },
  {
    id: "8",
    name: "Desk Organizer",
    price: 34.99,
    rating: 4.2,
    reviews: 92,
    image: "/desk-organizer.png",
    category: "Office" as const,
    description: "Keep your workspace tidy with this multi-compartment organizer",
  },
  {
    id: "11",
    name: "Monitor Stand",
    price: 49.99,
    rating: 4.3,
    reviews: 87,
    image: "/monitor-stand.jpg",
    category: "Office" as const,
    description: "Elevate your monitor to the perfect viewing height",
  },
  {
    id: "14",
    name: "File Cabinet",
    price: 159.99,
    rating: 4.5,
    reviews: 67,
    image: "/standard-file-cabinet.png",
    category: "Office" as const,
    description: "Secure storage for important documents and files",
  },

  // School Products
  {
    id: "3",
    name: "Scientific Calculator",
    price: 24.99,
    rating: 4.6,
    reviews: 89,
    image: "/scientific-calculator.jpg",
    category: "School" as const,
    description: "Advanced calculator for mathematical and scientific calculations",
  },
  {
    id: "6",
    name: "Mechanical Pencil Set",
    price: 12.99,
    rating: 4.3,
    reviews: 45,
    image: "/mechanical-pencil-set.jpg",
    category: "School" as const,
    description: "Professional mechanical pencils for precise writing and drawing",
  },
  {
    id: "9",
    name: "Notebook Set",
    price: 18.99,
    rating: 4.4,
    reviews: 123,
    image: "/notebook-set.png",
    category: "School" as const,
    description: "High-quality notebooks for note-taking and journaling",
  },
  {
    id: "12",
    name: "Highlighter Pack",
    price: 8.99,
    rating: 4.1,
    reviews: 56,
    image: "/highlighter-pack.jpg",
    category: "School" as const,
    description: "Vibrant highlighters for marking important text and notes",
  },
  {
    id: "15",
    name: "Backpack",
    price: 45.99,
    originalPrice: 69.99,
    rating: 4.7,
    reviews: 189,
    image: "/bag.png",
    category: "School" as const,
    description: "Durable backpack with multiple compartments for school supplies",
  },

  // Electronics Products
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviews: 234,
    image: "/wireless-bluetooth-headphones.jpg",
    category: "Electronics" as const,
    isNew: true,
    description: "High-quality wireless headphones with noise cancellation technology",
  },
  {
    id: "4",
    name: "4K Webcam",
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.7,
    reviews: 312,
    image: "/4k-webcam.png",
    category: "Electronics" as const,
    isNew: true,
    description: "Ultra-high definition webcam for professional video calls",
  },
  {
    id: "7",
    name: "Wireless Mouse",
    price: 39.99,
    originalPrice: 59.99,
    rating: 4.5,
    reviews: 167,
    image: "/wireless-computer-mouse.jpg",
    category: "Electronics" as const,
    description: "Ergonomic wireless mouse with precision tracking",
  },
  {
    id: "10",
    name: "USB-C Hub",
    price: 79.99,
    rating: 4.6,
    reviews: 201,
    image: "/usb-c-hub.jpg",
    category: "Electronics" as const,
    isNew: true,
    description: "Multi-port USB-C hub for connecting multiple devices",
  },
  {
    id: "13",
    name: "Tablet Stand",
    price: 29.99,
    rating: 4.4,
    reviews: 134,
    image: "/minimalist-wooden-tablet-stand.png",
    category: "Electronics" as const,
    description: "Elegant wooden stand for tablets and smartphones",
  },
  {
    id: "16",
    name: "Bluetooth Speaker",
    price: 59.99,
    rating: 4.6,
    reviews: 278,
    image: "/bluetooth-speaker.png",
    category: "Electronics" as const,
    description: "Portable Bluetooth speaker with rich, clear sound",
  },
]

const categoryInfo = {
  office: {
    title: "Office Supplies",
    description: "Professional workspace essentials for productivity and comfort",
    icon: Briefcase,
    color: "text-blue-600",
  },
  school: {
    title: "School Supplies",
    description: "Everything you need for academic success and learning",
    icon: GraduationCap,
    color: "text-green-600",
  },
  electronics: {
    title: "Electronics",
    description: "Latest technology and gadgets for work and entertainment",
    icon: Smartphone,
    color: "text-purple-600",
  },
}

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params
  const categoryKey = slug.toLowerCase() as keyof typeof categoryInfo
  const category = categoryInfo[categoryKey]

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Category Not Found</h1>
            <p className="text-muted-foreground mb-8">The category you're looking for doesn't exist.</p>
            <Link href="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const categoryProducts = allProducts.filter((product) => product.category.toLowerCase() === categoryKey)

  const IconComponent = category.icon

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">{category.title}</span>
        </div>

        {/* Category Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className={`p-3 rounded-full bg-muted ${category.color}`}>
            <IconComponent className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-balance">{category.title}</h1>
            <p className="text-muted-foreground text-pretty">{category.description}</p>
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid products={categoryProducts} category={category.title} />
      </main>
    </div>
  )
}

// Generate static params for the three categories
export function generateStaticParams() {
  return [{ slug: "office" }, { slug: "school" }, { slug: "electronics" }]
}
