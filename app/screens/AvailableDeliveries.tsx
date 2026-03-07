import React, { useEffect, useState, useContext } from "react";
import { DriverContext } from "../components/DriverContext";
import { useNavigation } from '@react-navigation/native';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { IconButton } from "react-native-paper";
import * as Location from "expo-location";

import { getNearbyDeliveries, updateDeliveryStatus, DeliveryStatus } from "../services/deliveryService";

export default function AvailableDeliveriesScreen() {

const { socket } = useContext(DriverContext);

  useEffect(() => {
    if (!socket) return;

    socket.on("delivery:update", (data) => {
      console.log("New delivery update:", data);
    });

    return () => {
      socket.off("delivery:update");
    };
  }, [socket]);


  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchNearbyDeliveries();
  }, []);

  const fetchNearbyDeliveries = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      const lat = location.coords.latitude;
      const lng = location.coords.longitude;

      const data = await getNearbyDeliveries(lat, lng);

      setDeliveries(data);
    } catch (err) {
      console.log("failed to fetch deliveries", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    deliveryId: string,
    status: DeliveryStatus
  ) => {
    try {
      const updated = await updateDeliveryStatus(deliveryId, status);

      setDeliveries((prev) =>
        prev.map((d) => (d._id === deliveryId ? updated : d))
      );
    } catch (error) {
      console.log("Status update failed:", error);
    }
  };

  const renderDelivery = ({ item }: any) => {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.deliveryId}>Delivery #{item._id.slice(-5)}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.addressContainer}>
          <Text style={styles.label}>Pickup</Text>
          <Text style={styles.address}>{item.pickup?.lat}, {item.pickup?.lng}</Text>
        </View>

        <View style={styles.addressContainer}>
          <Text style={styles.label}>Dropoff</Text>
          <Text style={styles.address}>{item.dropoff?.lat}, {item.dropoff?.lng}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.acceptBtn}
            onPress={() => handleUpdateStatus(item._id, "accepted")}
          >
            <Text style={styles.btnText}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => handleUpdateStatus(item._id, "in_progress")}
          >
            <Text style={styles.btnText}>Start</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.completeBtn}
            onPress={() => handleUpdateStatus(item._id, "completed")}
          >
            <Text style={styles.btnText}>Delivered</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>finding nearby deliveries...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => navigation.goBack()}
            />

            <Text style={styles.pageTitle}>
              Available Nearby Deliveries...
            </Text>
        </View>

      <FlatList
        data={deliveries}
        keyExtractor={(item) => item._id}
        renderItem={renderDelivery}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
        <View style={styles.center}>
        <Text>No nearby deliveries found</Text>
        </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    padding: 12,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  deliveryId: {
    fontWeight: "bold",
    fontSize: 16,
  },

  statusBadge: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    color: "#1976D2",
    fontWeight: "600",
  },

  addressContainer: {
    marginBottom: 10,
  },

  label: {
    fontSize: 12,
    color: "#888",
  },

  address: {
    fontSize: 14,
    fontWeight: "500",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  acceptBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  startBtn: {
    backgroundColor: "#2196F3",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  completeBtn: {
    backgroundColor: "#FF9800",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  btnText: {
    color: "white",
    fontWeight: "600",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pageTitle:{
  fontSize:20,
  textAlign:"center",
  fontWeight:"700",
  color:"#333",
  backgroundColor:"#f5f5f5",
  padding:10,
  borderRadius:8
}
});