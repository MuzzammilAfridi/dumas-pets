import { useEffect, useState } from "react";
import {
  getCustomers,
  getSalesOrdersByCustomer,
} from "@/services/customerService";

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await getCustomers();

        const customersData = res.data.data || [];

        const updatedCustomers = [];

        // sequential fetching (safer for ERP)
        for (const customer of customersData) {
          try {
            const ordersRes =
              await getSalesOrdersByCustomer(
                customer.customer_name
              );

            const orders =
              ordersRes?.data?.data || [];

            // exclude cancelled
            const validOrders = orders.filter(
              (o) => o.status !== "Cancelled"
            );

            const totalSpent = validOrders.reduce(
              (sum, order) =>
                sum +
                Number(order.grand_total || 0),
              0
            );

            updatedCustomers.push({
              ...customer,
              totalOrders: validOrders.length,
              totalSpent,
            });
          } catch (err) {
            console.log(
              "Failed customer:",
              customer.customer_name
            );

            updatedCustomers.push({
              ...customer,
              totalOrders: 0,
              totalSpent: 0,
            });
          }
        }

        setCustomers(updatedCustomers);
      } catch (err) {
        console.error(
          "Error fetching customers:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return { customers, loading };
};