// ERPNext Blog API service.
// Currently backed by an in-memory mock store so the UI works without a live ERPNext.
// Swap `MOCK` calls for `fetch(`${BASE}/api/resource/...`)` to go live.

import {
  BlogCategory,
  Blogger,
  BlogPost,
  CreateBlogPayload,
  UpdateBlogPayload,
  mockBlogPosts,
  mockCategories,
  mockBloggers,
} from "@/data/blogData";

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

// Mutable in-memory store (mock DB).
let posts: BlogPost[] = [...mockBlogPosts];

export const blogService = {
  async listPosts(): Promise<BlogPost[]> {
    await delay();
    return [...posts].sort((a, b) =>
      b.published_on.localeCompare(a.published_on),
    );
  },

  async getPost(name: string): Promise<BlogPost | undefined> {
    await delay();
    return posts.find((p) => p.name === name);
  },

  async createPost(payload: CreateBlogPayload): Promise<BlogPost> {
    await delay();
    const name =
      payload.name?.trim() ||
      payload.route?.split("/").pop() ||
      payload.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const post: BlogPost = { ...(payload as BlogPost), name };
    posts = [post, ...posts.filter((p) => p.name !== name)];
    return post;
  },

  async updatePost(payload: UpdateBlogPayload): Promise<BlogPost> {
    await delay();
    posts = posts.map((p) =>
      p.name === payload.name ? ({ ...p, ...payload } as BlogPost) : p,
    );
    return posts.find((p) => p.name === payload.name)!;
  },

  async deletePost(name: string): Promise<void> {
    await delay();
    posts = posts.filter((p) => p.name !== name);
  },

  async listCategories(): Promise<BlogCategory[]> {
    await delay(120);
    return mockCategories;
  },

  async listBloggers(): Promise<Blogger[]> {
    await delay(120);
    return mockBloggers;
  },
};

// Utilities --------------------------------------------------

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const calcReadTime = (content: string) => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};
