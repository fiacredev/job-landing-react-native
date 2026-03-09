import * as React from "react";
import { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { DriverProvider } from "./components/DriverContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";

import DriverHomeScreen from "./screens/driverHomeScreen";
import AvailableDeliveries from "./screens/AvailableDeliveries";
import CustomerHomeScreen from "./screens/CustomerHomeScreen";
import DriverLoginScreen from "./screens/DriverLoginScreen";
import DriverSignupScreen from "./screens/DriverSignupScreen";
import RoleSelectionScreen from "./screens/RoleSelectionScreen";

export default function App({ children }: { children: ReactNode }) {
  return (
      <SafeAreaView style={styles.container}>
        <RoleSelectionScreen />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});