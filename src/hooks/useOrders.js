import { useEffect, useState } from "react";
import { getQuotations, getSalesOrders } from "@/services/orderService";

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch logged-in user from localStorage
        const storedUser = localStorage.getItem("dumas_user");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;

        console.log("storeduser in useOrder", storedUser)
        
        // ERP Customer name
        // const customerName = parsedUser?.name || "Customer Test";
        const customerName =  "Customer Test";

        console.log("LOGGED IN CUSTOMER:", customerName);

        const res = await getSalesOrders(customerName);

        console.log("FILTERED SALES ORDERS:", res.data?.data);

        setOrders(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching Sales Orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  return { orders, loading };
};