import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  User,
  Quote,
  AlertTriangle,
  Leaf,
  Heart,
  Sparkles,
  Facebook,
  Twitter,
  Instagram,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import heroDog from "@/assets/hero-dog.jpg";
import nutritionDog from "@/assets/nutrition-dog.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import team1 from "@/assets/team-1.jpg";

const blogPosts: Record<string, any> = {
  "1": {
    id: 1,
    title: "The Importance of Fresh Food for Your Pet's Health",
    subtitle:
      "Discover why switching to fresh home-cooked meals can transform your dog's overall health and energy levels.",
    image: nutritionDog,
    author: "Bismi Anil",
    date: "January 15, 2026",
    readTime: "6 min read",
    category: "Nutrition",
  },
};

const ingredientsToAvoid = [
  { icon: AlertTriangle, title: "Artificial Preservatives", desc: "Linked to long-term health concerns." },
  { icon: AlertTriangle, title: "Excess Fillers", desc: "Empty calories with little nutrition." },
  { icon: AlertTriangle, title: "Added Sugar", desc: "Causes obesity and dental decay." },
  { icon: AlertTriangle, title: "Harmful Additives", desc: "Artificial colors and flavor enhancers." },
];

const healthyIngredients = [
  { name: "Chicken", img: product1, benefit: "Lean protein for muscle growth" },
  { name: "Pumpkin", img: product2, benefit: "Aids digestion & gut health" },
  { name: "Rice", img: product3, benefit: "Gentle, easy-to-digest energy" },
  { name: "Carrots", img: product4, benefit: "Rich in beta-carotene & fiber" },
  { name: "Eggs", img: product1, benefit: "Complete amino acid profile" },
  { name: "Fish Oil", img: product2, benefit: "Omega-3 for shiny coat" },
];

const galleryImages = [heroDog, nutritionDog, product1, product2];

const relatedPosts = [
  {
    id: 2,
    title: "Understanding Your Dog's Dietary Needs",
    excerpt: "Every dog is unique. Learn how to cater to your pet's nutritional requirements.",
    image: heroDog,
    category: "Health",
  },
  {
    id: 3,
    title: "Common Food Allergies in Dogs",
    excerpt: "What to know to keep your pet safe from food-related allergies.",
    image: nutritionDog,
    category: "Health",
  },
  {
    id: 4,
    title: "Celebrating Your Pet's Birthday Healthily",
    excerpt: "Make your furry friend's day special with nutritious birthday treats.",
    image: heroDog,
    category: "Celebrations",
  },
];

const dummyComments = [
  {
    name: "Priya Sharma",
    date: "2 days ago",
    text: "This article completely changed how I feed my Labrador. Thank you Bismi!",
    avatar: team1,
  },
  {
    name: "Rahul Verma",
    date: "5 days ago",
    text: "Switched to fresh meals last month and my pup's coat is noticeably shinier.",
    avatar: team1,
  },
];

const BlogDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const post = blogPosts[id || "1"] || blogPosts["1"];

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return () => clearTimeout(t);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-12 space-y-6">
          <Skeleton className="h-[60vh] w-full rounded-2xl" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* 2. Hero Banner */}
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden group">
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 text-white">
          <span className="inline-block px-4 py-1.5 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-bold tracking-widest uppercase rounded-full mb-5 shadow-lg">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black max-w-4xl leading-tight mb-4 drop-shadow-lg">
            {post.title}
          </h1>
          <p className="text-base md:text-lg text-white/90 max-w-2xl mb-6">{post.subtitle}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/80">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{post.author}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{post.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* 3. Article Content */}
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        <p className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-10 font-medium">
          Every pet parent dreams of seeing their dog happy, energetic, and full of life. What we put in their bowl
          plays a bigger role than most of us realize. Switching from processed commercial food to fresh, nutrient-rich
          meals can be the single most powerful step toward better health.
        </p>

        {/* Section 1 */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Leaf className="w-7 h-7 text-primary" />
            Why Fresh Food Matters
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-foreground/80 leading-relaxed">
              <p>Fresh, whole ingredients retain the vitamins, enzymes, and proteins that pets need to thrive — nutrients that high-heat processing often destroys.</p>
              <ul className="space-y-2 pl-1">
                {["Better digestion & gut health", "Higher daily energy levels", "Shinier, softer coat", "Stronger immunity", "Healthier weight"].map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <img src={heroDog} alt="Happy healthy dog" loading="lazy" className="rounded-2xl shadow-lg w-full object-cover aspect-[4/3] hover:scale-[1.02] transition-all duration-300" />
          </div>
        </section>

        {/* Section 2 */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-destructive" />
            Ingredients to Avoid
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {ingredientsToAvoid.map((i) => (
              <div key={i.title} className="bg-destructive/5 border border-destructive/20 rounded-2xl p-5 flex gap-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <i.icon className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{i.title}</h3>
                  <p className="text-sm text-muted-foreground">{i.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-primary" />
            Recommended Healthy Ingredients
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {healthyIngredients.map((ing) => (
              <div key={ing.name} className="bg-card rounded-2xl p-5 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3 ring-4 ring-primary/10">
                  <img src={ing.img} alt={ing.name} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-foreground">{ing.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{ing.benefit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Quote */}
        <section className="my-16">
          <div className="relative bg-primary/5 border border-primary/20 rounded-2xl p-10 md:p-12 text-center">
            <Quote className="w-12 h-12 text-primary/30 mx-auto mb-4" />
            <p className="text-xl md:text-2xl italic font-medium text-foreground leading-relaxed max-w-2xl mx-auto">
              "Healthy food is not an expense, it is an investment in your pet's long and happy life."
            </p>
            <p className="mt-4 text-sm font-semibold text-primary tracking-wide uppercase">— Bismi Anil</p>
          </div>
        </section>

        {/* 6. Gallery */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Moments of Joy</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, idx) => (
              <div key={idx} className={`overflow-hidden rounded-2xl shadow-md ${idx === 0 ? "col-span-2 row-span-2" : ""}`}>
                <img src={img} alt={`gallery-${idx}`} loading="lazy" className="w-full h-full object-cover aspect-square hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </section>

        {/* 7. Author Card */}
        <section className="mb-16">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <img src={team1} alt={post.author} className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Author</p>
              <h3 className="text-2xl font-bold text-foreground">{post.author}</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Pet nutritionist and founder of Dumas 'N' Bismi. Passionate about helping pets live longer, healthier lives through fresh, wholesome meals.
              </p>
              <div className="flex gap-3 mt-4 justify-center md:justify-start">
                {[Facebook, Twitter, Instagram].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary flex items-center justify-center transition-all">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </article>

      {/* 8. Related Posts */}
      <section className="bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">You Might Also Like</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {relatedPosts.map((p) => (
              <Link to={`/blog/${p.id}`} key={p.id} className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="overflow-hidden aspect-[16/10]">
                  <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">{p.category}</span>
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{p.excerpt}</p>
                  <span className="text-sm font-semibold text-primary inline-flex items-center gap-1">
                    Read More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Comments */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
          <MessageCircle className="w-7 h-7 text-primary" /> Comments
        </h2>
        <form className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm space-y-4 mb-10">
          <div className="grid md:grid-cols-2 gap-4">
            <Input placeholder="Your name" />
            <Input type="email" placeholder="Your email" />
          </div>
          <Textarea placeholder="Share your thoughts..." rows={4} />
          <Button type="button" className="w-full md:w-auto">Post Comment</Button>
        </form>

        <div className="space-y-5">
          {dummyComments.map((c, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 flex gap-4 shadow-sm hover:shadow-md transition-all">
              <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h4 className="font-bold text-foreground">{c.name}</h4>
                  <span className="text-xs text-muted-foreground">• {c.date}</span>
                </div>
                <p className="text-sm text-foreground/80">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Newsletter */}
      <section className="container mx-auto px-4 pb-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-secondary p-10 md:p-14 text-center text-primary-foreground shadow-xl">
          <Heart className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl md:text-4xl font-black mb-3">Get Weekly Pet Nutrition Tips</h2>
          <p className="text-primary-foreground/90 max-w-xl mx-auto mb-6">
            Join our newsletter for healthy recipes, pet wellness tips, and expert advice — straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <Input type="email" placeholder="Enter your email" className="bg-background text-foreground" />
            <Button type="button" variant="secondary" className="font-bold">Subscribe</Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2026 Dumas 'N' Bismi. All rights reserved. | Premium Pet Nutrition Scheme</p>
        </div>
      </footer>
    </div>
  );
};

export default BlogDetails;
