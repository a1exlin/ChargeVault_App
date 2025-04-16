import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./navigation"; // adjust path as needed

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function NavBar() {
  const navigation = useNavigation<NavProp>();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text style={styles.icon}>🏠</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Slots")}>
        <Text style={styles.icon}>🔋</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("AccessHistory")}>
        <Text style={styles.icon}>🔒</Text>
      </TouchableOpacity>

      <View style={styles.logoutWrapper}>
        <TouchableOpacity onPress={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          navigation.navigate("Login");
        }}>
          <Text style={styles.icon}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#222",
    padding: 12,
  },
  icon: {
    fontSize: 20,
    color: "white",
    marginHorizontal: 10,
  },
  logoutWrapper: {
    marginLeft: "auto",
  },
});
