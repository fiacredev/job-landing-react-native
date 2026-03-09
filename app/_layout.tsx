import { Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import { DriverProvider } from "./components/DriverContext";

export default function RootLayout() {
  return (
    <PaperProvider>
      <DriverProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </DriverProvider>
    </PaperProvider>
  );
}