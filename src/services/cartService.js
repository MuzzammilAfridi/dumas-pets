import axios from "axios";



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



export const createCart = (payload) => {
  return axios.post("/api/resource/Quotation", { data: payload }, { withCredentials: true });
};

export const updateCart = (id, payload) => {
  return axios.put(`/api/resource/Quotation/${id}`, { data: payload }, { withCredentials: true });
};

export const getCart = (id) => {
  return axios.get(`/api/resource/Quotation/${id}`, { withCredentials: true });
};