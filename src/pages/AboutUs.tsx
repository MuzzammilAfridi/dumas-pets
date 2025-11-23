import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Award, Heart, Users, Target } from "lucide-react";
import nutritionDog from "@/assets/nutrition-dog.jpg";
import team1 from "@/assets/team-1.jpg";
import team2 from "@/assets/team-2.jpg";
import heroDog from "@/assets/hero-dog.jpg";

const AboutUs = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-black text-primary-foreground text-center mb-6">
            About DumasBakesnMeals
          </h1>
          <p className="text-xl text-primary-foreground/90 text-center max-w-3xl mx-auto">
            Where Passion for Pets Meets Nutritional Excellence
          </p>
        </div>
      </section>

      {/* Section 1: Our Founder's Story */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-bold text-foreground">Our Founder's Story</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">DumasBakesnMeals</strong> is founded by <strong className="text-foreground">Bismi Anil</strong>, 
                  a dedicated IT professional who made a remarkable transition into animal welfare activism. For over five years, Bismi has been 
                  an avid animal lover and rescuer based in Bengaluru, touching the lives of countless pets and their families.
                </p>
                <p>
                  What started as a personal mission has evolved into a professional calling. Bismi's journey began with her own experiences as a 
                  pet parent and her extensive work rescuing and caring for animals in need. Her deep understanding of animal behavior and genuine 
                  compassion for their wellbeing set the foundation for what would become DumasBakesnMeals.
                </p>
                <p>
                  Through her work with <strong className="text-foreground">Dumas Animal Welfare Trust</strong>, which she co-founded, Bismi continues 
                  to support animal welfare operations in Whitefield and neighboring areas, making a tangible difference in the lives of animals who 
                  need it most.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src={team1} 
                alt="Bismi Anil - Founder of DumasBakesnMeals" 
                className="w-full h-[500px] object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: The Birth of DumasBakesnMeals */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <img 
                src={nutritionDog} 
                alt="Fresh and nutritious pet food" 
                className="w-full h-[500px] object-cover rounded-lg shadow-2xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-8 h-8 text-primary-foreground" />
                <h2 className="text-4xl font-bold text-primary-foreground">The Birth of DumasBakesnMeals</h2>
              </div>
              <div className="space-y-4 text-primary-foreground/90 leading-relaxed">
                <p>
                  Through her interactions with hundreds of pets and closely studying their dietary habits, Bismi made a concerning discovery: 
                  many common pet ailments could be directly attributed to the long-term consumption of commercial pet foods. These products often 
                  contain large amounts of preservatives, artificial additives, and meat waste that compromise the health and vitality of our 
                  beloved companions.
                </p>
                <p>
                  The turning point came when her own pet Labradors began experiencing health issues after prolonged use of commercial food. 
                  This personal experience, combined with her professional observations, ignited a passion to create something better—something 
                  that would truly nourish pets from the inside out.
                </p>
                <p>
                  <strong>DumasBakesnMeals was born from this passion</strong>—a commitment to provide nutritious, home-cooked meals for pets 
                  using wholesome, real food made with human-grade quality ingredients. Every recipe has been carefully crafted and tested, 
                  with proven formulas that have been loved by hundreds of dogs over multiple years.
                </p>
                <p className="font-semibold">
                  We believe in the transformative power of proper nutrition and the importance of feeding our pets the way nature intended.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Recognition & Media Coverage */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-bold text-foreground">Recognition & Impact</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">DumasBakesnMeals</strong> has been featured in <strong className="text-foreground">PolkaCafe.com</strong> as 
                  one of the top pet food caterers in Bengaluru, a testament to our commitment to quality and customer satisfaction.
                </p>
                <p>
                  In recognition of her extraordinary efforts toward social work and animal welfare activities, Bismi has received numerous 
                  prestigious accolades, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-foreground">C.J. Memorial Community Guardian Award</strong></li>
                  <li>Voted as Bangalore's <strong className="text-foreground">"Most Wanted for the Year 2015"</strong> by Radio Red FM</li>
                </ul>
                <p>
                  Her groundbreaking work has been featured in leading media publications including <strong className="text-foreground">Femina, 
                  Times of India, DNA India, Bangalore Mirror, The Better India, Deccan Chronicle, HeadsUp for Tails, Live Mint, Asian Age, 
                  and Leap Magazine</strong>. She has also appeared on prominent television channels such as <strong className="text-foreground">NDTV 
                  and News 18</strong>, sharing her insights on animal welfare and pet nutrition.
                </p>
                <p>
                  Her work has even gained international recognition, being featured on <strong className="text-foreground">www.caninetherapy.co.uk</strong>, 
                  showcasing the global relevance of her mission.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src={team2} 
                alt="Award and recognition" 
                className="w-full h-[500px] object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Our Mission */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <img 
                src={heroDog} 
                alt="Happy and healthy pets" 
                className="w-full h-[500px] object-cover rounded-lg shadow-2xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-primary-foreground" />
                <h2 className="text-4xl font-bold text-primary-foreground">Our Mission & Values</h2>
              </div>
              <div className="space-y-4 text-primary-foreground/90 leading-relaxed">
                <p className="text-xl font-semibold">
                  At DumasBakesnMeals, we strongly believe in the critical importance of nutrition and feeding our pets wholesome, 
                  real food made with human-grade quality ingredients.
                </p>
                <p>
                  Our philosophy is simple yet powerful: pets deserve the same quality of food that we would eat ourselves. Every meal 
                  we create is a labor of love, formulated with scientifically-backed nutritional principles and perfected through years 
                  of real-world testing with hundreds of satisfied dogs.
                </p>
                <p>
                  We are committed to transparency in our ingredients, sustainability in our practices, and excellence in our service. 
                  Each recipe is carefully balanced to provide optimal nutrition while being delicious enough to make even the pickiest 
                  eaters excited for mealtime.
                </p>
                <div className="bg-primary-foreground/10 p-6 rounded-lg border-l-4 border-primary-foreground">
                  <p className="font-semibold text-primary-foreground text-lg">
                    Making a Difference Beyond Nutrition
                  </p>
                  <p className="mt-2">
                    A portion of all revenues from DumasBakesnMeals directly supports animal welfare activities through the Dumas Animal 
                    Welfare Trust. When you choose our meals for your pet, you're not just investing in their health—you're also helping 
                    animals in need across our community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Ready to Give Your Pet the Nutrition They Deserve?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied pet parents who have seen the difference real, wholesome food can make.
          </p>
          <Button size="lg" className="text-lg px-8" onClick={() => window.location.href = '/#shop'}>
            Explore Our Products
          </Button>
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

export default AboutUs;
