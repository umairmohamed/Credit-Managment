import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';

const AddCustomerScreen = ({ navigation }) => {
  const { addCustomer, addDebt } = useApp();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [initialCredit, setInitialCredit] = useState('');

  const handleSave = () => {
    if (!name || !mobile) {
      Alert.alert('Error', 'Name and Mobile are required');
      return;
    }
    try {
      const newCustomer = addCustomer(name, mobile);
      if (initialCredit && !isNaN(initialCredit) && parseFloat(initialCredit) > 0) {
          addDebt(newCustomer.id, initialCredit);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Customer Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter Name"
        placeholderTextColor="#7D8498"
      />
      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        value={mobile}
        onChangeText={setMobile}
        placeholder="Enter 9-digit Mobile Number"
        placeholderTextColor="#7D8498"
        keyboardType="phone-pad"
        maxLength={9}
      />
       <Text style={styles.label}>Initial Credit (Debt) - Optional</Text>
      <TextInput
        style={styles.input}
        value={initialCredit}
        onChangeText={setInitialCredit}
        placeholder="Enter Initial Credit Amount"
        placeholderTextColor="#7D8498"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Customer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EFEEEE',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#3E4152',
    marginTop: 10,
  },
  input: {
    backgroundColor: '#EFEEEE',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    color: '#3E4152',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  saveBtn: {
      backgroundColor: '#EFEEEE',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
      shadowColor: '#A3B1C6',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 5,
  },
  saveBtnText: {
      color: '#4F46E5',
      fontWeight: 'bold',
      fontSize: 16,
  }
});

export default AddCustomerScreen;
