import Navigation from "@/components/Navigation";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { findLeadByEmail, createLead, updateLead, getLeadByName, addCommunication } from "@/services/leadService";

import { useState } from "react";


const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await findLeadByEmail(form.email);
    const leads = res.data.data;

    let leadName;

    if (leads.length > 0) {
      // 🔄 Existing lead
      leadName = leads[0].name;

      await updateLead(leadName, form);
    } else {
      // ➕ New lead
      const newLead = await createLead(form);
      leadName = newLead.data.data.name;
    }

    // 💬 Always add communication (history)
    await addCommunication(leadName, form);

    alert("Message sent successfully ✅");

    setForm({
      name: "",
      phone: "",
      email: "",
      subject: "",
      message: "",
    });

  } catch (error) {
    console.error(error);

    if (error.response?.data?.exc_type === "DuplicateEntryError") {
      alert("This email already exists ⚠️");
    } else {
      alert("Something went wrong ❌");
    }
  }
};
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Your Name</label>
                    <Input
                      placeholder="John Doe"
                      className="rounded-xl"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                    <Input
  name="phone"
  value={form.phone}
  onChange={handleChange}
  placeholder="+91 98765 43210"
/>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                <Input
  type="email"
  name="email"
  value={form.email}
  onChange={handleChange}
  placeholder="john@example.com"
/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
              <Input
  name="subject"
  value={form.subject}
  onChange={handleChange}
  placeholder="How can we help you?"
/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                <Textarea
  name="message"
  value={form.message}
  onChange={handleChange}
  placeholder="Tell us about your pet's needs..."
/>
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
