import AsyncStorage from '@react-native-async-storage/async-storage';

export async function checkToken(): Promise<boolean> {
  const token = await AsyncStorage.getItem('token');
  const username = await AsyncStorage.getItem('username');

  if (!token || !username) {
    await AsyncStorage.multiRemove(['token', 'username']);
    return false;
  }

  try {
    const res = await fetch('http://localhost:3001/api/tokenValidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, username }),
    });

    const data = await res.json();

    if (res.ok && data.message === 'Success') {
      return true;
    } else {
      await AsyncStorage.multiRemove(['token', 'username']);
      return false;
    }
  } catch (err) {
    console.error('Token validation failed:', err);
    await AsyncStorage.multiRemove(['token', 'username']);
    return false;
  }
}
