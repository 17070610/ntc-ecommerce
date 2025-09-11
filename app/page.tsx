import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProductCarousel } from "@/components/product-carousel"
import { CategoryShowcase } from "@/components/category-showcase"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ProductCarousel />
        <CategoryShowcase />
      </main>
    </div>
  )
}
