import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { SERVER_URI } from '@env';
import { checkToken } from './utils/auth';

export default function ReserveSlot() {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const runTokenCheck = async () => {
      const isValid = await checkToken();
      const username = await AsyncStorage.getItem('username');
      setUserId(username || '');

      if (!isValid) {
        navigation.navigate('Login');
      }
    };

    runTokenCheck();
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await fetch(`${SERVER_URI}/api/getSlots`, {
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

  const reserveSlot = async (slot: any) => {
    try {
      const response = await fetch(`${SERVER_URI}/api/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ufid: userId,
          slotID: slot.id,
          status: 'reserved',
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSlots((prev) =>
          prev.map((s) =>
            s.id === slot.id ? { ...s, status: 'reserved', ufid: userId } : s
          )
        );
      }
    } catch (err) {
      console.error('Failed to reserve slot:', err);
    }
  };

  const releaseSlot = async (slot: any) => {
    try {
      const response = await fetch(`${SERVER_URI}/api/reserve`, {
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
      console.error('Failed to release slot:', err);
    }
  };

  const triggerArduino = async (path: string) => {
    try {
      const response = await fetch(`http://10.136.10.226:3002/${path}`, {
        method: 'GET',
      });
      console.log(`Arduino ${path} response:`, response);
    } catch (err) {
      console.error(`Failed to trigger Arduino ${path}:`, err);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Charger Slots</Text>
      {slots.map((slot) => {
        let text = 'Status Error';
        let color = 'black';

        if (slot.status === 'empty') {
          text = 'Available';
          color = 'green';
        } else if (slot.status === 'full') {
          text = 'Not Available';
          color = 'red';
        } else if (slot.status === 'reserved') {
          text = 'Pending';
          color = 'orange';
        }

        return (
          <View key={slot.id} style={styles.slotBox}>
            <Text>ID: {slot.id}</Text>
            <Text style={{ color, fontWeight: 'bold' }}>{text}</Text>
            <Text>Reserver: {slot.ufid || 'None'}</Text>
            <View style={styles.controls}>
              {slot.status === 'empty' ? (
                <>
                  <TouchableOpacity onPress={() => reserveSlot(slot)}>
                    <Text style={styles.lock}>🔒</Text>
                  </TouchableOpacity>
                  <Text style={styles.disabled}>🔓</Text>
                </>
              ) : (slot.status === 'full' || slot.status === 'reserved') &&
                userId === slot.ufid ? (
                <>
                  <Text style={styles.disabled}>🔒</Text>
                  <TouchableOpacity onPress={() => releaseSlot(slot)}>
                    <Text style={styles.lock}>🔓</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.disabled}>🔒🔓</Text>
              )}
            </View>
          </View>
        );
      })}
      <Button title="Unlock" onPress={() => triggerArduino('unlock')} />
      <View style={{ marginTop: 10 }}>
        <Button title="Lock" onPress={() => triggerArduino('lock')} />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  slotBox: {
    marginBottom: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  lock: {
    fontSize: 24,
  },
  disabled: {
    fontSize: 24,
    opacity: 0.3,
  },
});
