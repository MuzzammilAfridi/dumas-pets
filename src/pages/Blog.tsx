import Navigation from "@/components/Navigation";
import { Calendar, User } from "lucide-react";
import nutritionDog from "@/assets/nutrition-dog.jpg";
import heroDog from "@/assets/hero-dog.jpg";

const blogPosts = [
  {
    id: 1,
    title: "The Importance of Fresh Food for Your Pet's Health",
    excerpt: "Discover why switching from commercial pet food to fresh, home-cooked meals can transform your dog's health and vitality.",
    image: nutritionDog,
    author: "Bismi Anil",
    date: "January 15, 2024",
    category: "Nutrition"
  },
  {
    id: 2,
    title: "Understanding Your Dog's Dietary Needs",
    excerpt: "Every dog is unique. Learn how to identify and cater to your pet's specific nutritional requirements for optimal health.",
    image: heroDog,
    author: "Bismi Anil",
    date: "January 10, 2024",
    category: "Health"
  },
  {
    id: 3,
    title: "Common Food Allergies in Dogs and How to Avoid Them",
    excerpt: "Many dogs suffer from food allergies caused by commercial pet foods. Here's what you need to know to keep your pet safe.",
    image: nutritionDog,
    author: "Bismi Anil",
    date: "January 5, 2024",
    category: "Health"
  },
  {
    id: 4,
    title: "Celebrating Your Pet's Birthday with Healthy Treats",
    excerpt: "Make your furry friend's special day memorable with delicious, nutritious birthday cakes and treats.",
    image: heroDog,
    author: "Bismi Anil",
    date: "December 28, 2023",
    category: "Celebrations"
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Our Blog
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Tips, insights, and stories about pet nutrition and wellness
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
                    {post.category}
                  </span>
                  <h2 className="text-xl font-bold text-foreground mb-3 hover:text-primary transition-colors cursor-pointer">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                  </div>
                </div>
              </article>
            ))}
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

export default Blog;
