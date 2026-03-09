import  React, {useEffect, useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet} from "react-native";
import { Button } from "react-native-paper";
import MapSection from "../components/mapSection";
import BottomPanel from "../components/BottomPanel";
import { Delivery, updateDeliveryStatus, DeliveryStatus } from "../services/deliveryService";
import { useLiveLocation } from "../hooks/useLiveLocation";
import { io, Socket } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location"

export default function DriverHomeScreen(){


const SERVER_URL = "https://curb-side-backend.onrender.com";

const [isOnline, setIsOnline] = useState(false);
const [socket, setSocket] = useState<Socket | null>(null);
const coords = useLiveLocation(isOnline);
const [delivery, setDelivery] = useState<any | null>(null);
const [driverId, setDriverId] = useState<string | null>(null);
        


        useEffect(() => {
        const loadUser = async () => {
            const storedDriverId = await AsyncStorage.getItem("userId");

        if (storedDriverId) {
            console.log("Logged driver:", storedDriverId);
            setDriverId(storedDriverId);
        }
        };

        loadUser();
        }, []);

    useEffect(() => {
        const s = io(SERVER_URL, {
            transports: ["websocket"],
        });
        s.on("connect", () => {
            console.log("socket connected:", s.id);
        });
        s.on("disconnect", () => {
            console.log("socket disconnected");
        });

        s.on("driver:update", (data: { driverId: string; lat: number; lng: number }) => {
            if (data.driverId === driverId) {
                console.log("backend confirmed location saved:", data);
            }
        });

        setSocket(s);
        return () => {
            s.disconnect();
        };
    }, []);
    
    // function to make sure that everything is going well or not

        useEffect(() => {
            if (!coords || !isOnline) return;
            if (!socket || !socket.connected) return;
            if (!driverId) return;

        console.log("Emitting location...", coords);

        socket.emit("driver:location", {
            driverId,
            lat: coords.latitude,
            lng: coords.longitude
        });

        }, [coords, isOnline, socket, driverId]);



        const handleUpdateStatus = async (status: DeliveryStatus) => {
            try {

                if (!delivery) return;

                const updatedDelivery = await updateDeliveryStatus(
                delivery._id,
                status
                );

                setDelivery(updatedDelivery);

            } catch (error) {
                console.log("Status update failed:", error);
            }
        };

    
    return(
        <SafeAreaView style={{ flex:1 }} >
        <View style={styles.container}>
            <MapSection isOnline={isOnline} delivery={delivery}/>
            <BottomPanel isOnline={isOnline} setIsOnline={setIsOnline} delivery={delivery} updateStatus={handleUpdateStatus}/>
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    }
})