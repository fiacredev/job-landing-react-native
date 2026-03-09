import React, { useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as Updates from "expo-updates";
import { Button } from "react-native-paper";
import { getNearbyDrivers, createDelivery } from "../services/deliveryService";
import { Alert } from "react-native";
import { calculateETA } from "@/app/utils/calculateETA";
import { Portal, Dialog, Text } from "react-native-paper";
import { useRouter } from "expo-router";

export default function CustomerHomeScreen() {
    
  const mapRef = useRef<MapView | null>(null);

  const router = useRouter();

  const [userLocation, setUserLocation] = useState<any>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [buttonDeliveryLoading, setButtonDeliveryLoading] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);

// states to help our users deal with creating deliveries 

const [pickup, setPickup] = useState<any>(null);
const [drop, setDrop] = useState<any>(null);
const [delivery, setDelivery] = useState<any>(null);

// states deal with calcualting ETA calcualtion of customer when new delivery is assigned

const [eta, setEta] = useState<number | null>(null);
const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const storedCustomerId = await AsyncStorage.getItem("userId");

        if (storedCustomerId) {
          console.log("Logged customer:", storedCustomerId);
          setCustomerId(storedCustomerId);
        }
      } catch (err) {
        console.error("Failed to load customer:", err);
      }
    };

    loadCustomer();
  }, []);
  

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
   

  // react neattive papper indicator when app is still loading and when no user location available
  if (loading || !userLocation) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <>
     <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
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

        { !delivery && drivers.map((driver) => {
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

          {pickup && !delivery &&(
          <Marker coordinate={pickup} title="Pickup" pinColor="green" />
          )}

          {/* showing drop marker when user clicked on map */}

          {drop && !delivery && (
          <Marker coordinate={drop} title="Drop" pinColor="red" />
          )}

          
      </MapView>
           
              <Dialog.Content>
                  <View style={styles.dialog}>
                  <Button mode="contained" onPress={() => router.push("/screens/OrderHistoryScreen")} style={styles.dialogButton}>History</Button>
                  </View>
              </Dialog.Content>

      

          {pickup && drop && !delivery && (
          <>
              <View style={styles.bottomPanel}>
              <Button
              mode="contained"
              // buttonColor="blue"
              contentStyle={styles.buttonContent}
              style={styles.requestButton}
              loading={ !buttonDeliveryLoading }
              disabled={!pickup || !drop}
              textColor="white"
              onPress={async () => {
                  try {

                    if (!customerId) {
                      Alert.alert("Error", "User not authenticated");
                      return;
                    }

                    const payload = {
                      customer: customerId,
                      pickup: { lat: pickup.latitude, lng: pickup.longitude },
                      dropoff: { lat: drop.latitude, lng: drop.longitude },
                    };

                    const newDelivery = await createDelivery(payload);
                    
                    setDelivery(newDelivery);
                    // deal with calculating estimated time, it can take 
                    const estimatedTime = calculateETA(pickup,drop)
                    setEta(estimatedTime);
                    setDialogVisible(true);
                    // setDelivery(newDelivery);
                  } catch (err: any) {
                    console.error("Delivery request failed:", err);
                    Alert.alert("Error", err.message || "Failed to create delivery");
                  }
                }}
            >
              Request Delivery
            </Button>       
            </View>
          </>
        )}

        {/* for the pop up eefeciency, we got render this below of the component return */}

            <Portal>
              <Dialog style={styles.dialog} visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                <Dialog.Title style={styles.dialogTitle}>Delivery Created 🔜</Dialog.Title>
                <Dialog.Content>
                  <Text style={styles.dialogText}>
                    Your delivery request was created successfully.
                  </Text>
                  <Text style={styles.etaText}>
                    Estimated Arrival Time: {eta} minutes
                  </Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button style={styles.dialogButton} onPress={() => setDialogVisible(false)}>OK</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
    </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },

  map: {
    // ...StyleSheet.absoluteFillObject,
    flex: 1,
  },

  bottomPanel: {
    position: "absolute",
    bottom: 10,
    left: "25%",
    right: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    alignSelf: "center",
    width:"50%",

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,

    // aandroid shadow
    elevation: 8,
  },

  requestButton: {
    borderRadius: 12,
  },

  buttonContent: {
    paddingVertical: 8,
  },

  // deal with designing the pop up 

  dialog: {
    borderRadius: 20,
    backgroundColor: "white",
},

dialogTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
},

dialogText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
},

etaText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#2563eb",
},

dialogButton: {
    borderRadius: 10,
    paddingHorizontal: 10,
},
 buttonHistoryContainer: {
    width:"25%",
    padding: 10,
    backgroundColor: "#684de0",
    color:"#fff",
    justifyContent: "center",
  },
});