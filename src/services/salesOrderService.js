import axios from "axios";

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
    "/api/resource/Sales Order",
    payload,
    {
      withCredentials: true,
    }
  );
};

/* -----------------------------------
2. Update Existing Sales Order
PUT /api/resource/Sales Order/:id
----------------------------------- */
export const updateSalesOrder = (id, payload) => {
  return axios.put(
    `/api/resource/Sales Order/${id}`,
    payload,
    {
      withCredentials: true,
    }
  );
};

/* -----------------------------------
3. Get Single Sales Order
GET /api/resource/Sales Order/:id
----------------------------------- */
export const getSalesOrder = (id) => {
  return axios.get(
    `/api/resource/Sales Order/${id}`,
    {
      withCredentials: true,
    }
  );
};

export const getAllSalesOrders = (customerName) => {
  return axios.get(
    `/api/resource/Sales Order?fields=["*"]&filters=[["customer","=","${customerName}"]]&order_by=creation desc`,
    {
      withCredentials: true,
    }
  );
};

/* -----------------------------------
4. Get Latest Active Draft Sales Order
(GET active cart)
----------------------------------- */
export const getLatestSalesOrderByCustomer = (customerName) => {
  return axios.get(
    `/api/resource/Sales Order?fields=["name","customer","transaction_date","grand_total","status"]&filters=[["customer","=","${customerName}"],["docstatus","=",0]]&order_by=creation desc&limit_page_length=1`,
    {
      withCredentials: true,
    }
  );
};

/* -----------------------------------
5. Submit Sales Order
POST /api/method/frappe.client.submit
----------------------------------- */
export const submitSalesOrder = async (salesOrderId) => {
  // Always fetch latest doc first
  const latestRes = await axios.get(
    `/api/resource/Sales Order/${salesOrderId}`,
    {
      withCredentials: true,
    }
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
    "/api/method/frappe.client.submit",
    {
      doc: latestSalesOrder,
    },
    {
      withCredentials: true,
    }
  );
};

/* -----------------------------------
6. Create Sales Invoice from Sales Order
POST /api/method/frappe.model.mapper.make_mapped_doc
----------------------------------- */
export const createSalesInvoiceFromOrder = (salesOrderId) => {
  return axios.post(
    "/api/method/frappe.model.mapper.make_mapped_doc",
    {
      method:
        "erpnext.selling.doctype.sales_order.sales_order.make_sales_invoice",
      source_name: salesOrderId,
    },
    {
      withCredentials: true,
    }
  );
};

/* -----------------------------------
7. Save Final Sales Invoice
POST /api/resource/Sales Invoice
----------------------------------- */
export const saveSalesInvoice = (invoicePayload) => {
  return axios.post(
    "/api/resource/Sales Invoice",
    invoicePayload,
    {
      withCredentials: true,
    }
  );
};