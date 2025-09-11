import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function ContactInfo() {
  return (
    <div className="space-y-6">
      {/* Contact Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Get in Touch
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-sm text-muted-foreground">
                123 Technology Drive
                <br />
                Innovation District
                <br />
                Tech City, TC 12345
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">support@ntc.com</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Business Hours</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Follow Us</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge
              variant="outline"
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium text-sm">What are your shipping options?</p>
            <p className="text-sm text-muted-foreground">
              We offer free standard shipping on orders over $50, with express options available.
            </p>
          </div>
          <div>
            <p className="font-medium text-sm">Do you offer bulk discounts?</p>
            <p className="text-sm text-muted-foreground">
              Yes! Contact us for special pricing on bulk orders for businesses and schools.
            </p>
          </div>
          <div>
            <p className="font-medium text-sm">What's your return policy?</p>
            <p className="text-sm text-muted-foreground">
              We accept returns within 30 days of purchase for unused items in original packaging.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
