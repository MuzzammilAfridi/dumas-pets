import axios from "axios";

export const getProducts = async () => {
    return axios.get(
        '/api/resource/Item?fields=["item_code","name","item_name","standard_rate","item_group","image"]',
        {
            withCredentials: true,
        }
    );
};