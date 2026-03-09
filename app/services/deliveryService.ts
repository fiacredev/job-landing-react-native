const BASE_URL = "https://curb-side-backend.onrender.com";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Alert } from "react-native";

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

  const driverId = await AsyncStorage.getItem("userId");

   if (!driverId) {
    throw new Error("Driver not logged in");
  }

  const response = await fetch(
    `${BASE_URL}/deliveries/${deliveryId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, driverId }),
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
  customer:string;
  pickup: { lat: number; lng: number };
  dropoff: { lat: number; lng: number };
}) => {
  try {
    
    console.log("customer:", data.customer);
    // console.log("customerEmail:", data.customerEmail);
    console.log("pickup:", data.pickup);
    console.log("dropoff:", data.dropoff);
    console.log("===========praise the Lord(every thing is working)=============");

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

    // Now check email status
    if (!responseData.emailSent) {
      Alert.alert(
        "Delivery Created",
        `Delivery created but email failed: ${responseData.emailError}`
      );
    } else {
      Alert.alert("Delivery Created", "Email sent successfully!");
    }

    return responseData;
  } catch (err) {
    console.error("createDelivery failed:", err);
    throw err;
  }
};

// fetch all deliveries for a specific customer
export const getCustomerDeliveries = async (customerId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/deliveries/${customerId}`);
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "failed to fetch deliveries");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("getCustomerDeliveries failed:", err);
    throw err;
  }
};

export const getNearbyDeliveries = async (lat: number, lng: number) => {
  const res = await fetch(
    `${BASE_URL}/deliveries/nearby?lat=${lat}&lng=${lng}`
  );

  if (!res.ok) {
    throw new Error(`Error fetching nearby deliveries: ${res.status}`);
  }

  const data = await res.json();
  return data;
};