import { Alert } from "react-native";

const BASE_URL = "https://curb-side-backend.onrender.com";

// interfce for users customers.
export interface AuthUser {
  _id?: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  success: boolean;
  customer?: AuthUser;
}


// interface for drivers users
export interface DriverAuthUser {
  _id: string;
  name: string;
  email: string;
}

export interface DriverAuthResponse {
  message: string;
  token?: string;
  success: boolean;
  driver?: DriverAuthUser;
}

// DRIVER LOGIN
export const loginDriver = async (email: string, password: string): Promise<DriverAuthResponse> => {
  try {
    console.log("Driver login attempt:", email);

    const response = await fetch(`${BASE_URL}/api/auth/signin/driver`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("response status:", response.status);

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      console.error("API error:", data);
      throw new Error(data.message || "Driver login failed");
    }

    return data;
  } catch (err) {
    console.error("loginDriver failed:", err);
    throw err;
  }
};

// DRIVER SIGNUP
export const signupDriver = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    console.log("Driver signup:", name, email);

    const response = await fetch(`${BASE_URL}/signup/driver`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        location: {
          type: "Point",
          coordinates: [30.0619, -1.9441],
        },
      }),
    });

    console.log("response status:", response.status);

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      console.error("API error:", data);
      throw new Error(data.message || "Driver signup failed");
    }

    Alert.alert("Signup Successful", "Driver account created!");

    return data;
  } catch (err) {
    console.error("signupDriver failed:", err);
    throw err;
  }
};

// CUSTOMER LOGIN
export const loginCustomer = async (email: string, password: string) => {
  try {
    console.log("Customer login:", email);

    const response = await fetch(`${BASE_URL}/api/auth/signin/customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("response status:", response.status);

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      console.error("API error:", data);
      throw new Error(data.message || "Customer login failed");
    }

    return data;
  } catch (err) {
    console.error("loginCustomer failed:", err);
    throw err;
  }
};

// CUSTOMER SIGNUP
export const signupCustomer = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    console.log("Customer signup:", name, email);

    const response = await fetch(`${BASE_URL}/signup/customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    console.log("response status:", response.status);

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      console.error("API error:", data);
      throw new Error(data.message || "Customer signup failed");
    }

    Alert.alert("Signup Successful", "Customer account created!");

    return data;
  } catch (err) {
    console.error("signupCustomer failed:", err);
    throw err;
  }
};