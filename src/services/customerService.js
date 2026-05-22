import axios from "axios";
const API = import.meta.env.VITE_API_URL;
export const getCustomers = async () => {
  return axios.get(
    `${API}/api/resource/Customer?fields=["*"]&limit_page_length=1000`,
    {
      withCredentials: true,
    }
  );
};

export const getSalesOrdersByCustomer = async (
  customerName
) => {
  const filters = encodeURIComponent(
    JSON.stringify([
      ["customer", "=", customerName],
    ])
  );

  return axios.get(
    `${API}/api/resource/Sales Order?fields=["name","transaction_date","grand_total","status","customer"]&filters=${filters}&limit_page_length=300`,
    {
      withCredentials: true,
    }
  );
};