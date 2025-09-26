import { Header } from "@/components/header"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Headphones, MessageCircle, Shield } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
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
          <span className="text-foreground">Contact</span>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-balance mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            We're here to help! Reach out to us with any questions, concerns, or feedback.
          </p>
        </div>

        {/* Support Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 rounded-lg bg-muted/30">
            <Headphones className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">24/7 Support</h3>
            <p className="text-sm text-muted-foreground">Round-the-clock assistance for all your needs</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-muted/30">
            <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Quick Response</h3>
            <p className="text-sm text-muted-foreground">We respond to all inquiries within 24 hours</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-muted/30">
            <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Secure Communication</h3>
            <p className="text-sm text-muted-foreground">Your information is safe and protected</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1">
            <ContactInfo />
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
