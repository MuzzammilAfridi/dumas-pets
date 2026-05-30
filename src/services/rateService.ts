import { apiClient } from "./apiClient";

// Get active tariff
export const getActiveTariff = async () => {
  return apiClient.get("/api/resource/Daily Tariff", {
    params: {
      filters: JSON.stringify([
        ["status", "=", "Enabled"]
      ]),
    },
  });
};

// Get tariff details by name
export const getTariffDetails = async (name: string) => {
  return apiClient.get(
    `/api/resource/Daily Tariff/${encodeURIComponent(name)}`
  );
};

// Get raw materials
export const getRawMaterials = async () => {
  return apiClient.get("/api/resource/Item", {
    params: {
    fields: JSON.stringify([
  "name",
  "item_name",
  "item_code",
  "item_group",
  "image"
]),
      filters: JSON.stringify([
        ["item_group", "=", "Raw Material"],
      ]),
    },
  });
};

// Create Daily Tariff
export const createRateCard = async (payload: any) => {
  return apiClient.post(
    "/api/resource/Daily Tariff",
    payload
  );
};

// Update Daily Tariff
// Update Daily Tariff
export const updateRateCard = async (
  rateCardName: string,
  payload: any
) => {
  console.log("========== UPDATE RATE CARD ==========");
  console.log("Rate Card Name:", rateCardName);
  console.log("Payload:", JSON.stringify(payload, null, 2));

  try {
    const response = await apiClient.put(
      `/api/resource/Daily Tariff/${encodeURIComponent(rateCardName)}`,
      payload
    );

    console.log("Update Response:", response.data);
    console.log("====================================");

    return response;
  } catch (error: any) {
    console.error("UPDATE RATE CARD ERROR");
    console.error("Status:", error?.response?.status);
    console.error("Response:", error?.response?.data);
    console.error("Error:", error);

    throw error;
  }
};

// Delete Daily Tariff
export const deleteRateCard = async (rateCardName: string) => {
  return apiClient.delete(
    `/api/resource/Daily Tariff/${encodeURIComponent(rateCardName)}`
  );
};


export const getRateCardItems = async () => {
  return apiClient.get(
    "/api/resource/Daily Tariff/Rate%20Card%20-%201"
  );
};