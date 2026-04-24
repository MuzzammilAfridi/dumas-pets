import axios from "axios";

export const getQuotations = () => {
  return axios.get(
    '/api/resource/Quotation?fields=["name","customer_name","party_name","transaction_date","grand_total"]',
    {
      withCredentials: true,
    }
  );
};

/*
========================================
Get Sales Orders (Full Fields)
========================================
*/
export const getSalesOrders = (customerName) => {
  return axios.get(
    `/api/resource/Sales Order?fields=["*"]&filters=[["customer","=","${customerName}"]]&order_by=creation desc`,
    {
      withCredentials: true,
    }
  );
};

/*
========================================
Get Single Sales Order (Best for Modal)
========================================
*/
export const getSingleSalesOrder = (salesOrderId) => {
  return axios.get(
    `/api/resource/Sales Order/${salesOrderId}`,
    {
      withCredentials: true,
    }
  );
};