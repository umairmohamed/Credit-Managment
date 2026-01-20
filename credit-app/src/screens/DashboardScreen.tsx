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

  const totalSuppliersCredit = suppliers.reduce((sum, s) => sum + s.credit, 0);
  const totalInvestmentGiven = investments.filter(i => i.type === 'given').reduce((sum, i) => sum + i.amount, 0);
  const totalInvestmentTaken = investments.filter(i => i.type === 'taken').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="app-layout">
      <div className="sidebar glass-panel-sidebar">
        <div className="sidebar-header">
           <h2>Credit App</h2>
        </div>
        <div className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => onTabChange('customers')}>
            Customers
          </button>
          <button className={`nav-item ${activeTab === 'suppliers' ? 'active' : ''}`} onClick={() => onTabChange('suppliers')}>
            Suppliers
          </button>
          <button className={`nav-item ${activeTab === 'investments' ? 'active' : ''}`} onClick={() => onTabChange('investments')}>
            Investments
          </button>
        </div>
        <div className="sidebar-footer">
           <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="main-content">
        {activeTab === 'customers' && (
            <div className="view-container">
                <div className="view-header glass-header">
                     <div className="total-credit-section">
                        <span className="total-label">Total Customer Credit</span>
                        <span className="total-amount">LKR {totalCredit.toFixed(2)}</span>
                     </div>
                </div>
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
                            <span className="card-amount" style={{color: '#EF4444'}}>Credit: LKR {item.credit.toFixed(2)}</span>
                            <button onClick={() => handlePaymentClick(item)} className="action-btn pay-btn">Pay</button>
                        </div>
                        </div>
                    ))
                    )}
                </div>
            </div>
        )}

        {activeTab === 'suppliers' && (
            <div className="view-container">
                <div className="view-header glass-header">
                     <div className="total-credit-section">
                        <span className="total-label">Total Supplier Credit</span>
                        <span className="total-amount" style={{ color: '#F59E0B', WebkitTextFillColor: '#F59E0B' }}>LKR {totalSuppliersCredit.toFixed(2)}</span>
                     </div>
                </div>
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
                            <span className="card-amount" style={{color: '#F59E0B'}}>Due: LKR {item.credit.toFixed(2)}</span>
                            <button className="action-btn" style={{backgroundColor: '#F59E0B'}}>Pay</button>
                        </div>
                        </div>
                    ))
                    )}
                </div>
            </div>
        )}

        {activeTab === 'investments' && (
            <div className="view-container">
                 <div className="investments-summary glass-header">
                    <div className="summary-item">
                        <span className="total-label">Total Given</span>
                        <span className="total-amount" style={{ color: '#10B981', WebkitTextFillColor: '#10B981' }}>LKR {totalInvestmentGiven.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        <span className="total-label">Total Taken</span>
                        <span className="total-amount" style={{ color: '#EF4444', WebkitTextFillColor: '#EF4444' }}>LKR {totalInvestmentTaken.toFixed(2)}</span>
                    </div>
                 </div>

                <div className="investments-container">
                    <div className="investment-section given-section">
                        <h3 className="section-title">Given</h3>
                        {investments.filter(i => i.type === 'given').map(item => (
                            <div key={item.id} className="card glass-card investment-card given">
                                 <div className="card-info">
                                    <span className="card-name">{item.name}</span>
                                    <span className="card-sub">{item.mobile || 'No Contact'}</span>
                                    <span className="card-date">{new Date(item.date).toLocaleDateString()}</span>
                                </div>
                                <span className="card-amount" style={{color: '#10B981'}}>LKR {item.amount.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="investment-section taken-section">
                        <h3 className="section-title">Taken</h3>
                        {investments.filter(i => i.type === 'taken').map(item => (
                            <div key={item.id} className="card glass-card investment-card taken">
                                 <div className="card-info">
                                    <span className="card-name">{item.name}</span>
                                    <span className="card-sub">{item.mobile || 'No Contact'}</span>
                                    <span className="card-date">{new Date(item.date).toLocaleDateString()}</span>
                                </div>
                                <span className="card-amount" style={{color: '#EF4444'}}>LKR {item.amount.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        <div className="fab-container-floating">
           <button onClick={handleFabClick} className={`fab-btn ${activeTab}`}>
               +
           </button>
        </div>
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
