import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();

  const categorySlug = "bakes"; // 👈 dynamic later

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get("/api/resource/Item", {
          params: {
            fields: JSON.stringify([
              "item_name",
              "item_code",
              "image",
            ]),
            filters: JSON.stringify([
              ["has_variants", "=", 1],
              ["item_group", "=", "All Item Groups"],
            ]),
          },
        });

        setTemplates(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10">Templates</h2>

        {/* 👇 Only 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.slice(0, 3).map((item) => (
            <div
              key={item.item_code}
              onClick={() => navigate(`/template/${item.item_code}`)}
              className="cursor-pointer p-4 border rounded-xl hover:shadow-lg"
            >
              <img
                src={item.image || "/placeholder.png"}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="mt-3 font-bold">{item.item_name}</h3>
            </div>
          ))}
        </div>

        {/* 👇 Navigate instead of expand */}
        <div className="text-center mt-8">
          <Link to={`/category/${categorySlug}/all`}>
            <Button variant="outline" size="lg">
              Load More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Templates;