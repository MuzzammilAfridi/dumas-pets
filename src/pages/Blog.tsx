import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import { getBlogs } from "@/services/blogService";

const API_URL = import.meta.env.VITE_API_URL;

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await getBlogs();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

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

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <div>Loading Blogs...</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {blogs.map((post: any) => (
                <article
                  key={post.name}
                  className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Link to={`/blog/${post.name}`}>
                    <img
                      src={
                        post.meta_image
                          ? post.meta_image.startsWith("http")
                            ? post.meta_image
                            : `${API_URL}${post.meta_image}`
                          : "/placeholder.jpg"
                      }
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />

                    <div className="p-6">
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
                        {post.blog_category}
                      </span>

                      <h2 className="text-xl font-bold text-foreground mb-3 hover:text-primary transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-muted-foreground mb-4">
                        {post.blog_intro}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.blogger}
                        </span>

                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(
                            post.published_on
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;