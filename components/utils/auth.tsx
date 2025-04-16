import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation'; // adjust the path if needed
import { SERVER_URI } from '@env';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export async function checkToken() {
  try {
    const token = await AsyncStorage.getItem("token") || "";
    const username = await AsyncStorage.getItem("username") || "";

    if (!token || !username) {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("username");
      return false;
    }

    const res = await fetch(`${SERVER_URI}/api/tokenValidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, username }),
    });

    const data = await res.json();

    if (res.ok && data.message === "Success") {
      return true;
    } else {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("username");
      return false;
    }
  } catch (err) {
    console.error("Token validation failed:", err);
    return false;
  }
}

export default function LogoutButton() {
  const navigation = useNavigation<NavProp>();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("username");
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} color="#ff3b30" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
  },
});
console.log("SEVER_URI in checkToken:" , SERVER_URI);
console.log("Calling:", `${SERVER_URI}/api/tokenValidate`);