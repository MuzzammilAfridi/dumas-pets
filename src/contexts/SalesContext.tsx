// src/contexts/SalesContext.tsx

import React, {
  createContext,
  useContext,
  ReactNode,
} from "react";

import useSalesOrder from "@/hooks/useSalesOrder";
import { useCart } from "@/contexts/CartContext";

/*
========================================
Sales Context Type
========================================
*/

interface SalesContextType {
  salesOrderId: string | null;
  loading: boolean;

  loadActiveSalesOrder: () => Promise<string | null>;

  syncSalesOrderWithCart: () => Promise<void>;

  placeOrder: () => Promise<{
    success: boolean;
    salesOrderId: string;
    invoiceId: string;
  }>;

  clearSalesState: () => void;
}

/*
========================================
Create Context
========================================
*/

const SalesContext = createContext<
  SalesContextType | undefined
>(undefined);

/*
========================================
Provider
========================================
*/

export const SalesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const {
    salesOrderId,
    loading,

    loadActiveSalesOrder,
    createOrUpdateSalesOrder,
    placeFinalOrder,
    clearSalesOrderState,
  } = useSalesOrder();

  const { items } = useCart();

  /*
  ========================================
  Sync Cart → ERP Sales Order
  ========================================
  */

  const syncSalesOrderWithCart =
    async (): Promise<void> => {
      try {
        /*
        ----------------------------------------
        If cart empty → just clear local sales state
        (No backend delete required)
        ----------------------------------------
        */

        if (!items || items.length === 0) {
          console.log(
            "Cart empty → clearing sales state"
          );

          clearSalesOrderState();
          return;
        }

        /*
        ----------------------------------------
        Create OR Update Sales Order
        ----------------------------------------
        */

        await createOrUpdateSalesOrder(items);

        console.log(
          "Sales Order synced successfully"
        );
      } catch (err: any) {
        console.error(
          "SYNC SALES ORDER FAILED:",
          err?.response?.data || err
        );

        throw err;
      }
    };

  /*
  ========================================
  Final Place Order
  ========================================
  */

  const placeOrder = async () => {
    try {
      /*
      ----------------------------------------
      Ensure latest cart is synced first
      ----------------------------------------
      */

      await syncSalesOrderWithCart();

      /*
      ----------------------------------------
      Submit Sales Order
      +
      Create Sales Invoice
      +
      Save Invoice
      ----------------------------------------
      */

      const result = await placeFinalOrder();

      console.log(
        "FINAL ORDER SUCCESS:",
        result
      );

      return result;
    } catch (err: any) {
      console.error(
        "PLACE ORDER FAILED:",
        err?.response?.data || err
      );

      throw err;
    }
  };

  /*
  ========================================
  Clear State
  ========================================
  */

  const clearSalesState = () => {
    clearSalesOrderState();
  };

  return (
    <SalesContext.Provider
      value={{
        salesOrderId,
        loading,

        loadActiveSalesOrder,

        syncSalesOrderWithCart,

        placeOrder,

        clearSalesState,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

/*
========================================
Custom Hook
========================================
*/

export const useSales = () => {
  const context = useContext(SalesContext);

  if (!context) {
    throw new Error(
      "useSales must be used inside SalesProvider"
    );
  }

  return context;
};

export default SalesContext;