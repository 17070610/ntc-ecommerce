import { Header } from "@/components/header"
import { ProductGrid } from "@/components/category/product-grid"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// Category definitions
const categoryInfo = {
    office: {
        title: "Office Supplies",
        description: "Professional workspace essentials for productivity and comfort",
        color: "text-blue-600",
    },
    school: {
        title: "School Supplies",
        description: "Everything you need for academic success and learning",
        color: "text-green-600",
    },
    electronics: {
        title: "Electronics",
        description: "Latest technology and gadgets for work and entertainment",
        color: "text-purple-600",
    },
}

interface CategoryPageProps {
    params: {
        slug: string
    }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = params
    const categoryKey = slug.toLowerCase() as keyof typeof categoryInfo
    const category = categoryInfo[categoryKey]

    if (!category) {
        return (
            <div className="min-h-screen bg-background">
                <Header user={null} />
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

    // Build a safe API URL (works in dev + prod)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const res = await fetch(`${baseUrl}/api/products`, {
        cache: "no-store", // always fetch fresh data
    })

    if (!res.ok) {
        throw new Error("Failed to fetch products")
    }

    const { data: allProducts = [] } = await res.json()

    // Filter products by category with safe check
    const categoryProducts = allProducts.filter(
        (product: any) =>
            product.category?.toLowerCase() === categoryKey
    )

    return (
        <div className="min-h-screen bg-background">
            <Header user={null} />
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
                    <div className={`p-3 rounded-full bg-muted ${category.color}`}></div>
                    <div>
                        <h1 className="text-3xl font-bold">{category.title}</h1>
                        <p className="text-muted-foreground">{category.description}</p>
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