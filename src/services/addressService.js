import axios from "axios";

// CREATE
export const createAddress = (payload) =>
  axios.post("/api/resource/Address", payload, {
    withCredentials: true,
  });
// GET
export const getAddresses = (customerName) =>
  axios.get("/api/resource/Address", {
    withCredentials: true, // ✅ ADD THIS
    params: {
      filters: JSON.stringify([
        ["Dynamic Link", "link_name", "=", customerName],
      ]),
      fields: JSON.stringify([
        "name",
        "address_title",
        "address_line1",
        "city",
        "state",
        "pincode",
      ]),
    },
  });

// DELETE
export const deleteAddress = async (name) => {
  return axios.delete(`/api/resource/Address/${encodeURIComponent(name)}`, {
    withCredentials: true,
  });
};