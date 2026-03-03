const BASE_URL = "https://curb-side-backend.onrender.com";

export interface Delivery {
  id: string;
  pickupAddress: string;
  dropAddress: string;
  status: DeliveryStatus;
  pickup?: {
    lat: number;
    lng: number;
  };
  dropoff?: {
    lat: number;
    lng: number;
  };
}

export type DeliveryStatus = | "pending" | "accepted" | "arrived" | "in_progress" | "completed";

export const updateDeliveryStatus = async (
  deliveryId: string,
  status: DeliveryStatus
) => {
  const response = await fetch(
    `${BASE_URL}/deliveries/${deliveryId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update delivery status");
  }

  return response.json();
};


export const getNearbyDrivers = async (
  latitude: number,
  longitude: number
) => {
  const response = await fetch(
    `${BASE_URL}/drivers/nearby?lat=${latitude}&lng=${longitude}`
  );

  if (!response.ok) {
    throw new Error("failed to fetch nearby drivers");
  }

  return response.json();
};


export const createDelivery = async (data: {
  pickup: { lat: number; lng: number };
  dropoff: { lat: number; lng: number };
}) => {
  try {
    console.log("sending delivery data:", data);

    const response = await fetch(`${BASE_URL}/deliveries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    console.log("response status:", response.status);

    const responseData = await response.json();
    if (!response.ok) {
      console.error("aPI error response:", responseData);
      throw new Error(responseData.message || "failed to create delivery");
    }
    return responseData;
  } catch (err) {
    console.error("createDelivery failed:", err);
    throw err;
  }
};