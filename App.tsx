import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './components/store';

// Import your screens
import LoginScreen from './components/login';
import HomeScreen from './components/home';
import SignupScreen from './components/signup';
import SlotList from './components/getSlot';
import AccessHistoryScreen from './components/accessHistory';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Slots: undefined;
  AccessHistory: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: true,
            headerTitleAlign: 'center',
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Slots" component={SlotList} />
          <Stack.Screen name="AccessHistory" component={AccessHistoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

