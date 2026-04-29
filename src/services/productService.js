import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getProducts = async () => {
    return axios.get(
        `${API}/api/resource/Item?fields=["item_code","name","item_name","standard_rate","item_group","image"]`,
        {
            withCredentials: true,
        }
    );
};


export const getTemplateVariants = async (itemCode) => {
  return axios.get(`${API}/api/resource/Item`, {
    params: {
      fields: JSON.stringify([
        "item_name",
        "item_code",
        "image",
        "variant_of",
        "item_group",
        "standard_rate",
      ]),
      filters: JSON.stringify([
        ["variant_of", "=", itemCode],
      ]),
    },
    withCredentials: true,
  });
};


export const getTemplates = async () => {
  return axios.get(`${API}/api/resource/Item`, {
    params: {
      fields: JSON.stringify([
        "item_name",
        "item_code",
        "image",
        "item_group",
        "has_variants",
      ]),
      filters: JSON.stringify([
        ["has_variants", "=", 1], // only templates
      ]),
    },
    withCredentials: true,
  });
};

