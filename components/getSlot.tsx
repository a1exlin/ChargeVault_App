import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { checkToken } from './utils/auth'; // adjust path if needed

interface Slot {
  id: number;
  status: string;
  ufid?: string;
}

export default function SlotList() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const runTokenCheck = async () => {
      const isValid = await checkToken();
      if (!isValid) {
        navigation.navigate('Login' as never);
      }
    };
    runTokenCheck();
  }, []);

  useEffect(() => {
    const loadUsername = async () => {
      const stored = await AsyncStorage.getItem('username');
      setUsername(stored);
    };
    loadUsername();
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/getSlots', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setSlots(data);
      } catch (error) {
        console.error('Failed to fetch slots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const reserveSlot = async (slot: Slot) => {
    try {
      const response = await fetch('http://localhost:3001/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ufid: username,
          slotID: slot.id,
          status: 'reserved',
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSlots((prev) =>
          prev.map((s) =>
            s.id === slot.id ? { ...s, status: 'reserved', ufid: username || 'None' } : s
          )
        );
      }
    } catch (err) {
      console.error('Failed to reserve slot:', err);
    }
  };

  const releaseSlot = async (slot: Slot) => {
    try {
      const response = await fetch('http://localhost:3001/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ufid: 'None',
          slotID: slot.id,
          status: 'empty',
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSlots((prev) =>
          prev.map((s) =>
            s.id === slot.id ? { ...s, status: 'empty', ufid: 'None' } : s
          )
        );
      }
    } catch (err) {
      console.error('Failed to free slot:', err);
    }
  };

  const renderItem = ({ item }: { item: Slot }) => {
    let text = 'Status Error';
    let color = 'gray';

    if (item.status === 'empty') {
      text = 'Available';
      color = 'green';
    } else if (item.status === 'full') {
      text = 'Not Available';
      color = 'red';
    } else if (item.status === 'reserved') {
      text = 'Pending';
      color = 'orange';
    }

    return (
      <View style={styles.row}>
        <Text style={styles.cell}>{item.id}</Text>
        <Text style={[styles.cell, { color, fontWeight: 'bold' }]}>{text}</Text>
        <Text style={styles.cell}>{item.ufid || 'None'}</Text>
        <View style={styles.cell}>
          {item.status === 'empty' ? (
            <>
              <TouchableOpacity onPress={() => reserveSlot(item)}>
                <Text style={styles.icon}>🔒</Text>
              </TouchableOpacity>
              <Text style={[styles.icon, styles.inactive]}>🔓</Text>
            </>
          ) : (item.status === 'full' || item.status === 'reserved') &&
            item.ufid === username ? (
            <>
              <Text style={[styles.icon, styles.inactive]}>🔒</Text>
              <TouchableOpacity onPress={() => releaseSlot(item)}>
                <Text style={styles.icon}>🔓</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={[styles.icon, styles.inactive]}>🔒🔓</Text>
          )}
        </View>
      </View>
    );
  };

  if (loading || username === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#333" />
        <Text>Loading slots...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Charger Slots</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.cell}>Slot ID</Text>
        <Text style={styles.cell}>Status</Text>
        <Text style={styles.cell}>UFID</Text>
        <Text style={styles.cell}>Reserve</Text>
      </View>
      <FlatList
        data={slots}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  icon: {
    fontSize: 20,
    marginHorizontal: 4,
  },
  inactive: {
    opacity: 0.3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
