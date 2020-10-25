import { Platform, ToastAndroid, Alert } from "react-native";

export const showMessage = (message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert('', message);
  }   
}