// Mock ERPNext-compatible Blog data layer.
// Mirrors ERPNext doctypes: Blog Post, Blog Category, Blogger.

export interface BlogCategory {
  name: string; // ERPNext primary key
  title: string;
  published: 1 | 0;
}

export interface Blogger {
  name: string;
  full_name: string;
  short_name: string;
  avatar?: string;
  bio?: string;
}

export type ContentType = "Markdown" | "HTML" | "Rich Text";

export interface BlogPost {
  name: string; // ERPNext primary key (slug-ish)
  title: string;
  blog_intro: string;
  blog_category: string; // FK -> BlogCategory.name
  blogger: string;       // FK -> Blogger.name
  published: 1 | 0;
  featured: 1 | 0;
  published_on: string;  // ISO date
  route: string;
  meta_title?: string;
  meta_description?: string;
  meta_image?: string;
  cover_image?: string;
  content_type: ContentType;
  content: string;
  read_time?: number; // minutes
  email_notification?: 1 | 0;
  disable_comments?: 1 | 0;
  disable_likes?: 1 | 0;
  hide_cta?: 1 | 0;
}

export type CreateBlogPayload = Omit<BlogPost, "name"> & { name?: string };
export type UpdateBlogPayload = Partial<BlogPost> & { name: string };

export const mockCategories: BlogCategory[] = [
  { name: "nutrition", title: "Nutrition", published: 1 },
  { name: "training", title: "Training", published: 1 },
  { name: "health", title: "Pet Health", published: 1 },
  { name: "lifestyle", title: "Lifestyle", published: 1 },
  { name: "recipes", title: "Recipes & Treats", published: 1 },
];

export const mockBloggers: Blogger[] = [
  {
    name: "dr-meera",
    full_name: "Dr. Meera Iyer",
    short_name: "Meera",
    avatar: "https://i.pravatar.cc/120?img=47",
    bio: "Veterinary nutritionist with 12+ years of experience.",
  },
  {
    name: "rohan-k",
    full_name: "Rohan Kapoor",
    short_name: "Rohan",
    avatar: "https://i.pravatar.cc/120?img=12",
    bio: "Dog trainer & behaviourist.",
  },
  {
    name: "ananya-s",
    full_name: "Ananya Shah",
    short_name: "Ananya",
    avatar: "https://i.pravatar.cc/120?img=32",
    bio: "Pet parent, recipe developer for home-cooked meals.",
  },
];

export const mockBlogPosts: BlogPost[] = [
  {
    name: "balanced-bowl-for-adult-dogs",
    title: "Building a Balanced Bowl for Adult Dogs",
    blog_intro:
      "What goes into a complete, vet-approved meal for an adult dog — and why portions matter as much as ingredients.",
    blog_category: "nutrition",
    blogger: "dr-meera",
    published: 1,
    featured: 1,
    published_on: "2026-05-12",
    route: "blog/balanced-bowl-for-adult-dogs",
    meta_title: "Balanced Dog Bowl Guide | Dumas Pets",
    meta_description:
      "A step-by-step nutritionist's guide to building a balanced meal for adult dogs at home.",
    meta_image:
      "https://images.unsplash.com/photo-1558944351-c61f9a3a9b3a?w=1200",
    cover_image:
      "https://images.unsplash.com/photo-1558944351-c61f9a3a9b3a?w=1600",
    content_type: "Markdown",
    content:
      "## Why balance matters\n\nDogs thrive on a steady ratio of protein, healthy fats, and complex carbohydrates...\n\n### A simple template\n\n- 50% lean protein\n- 25% cooked veg\n- 25% slow-release carbs\n\nAdd a teaspoon of fish oil for coat health.",
    read_time: 5,
    email_notification: 1,
    disable_comments: 0,
    disable_likes: 0,
    hide_cta: 0,
  },
  {
    name: "puppy-training-first-30-days",
    title: "Puppy Training: The First 30 Days",
    blog_intro:
      "A calm, consistent plan to get a new puppy from chaos to confident in their first month at home.",
    blog_category: "training",
    blogger: "rohan-k",
    published: 1,
    featured: 0,
    published_on: "2026-04-28",
    route: "blog/puppy-training-first-30-days",
    cover_image:
      "https://images.unsplash.com/photo-1583511655802-41f9a3a3f87f?w=1600",
    content_type: "Markdown",
    content:
      "Start small. Reward generously. Sleep is a skill — protect their nap schedule fiercely.",
    read_time: 4,
    disable_comments: 0,
    disable_likes: 0,
    hide_cta: 0,
  },
  {
    name: "homemade-pumpkin-treats",
    title: "3-Ingredient Homemade Pumpkin Treats",
    blog_intro: "A simple, gut-friendly treat your dog will lose their mind for.",
    blog_category: "recipes",
    blogger: "ananya-s",
    published: 0,
    featured: 0,
    published_on: "2026-06-01",
    route: "blog/homemade-pumpkin-treats",
    cover_image:
      "https://images.unsplash.com/photo-1606851181064-0f04bcb2c95e?w=1600",
    content_type: "Markdown",
    content:
      "Mix pumpkin puree, oat flour, and a beaten egg. Roll, cut, bake at 175°C for 25 minutes.",
    read_time: 2,
    disable_comments: 0,
    disable_likes: 0,
    hide_cta: 1,
  },
];
