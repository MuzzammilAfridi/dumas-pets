import Navigation from "@/components/Navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    category: "Products & Ingredients",
    questions: [
      {
        question: "What ingredients do you use in your pet food?",
        answer: "We use only human-grade quality ingredients including fresh meats, vegetables, and grains. All our ingredients are sourced locally and are free from preservatives, artificial colors, and meat waste commonly found in commercial pet foods."
      },
      {
        question: "Are your products suitable for dogs with allergies?",
        answer: "Yes! We offer customizable meal plans that can accommodate various dietary restrictions and allergies. Please contact us with your pet's specific needs, and we'll create a suitable meal plan."
      },
      {
        question: "How long do your products stay fresh?",
        answer: "Our fresh meals stay good for 3-5 days when refrigerated and up to 3 months when frozen. Treats and cakes have varying shelf lives depending on the product - detailed information is provided with each order."
      }
    ]
  },
  {
    category: "Ordering & Delivery",
    questions: [
      {
        question: "What areas do you deliver to?",
        answer: "We currently deliver across Bengaluru. For areas outside our regular delivery zones, please contact us to discuss shipping options."
      },
      {
        question: "How do I place an order?",
        answer: "You can place orders through our website, via WhatsApp, or by calling us directly. For customized meal plans, we recommend scheduling a consultation first."
      },
      {
        question: "What are your delivery timelines?",
        answer: "Standard orders are delivered within 2-3 business days. Custom cakes require 48-72 hours advance notice. Rush orders may be available - please contact us for availability."
      }
    ]
  },
  {
    category: "Nutrition & Health",
    questions: [
      {
        question: "How do I transition my pet to your food?",
        answer: "We recommend a gradual transition over 7-10 days. Start by mixing 25% of our food with 75% of their current food, gradually increasing the ratio. This helps prevent digestive upset."
      },
      {
        question: "Do you offer consultation services?",
        answer: "Yes! We offer free nutrition consultations to help you understand your pet's dietary needs and create a customized meal plan. Book a consultation through our contact page."
      },
      {
        question: "Is home-cooked food better than commercial pet food?",
        answer: "Fresh, home-cooked meals made with quality ingredients can offer numerous benefits including better digestion, improved coat health, increased energy, and fewer allergies. Our founder started this journey after seeing the positive impact on her own Labradors."
      }
    ]
  },
  {
    category: "Special Occasions",
    questions: [
      {
        question: "Can you make custom birthday cakes for my pet?",
        answer: "Absolutely! We specialize in custom birthday cakes that are not only beautiful but also healthy and safe for your pets. Share your ideas with us, and we'll create something special."
      },
      {
        question: "Do you cater for pet parties and events?",
        answer: "Yes, we offer catering services for pet parties, adoption events, and other pet-friendly gatherings. Contact us at least one week in advance for event catering."
      }
    ]
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Find answers to common questions about our products and services
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">{category.category}</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${categoryIndex}-${index}`}
                    className="bg-card rounded-2xl px-6 border-none shadow-sm"
                  >
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            We're here to help! Reach out to us anytime.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-background text-foreground px-8 py-3 rounded-full font-semibold hover:bg-background/90 transition-colors"
          >
            Contact Us
          </a>
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

export default FAQ;
