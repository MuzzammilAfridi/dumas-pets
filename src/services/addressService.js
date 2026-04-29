import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_FRAPPE_API_KEY;
const API_SECRET = import.meta.env.VITE_FRAPPE_API_SECRET;

const authHeaders = {
  headers: {
    Authorization: `token ${API_KEY}:${API_SECRET}`,
  },
};

// CREATE
export const createAddress = (payload) =>
  axios.post(
    `${API}/api/resource/Address`,
    payload,
    authHeaders
  );

// GET
export const getAddresses = (customerName) =>
  axios.get(`${API}/api/resource/Address`, {
    ...authHeaders,
    params: {
      filters: JSON.stringify([
        ["Dynamic Link", "link_name", "=", customerName],
      ]),
      fields: JSON.stringify([
        "name",
        "address_title",
        "address_line1",
        "city",
        "state",
        "pincode",
      ]),
    },
  });

// DELETE
export const deleteAddress = (name) =>
  axios.delete(
    `${API}/api/resource/Address/${encodeURIComponent(name)}`,
    authHeaders
  );