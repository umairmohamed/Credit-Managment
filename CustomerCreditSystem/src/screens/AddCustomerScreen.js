import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
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
      />
      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        value={mobile}
        onChangeText={setMobile}
        placeholder="Enter 9-digit Mobile Number"
        keyboardType="phone-pad"
        maxLength={9}
      />
       <Text style={styles.label}>Initial Credit (Debt) - Optional</Text>
      <TextInput
        style={styles.input}
        value={initialCredit}
        onChangeText={setInitialCredit}
        placeholder="Enter Initial Credit Amount"
        keyboardType="numeric"
      />
      <Button title="Save Customer" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default AddCustomerScreen;
