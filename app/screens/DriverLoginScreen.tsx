import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, StyleSheet, Alert } from "react-native";
import { TouchableOpacity, Text as RNText } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";
import { loginDriver } from "../services/authService";
import { useRouter } from "expo-router";

const DriverLoginScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

    const handleLogin = async () => {

    if (loading) return; // prevent double clicks
    setLoading(true);

    try {
      const result = await loginDriver(email, password);

      console.log("Customer login:", result);

      if (result.token && result.driver) {

      await AsyncStorage.setItem("token", result.token);
      await AsyncStorage.setItem("userId", result.driver._id!);
      await AsyncStorage.setItem("userName", result.driver.name);
      await AsyncStorage.setItem("userEmail", result.driver.email);

        console.log("Logged in user:", result.driver.email);

        router.push("/screens/driverHomeScreen"); 
        return;
      }else{
        Alert.alert("Login Failed", "Invalid email or password");
      }

      // success → go to driver dashboard

    } catch (err) {
      Alert.alert("Login Failed", "Invalid email or password");
    }
  };


  return (
    <View style={styles.container}>
      <Title style={styles.title}>Driver Login</Title>

      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <Button mode="contained" onPress={handleLogin} disabled={loading}>
        Login
      </Button>

      <View style={styles.SignUpcontainer}>
        <RNText style={styles.SignUpmessage}>Don't have an account? </RNText>
        <TouchableOpacity onPress={() => router.push("/screens/DriverSignupScreen")}>
          <RNText style={styles.SignUplink}>Sign Up</RNText>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default DriverLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
  },
  SignUpcontainer: { 
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16
  },
  SignUpmessage: { 
    fontSize: 16,
    color: "#333"
   },
  SignUplink: { 
    fontSize: 16,
    color: "#007bff", 
    textDecorationLine: "underline" 
  },
});