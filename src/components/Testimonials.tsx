import { Card, CardContent } from "./ui/card";
import { Star } from "lucide-react";
import team1 from "@/assets/team-1.jpg";
import team2 from "@/assets/team-2.jpg";
import team3 from "@/assets/team-3.jpg";

const Testimonials = () => {
  const testimonials = [
    {
      image: team1,
      name: "The Online Food Hub",
      company: "Premium Pet Services",
      text: "Everything you need about quality: from sourcing to delivery, Dumas 'N' Bismi goes above and beyond to ensure the best for our furry companions.",
      bgColor: "bg-pink-100",
    },
    {
      image: team2,
      name: "Food Pyramid Co.",
      company: "Pet Nutrition Experts",
      text: "We've tried many brands, but Dumas 'N' Bismi stands out with their commitment to natural ingredients and exceptional customer service.",
      bgColor: "bg-yellow-100",
    },
    {
      image: team3,
      name: "Jul & Sons Co.",
      company: "Veterinary Clinic",
      text: "As veterinarians, we recommend Dumas 'N' Bismi to our clients for their science-backed nutrition and quality ingredients.",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <section className="py-16 bg-background" style={{ minHeight: "100vh" }}>
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-black text-center text-foreground mb-12">
          What Our Members Speak
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="overflow-hidden hover:shadow-xl transition-all">
              <CardContent className="p-0">
                <div className={`${testimonial.bgColor} h-48 flex items-center justify-center p-4`}>
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-32 h-32 object-cover rounded-3xl shadow-lg"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-bold text-xl">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {testimonial.text}
                  </p>
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={testimonial.image}
                        alt={testimonial.company}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-sm">{testimonial.company}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
