// src/screens/OrderHistoryScreen.tsx
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Card, Text, IconButton } from "react-native-paper";
import { getCustomerDeliveries } from "../../services/deliveryService";

interface Delivery {
  _id: string;
  pickup: { lat: number; lng: number };
  dropoff: { lat: number; lng: number };
  status: string;
  createdAt: string;
}

export default function OrderHistoryScreen() {
  
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  const userIdForTesting = "6995a1441287438bcc1b863b"; // temporary test id

  const navigation = useNavigation();

  useEffect(() => {
  const fetchData = async () => {
    try {
      const deliveries = await getCustomerDeliveries(userIdForTesting);
      setDeliveries(deliveries);
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
          Pickup: {item.pickup.lat.toFixed(4)}, {item.pickup.lng.toFixed(4)}
        </Text>
        <Text variant="bodyMedium">
          Dropoff: {item.dropoff.lat.toFixed(4)}, {item.dropoff.lng.toFixed(4)}
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