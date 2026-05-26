// src/hooks/useSalesOrder.ts

import { useState } from "react";
import {
  createSalesOrder,
  updateSalesOrder,
  getLatestSalesOrderByCustomer,
  submitSalesOrder,
  createSalesInvoiceFromOrder,
  saveSalesInvoice,
  submitSalesInvoice
} from "@/services/salesOrderService";

const CUSTOMER_NAME = "Customer Test";

export const useSalesOrder = () => {
  const [salesOrderId, setSalesOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /*
  ========================================
  Load Latest Active Draft Sales Order
  ========================================
  */
  const loadActiveSalesOrder = async () => {
    try {
      setLoading(true);

      const res = await getLatestSalesOrderByCustomer(CUSTOMER_NAME);

      const latestOrder = res?.data?.data?.[0];

      if (latestOrder?.name) {
        console.log(
          "LATEST ACTIVE SALES ORDER:",
          latestOrder.name
        );

        setSalesOrderId(latestOrder.name);
        return latestOrder.name;
      }

      console.log("No active Sales Order found");
      setSalesOrderId(null);
      return null;
    } catch (err) {
      console.error(
        "LOAD ACTIVE SALES ORDER FAILED:",
        err?.response?.data || err
      );
      setSalesOrderId(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================================
  Create OR Update Sales Order
  ========================================
  */
/*
========================================
Create Fresh Sales Order Only
(No update of old Sales Order)
========================================
Replace your current createOrUpdateSalesOrder()
with this full function
========================================
*/

const createOrUpdateSalesOrder = async (cartItems) => {
  try {
    setLoading(true);

    /*
    ----------------------------------------
    Validation
    ----------------------------------------
    */
    if (!cartItems || cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    /*
    ----------------------------------------
    Full Sales Order Payload
    (IMPORTANT FIX → rate + amount + custom fields)
    ----------------------------------------
    */
    const payload = {
      customer: "Customer Test",

      transaction_date: new Date()
        .toISOString()
        .split("T")[0],

      // Parent custom fields from first cart item
      custom_meat_type:
        cartItems[0]?.customization?.meatType || "",

      custom_grain_type:
        cartItems[0]?.customization?.grainType || "",

      custom_grain_percentage:
        cartItems[0]?.customization?.grainPercentage || 0,

      custom_gpv_ratio:
        cartItems[0]?.customization?.gpvRatio || "",

      custom_vegetables:
        cartItems[0]?.customization?.vegetables?.join(", ") || "",

      custom_preparation_instructions:
        cartItems[0]?.customization?.preparationInstructions || "",

      custom_free_soup:
        cartItems[0]?.customization?.freeSoup || 0,

      custom_extra_soup:
        cartItems[0]?.customization?.extraSoup || 0,

      custom_purchase_type:
        cartItems[0]?.purchaseType === "subscription"
          ? "Subscription"
          : "One Time",

      custom_delivery_date:
        cartItems[0]?.subscription?.date
          ? new Date(cartItems[0].subscription.date)
              .toISOString()
              .split("T")[0]
          : cartItems[0]?.subscription?.startDate
          ? new Date(cartItems[0].subscription.startDate)
              .toISOString()
              .split("T")[0]
          : new Date()
              .toISOString()
              .split("T")[0],

      custom_delivery_time_slot:
        cartItems[0]?.subscription?.timeSlot || "",

      custom_subscription_start:
        cartItems[0]?.subscription?.startDate
          ? new Date(cartItems[0].subscription.startDate)
              .toISOString()
              .split("T")[0]
          : "",

      custom_subscription_end:
        cartItems[0]?.subscription?.endDate
          ? new Date(cartItems[0].subscription.endDate)
              .toISOString()
              .split("T")[0]
          : "",

      custom_delivery_days:
        cartItems[0]?.subscription?.deliveryDays?.join(",") || "",

      items: cartItems.map((item) => ({
        item_code: item.productId,

        qty: item.quantity,

        // MOST IMPORTANT FIX
        rate: Number(item.price || 0),

        amount:
          Number(item.price || 0) *
          Number(item.quantity || 1),

        delivery_date:
          item.subscription?.date
            ? new Date(item.subscription.date)
                .toISOString()
                .split("T")[0]
            : item.subscription?.startDate
            ? new Date(item.subscription.startDate)
                .toISOString()
                .split("T")[0]
            : new Date()
                .toISOString()
                .split("T")[0],
      })),
    };

    console.log(
      "FRESH SALES ORDER PAYLOAD:",
      payload
    ); // :contentReference[oaicite:0]{index=0}

    /*
    ----------------------------------------
    Always create NEW Sales Order
    ----------------------------------------
    */
    const res = await createSalesOrder(payload);

    console.log(
      "NEW SALES ORDER ERP RESPONSE:",
      res.data
    );

    const newOrderId = res?.data?.data?.name;

    if (!newOrderId) {
      throw new Error(
        "Failed to create Sales Order"
      );
    }

    console.log(
      "NEW SALES ORDER CREATED:",
      newOrderId
    );

    setSalesOrderId(newOrderId);

    return newOrderId;
  } catch (err) {
    console.error(
      "CREATE SALES ORDER FAILED:",
      err?.response?.data || err
    );

    throw err;
  } finally {
    setLoading(false);
  }
};

  /*
  ========================================
  Submit Order + Create Invoice
  ========================================
  */
  const placeFinalOrder = async () => {
    try {
      setLoading(true);

      let activeOrderId = salesOrderId;

      if (!activeOrderId) {
        activeOrderId = await loadActiveSalesOrder();
      }

      if (!activeOrderId) {
        throw new Error("No active Sales Order found");
      }

      console.log(
        "ACTIVE SALES ORDER:",
        activeOrderId
      );

      /*
      ----------------------------------------
      STEP 1 → Submit Sales Order
      ----------------------------------------
      */
      await submitSalesOrder(activeOrderId);

      console.log(
        "SALES ORDER SUBMITTED:",
        activeOrderId
      );

      /*
      ----------------------------------------
      STEP 2 → Create Sales Invoice
      ----------------------------------------
      */
      const invoiceRes =
        await createSalesInvoiceFromOrder(
          activeOrderId
        );

      console.log(
        "MAPPED SALES INVOICE:",
        invoiceRes.data
      );

      const mappedInvoice =
        invoiceRes?.data?.message;

      if (!mappedInvoice) {
        throw new Error(
          "Failed to create mapped Sales Invoice"
        );
      }

      mappedInvoice.update_billed_amount_in_sales_order = 1;

      /*
      ----------------------------------------
      STEP 3 → Save Final Invoice
      ----------------------------------------
      */
      const savedInvoiceRes =
        await saveSalesInvoice(mappedInvoice);

        await submitSalesInvoice(
  savedInvoiceRes.data.data
);

      console.log(
        "FINAL SALES INVOICE SAVED:",
        savedInvoiceRes.data
      );

      return {
        success: true,
        salesOrderId: activeOrderId,
        invoiceId:
          savedInvoiceRes?.data?.data?.name ||
          "INVOICE-CREATED",
      };
    } catch (err) {
      console.error(
        "PLACE FINAL ORDER FAILED:",
        err?.response?.data || err
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /*
  ========================================
  Clear Active Sales Order
  ========================================
  */
  const clearSalesOrderState = () => {
    setSalesOrderId(null);
  };

  return {
    salesOrderId,
    setSalesOrderId,

    loading,

    loadActiveSalesOrder,
    createOrUpdateSalesOrder,
    placeFinalOrder,
    clearSalesOrderState,
  };
};

export default useSalesOrder;