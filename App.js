import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AddMedScreen from './screens/AddMedScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* nota para mi: Auth Stack */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Registro" component={RegisterScreen} options={{ title: 'Crear Cuenta' }} />
        
        {/* nota para mi: Main Stack */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Mi Pastillero', headerBackVisible: false }} 
        />
        <Stack.Screen 
          name="AddMed" 
          component={AddMedScreen} 
          options={{ title: 'Nuevo Medicamento' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}