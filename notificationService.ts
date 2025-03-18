import * as Notifications from "expo-notifications";
import { getMessaging, getToken } from "firebase/messaging";
import { Platform } from "react-native";
import { db, auth } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export async function registerForPushNotificationsAsync() {
    let token = null;

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
        });
    }

    const messaging = getMessaging();
    token = await getToken(messaging, {
        vapidKey: "YOUR_VAPID_KEY", // Get from Firebase settings (for web push)
    });

    if (auth.currentUser && token) {
        await setDoc(doc(db, "users", auth.currentUser.uid), { fcmToken: token }, { merge: true });
    }

    return token;
}
