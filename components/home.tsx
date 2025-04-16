import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { checkToken } from './utils/auth';
import { RootStackParamList } from './navigation';
import { Image } from 'react-native';
import Logo from './imgs/logo.png'

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    const runCheck = async () => {
      const isValid = await checkToken();
      if (!isValid) {
        navigation.navigate('Login');
      }
    };
    runCheck();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <Image source={Logo} style={{width: 150, height: 150, borderRadius: 10, }}></Image>
        <Text style={styles.heading}>Home</Text>
        <Text style={styles.text}>
          You are signed into: {"\n"}
          <Text style={{ fontWeight: 'bold' }}>Midtown Atlanta Office / Building Renovation</Text>
        </Text>
        <Text>If this is not your construction site:</Text>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.link}>Click here</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.iconBar}>
        <Button title="Home" onPress={() => navigation.navigate('Home')} />
        <Button title="Slots" onPress={() => navigation.navigate('Slots')} />
        <Button title="Access History" onPress={() => navigation.navigate('AccessHistory')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    justifyContent: 'space-between',
    backgroundColor: '#d6ecf7',
    alignItems: 'center',
  },
  panel: {
    marginTop: 60,
    padding: 20,
    backgroundColor: '#c3dbe5',
    borderRadius: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  iconBar: {
    marginBottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0c3c60',

  },
});

