// services/categoryService.js
import axios from "axios";

export const getCategories = async () => {
  return axios.get(
    "/api/resource/Item Group?fields=[\"name\"]",
    {
      withCredentials: true,
    }
  );
};