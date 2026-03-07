import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Card, Text, Portal, Dialog } from "react-native-paper"
import { Delivery, DeliveryStatus } from "../services/deliveryService";
import { useRouter } from "expo-router";

    interface BottomPanelProps {
      isOnline: boolean;
      setIsOnline: (val: boolean) => void;
      delivery: Delivery | null;
      updateStatus: (status: DeliveryStatus) => void;
    }


    const BottomPanel: React.FC<BottomPanelProps> = ({
        isOnline,
        setIsOnline,
        delivery,
        updateStatus,
    }) => {

    const toggleOnline = () => setIsOnline(!isOnline);
    const handleGoOnline = () => setIsOnline(true);
    const router = useRouter();

    const renderWorkflowButton = () => {
        
    if (!delivery) {
      if (!isOnline) {
        return <Text style={styles.message}>Go Online to receive deliveries</Text>;
      } else {
        return (
          <Button
            mode="contained-tonal"
            onPress={() => updateStatus("accepted")}
          >
            Accept Delivery...
          </Button>
        );
      }
    }

    switch (delivery.status) {
      case "accepted":
        return (
          <Button mode="contained" onPress={() => updateStatus("arrived")}>
            Arrived
          </Button>
        );
      case "arrived":
        return (
          <Button mode="contained" onPress={() => updateStatus("in_progress")}>
            Start Trip
          </Button>
        );
      case "in_progress":
        return (
          <Button mode="contained" onPress={() => updateStatus("completed")}>
            Complete
          </Button>
        );
      case "completed":
        return <Text style={styles.message}>Delivery completed</Text>;
      default:
        return null;
    }
  };

    return(
        <>
            <View style={styles.container}>
                <Button
                    mode={isOnline ? "contained" : "outlined"}
                    onPress={toggleOnline}
                     style={[styles.onlineButton, { width: "50%", alignSelf: "center" }]}
                >
                    {isOnline ? "Go Offline" : "Go Online"}
                </Button>
                <Button mode="contained" style={[styles.nearbyButton, { width: "70%", alignSelf: "center" }]} onPress={() => router.push("/screens/AvailableDeliveries")} >Available NearBy Deliveries</Button>
            </View>


            {/* in the meantime this codes bottom not being used for while */}

            {/* //    blocking app popup logic here implemented corectly. */}
        
        <Portal>
            <Dialog
             visible={!isOnline}
             dismissable={false}
             dismissableBackButton={false}
            >
            <Dialog.Title>You are offline</Dialog.Title>
            <Dialog.Content>
                <Text>
                    Please, you can't do anything regardless going online. APP BLOCKED 🧲⁉
                </Text>
            </Dialog.Content>
            <Dialog.Actions>
                <Button mode="contained" onPress={handleGoOnline}>
                    <Text style={styles.text}>Go online</Text>
                </Button>
            </Dialog.Actions>
            </Dialog>
        </Portal>


    </>

        );
    }

export default BottomPanel;

const styles = StyleSheet.create({
    card: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 10,
        backgroundColor:"#b39999",
        borderRadius:"10px",
    },

    text: {
        color:"#fff"
    },
    container: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
   },
    onlineButton: {
    marginBottom: 12,
    },

    workflow: {
        flexDirection: "row",
        justifyContent: "center",
    },
    message: {
        color: "gray",
        textAlign: "center",
        fontSize: 16,
    },
    nearbyButton: {
    borderRadius: 12,
    paddingHorizontal: 10,
    backgroundColor: "#ccc9c9",
},
})