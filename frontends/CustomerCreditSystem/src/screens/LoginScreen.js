import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';

const LoginScreen = () => {
  const { login, register } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    if (isRegistering) {
      const success = register(username, password);
      if (success) {
        Alert.alert('Success', 'Registered successfully. Please login.');
        setIsRegistering(false);
      } else {
        Alert.alert('Error', 'Username already exists');
      }
    } else {
      const success = login(username, password);
      if (!success) {
        Alert.alert('Error', 'Invalid credentials');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{isRegistering ? 'Register' : 'Admin Login'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#7D8498"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#7D8498"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
           <Text style={styles.buttonText}>{isRegistering ? 'Register' : 'Login'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)} style={styles.toggleContainer}>
          <Text style={styles.toggleText}>
            {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#EFEEEE',
  },
  card: {
    backgroundColor: '#EFEEEE',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#3E4152',
  },
  input: {
    backgroundColor: '#EFEEEE',
    padding: 15,
    marginBottom: 20,
    borderRadius: 12,
    color: '#3E4152',
    // Simulate inset by using shadow on wrapper or just flat
    // Using flat with border for now to keep it clean, or subtle shadow
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: '#EFEEEE',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
      color: '#4F46E5',
      fontWeight: 'bold',
      fontSize: 16,
  },
  toggleContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    color: '#7D8498',
  },
});

export default LoginScreen;
