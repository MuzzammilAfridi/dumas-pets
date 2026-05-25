import axios from "axios";
const API = import.meta.env.VITE_API_URL;
export const getCustomers = async () => {
  return axios.get(
    `${API}/api/resource/Customer?fields=[
  "name",
  "customer_name",
  "customer_type",
  "gender",
  "mobile_no",
  "email_id",
  "customer_group",
  "territory",
  "creation",
  "modified",
  "owner",
  "modified_by"
]&limit_page_length=1000`,
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

export const getCustomerContacts = async (
  customerName
) => {
  const filters = encodeURIComponent(
    JSON.stringify([
      [
        "Dynamic Link",
        "link_name",
        "=",
        customerName
      ]
    ])
  );

  return axios.get(
    `${API}/api/resource/Contact?fields=["name","email_id","mobile_no"]&filters=${filters}`,
    {
      withCredentials: true,
    }
  );
};

export const getCustomerAddresses = async (
  customerName
) => {
  const filters = encodeURIComponent(
    JSON.stringify([
      [
        "Dynamic Link",
        "link_name",
        "=",
        customerName
      ]
    ])
  );

  return axios.get(
    `${API}/api/resource/Address?fields=["name","address_line1","city","state","country","pincode"]&filters=${filters}`,
    {
      withCredentials: true,
    }
  );
};