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

export const cancelInvoice = (invoiceId) => {
  return axios.post(
    `${API}/api/method/frappe.client.cancel`,
    {
      doctype: "Sales Invoice",
      name: invoiceId,
    },
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

export const getAllSalesOrdersAdmin = () => {
  return axios.get(
    `${API}/api/resource/Sales Order?fields=["name","customer","transaction_date","grand_total","status","docstatus", "per_billed"]&order_by=creation desc`,
    authHeaders
  );
};

// SUBMIT ORDER
export const submitOrder = async (id) => {
  // 🔥 STEP 1: Always fetch latest document
  const latestRes = await axios.get(
    `${API}/api/resource/Sales Order/${id}`,
    authHeaders
  );

  const latestDoc = latestRes.data.data;

  console.log("LATEST DOC BEFORE SUBMIT:", latestDoc);

  // 🔥 STEP 2: Check already submitted
  if (latestDoc.docstatus === 1) {
    console.log("Already submitted");
    return latestRes;
  }

  // 🔥 STEP 3: Submit using latest doc
  return axios.post(
    `${API}/api/method/frappe.client.submit`,
    {
      doc: latestDoc,
    },
    authHeaders
  );
};


export const getInvoiceBySalesOrder = (orderId) => {
  return axios.get(
    `${API}/api/resource/Sales Invoice?fields=["name"]&filters=[["sales_order","=","${orderId}"]]`,
    authHeaders
  );
};
export const getInvoices = () => {
  return axios.get(
    `${API}/api/resource/Sales Invoice?fields=["name","items"]&limit_page_length=50`,
    authHeaders
  );
};

export const getInvoiceFromOrder = (orderId) => {
  return axios.post(
    `${API}/api/method/frappe.model.mapper.get_mapped_doc`,
    {
      method:
        "erpnext.selling.doctype.sales_order.sales_order.make_sales_invoice",
      source_name: orderId,
    },
    authHeaders
  );
};

// CANCEL ORDER
export const cancelOrder = (id) => {
  return axios.post(
    `${API}/api/method/frappe.client.cancel`,
    {
      doctype: "Sales Order",
      name: id,
    },
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

export const handleInvoiceBeforeCancel = async (invoiceId) => {
  const API = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_FRAPPE_API_KEY;
  const API_SECRET = import.meta.env.VITE_FRAPPE_API_SECRET;

  const authHeaders = {
    headers: {
      Authorization: `token ${API_KEY}:${API_SECRET}`,
    },
  };

  // 🔥 Get invoice
  const invRes = await axios.get(
    `${API}/api/resource/Sales Invoice/${invoiceId}`,
    authHeaders
  );

  const invoice = invRes.data.data;

  console.log("INVOICE DOCSTATUS:", invoice.docstatus);

  // ✅ Draft → DELETE
  if (invoice.docstatus === 0) {
    console.log("Deleting draft invoice...");

    await axios.delete(
      `${API}/api/resource/Sales Invoice/${invoiceId}`,
      authHeaders
    );
  }

  // ✅ Submitted → CANCEL
  else if (invoice.docstatus === 1) {
    console.log("Cancelling submitted invoice...");

    await axios.post(
      `${API}/api/method/frappe.client.cancel`,
      {
        doctype: "Sales Invoice",
        name: invoiceId,
      },
      authHeaders
    );
  }
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


export const cancelOrderWithDependencies = async (orderId) => {
  try {
    // Step 1: get latest order
    let res = await getSalesOrder(orderId);
    let order = res.data.data;

    // Step 2: ensure submitted
    if (order.docstatus === 0) {
      await submitOrder(orderId);
    }

    // Step 3: try cancel
    await cancelOrder(orderId);

  } catch (err) {
    const msg = err?.response?.data?.exception || "";

    const match = msg.match(/SINV-[\d-]+/);
    if (!match) throw err;

    const invoiceId = match[0];

    // Step 4: handle invoice
    await handleInvoiceBeforeCancel(invoiceId);

    // Step 5: retry cancel
    await cancelOrder(orderId);
  }
};

export const markOrderAsDelivered = async (orderId) => {
  const API = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_FRAPPE_API_KEY;
  const API_SECRET = import.meta.env.VITE_FRAPPE_API_SECRET;

  const authHeaders = {
    headers: {
      Authorization: `token ${API_KEY}:${API_SECRET}`,
    },
  };

  // 1. create invoice
  const res = await axios.post(
    `${API}/api/method/frappe.model.mapper.make_mapped_doc`,
    {
      method:
        "erpnext.selling.doctype.sales_order.sales_order.make_sales_invoice",
      source_name: orderId,
    },
    authHeaders
  );

  const invoice = res.data.message;

  // 🔥 IMPORTANT FIX
  invoice.update_billed_amount_in_sales_order = 1;

  // 2. save invoice
  const saved = await axios.post(
    `${API}/api/resource/Sales Invoice`,
    invoice,
    authHeaders
  );

  // 3. submit invoice
  await axios.post(
    `${API}/api/method/frappe.client.submit`,
    {
      doc: saved.data.data,
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