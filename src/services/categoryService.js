// services/categoryService.js
import axios from "axios";
const API = import.meta.env.VITE_API_URL;
export const getCategories = async () => {
  return axios.get(
    `${API}/api/resource/Item Group?fields=["name"]`,
    {
      withCredentials: true,
    }
  );
};