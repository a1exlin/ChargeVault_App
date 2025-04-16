import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SERVER_URI } from '@env';

export default function AccessHistoryScreen() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${SERVER_URI}/api/getLoginLogs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error('Failed to fetch login logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={{ marginTop: 10 }}>Loading logs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login History</Text>
      <FlatList
        data={logs}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.noData}>No logs found</Text>}
        renderItem={({ item, index }) => {
          const readTime = new Date(item.time * 1000).toLocaleString();
          const rowStyle = index % 2 === 0 ? styles.evenRow : styles.oddRow;

          return (
            <View style={[styles.row, rowStyle]}>
              <Text style={styles.cell}>{item.username}</Text>
              <Text style={styles.cell}>{readTime}</Text>
              <Text style={styles.cell}>{item.ip}</Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    color: '#666',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
