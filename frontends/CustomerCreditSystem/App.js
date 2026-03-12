import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppProvider, useApp } from './src/context/AppContext';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AddCustomerScreen from './src/screens/AddCustomerScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user } = useApp();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#EFEEEE', // Neumorphic light gray
          elevation: 0, // Remove flat shadow to handle it differently or keep flat
          shadowOpacity: 0, // iOS
        },
        headerTintColor: '#3E4152', // Dark text
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {user ? (
        <>
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ title: 'Customer Credit System' }}
          />
          <Stack.Screen
            name="AddCustomer"
            component={AddCustomerScreen}
            options={{ title: 'Add Customer' }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}
