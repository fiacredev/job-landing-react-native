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