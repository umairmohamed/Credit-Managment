import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useApp } from '../context/AppContext';
import PaymentModal from '../components/PaymentModal';

const DashboardScreen = ({ navigation }) => {
  const { customers, totalCredit, addPayment, logout } = useApp();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handlePaymentClick = (customer) => {
    setSelectedCustomer(customer);
    setIsModalVisible(true);
  };

  const handlePaymentSubmit = (amount) => {
    if (selectedCustomer) {
      addPayment(selectedCustomer.id, amount);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.mobile}>{item.mobile}</Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.credit}>Credit: ${item.credit.toFixed(2)}</Text>
        <Button title="Pay" onPress={() => handlePaymentClick(item)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.totalLabel}>Total Credit</Text>
        <Text style={styles.totalAmount}>${totalCredit.toFixed(2)}</Text>
        <Button title="Logout" onPress={logout} color="#555" />
      </View>

      <FlatList
        data={customers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No customers found.</Text>}
      />

      <View style={styles.fabContainer}>
         <Button title="Add Customer" onPress={() => navigation.navigate('AddCustomer')} />
      </View>

      <PaymentModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handlePaymentSubmit}
        customerName={selectedCustomer?.name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  totalLabel: {
    color: '#fff',
    fontSize: 16,
  },
  totalAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mobile: {
    color: '#666',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  credit: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
  fabContainer: {
      padding: 20,
  }
});

export default DashboardScreen;
