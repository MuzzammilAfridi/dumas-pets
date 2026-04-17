import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Templates = () => {
  const navigate = useNavigate();
  const [groupedTemplates, setGroupedTemplates] = useState({});

  const BASE_URL = "https://dumas.frappe.cloud";

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get("/api/resource/Item", {
          params: {
            fields: JSON.stringify([
              "item_name",
              "item_code",
              "image",
              "item_group"
            ]),
            filters: JSON.stringify([
              ["has_variants","=",1],
              ["item_group","in",["All Item Groups","Street Dog Meals","Bakes","Desserts"]]
            ]),
          },
        });

        const data = res.data.data || [];

        const grouped = data.reduce((acc, item) => {
          if (!acc[item.item_group]) {
            acc[item.item_group] = [];
          }
          acc[item.item_group].push(item);
          return acc;
        }, {});

        setGroupedTemplates(grouped);

      } catch (err) {
        console.error(err);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">

        {Object.entries(groupedTemplates).map(([group, items]) => (
          <div key={group} className="mb-10">

            {/* 🔥 Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{group}</h2>
              <span
                onClick={() => navigate(`/category/${group}`)}
                className="text-sm text-blue-500 cursor-pointer"
              >
                View All →
              </span>
            </div>

            {/* 👉 Horizontal Scroll */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {items.slice(0, 6).map((item) => (
                <div
                  key={item.item_code}
                  onClick={() => navigate(`/template/${item.item_code}`)}
                  className="min-w-[200px] cursor-pointer border rounded-xl p-3 hover:shadow-lg"
                >
                  <img
                    src={
                      item.image
                        ? `${BASE_URL}${item.image}`
                        : "/placeholder.png"
                    }
                    className="w-full h-32 object-cover rounded"
                    alt={item.item_name}
                  />
                  <h3 className="mt-2 font-semibold text-sm">
                    {item.item_name}
                  </h3>
                </div>
              ))}
            </div>

          </div>
        ))}

      </div>
    </section>
  );
};

export default Templates;