import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_FRAPPE_API_KEY;
const API_SECRET = import.meta.env.VITE_FRAPPE_API_SECRET;

const authHeaders = {
  headers: {
    Authorization: `token ${API_KEY}:${API_SECRET}`,
  },
};

/*
========================================
GET ALL PRODUCTS
========================================
*/
export const getProducts = async () => {
  return axios.get(
    `${API}/api/resource/Item`,
    {
      ...authHeaders,
      params: {
        fields: JSON.stringify([
          "item_code",
          "name",
          "item_name",
          "standard_rate",
          "item_group",
          "image",
        ]),
      },
    }
  );
};

/*
========================================
GET TEMPLATE VARIANTS
========================================
*/
export const getTemplateVariants = async (itemCode) => {
  return axios.get(
    `${API}/api/resource/Item`,
    {
      ...authHeaders,
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
    }
  );
};

/*
========================================
GET TEMPLATES ONLY
========================================
*/
export const getTemplates = async () => {
  return axios.get(
    `${API}/api/resource/Item`,
    {
      ...authHeaders,
      params: {
        fields: JSON.stringify([
          "item_name",
          "item_code",
          "image",
          "item_group",
          "has_variants",
        ]),
        filters: JSON.stringify([
          ["has_variants", "=", 1],
        ]),
      },
    }
  );
};