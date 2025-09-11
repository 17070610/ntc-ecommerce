import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Briefcase, GraduationCap, Smartphone } from "lucide-react"
import Link from "next/link"

const categories = [
  {
    name: "Office",
    description: "Professional workspace essentials",
    icon: Briefcase,
    image: "/modern-office-supplies.jpg",
    itemCount: "500+ items",
    color: "bg-blue-50 text-blue-600",
    href: "/category/office", // Added href for navigation
  },
  {
    name: "School",
    description: "Everything for academic success",
    icon: GraduationCap,
    image: "/school-supplies-and-stationery.jpg",
    itemCount: "300+ items",
    color: "bg-green-50 text-green-600",
    href: "/category/school", // Added href for navigation
  },
  {
    name: "Electronics",
    description: "Latest technology and gadgets",
    icon: Smartphone,
    image: "/modern-electronics.png",
    itemCount: "200+ items",
    color: "bg-purple-50 text-purple-600",
    href: "/category/electronics", // Added href for navigation
  },
]

export function CategoryShowcase() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-balance mb-4">Shop by Category</h2>
          <p className="text-muted-foreground text-pretty max-w-2xl mx-auto">
            Explore our carefully curated collections designed for your specific needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link key={category.name} href={category.href}>
                <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <div
                          className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${category.color} mb-2`}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-bold">{category.name}</h3>
                        <p className="text-sm opacity-90">{category.itemCount}</p>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-muted-foreground mb-4 text-pretty">{category.description}</p>
                      <Button
                        variant="ghost"
                        className="group/btn p-0 h-auto font-medium text-primary hover:text-accent"
                      >
                        Explore {category.name}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
