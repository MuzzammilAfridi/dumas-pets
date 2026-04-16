import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const TemplateDetails = () => {
  const { itemCode } = useParams();
  const [variants, setVariants] = useState([]);

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
    ]),
    filters: JSON.stringify([
      ["variant_of", "=", itemCode],
    ]),
  },
});

        setVariants(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVariants();
  }, [itemCode]);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">
        Variants
      </h2>

      <div className="grid grid-cols-3 gap-6">
        {variants.map((v) => (
          <div key={v.item_code} className="border p-4 rounded">
            <h3>{v.item_name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateDetails;