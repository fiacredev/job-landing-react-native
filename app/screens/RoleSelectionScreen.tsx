import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import { useRouter } from "expo-router";


const RoleSelectionScreen = ({ navigation }: any) => {
    
const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={() => router.push("/screens/DriverLoginScreen")}
          >
            I am a Driver
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={() => router.push("/screens/CustomerLoginScreen")}
          >
            I am a Customer
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

export default RoleSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
    fontSize: 24,
  },
  card: {
    marginBottom: 20,
  },
});