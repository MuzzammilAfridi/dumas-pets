import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_FRAPPE_API_KEY;
const API_SECRET = import.meta.env.VITE_FRAPPE_API_SECRET;

console.log(API_KEY);
console.log(API_SECRET);
console.log(`token ${API_KEY}:${API_SECRET}`);

const authHeaders = {
  headers: {
    Authorization: `token ${API_KEY}:${API_SECRET}`,
  },
};

/*
========================================
Get Quotations
========================================
*/
export const getQuotations = () => {
  return axios.get(
    `${API}/api/resource/Quotation?fields=["name","customer_name","party_name","transaction_date","grand_total"]`,
    authHeaders
  );
};

/*
========================================
Get Sales Orders (Full Fields)
========================================
*/
export const getSalesOrders = (customerName) => {
  return axios.get(
    `${API}/api/resource/Sales Order?fields=["*"]&filters=[["customer","=","${customerName}"]]&order_by=creation desc`,
    authHeaders
  );
};

/*
========================================
Get Single Sales Order (Best for Modal)
========================================
*/
export const getSingleSalesOrder = (salesOrderId) => {
  return axios.get(
    `${API}/api/resource/Sales Order/${salesOrderId}`,
    authHeaders
  );
};