import { apiClient } from "./apiClient";

// LOGIN
export const loginUser = async (data) => {
  return apiClient.post("/api/method/login", data);
};

// LOGOUT
export const logoutAPI = () => {
  return apiClient.post("/api/method/logout");
};

// REGISTER USER
export const registerUserAPI = async ({ name, email, password }) => {
  // Create User
  await apiClient.post("/api/resource/User", {
    email,
    first_name: name,
    enabled: 1,
    new_password: password,
    roles: [{ role: "Customer" }],
  });

  // Create Customer
  await apiClient.post("/api/resource/Customer", {
    customer_name: name,
    customer_type: "Individual",
    customer_group: "All Customer Groups",
    territory: "All Territories",
    email_id: email,
  });
};