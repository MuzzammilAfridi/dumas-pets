import axios from "axios";

export const getQuotations = () => {
  return axios.get(
    '/api/resource/Quotation?fields=["name","customer_name","party_name","transaction_date","grand_total"]',
    {
      withCredentials: true, // keep this
    }
  );
};