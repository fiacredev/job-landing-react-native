import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Button } from "react-native-paper";
import { getNearbyDrivers, createDelivery } from "../../services/deliveryService";
import { Alert } from "react-native";

export default function CustomerHomeScreen() {
    
  const mapRef = useRef<MapView | null>(null);

  const [userLocation, setUserLocation] = useState<any>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

// states to help our users deal with creating deliveries 

const [pickup, setPickup] = useState<any>(null);
const [drop, setDrop] = useState<any>(null);
const [delivery, setDelivery] = useState<any>(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const location = await Location.getCurrentPositionAsync({});
    const coords = location.coords;

    const userCoords = {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };

    setUserLocation(userCoords);

    const nearbyDrivers = await getNearbyDrivers(
      coords.latitude,
      coords.longitude
    );

    setDrivers(nearbyDrivers);
    setLoading(false);
  };

  if (loading || !userLocation) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation

        // when user click on the map, we got fetch location he/she prefer

        onLongPress={(e) => {
        const coords = e.nativeEvent.coordinate;

        if (!pickup) {
              setPickup(coords);
            } else if (!drop) {
              setDrop(coords);
            }
        }}
      >

        {/* showing nearby drivers */}

        {drivers.map((driver) => {
        const [longitude, latitude] = driver.location.coordinates;

            return (
              <Marker
                key={driver._id}
                coordinate={{
                  latitude,
                  longitude,
                }}
                title={driver.name}
                pinColor="blue"
              />
            );
          })}

          {/* showing pick up marker when user clicked on map */}

          {pickup && (
          <Marker coordinate={pickup} title="Pickup" pinColor="green" />
          )}

          {/* showing drop marker when user clicked on map */}

          {drop && (
          <Marker coordinate={drop} title="Drop" pinColor="red" />
          )}

          
      </MapView>

          {pickup && drop && !delivery && (
            <Button
             mode="contained-tonal"
             buttonColor="blue"
             loading={ !delivery }
             disabled={!pickup && !drop && !delivery}
             textColor="white"
             onPress={async () => {
                try {

                  const payload = {
                  pickup: { lat: pickup.latitude, lng: pickup.longitude },
                  dropoff: { lat: drop.latitude, lng: drop.longitude },
                  };

                  const newDelivery = await createDelivery(payload);
                  
                  setDelivery(newDelivery);
                } catch (err: any) {
                  console.error("Delivery request failed:", err);
                  Alert.alert("Error", err.message || "Failed to create delivery");
                }
              }}
          >
            Request Delivery
          </Button>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});