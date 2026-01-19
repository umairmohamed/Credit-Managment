import React, { useState } from 'react';
import { useApp, type Customer } from '../context/AppContext';
import PaymentModal from '../components/PaymentModal';

interface DashboardScreenProps {
  onNavigate: (screen: string) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  const { customers, totalCredit, addPayment, logout } = useApp();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handlePaymentClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalVisible(true);
  };

  const handlePaymentSubmit = (amount: string) => {
    if (selectedCustomer) {
      addPayment(selectedCustomer.id, amount);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="total-credit-section">
            <span className="total-label">Total Credit</span>
            <span className="total-amount">${totalCredit.toFixed(2)}</span>
        </div>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>

      <div className="customer-list">
        {customers.length === 0 ? (
          <p className="empty-text">No customers found.</p>
        ) : (
          customers.map((item) => (
            <div key={item.id} className="customer-card">
              <div className="customer-info">
                <span className="customer-name">{item.name}</span>
                <span className="customer-mobile">{item.mobile}</span>
              </div>
              <div className="customer-actions">
                <span className="customer-credit">Credit: ${item.credit.toFixed(2)}</span>
                <button onClick={() => handlePaymentClick(item)} className="pay-btn">Pay</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="fab-container">
         <button onClick={() => onNavigate('AddCustomer')} className="fab-btn">Add Customer</button>
      </div>

      <PaymentModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handlePaymentSubmit}
        customerName={selectedCustomer?.name}
      />
    </div>
  );
};

export default DashboardScreen;
