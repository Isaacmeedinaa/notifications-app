import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Button, View, Alert } from "react-native";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  useEffect(() => {
    Permissions.getAsync(Permissions.NOTIFICATIONS)
      .then((statusObj) => {
        if (statusObj.status !== "granted") {
          Permissions.askAsync(Permissions.NOTIFICATIONS);
        }
        return statusObj;
      })
      .then((statusObj) => {
        if (statusObj.status !== "granted") {
          return;
        }
      });
  }, []);

  useEffect(() => {
    const bgSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        // you can navigate to another screen here
        console.log(response);
      }
    );

    const fgSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        // you can navigate to another screen here
        console.log(notification);
      }
    );

    return () => {
      bgSubscription.remove();
      fgSubscription.remove();
    };
  }, []);

  const triggerNotificationHandler = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "My first local notification",
        body: "This is the first local notification we are sending",
        data: { mySpecialData: "Some Data" },
      },
      trigger: {
        seconds: 10,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Button
        title="Trigger Notification"
        onPress={triggerNotificationHandler}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
