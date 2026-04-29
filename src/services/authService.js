import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_FRAPPE_API_KEY;
const API_SECRET = import.meta.env.VITE_FRAPPE_API_SECRET;

const authHeaders = {
  headers: {
    Authorization: `token ${API_KEY}:${API_SECRET}`,
  },
};

// LOGIN (still uses normal Frappe login)
export const loginUser = async (data) => {
  const response = await axios.post(
    `${API}/api/method/login`,
    data
  );

  return response;
};

// GET LOGGED USER (using token auth)
export const getLoggedUser = async () => {
  return axios.get(
    `${API}/api/method/frappe.auth.get_logged_user`,
    authHeaders
  );
};

// LOGOUT
export const logoutAPI = () => {
  return axios.post(
    `${API}/api/method/logout`,
    {},
    authHeaders
  );
};

// REGISTER USER
export const registerUserAPI = async ({ name, email, password }) => {
  // 1️⃣ Create User with Customer role
  await axios.post(
    `${API}/api/resource/User`,
    {
      email,
      first_name: name,
      enabled: 1,
      new_password: password,
      roles: [
        {
          role: "Customer",
        },
      ],
    },
    authHeaders
  );

  // 2️⃣ Create Customer
  await axios.post(
    `${API}/api/resource/Customer`,
    {
      customer_name: name,
      customer_type: "Individual",
      customer_group: "All Customer Groups",
      territory: "All Territories",
      email_id: email,
    },
    authHeaders
  );
};