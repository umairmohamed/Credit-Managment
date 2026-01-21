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
        <Text style={styles.credit}>Credit: LKR {item.credit.toFixed(2)}</Text>
        <TouchableOpacity style={styles.payBtn} onPress={() => handlePaymentClick(item)}>
            <Text style={styles.payBtnText}>Pay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.totalLabel}>Total Credit</Text>
        <Text style={styles.totalAmount}>LKR {totalCredit.toFixed(2)}</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={customers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No customers found.</Text>}
      />

      <View style={styles.fabContainer}>
         <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddCustomer')}>
            <Text style={styles.fabText}>+</Text>
         </TouchableOpacity>
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
    backgroundColor: '#EFEEEE',
  },
  header: {
    backgroundColor: '#EFEEEE',
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  totalLabel: {
    color: '#7D8498',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  totalAmount: {
    color: '#3E4152',
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 12,
  },
  logoutBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#EFEEEE',
    borderRadius: 12,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#EFEEEE',
    padding: 20,
    marginBottom: 16,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3E4152',
  },
  mobile: {
    color: '#7D8498',
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
  payBtn: {
    backgroundColor: '#EFEEEE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#A3B1C6',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2,
  },
  payBtnText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
  fabContainer: {
      position: 'absolute',
      bottom: 30,
      right: 30,
  },
  fab: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#EFEEEE',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#A3B1C6',
      shadowOffset: { width: 4, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 5,
  },
  fabText: {
      fontSize: 30,
      color: '#4F46E5',
      marginTop: -2,
  }
});

export default DashboardScreen;
