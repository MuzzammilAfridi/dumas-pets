import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_FRAPPE_API_KEY;
const API_SECRET = import.meta.env.VITE_FRAPPE_API_SECRET;

const authHeaders = {
  headers: {
    Authorization: `token ${API_KEY}:${API_SECRET}`,
  },
};

/*
========================================
SALES ORDER SERVICE (Direct Sales Order Flow)
========================================
Create
Get
Update
Submit
Create Sales Invoice
Save Sales Invoice
========================================
*/

/* -----------------------------------
1. Create Sales Order (Add to Cart)
POST /api/resource/Sales Order
----------------------------------- */
export const createSalesOrder = (payload) => {
  return axios.post(
    `${API}/api/resource/Sales Order`,
    payload,
    authHeaders
  );
};

/* -----------------------------------
2. Update Existing Sales Order
PUT /api/resource/Sales Order/:id
----------------------------------- */
export const updateSalesOrder = (id, payload) => {
  return axios.put(
    `${API}/api/resource/Sales Order/${id}`,
    payload,
    authHeaders
  );
};

/* -----------------------------------
3. Get Single Sales Order
GET /api/resource/Sales Order/:id
----------------------------------- */
export const getSalesOrder = (id) => {
  return axios.get(
    `${API}/api/resource/Sales Order/${id}`,
    authHeaders
  );
};

export const getAllSalesOrders = (customerName) => {
  return axios.get(
    `${API}/api/resource/Sales Order?fields=["*"]&filters=[["customer","=","${customerName}"]]&order_by=creation desc`,
    authHeaders
  );
};

/* -----------------------------------
4. Get Latest Active Draft Sales Order
(GET active cart)
----------------------------------- */
export const getLatestSalesOrderByCustomer = (customerName) => {
  return axios.get(
    `${API}/api/resource/Sales Order?fields=["name","customer","transaction_date","grand_total","status"]&filters=[["customer","=","${customerName}"],["docstatus","=",0]]&order_by=creation desc&limit_page_length=1`,
    authHeaders
  );
};

/* -----------------------------------
5. Submit Sales Order
POST /api/method/frappe.client.submit
----------------------------------- */
export const submitSalesOrder = async (salesOrderId) => {
  // Always fetch latest doc first
  const latestRes = await axios.get(
    `${API}/api/resource/Sales Order/${salesOrderId}`,
    authHeaders
  );

  const latestSalesOrder = latestRes.data.data;

  console.log(
    "LATEST SALES ORDER BEFORE SUBMIT:",
    latestSalesOrder
  );

  // Already submitted → skip
  if (latestSalesOrder.docstatus === 1) {
    console.log("Sales Order already submitted");
    return latestRes;
  }

  return axios.post(
    `${API}/api/method/frappe.client.submit`,
    {
      doc: latestSalesOrder,
    },
    authHeaders
  );
};

/* -----------------------------------
6. Create Sales Invoice from Sales Order
POST /api/method/frappe.model.mapper.make_mapped_doc
----------------------------------- */
export const createSalesInvoiceFromOrder = (salesOrderId) => {
  return axios.post(
    `${API}/api/method/frappe.model.mapper.make_mapped_doc`,
    {
      method:
        "erpnext.selling.doctype.sales_order.sales_order.make_sales_invoice",
      source_name: salesOrderId,
    },
    authHeaders
  );
};

/* -----------------------------------
7. Save Final Sales Invoice
POST /api/resource/Sales Invoice
----------------------------------- */
export const saveSalesInvoice = (invoicePayload) => {
  return axios.post(
    `${API}/api/resource/Sales Invoice`,
    invoicePayload,
    authHeaders
  );
};