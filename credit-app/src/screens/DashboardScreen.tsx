import React, { useState } from 'react';
import { useApp, type Customer } from '../context/AppContext';
import PaymentModal from '../components/PaymentModal';

export type TabType = 'customers' | 'suppliers' | 'investments';

interface DashboardScreenProps {
  onNavigate: (screen: string) => void;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate, activeTab, onTabChange }) => {
  const { customers, suppliers, investments, totalCredit, addPayment, logout } = useApp();
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

  const handleFabClick = () => {
      if (activeTab === 'customers') onNavigate('AddCustomer');
      else if (activeTab === 'suppliers') onNavigate('AddSupplier');
      else if (activeTab === 'investments') onNavigate('AddInvestment');
  };

  return (
    <div className="dashboard-container glass-panel">
      <div className="dashboard-header glass-header">
        <div className="total-credit-section">
            <span className="total-label">Total Credit</span>
            <span className="total-amount">${totalCredit.toFixed(2)}</span>
        </div>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>

      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => onTabChange('customers')}>Customers</button>
        <button className={`tab-btn ${activeTab === 'suppliers' ? 'active' : ''}`} onClick={() => onTabChange('suppliers')}>Suppliers</button>
        <button className={`tab-btn ${activeTab === 'investments' ? 'active' : ''}`} onClick={() => onTabChange('investments')}>Investments</button>
      </div>

      <div className="content-area">
        {activeTab === 'customers' && (
            <div className="list-container">
                {customers.length === 0 ? (
                <p className="empty-text">No customers found.</p>
                ) : (
                customers.map((item) => (
                    <div key={item.id} className="card glass-card customer-card-style">
                    <div className="card-info">
                        <span className="card-name">{item.name}</span>
                        <span className="card-sub">{item.mobile}</span>
                    </div>
                    <div className="card-actions">
                        <span className="card-amount" style={{color: '#EF4444'}}>Credit: ${item.credit.toFixed(2)}</span>
                        <button onClick={() => handlePaymentClick(item)} className="action-btn pay-btn">Pay</button>
                    </div>
                    </div>
                ))
                )}
            </div>
        )}

        {activeTab === 'suppliers' && (
            <div className="list-container">
                {suppliers.length === 0 ? (
                <p className="empty-text">No suppliers found.</p>
                ) : (
                suppliers.map((item) => (
                    <div key={item.id} className="card glass-card supplier-card-style">
                    <div className="card-info">
                        <span className="card-name">{item.name}</span>
                        <span className="card-sub">{item.mobile}</span>
                    </div>
                    <div className="card-actions">
                        <span className="card-amount" style={{color: '#F59E0B'}}>Due: ${item.credit.toFixed(2)}</span>
                        <button className="action-btn" style={{backgroundColor: '#F59E0B'}}>Pay</button>
                    </div>
                    </div>
                ))
                )}
            </div>
        )}

        {activeTab === 'investments' && (
            <div className="investments-container">
                <div className="investment-section given-section">
                    <h3 className="section-title">Given</h3>
                    {investments.filter(i => i.type === 'given').map(item => (
                        <div key={item.id} className="card glass-card investment-card given">
                             <div className="card-info">
                                <span className="card-name">{item.name}</span>
                                <span className="card-date">{new Date(item.date).toLocaleDateString()}</span>
                            </div>
                            <span className="card-amount" style={{color: '#10B981'}}>${item.amount.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="investment-section taken-section">
                    <h3 className="section-title">Taken</h3>
                    {investments.filter(i => i.type === 'taken').map(item => (
                        <div key={item.id} className="card glass-card investment-card taken">
                             <div className="card-info">
                                <span className="card-name">{item.name}</span>
                                <span className="card-date">{new Date(item.date).toLocaleDateString()}</span>
                            </div>
                            <span className="card-amount" style={{color: '#EF4444'}}>${item.amount.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>

      <div className="fab-container">
         <button onClick={handleFabClick} className={`fab-btn ${activeTab}`}>
             {activeTab === 'customers' ? 'Add Customer' : activeTab === 'suppliers' ? 'Add Supplier' : 'Add Investment'}
         </button>
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
