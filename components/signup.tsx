import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://10.91.245.203:3001/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.status === 201) {
        Alert.alert('Success', 'Account created!');
        navigation.navigate('Login' as never);
      } else {
        Alert.alert('Signup Failed', data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      Alert.alert('Error', 'An error occurred during signup.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CHARGEVault</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>Already have an account?</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
        <Text style={styles.loginLink}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    paddingTop: 100,
    alignItems: 'center',
    backgroundColor: '#e2edf2',
  },
  title: {
    fontSize: 32,
    marginBottom: 40,
    fontWeight: 'bold',
  },
  input: {
    width: '90%',
    padding: 12,
    marginBottom: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 16,
    color: 'black',
  
  },
  button: {
    backgroundColor: '#0c3c60',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#0c3c60',
  },
  loginText: {
    fontSize: 14,
    color: '#888',
  },
  loginLink: {
    fontSize: 16,
    color: '#007bff',
    marginTop: 4,
  },
});
