import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SERVER_URI } from "@env";

// Define the structure of each log entry
type AccessLog = {
  username: string;
  rfid: string;
  location?: string;
  time: number;
};

export default function AccessHistory() {
  const [logs, setLogs] = useState<AccessLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${SERVER_URI}/api/getLogs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <ScrollView style={styles.wrapper}>
      <Text style={styles.heading}>Access Logs</Text>

      <View style={styles.rowHeader}>
        <Text style={styles.cellHeader}>Username</Text>
        <Text style={styles.cellHeader}>RFID</Text>
        <Text style={styles.cellHeader}>Location</Text>
        <Text style={styles.cellHeader}>Time</Text>
      </View>

      {logs.map((log, index) => (
        <View
          key={index}
          style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}
        >
          <Text style={styles.cell}>{log.username}</Text>
          <Text style={styles.cell}>{log.rfid}</Text>
          <Text style={styles.cell}>{log.location || "—"}</Text>
          <Text style={styles.cell}>
            {new Date(log.time * 1000).toLocaleString()}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 50,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#0066cc",
    padding: 10,
  },
  cellHeader: {
    color: "white",
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  evenRow: {
    backgroundColor: "#f9f9f9",
  },
  oddRow: {
    backgroundColor: "#ffffff",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
  },
});
