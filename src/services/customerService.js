import axios from "axios";
const API = import.meta.env.VITE_API_URL;
export const getCustomers = async () => {
    return axios.get(
        `${API}/api/resource/Customer?fields=["name","customer_name","gender","customer_type"]`,
        {
            withCredentials: true,
        }
    );
};