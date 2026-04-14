import axios from "axios";

export const loginUser = async (data) => {
  return axios.post("/api/method/login", data, {
    withCredentials: true,
  });
};