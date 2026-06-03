import { apiClient } from "./apiClient";

const API_URL = import.meta.env.VITE_API_URL;

// ================= BLOGS =================

export const getBlogs = async () => {
  const res = await apiClient.get(
    `${API_URL}/api/resource/Blog Post`,
    {
      params: {
       fields: JSON.stringify([
  "name",
  "title",
  "blog_category",
  "published_on",
  "blog_intro",
  "blogger",
  "meta_image",
//   "cover_image",
  "route",
  "featured",
  "published",
  "read_time"
]),
        order_by: "published_on desc"
      }
    }
  );

  return res.data.data;
};

export const getBlogById = async (id: string) => {
  const res = await apiClient.get(
    `${API_URL}/api/resource/Blog Post/${id}`
  );

  console.log("Blog Details:", res.data);

  return res.data.data;
};

// ================= CREATE BLOG =================

export const createBlog = async (payload: any) => {
  const res = await apiClient.post(
    `${API_URL}/api/resource/Blog Post`,
    payload
  );

  return res.data.data;
};

// ================= UPDATE BLOG =================

export const updateBlog = async (
  blogId: string,
  payload: any
) => {
  const res = await apiClient.put(
    `${API_URL}/api/resource/Blog Post/${blogId}`,
    payload
  );

  return res.data.data;
};

// ================= DELETE BLOG =================

export const deleteBlog = async (blogId: string) => {
  const res = await apiClient.delete(
    `${API_URL}/api/resource/Blog Post/${blogId}`
  );

  return res.data;
};

// ================= BLOG CATEGORIES =================

export const getBlogCategories = async () => {
  const res = await apiClient.get(
    `${API_URL}/api/resource/Blog Category`,
    {
      params: {
        fields: JSON.stringify([
          "name",
          "title"
        ])
      }
    }
  );

  return res.data.data;
};

// ================= BLOGGERS =================

export const getBloggers = async () => {
  const res = await apiClient.get(
    `${API_URL}/api/resource/Blogger`,
    {
      params: {
        fields: JSON.stringify([
          "name",
          "full_name"
        ])
      }
    }
  );

  return res.data.data;
};