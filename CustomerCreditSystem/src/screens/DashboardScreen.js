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
    backgroundColor: '#F3F4F6', // Matching web bg
  },
  header: {
    backgroundColor: '#4F46E5', // Matching web primary
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  totalLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalAmount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 12,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 12,
    borderRadius: 16, // More rounded
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  mobile: {
    color: '#6B7280',
    marginTop: 4,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  credit: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 8,
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
