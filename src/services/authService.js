import axios from "axios";

export const loginUser = async (data) => {
  return axios.post("/api/method/login", data, {
    withCredentials: true,
  });
};

export const getLoggedUser = async () => {
  return axios.get("/api/method/frappe.auth.get_logged_user", {
    withCredentials: true,
  });
};

export const logoutAPI = () => {
  return axios.post("/api/method/logout", {}, { withCredentials: true });
};





export const registerUserAPI = async ({ name, email, password }) => {
  // 1️⃣ Create User with role
  await axios.post("/api/resource/User", {
    email,
    first_name: name,
    enabled: 1,
    new_password: password,
    roles: [
      {
        role: "Customer",
      },
    ],
  });

  // 2️⃣ Create Customer
  await axios.post("/api/resource/Customer", {
    customer_name: name,
    customer_type: "Individual",
    customer_group: "All Customer Groups",
    territory: "All Territories",
    email_id: email,
  });
};