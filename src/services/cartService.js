import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// ✅ Create quotation (cart)
// export const createCart = (payload) => {
//   return axios.post(
//     "/api/resource/Quotation",
//     { data: payload },
//     {
//       withCredentials: true, 

//     }
//   );
// };



// export const createCart = (payload) => {
//   return axios.post("/api/resource/Quotation", { data: payload }, { withCredentials: true });
// };

export const createCart = (payload) => {
  return axios.post(
    `${API}/api/resource/Quotation`,
    payload,
    {
      withCredentials: true,
    }
  );
};

export const updateCart = (id, payload) => {
  return axios.put(`${API}/api/resource/Quotation/${id}`, { data: payload }, { withCredentials: true });
};

export const getCart = (id) => {
  return axios.get(`${API}/api/resource/Quotation/${id}`, { withCredentials: true });
};





export const getAllCarts = (customerName) => {
  return axios.get(
    `${API}/api/resource/Quotation?fields=["name","party_name","transaction_date","grand_total","status"]&filters=[["party_name","=","${customerName}"]]`,
    {
      withCredentials: true,
    }
  );
};

export const getLatestCartByCustomer = (customerName) => {
  return axios.get(
    `${API}/api/resource/Quotation?fields=["name"]&filters=[
      ["party_name","=","${customerName}"],
      ["docstatus","=",0]
    ]&order_by=creation desc&limit_page_length=1`,
    {
      withCredentials: true,
    }
  );
};


export const submitQuotation = async (quotationId) => {
  // always fetch latest document first
  const latestRes = await axios.get(
    `${API}/api/resource/Quotation/${quotationId}`,
    {
      withCredentials: true,
    }
  );

  const latestQuotation = latestRes.data.data;

  console.log(
    "LATEST QUOTATION BEFORE SUBMIT:",
    latestQuotation
  );

  // if already submitted skip
  if (latestQuotation.docstatus === 1) {
    console.log("Quotation already submitted");
    return latestRes;
  }

  return axios.post(
    `${API}/api/method/frappe.client.submit`,
    {
      doc: latestQuotation,
    },
    {
      withCredentials: true,
    }
  );
};

export const convertQuotationToSalesOrder = (
  quotationId,
  customerName
) => {
  return axios.post(
    `${API}/api/method/frappe.model.mapper.make_mapped_doc`,
    {
      method:
        "erpnext.selling.doctype.quotation.quotation.make_sales_order",
      source_name: quotationId,
      selected_children: JSON.stringify({}),
      args: JSON.stringify({
        customer: customerName,
      }),
    },
    {
      withCredentials: true,
    }
  );
};

export const deleteCart = (quotationId) => {
  return axios.delete(
    `${API}/api/resource/Quotation/${quotationId}`,
    {
      withCredentials: true,
    }
  );
};