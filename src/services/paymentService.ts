import { apiClient } from "./apiClient";

// CREATE RAZORPAY ORDER
export const createRazorpayOrder = async (amount: number) => {

  const response = await apiClient.post(
    "/api/method/dumas_15.a3_dumas.api.create_order",
    {
      amount,
    }
  );

  console.log(
    "CREATE ORDER RESPONSE:",
    response.data
  );

  if (!response?.data?.message) {
    throw new Error("Failed to create Razorpay order");
  }

  return response.data.message;
};

// VERIFY PAYMENT
export const verifyRazorpayPayment = async (
  paymentData: any
) => {

  const response = await apiClient.post(
    "/api/method/dumas_15.a3_dumas.api.verify_payment",
    paymentData
  );

  console.log(
    "VERIFY PAYMENT RESPONSE:",
    response.data
  );

  if (!response?.data?.message?.success) {
    throw new Error("Payment verification failed");
  }

  return response.data.message;
};