import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Heart, Stethoscope, Sparkles, Phone, ShieldCheck, Upload } from "lucide-react";
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  Ticket,
  Users,
  Utensils,
  Salad,
  Apple,
  AlertCircle,
  Cookie,
  Scale,
  Instagram,
  Twitter,
  Linkedin,
  Star,
  PawPrint,
  Mail,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const event = {
  id: "1",
  title: "Pet Nutrition Workshop",
  category: "Workshop",
  subtitle:
    "Join our expert nutritionists and veterinarians for an interactive session on preparing healthy meals for your pets.",
  date: "February 15, 2024",
  time: "10:00 AM - 1:00 PM",
  location: "Whitefield Community Center, Bengaluru",
  fee: "Free Entry",
  seats: "32 Seats Left",
  image:
    "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1600&q=80",
};

const learnTopics = [
  { icon: Salad, title: "Pet Nutrition Basics", desc: "Understanding macros, micros, and balanced bowls." },
  { icon: Utensils, title: "Meal Planning", desc: "Build weekly meal plans tailored to your pet." },
  { icon: Apple, title: "Healthy Ingredients", desc: "Discover safe, fresh, and seasonal foods." },
  { icon: AlertCircle, title: "Food Allergies", desc: "Identify triggers and safer alternatives." },
  { icon: Cookie, title: "Homemade Treats", desc: "Easy, vet-approved recipes you can bake." },
  { icon: Scale, title: "Portion Management", desc: "Right portions for breed, age & activity." },
];

const schedule = [
  { time: "10:00 AM", title: "Welcome Session", desc: "Registration, breakfast bites & introductions." },
  { time: "10:30 AM", title: "Pet Nutrition Basics", desc: "Core principles of feeding well." },
  { time: "11:30 AM", title: "Live Meal Preparation", desc: "Hands-on cooking with our chefs." },
  { time: "12:15 PM", title: "Q&A Session", desc: "Ask our vets anything." },
  { time: "1:00 PM", title: "Networking & Snacks", desc: "Connect with the community." },
];

const speakers = [
  {
    name: "Dr. Anita Rao",
    role: "Veterinarian",
    bio: "15+ years guiding pets to lifelong wellness.",
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Bismi Anil",
    role: "Pet Nutrition Expert",
    bio: "Founder, Dumas 'N' Bismi. Fresh-food advocate.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Karan Mehta",
    role: "Animal Wellness Coach",
    bio: "Behavior, movement & holistic care specialist.",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
  },
];

const gallery = [
  "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
];

const testimonials = [
  { name: "Priya S.", rating: 5, text: "Truly enriching session. My dog has never eaten better!" },
  { name: "Rahul K.", rating: 5, text: "Loved the live cooking demo. Practical and warm community." },
  { name: "Meera J.", rating: 4, text: "Great speakers and friendly atmosphere. Highly recommend." },
];

const faqs = [
  { q: "Is this event beginner friendly?", a: "Absolutely — sessions are designed for all experience levels." },
  { q: "Can I bring my pet?", a: "Yes! Well-behaved, leashed pets are welcome." },
  { q: "Will food be provided?", a: "Light snacks and beverages are included." },
  { q: "Do I need prior experience?", a: "No prior cooking or nutrition experience required." },
];

const related = [
  {
    id: 2,
    title: "Adoption Drive & Pet Fair",
    date: "Feb 28, 2024",
    desc: "Meet adoptable pets and enjoy community fun.",
    img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Healthy Treats Baking Class",
    date: "Mar 10, 2024",
    desc: "Bake nutritious treats with our expert team.",
    img: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Annual Pet Health Camp",
    date: "Mar 25, 2024",
    desc: "Free vet checkups & nutrition consults.",
    img: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80",
  },
];

const EventDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submittingRegister, setSubmittingRegister] = useState(false);
  const [submittingNewsletter, setSubmittingNewsletter] = useState(false);
  const registerFormRef = useRef<HTMLFormElement>(null);
  const newsletterFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [id]);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittingRegister(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Your spot is reserved! Check your email for details.");
      registerFormRef.current?.reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmittingRegister(false);
    }
  };

  const handleNewsletter = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittingNewsletter(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success("Subscribed! Welcome to the pack.");
      newsletterFormRef.current?.reset();
    } catch {
      toast.error("Subscription failed. Please try again.");
    } finally {
      setSubmittingNewsletter(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-10 space-y-6">
          <Skeleton className="h-[60vh] w-full rounded-2xl" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

      {/* HERO */}
      <section className="relative h-[60vh] min-h-[420px] sm:h-[70vh] sm:min-h-[520px] w-full overflow-visible pb-24 lg:pb-32">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
        <div className="relative z-10 flex h-full items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-center text-white animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/90 px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-semibold backdrop-blur">
              <Tag className="h-3.5 w-3.5" /> {event.category}
            </span>
            <h1 className="mt-4 sm:mt-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight break-words">
              {event.title}
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-white/85 px-2">
              {event.subtitle}
            </p>
            <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-white/90">
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{event.date}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{event.time}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{event.location}</span>
            </div>
            <Button
              size="lg"
              variant="default"
              asChild
              className="mt-6 sm:mt-8 w-full sm:w-auto rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <a href="#register">Register Now</a>
            </Button>
          </div>
        </div>

        {/* Floating glass info card */}
        <div className="absolute bottom-[-60px] left-1/2 z-20 hidden w-[92%] max-w-5xl -translate-x-1/2 md:block animate-float-in">
          <div className="rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 p-5 sm:p-6 shadow-2xl">
            <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center text-white">
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/70">Date</p>
                <p className="text-sm sm:text-base font-semibold">{event.date}</p>
              </div>
              <div className="border-x border-white/30">
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/70">Time</p>
                <p className="text-sm sm:text-base font-semibold">{event.time}</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/70">Entry</p>
                <p className="text-sm sm:text-base font-semibold">{event.fee}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK INFO */}
      <section className="bg-secondary/30 pt-24 pb-12 sm:pb-16 lg:pt-32 lg:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
            {[
              { icon: Calendar, label: "Date", value: event.date },
              { icon: Clock, label: "Time", value: event.time },
              { icon: MapPin, label: "Venue", value: "Whitefield, Bengaluru" },
              { icon: Tag, label: "Event Type", value: event.category },
              { icon: Ticket, label: "Entry Fee", value: event.fee },
              { icon: Users, label: "Seats", value: event.seats },
            ].map((it) => (
              <Card
                key={it.label}
                className="h-full rounded-2xl border-white/30 bg-white/60 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                <CardContent className="flex h-full flex-col items-center gap-2 p-4 sm:p-5 text-center">
                  <div className="rounded-xl bg-primary/10 p-2.5 sm:p-3 text-primary">
                    <it.icon className="h-5 w-5" />
                  </div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">{it.label}</p>
                  <p className="text-xs sm:text-sm font-semibold text-foreground break-words">{it.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-background py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto grid grid-cols-1 items-center gap-8 sm:gap-10 lg:gap-12 px-4 sm:px-6 lg:px-8 lg:grid-cols-2">
          <div>
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-primary">About the Event</span>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-foreground break-words">
              A warm afternoon of fresh food, real science, and great company.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Spend the morning with vets, nutritionists, and fellow pet parents as we
              unpack everything you need to feed your pet better — from ingredient
              sourcing to portioning, allergies, and home-baked treats.
            </p>
            <ul className="mt-6 space-y-3 text-sm sm:text-base text-foreground">
              <li className="flex items-start gap-3"><PawPrint className="mt-1 h-4 w-4 shrink-0 text-primary" /> Hands-on meal prep demonstrations</li>
              <li className="flex items-start gap-3"><PawPrint className="mt-1 h-4 w-4 shrink-0 text-primary" /> Personalised Q&A with veterinarians</li>
              <li className="flex items-start gap-3"><PawPrint className="mt-1 h-4 w-4 shrink-0 text-primary" /> Take-home recipe booklet & samples</li>
              <li className="flex items-start gap-3"><PawPrint className="mt-1 h-4 w-4 shrink-0 text-primary" /> Community networking with snacks</li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-lg aspect-[4/3] lg:aspect-auto lg:h-full">
            <img
              src="https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=1200&q=80"
              alt="About event"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.05]"
            />
          </div>
        </div>
      </section>

      {/* LEARN */}
      <section className="bg-secondary/30 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">What You Will Learn</h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">Practical skills you can apply the moment you get home.</p>
          </div>
          <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {learnTopics.map((t) => (
              <Card
                key={t.title}
                className="group h-full rounded-2xl border-0 bg-card shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <t.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">{t.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SCHEDULE TIMELINE */}
      <section className="bg-background py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Event Schedule</h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">A relaxed flow with plenty of time for questions.</p>
          </div>
          <div className="relative mx-auto mt-10 sm:mt-12 max-w-3xl">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20 md:left-1/2" />
            <div className="space-y-6 sm:space-y-8">
              {schedule.map((s, i) => (
                <div
                  key={s.time}
                  className={`relative flex flex-col gap-4 md:flex-row md:items-center ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="absolute left-4 -translate-x-1/2 md:left-1/2">
                    <div className="h-4 w-4 rounded-full border-4 border-background bg-primary shadow-lg" />
                  </div>
                  <div className="ml-12 md:ml-0 md:w-1/2 md:px-8">
                    <Card className="h-full rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl">
                      <CardContent className="p-4 sm:p-5">
                        <p className="text-sm font-bold text-primary">{s.time}</p>
                        <h4 className="mt-1 text-base sm:text-lg font-semibold text-foreground break-words">{s.title}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SPEAKERS */}
      <section className="bg-secondary/30 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Guest Speakers</h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">Industry experts who'll guide our sessions.</p>
          </div>
          <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {speakers.map((s) => (
              <Card
                key={s.name}
                className="h-full rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <CardContent className="p-6 text-center">
                  <img
                    src={s.img}
                    alt={s.name}
                    loading="lazy"
                    className="mx-auto h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover ring-4 ring-primary/20"
                  />
                  <h3 className="mt-4 text-base sm:text-lg font-semibold text-foreground break-words">{s.name}</h3>
                  <p className="text-sm font-medium text-primary">{s.role}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{s.bio}</p>
                  <div className="mt-4 flex items-center justify-center gap-4 text-muted-foreground">
                    <a href="#" aria-label="Instagram" className="p-2 -m-2 hover:text-primary"><Instagram className="h-4 w-4" /></a>
                    <a href="#" aria-label="Twitter" className="p-2 -m-2 hover:text-primary"><Twitter className="h-4 w-4" /></a>
                    <a href="#" aria-label="LinkedIn" className="p-2 -m-2 hover:text-primary"><Linkedin className="h-4 w-4" /></a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-background py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Event Gallery</h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">Moments from our past community gatherings.</p>
          </div>
          <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            {gallery.map((src, i) => (
              <div
                key={src}
                className={`group relative aspect-square overflow-hidden rounded-2xl shadow-lg ${
                  i === 0 ? "md:col-span-2 md:row-span-2 md:aspect-auto" : ""
                }`}
              >
                <img
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REGISTRATION */}
      <section id="register" className="bg-secondary/30 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Reserve Your Spot</h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground">Seats are limited — register to confirm your place.</p>
            </div>
            <Card className="mt-8 sm:mt-10 rounded-2xl shadow-lg">
              <CardContent className="p-5 sm:p-6 md:p-8">
                <form ref={registerFormRef} onSubmit={handleRegister} className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" required placeholder="Your name" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" required placeholder="you@example.com" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" required placeholder="+91 98765 43210" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="count">Number of Attendees</Label>
                      <Input id="count" type="number" min={1} defaultValue={1} className="rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="msg">Message (optional)</Label>
                    <Textarea id="msg" placeholder="Anything you'd like us to know" className="rounded-xl" />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    variant="default"
                    disabled={submittingRegister}
                    className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {submittingRegister ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Reserving...
                      </>
                    ) : (
                      "Reserve My Spot"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-background py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">What Attendees Say</h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">Real feedback from our pet-parent community.</p>
          </div>
          <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="h-full rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                      {t.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground break-words">{t.name}</p>
                      <div className="flex">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground break-words">"{t.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary/30 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Frequently Asked</h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">Everything you need to know before joining.</p>
          </div>
          <Accordion type="single" collapsible className="mt-8 sm:mt-10 space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="rounded-2xl border-0 bg-card px-4 sm:px-5 shadow-lg"
              >
                <AccordionTrigger className="text-left text-sm sm:text-base text-foreground hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* RELATED */}
      <section className="bg-background py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Related Events</h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">More ways to learn and connect.</p>
          </div>
          <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <Card key={r.id} className="group flex h-full flex-col overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={r.img}
                    alt={r.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <CardContent className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">{r.date}</p>
                  <h3 className="mt-2 text-base sm:text-lg font-semibold text-foreground break-words">{r.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
                  <Button asChild className="mt-auto pt-0 w-full rounded-xl">
                    <Link to={`/events/${r.id}`} className="mt-4">Register</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="px-4 sm:px-6 lg:px-8 pb-28 md:pb-16 lg:pb-20">
        <div className="container mx-auto">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/70 p-6 sm:p-10 md:p-14 shadow-xl">
            <div className="mx-auto max-w-2xl text-center text-primary-foreground">
              <Mail className="mx-auto h-7 w-7 sm:h-8 sm:w-8 opacity-90" />
              <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold break-words">
                Stay Updated on Upcoming Pet Events
              </h2>
              <p className="mt-3 text-sm sm:text-base text-primary-foreground/85">
                Join our community and never miss workshops, adoption drives, and wellness camps.
              </p>
              <form
                ref={newsletterFormRef}
                onSubmit={handleNewsletter}
                className="mt-6 flex flex-col gap-3 sm:flex-row"
              >
                <Input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full rounded-xl bg-white/95 text-foreground"
                />
                <Button
                  type="submit"
                  variant="default"
                  disabled={submittingNewsletter}
                  className="w-full sm:w-auto rounded-xl bg-background text-primary hover:bg-background/90 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold"
                >
                  {submittingNewsletter ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Subscribing...
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY MOBILE CTA */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 px-3 pt-3 backdrop-blur-md shadow-2xl md:hidden"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Entry</p>
            <p className="font-bold text-foreground truncate">{event.fee}</p>
          </div>
          <Button asChild className="flex-1 rounded-xl" size="lg">
            <a href="#register">Register Now</a>
          </Button>
        </div>
      </div>

      <footer className="bg-foreground py-6 text-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs sm:text-sm break-words">© 2024 Dumas 'N' Bismi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default EventDetails;
