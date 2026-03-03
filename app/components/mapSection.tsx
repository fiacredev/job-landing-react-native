import React from "react";
import { View ,StyleSheet } from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE, AnimatedRegion} from "react-native-maps";
import { Delivery } from "../services/deliveryService";
import { useLiveLocation } from "../hooks/useLiveLocation";

interface Props {
  isOnline: boolean;
  delivery: Delivery | null;
}

export default function MapSection({ isOnline, delivery }: Props){

    const coords = useLiveLocation(isOnline);
    const mapRef = React.useRef<MapView>(null);
    // const markerRef = React.useRef<React.ElementRef<typeof Marker>>(null);

    // mapRef ref not supported and gonna be removed soon
    

    //     React.useEffect(() => {
    //     if (!coords) return;

    //     markerRef.current?.animateMarkerToCoordinate(
    //         {
    //         latitude: coords.latitude,
    //         longitude: coords.longitude,
    //         },
    //         800 // duration ms
    //     );
    //     }, [coords]);

            
    //     React.useEffect(() => {
    //     if (!mapRef.current || !coords) return;

    //     const points: any[] = [
    //     {
    //         latitude: coords.latitude,
    //         longitude: coords.longitude,
    //     },

    //     ];
            
    //     if (delivery?.pickup && delivery.status === "accepted") {
    //     points.push({
    //         latitude: delivery.pickup.lat,
    //         longitude: delivery.pickup.lng,
    //     });
    //     }

    //     if (delivery?.dropoff) {
    //     points.push({
    //         latitude: delivery.dropoff.lat,
    //         longitude: delivery.dropoff.lng,
    //     });
    //     }

    //     if (points.length > 1) {
    //     mapRef.current.fitToCoordinates(points, {
    //         edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
    //         animated: true,
    //     });
    // }
    // }, [delivery, coords]);

    if (!coords) return null;

//    please be and pay atttention on this have to be rendered last to prevernt error of rendering before previous hook


    return(
        <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            followsUserLocation={true}
            style = {styles.map}
            region={{
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }}
            >

            {/* this marker ref not supported and is about to be removed soon */}
            <Marker coordinate={coords} title="Cheuffeur" />

            {delivery?.pickup && (
            <Marker
                coordinate={{
                latitude: delivery.pickup.lat,
                longitude: delivery.pickup.lng,
                }}
                title="Pickup"
                pinColor="yellow"
            />
            )}



            {delivery?.dropoff && (
            <Marker
                coordinate={{
                latitude: delivery.dropoff.lat,
                longitude: delivery.dropoff.lng,
                }}
                title="Dropoff"
                pinColor="green"
            />
            )}


        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    }
})