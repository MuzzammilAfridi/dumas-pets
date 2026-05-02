import { apiClient } from "./apiClient";

// 🔍 Find lead
export const findLeadByEmail = async (email) => {
  return apiClient.get("/api/resource/Lead", {
    params: {
      filters: JSON.stringify([["email_id", "=", email]]),
      fields: JSON.stringify(["name"]),
    },
  });
};

export const getLeadByName = async (name) => {
  return apiClient.get(`/api/resource/Lead/${name}`);
};

export const updateLead = async (leadName, form) => {
  return apiClient.put(`/api/resource/Lead/${leadName}`, {
    mobile_no: form.phone,
  });
};

// ➕ Create lead
export const createLead = async (form) => {
  return apiClient.post("/api/resource/Lead", {
    lead_name: form.name,
    first_name: form.name.split(" ")[0],
    last_name: form.name.split(" ").slice(1).join(" "),
    email_id: form.email,
    mobile_no: form.phone,
    description: form.message,
    title: form.subject,
    company_name: "Dumas Bakes N Meals",
  });
};


export const addCommunication = async (leadName, form) => {
  return apiClient.post("/api/resource/Communication", {
    communication_type: "Communication",
    communication_medium: "Email",
    subject: form.subject,
    content: form.message,
    reference_doctype: "Lead",
    reference_name: leadName,
  });
};