import  React, {useEffect, useState} from "react";
import { View, StyleSheet } from "react-native";
import MapSection from "../components/mapSection";
import BottomPanel from "../components/BottomPanel";
import { Delivery, updateDeliveryStatus, DeliveryStatus } from "../services/deliveryService";
import { useLiveLocation } from "../hooks/useLiveLocation";
import { io, Socket } from "socket.io-client";
import * as Location from "expo-location"


export default function DriverHomeScreen(){

const SERVER_URL = "https://curb-side-backend.onrender.com";

const [isOnline, setIsOnline] = useState(false);
const [socket, setSocket] = useState<Socket | null>(null);
const coords = useLiveLocation(isOnline);
const [delivery, setDelivery] = useState<any | null>(null);
        

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
        if (data.driverId === "69a6e8500ccedebcb2e6bb22") {
            console.log("backend confirmed location saved:", data);
        }
        });

        setSocket(s);
        return () => {
            s.disconnect();
        };
    }, []);
    
    // function to make sure that everything is going well or not

    useEffect(()=>{

        console.log("about to emit location...");
        if (!coords || !isOnline) return;
        if (!coords || !isOnline) return;
        if (!socket || !socket.connected) return;

        console.log("Emitting location...", { lat: coords.latitude, lng: coords.longitude });

        socket.emit("driver:location",{
            driverId: "69a6e8500ccedebcb2e6bb22",
            lat: coords.latitude,
            lng:coords.longitude
        });
        console.log("location emitted");
    },[coords,isOnline]);




    // deal with background tracking even when the app is minimized

    // const startBackgroundTracking = async () => {
    // await Location.startLocationUpdatesAsync("background-location-task", {
    //     accuracy: Location.Accuracy.High,
    //     timeInterval: 5000,
    //     distanceInterval: 10,
    //     showsBackgroundLocationIndicator: true,
    //     foregroundService: {
    //     notificationTitle: "Driver Tracking",
    //     notificationBody: "Your location is being tracked",
    //     },
    // });
    // };

    // function to deal with stop backgound tracking

    // const stopBackgroundTracking = async () => {
    // await Location.stopLocationUpdatesAsync("background-location-task");
    // };

    // // useEffect to deal with making sure that some driver is online then track unless that stop tracking 

    // useEffect(()=>{
    //     if(isOnline){
    //         startBackgroundTracking();
    //     }else{
    //         stopBackgroundTracking();
    //     }
    // },[isOnline]);


    // deal with updating status of delivery

  const handleUpdateStatus = async (status: DeliveryStatus) => {
        try {
        const updatedDelivery = await updateDeliveryStatus( "6995a1441287438bcc1b8641", status);
        console.log("Server Responded with: ", updatedDelivery );
        setDelivery(updatedDelivery); // trust serveer response
        } catch (error) {
        console.log("Status update failed:", error);
    }
    };

    
    return(
        <View style={styles.container}>
            <MapSection isOnline={isOnline} delivery={delivery}/>
            <BottomPanel isOnline={isOnline} setIsOnline={setIsOnline} delivery={delivery} updateStatus={handleUpdateStatus}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    }
})