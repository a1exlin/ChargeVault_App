import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_URI } from '@env';
import { useNavigation } from '@react-navigation/native';

interface Slot {
  id: number;
  status: string;
  ufid?: string;
}

export default function ReserveSlotScreen() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const validateToken = async () => {
      const token = await AsyncStorage.getItem('token');
      const storedUsername = await AsyncStorage.getItem('username');

      if (!token || !storedUsername) {
        navigation.navigate('Login' as never);
        return;
      }

      try {
        const res = await fetch(`${SERVER_URI}/api/tokenValidate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, username: storedUsername }),
        });

        const data = await res.json();
        if (!res.ok || data.message !== 'Success') {
          await AsyncStorage.clear();
          navigation.navigate('Login' as never);
        } else {
          setUsername(storedUsername);
        }
      } catch (err) {
        console.error('Token validation error:', err);
        navigation.navigate('Login' as never);
      }
    };

    validateToken();
  }, [navigation]);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await fetch(`${SERVER_URI}/api/getSlots`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        console.log('Fetched slots:', data);
        setSlots(data); // <- updated here
      } catch (err) {
        console.error('Failed to fetch slots:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  const reserveSlot = async (slot: Slot) => {
    try {
      await fetch(`${SERVER_URI}/api/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ufid: username,
          slotID: slot.id,
          status: 'reserved',
        }),
      });

      await fetch(`http://10.136.10.226:3002/reserve${slot.id}`);
      setSlots(prev =>
        prev.map(s => (s.id === slot.id ? { ...s, status: 'reserved', ufid: username || '' } : s))
      );
    } catch (err) {
      console.error('Reservation failed:', err);
    }
  };

  const releaseSlot = async (slot: Slot) => {
    try {
      await fetch(`${SERVER_URI}/api/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ufid: 'None',
          slotID: slot.id,
          status: 'empty',
        }),
      });

      await fetch(`http://10.136.10.226:3002/unreserve${slot.id}`);
      setSlots(prev =>
        prev.map(s => (s.id === slot.id ? { ...s, status: 'empty', ufid: 'None' } : s))
      );
    } catch (err) {
      console.error('Release failed:', err);
    }
  };

  const triggerArduinoUnlock = async () => {
    try {
      const response = await fetch('http://10.136.10.226:3002/unlock');
      console.log('Unlocked:', await response.text());
    } catch (err) {
      console.error('Unlock error:', err);
    }
  };

  const triggerArduinoLock = async () => {
    try {
      const response = await fetch('http://10.136.10.226:3002/lock');
      console.log('Locked:', await response.text());
    } catch (err) {
      console.error('Lock error:', err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Charger Slots</Text>

      {Array.isArray(slots) && slots.map(slot => {
        const color = slot.status === 'reserved' ? 'orange' : 'gray';
        const label = `ID: ${slot.id}`;
        const statusLabel =
          slot.status === 'empty'
            ? 'Available'
            : slot.status === 'reserved'
            ? 'Pending'
            : 'Unavailable';

        return (
          <View key={slot.id} style={styles.slotBox}>
            <Text style={{ color, fontWeight: 'bold' }}>{label}</Text>
            <Text>Status: {statusLabel}</Text>
            <Text>Reserver: {slot.ufid || 'None'}</Text>

            <View style={styles.lockIcons}>
              {slot.status === 'empty' ? (
                <>
                  <TouchableOpacity onPress={() => reserveSlot(slot)}>
                    <Text style={styles.lockButton}>🔒</Text>
                  </TouchableOpacity>
                  <Text style={styles.disabledIcon}>🔓</Text>
                </>
              ) : (
                <>
                  <Text style={styles.disabledIcon}>🔒</Text>
                  {slot.ufid === username ? (
                    <TouchableOpacity onPress={() => releaseSlot(slot)}>
                      <Text style={styles.lockButton}>🔓</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.disabledIcon}>🔓</Text>
                  )}
                </>
              )}
            </View>
          </View>
        );
      })}

      <TouchableOpacity style={styles.button} onPress={triggerArduinoUnlock}>
        <Text style={styles.buttonText}>Unlock</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={triggerArduinoLock}>
        <Text style={styles.buttonText}>Lock</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  slotBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    width: '90%',
    alignItems: 'center',
  },
  lockIcons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  lockButton: {
    fontSize: 24,
    color: '#333',
    marginHorizontal: 10,
  },
  disabledIcon: {
    fontSize: 24,
    color: '#ccc',
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: '#0020aa',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

