import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const TemplateDetails = () => {
  const { itemCode } = useParams();
  const [variants, setVariants] = useState([]);
  const navigate = useNavigate();

  const BASE_URL = "https://dumas.frappe.cloud";

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const res = await axios.get("/api/resource/Item", {
          params: {
            fields: JSON.stringify([
              "item_name",
              "item_code",
              "image",
              "variant_of",
              "item_group",
            ]),
            filters: JSON.stringify([["variant_of", "=", itemCode]]),
          },
        });
        // console.log("Data in template details",res.data);
        setVariants(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVariants();
  }, [itemCode]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Choose Your Variant
      </h2>

      {variants.length === 0 ? (
        <p className="text-center text-gray-500">No variants available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {variants.map((v) => (
            <div
              key={v.item_code}
              onClick={() => navigate(`/product/${v.item_code}`)}
              className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden"
            >
              {/* 🖼 Image */}
              <img
                src={v.image ? `${BASE_URL}${v.image}` : "/placeholder.png"}
                alt={v.item_name}
                className="w-full h-48 object-cover"
              />

              {/* 📦 Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{v.item_name}</h3>

                <p className="text-sm text-gray-500 mt-1">Variant Item</p>

                {/* 🔥 CTA */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click double fire
                    navigate(`/product/${v.item_code}`);
                  }}
                  className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Customize & Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateDetails;
