
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_FRAPPE_API_KEY;
const API_SECRET = import.meta.env.VITE_FRAPPE_API_SECRET;

export const apiClient = axios.create({
  baseURL: API,
  headers: {
    Authorization: `token ${API_KEY}:${API_SECRET}`,
     "Content-Type": "application/json",
  },
});