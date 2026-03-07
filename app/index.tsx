import * as React from "react";
import { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { DriverProvider } from "./components/DriverContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";

import DriverHomeScreen from "./screens/driverHomeScreen";
import AvailableDeliveries from "./screens/AvailableDeliveries";
import CustomerHomeScreen from "./components/customer/CustomerHomeScreen";

export default function App({ children }: { children: ReactNode }) {
  return (
    <PaperProvider>
    <DriverProvider>
      <SafeAreaView style={styles.container}>
        <DriverHomeScreen />
      </SafeAreaView>
    </DriverProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});