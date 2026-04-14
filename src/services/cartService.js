import axios from "axios";

const BASE_URL = "/api/resource";

// ✅ Create quotation (cart)
export const createCart = (payload) => {
  return axios.post(`${BASE_URL}/Quotation`, payload);
};