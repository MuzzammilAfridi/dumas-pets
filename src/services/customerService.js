import axios from "axios";

export const getCustomers = async () => {
    return axios.get(
        '/api/resource/Customer?fields=["name","customer_name","gender","customer_type"]',
        {
            withCredentials: true,
        }
    );
};