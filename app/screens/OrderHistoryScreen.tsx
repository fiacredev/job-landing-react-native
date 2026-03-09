import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Card, Text, IconButton } from "react-native-paper";
import { getCustomerDeliveries } from '../services/deliveryService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from "expo-location";

interface Delivery {
  _id: string;
  pickup: { lat: number; lng: number };
  dropoff: { lat: number; lng: number };
  pickupAddress?: string;
  dropoffAddress?: string;
  status: string;
  createdAt: string;
}

export default function OrderHistoryScreen() {
  
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();



    useEffect(() => {
      const fetchData = async () => {

      try {

        const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        console.error("User not logged in");
        return;
      }

      const deliveries = await getCustomerDeliveries(userId);

          const deliveriesWithAddresses = await Promise.all(
            deliveries.map(async (delivery: any) => {
              const pickupGeo = await Location.reverseGeocodeAsync({
                latitude: delivery.pickup.lat,
                longitude: delivery.pickup.lng,
              });

              const dropoffGeo = await Location.reverseGeocodeAsync({
                latitude: delivery.dropoff.lat,
                longitude: delivery.dropoff.lng,
              });

              const pickupAddress =
                pickupGeo.length > 0
                  ? `${pickupGeo[0].name || ""} ${pickupGeo[0].street || ""}, ${
                      pickupGeo[0].city || ""
                    }`
                  : "Unknown location";

              const dropoffAddress =
                dropoffGeo.length > 0
                  ? `${dropoffGeo[0].name || ""} ${dropoffGeo[0].street || ""}, ${
                      dropoffGeo[0].city || ""
                    }`
                  : "Unknown location";

              return {
                ...delivery,
                pickupAddress,
                dropoffAddress,
              };
            })
          );

          setDeliveries(deliveriesWithAddresses);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []);

  const renderDelivery = ({ item }: { item: Delivery }) => (
    <Card style={styles.card} elevation={2}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          Delivery #{item._id.slice(-6)}
        </Text>
        <Text variant="bodyMedium">
          Pickup: {item.pickupAddress}
        </Text>

        <Text variant="bodyMedium">
          Dropoff: {item.dropoffAddress}
        </Text>
        <Text variant="bodyMedium">Status: {item.status}</Text>
        <Text variant="bodyMedium">
          Date: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text variant="bodyLarge">Loading order history...</Text>
      </View>
    );
  }

  if (!deliveries || deliveries.length === 0) {
  return (
    <View style={styles.center}>
      <Text variant="bodyLarge">No deliveries found.</Text>
    </View>
  );
}

  return (
    <SafeAreaView style={{ flex:1 }}>
    <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => navigation.goBack()}
            />

            <Text style={styles.pageTitle}>
              Deliveries History..
            </Text>
        </View>

      <FlatList
        data={deliveries}
        keyExtractor={(item) => item._id}
        renderItem={renderDelivery}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginBottom: 10,
    borderRadius: 12,
  },
  title: {
    marginBottom: 4,
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