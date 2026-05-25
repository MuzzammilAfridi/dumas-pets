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

export const getProductsWithAttributes = async () => {
  return axios.get(
    `${API}/api/method/dumas_15.a3_dumas.api.get_variant_items_with_attributes`,
    authHeaders
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
  "is_stock_item",
  "variant_of",
]),
        filters: JSON.stringify([
          ["has_variants", "=", 1],
        ]),
      },
    }
  );
};

export const getItemGroups = async () => {
  return axios.get(
    `${API}/api/resource/Item Group`,
    {
      ...authHeaders,
      params: {
        fields: JSON.stringify([
          "name",
          "parent_item_group"
        ]),
        limit_page_length: 1000, // IMPORTANT (get all)
      },
    }
  );
};

// export const getProductById = async (itemCode) => {
//   const encodedCode = encodeURIComponent(itemCode.trim());

//   return axios.get(
//     `${API}/api/resource/Item/${encodedCode}`,
//     authHeaders
//   );
// };

export const getProductById = async (itemCode) => {
  return axios.get(
    `${API}/api/resource/Item`,
    {
      ...authHeaders,
      params: {
        filters: JSON.stringify([
          ["item_code", "=", itemCode.trim()]
        ]),
        fields: JSON.stringify(["*"]),
        limit_page_length: 1,
      },
    }
  );
};
export const disableItem = async (itemCode) => {
  return axios.put(
    `${API}/api/resource/Item/${encodeURIComponent(itemCode)}`,
    {
      disabled: 1,
    },
    authHeaders
  );
};