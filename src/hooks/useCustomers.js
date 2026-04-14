import { useEffect, useState } from "react";
import { getCustomers } from "@/services/customerService";

export const useCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await getCustomers();
                setCustomers(res.data.data);
            } catch (err) {
                console.error("Error fetching customers:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    return { customers, loading };
};