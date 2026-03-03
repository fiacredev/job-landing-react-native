import * as React from "react";
import { Provider as Paperprovider} from "react-native-maps"
import { PaperProvider } from "react-native-paper";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DriverHomeScreen from "./screens/driverHomeScreen";
import CustomerHomeScreen from "./components/customer/CustomerHomeScreen";

export default function App(){
    return(
        <PaperProvider>
            <SafeAreaView style={styles.container}>
                <CustomerHomeScreen />
            </SafeAreaView>
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})