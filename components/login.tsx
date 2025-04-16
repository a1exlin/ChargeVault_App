import { SERVER_URI } from '@env';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { checkToken } from './utils/auth';


export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigation = useNavigation<any>();


  useEffect(() => {
    const runTokenCheck = async () => {
      console.log('Checking token...');
      const isValid = await checkToken();
      if (isValid) {
        console.log('Token is valid. Navigating to Home.');
        navigation.navigate('Home');
      } else {
        console.log('Token is invalid or not found.');
      }
    };


    runTokenCheck();
  }, []);


  const handleLogin = async () => {
    setLoginError('');


    console.log('SERVER_URI:', SERVER_URI); // Confirm .env is working

    try {
      const res = await fetch(`${SERVER_URI}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });


      const data = await res.json();


      if (res.ok && data.message === 'Success') {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('username', data.username);
        console.log('Token and username stored:', data.token, data.username);


        navigation.navigate('Home');
      } else {
        setLoginError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('A network error occurred during login.');
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


      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>


      {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}


      <Text style={styles.signupText}>Don’t have an account?</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupLink}>Sign Up</Text>
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
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 12,
  },
  signupText: {
    fontSize: 14,
    color: '#888',
  },
  signupLink: {
    fontSize: 16,
    color: '#007bff',
    marginTop: 4,
  },
});

