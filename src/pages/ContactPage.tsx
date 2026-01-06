import Navigation from "@/components/Navigation";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            We'd love to hear from you! Get in touch with us.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">Get In Touch</h2>
              <p className="text-muted-foreground mb-8">
                Have questions about our products, need a custom order, or want to discuss your pet's nutritional needs? We're here to help!
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Phone</h3>
                    <p className="text-muted-foreground">+91 98765 43210</p>
                    <p className="text-muted-foreground">+91 98765 43211</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="text-muted-foreground">hello@dumasbakesnmeals.com</p>
                    <p className="text-muted-foreground">orders@dumasbakesnmeals.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Location</h3>
                    <p className="text-muted-foreground">Whitefield, Bengaluru</p>
                    <p className="text-muted-foreground">Karnataka, India - 560066</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Business Hours</h3>
                    <p className="text-muted-foreground">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                    <p className="text-muted-foreground">Sunday: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Your Name</label>
                    <Input placeholder="John Doe" className="rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                    <Input placeholder="+91 98765 43210" className="rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <Input type="email" placeholder="john@example.com" className="rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                  <Input placeholder="How can we help you?" className="rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <Textarea placeholder="Tell us about your pet's needs..." rows={4} className="rounded-xl" />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-6 text-lg font-semibold">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-background py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2024 Dumas 'N' Bismi. All rights reserved. | Premium Pet Nutrition Scheme</p>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
