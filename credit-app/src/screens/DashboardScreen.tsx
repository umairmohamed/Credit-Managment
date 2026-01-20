import React, { useState, useEffect } from 'react';
import { useApp, type Customer, type Supplier, type Investment } from '../context/AppContext';
import PaymentModal from '../components/PaymentModal';
import InvoiceModal from '../components/InvoiceModal';

export type TabType = 'customers' | 'suppliers' | 'investments' | 'admin';

interface DashboardScreenProps {
  onNavigate: (screen: string) => void;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate, activeTab, onTabChange }) => {
  const { customers, suppliers, investments, totalCredit, addPayment, addSupplierPayment, processInvestmentPayment, logout, adminProfile, updateAdminProfile } = useApp();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isInvoiceVisible, setIsInvoiceVisible] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<{amount: string, date: string, payeeName: string} | null>(null);

  const [localAdminProfile, setLocalAdminProfile] = useState(adminProfile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    setLocalAdminProfile(adminProfile);
  }, [adminProfile]);

  const handlePaymentClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSelectedSupplier(null);
    setSelectedInvestment(null);
    setIsModalVisible(true);
  };

  const handleSupplierPaymentClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setSelectedCustomer(null);
    setSelectedInvestment(null);
    setIsModalVisible(true);
  };

  const handleInvestmentPaymentClick = (investment: Investment) => {
    setSelectedInvestment(investment);
    setSelectedCustomer(null);
    setSelectedSupplier(null);
    setIsModalVisible(true);
  };

  const handlePaymentSubmit = (amount: string) => {
    if (selectedCustomer) {
      addPayment(selectedCustomer.id, amount);
      setLastTransaction({
          amount,
          date: new Date().toLocaleString('en-LK'),
          payeeName: selectedCustomer.name
      });
      setIsInvoiceVisible(true);
    } else if (selectedSupplier) {
      addSupplierPayment(selectedSupplier.id, amount);
      setLastTransaction({
          amount,
          date: new Date().toLocaleString('en-LK'),
          payeeName: selectedSupplier.name
      });
      setIsInvoiceVisible(true);
    } else if (selectedInvestment) {
      processInvestmentPayment(selectedInvestment.id, amount);
      setLastTransaction({
          amount,
          date: new Date().toLocaleString('en-LK'),
          payeeName: selectedInvestment.name
      });
      setIsInvoiceVisible(true);
    }
  };

  const handleFabClick = () => {
      if (activeTab === 'customers') onNavigate('AddCustomer');
      else if (activeTab === 'suppliers') onNavigate('AddSupplier');
      else if (activeTab === 'investments') onNavigate('AddInvestment');
  };

  const handleSaveProfile = () => {
    updateAdminProfile(localAdminProfile);
    setIsEditingProfile(false);
    window.alert('Profile Saved Successfully!');
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalAdminProfile({ ...localAdminProfile, shopLogo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const totalSuppliersCredit = suppliers.reduce((sum, s) => sum + s.credit, 0);
  const totalInvestmentGiven = investments.filter(i => i.type === 'given').reduce((sum, i) => sum + i.amount, 0);
  const totalInvestmentTaken = investments.filter(i => i.type === 'taken').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="app-layout">
      <div className="sidebar">
        <div className="sidebar-header">
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              {adminProfile.shopLogo && <img src={adminProfile.shopLogo} alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />}
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{adminProfile.shopName || 'Credit App'}</h2>
           </div>
           <div style={{ fontSize: '0.9rem', opacity: 0.8, paddingLeft: adminProfile.shopLogo ? '50px' : '0' }}>{adminProfile.adminName}</div>
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
          <button className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => onTabChange('admin')}>
            Admin Profile
          </button>
        </div>
        <div className="sidebar-footer">
           <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="main-content">
        {activeTab === 'customers' && (
            <div className="view-container">
                <div className="view-header">
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
                        <div key={item.id} className="card customer-card">
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

        {activeTab === 'admin' && (
            <div className="view-container">
                <div className="view-header">
                    <span className="total-label" style={{fontSize: '1.5rem'}}>Admin Profile</span>
                    {!isEditingProfile && (
                        <button className="action-btn" onClick={() => setIsEditingProfile(true)} style={{backgroundColor: '#4F46E5'}}>Edit Profile</button>
                    )}
                </div>
                <div className="list-container" style={{padding: '20px'}}>
                   {!isEditingProfile ? (
                       <div className="profile-overview card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                {adminProfile.shopLogo ? (
                                    <img src={adminProfile.shopLogo} alt="Shop Logo" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e5e7eb' }} />
                                ) : (
                                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>No Logo</div>
                                )}
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '2rem' }}>{adminProfile.shopName || 'N/A'}</h2>
                                    <p style={{ margin: '5px 0', color: '#6b7280' }}>{adminProfile.adminName}</p>
                                </div>
                            </div>
                            <div style={{ width: '100%', height: '1px', background: '#e5e7eb' }}></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%', gap: '20px' }}>
                                <div>
                                    <label style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 600 }}>Contact Number</label>
                                    <p style={{ fontSize: '1.1rem', margin: '5px 0' }}>{adminProfile.contactNumber || 'N/A'}</p>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 600 }}>Address</label>
                                    <p style={{ fontSize: '1.1rem', margin: '5px 0' }}>{adminProfile.address || 'N/A'}</p>
                                </div>
                            </div>
                       </div>
                   ) : (
                       <div style={{padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px'}} className="card">
                          <div className="form-group">
                              <label style={{display: 'block', marginBottom: '5px'}}>Shop Logo</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="modal-input"
                              />
                              {localAdminProfile.shopLogo && <img src={localAdminProfile.shopLogo} alt="Preview" style={{ width: '60px', height: '60px', marginTop: '10px', borderRadius: '8px', objectFit: 'cover' }} />}
                          </div>
                          <div className="form-group">
                              <label style={{display: 'block', marginBottom: '5px'}}>Shop Name</label>
                              <input
                                className="modal-input"
                                value={localAdminProfile.shopName}
                                onChange={(e) => setLocalAdminProfile({...localAdminProfile, shopName: e.target.value})}
                              />
                          </div>
                          <div className="form-group">
                              <label style={{display: 'block', marginBottom: '5px'}}>Admin Name</label>
                              <input
                                className="modal-input"
                                value={localAdminProfile.adminName}
                                onChange={(e) => setLocalAdminProfile({...localAdminProfile, adminName: e.target.value})}
                              />
                          </div>
                          <div className="form-group">
                              <label style={{display: 'block', marginBottom: '5px'}}>Contact Number</label>
                              <input
                                className="modal-input"
                                value={localAdminProfile.contactNumber}
                                onChange={(e) => setLocalAdminProfile({...localAdminProfile, contactNumber: e.target.value})}
                              />
                          </div>
                          <div className="form-group">
                              <label style={{display: 'block', marginBottom: '5px'}}>Address</label>
                              <textarea
                                className="modal-input"
                                style={{minHeight: '80px', paddingTop: '10px'}}
                                value={localAdminProfile.address}
                                onChange={(e) => setLocalAdminProfile({...localAdminProfile, address: e.target.value})}
                              />
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                              <button
                                onClick={handleSaveProfile}
                                className="action-btn"
                                style={{backgroundColor: '#10B981', marginTop: '10px'}}
                              >
                                Save Profile
                              </button>
                              <button
                                onClick={() => setIsEditingProfile(false)}
                                className="action-btn"
                                style={{backgroundColor: '#9CA3AF', marginTop: '10px'}}
                              >
                                Cancel
                              </button>
                          </div>
                       </div>
                   )}
                </div>
            </div>
        )}

        {activeTab === 'suppliers' && (
            <div className="view-container">
                <div className="view-header">
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
                        <div key={item.id} className="card supplier-card">
                        <div className="card-info">
                            <span className="card-name">{item.name}</span>
                            <span className="card-sub">{item.mobile}</span>
                        </div>
                        <div className="card-actions">
                            <span className="card-amount" style={{color: '#F59E0B'}}>Due: LKR {item.credit.toFixed(2)}</span>
                            <button className="action-btn" style={{backgroundColor: '#F59E0B'}} onClick={() => handleSupplierPaymentClick(item)}>Pay</button>
                        </div>
                        </div>
                    ))
                    )}
                </div>
            </div>
        )}

        {activeTab === 'investments' && (
            <div className="view-container">
                 <div className="investments-summary">
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
                            <div key={item.id} className="card investment-card given">
                                 <div className="card-info">
                                    <span className="card-name">{item.name}</span>
                                    <span className="card-sub">{item.mobile || 'No Contact'}</span>
                                    <span className="card-date">{new Date(item.date).toLocaleDateString()}</span>
                                </div>
                                <div className="card-actions">
                                    <span className="card-amount" style={{color: '#10B981'}}>LKR {item.amount.toFixed(2)}</span>
                                    <button className="action-btn" style={{backgroundColor: '#10B981'}} onClick={() => handleInvestmentPaymentClick(item)}>Pay</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="investment-section taken-section">
                        <h3 className="section-title">Taken</h3>
                        {investments.filter(i => i.type === 'taken').map(item => (
                            <div key={item.id} className="card investment-card taken">
                                 <div className="card-info">
                                    <span className="card-name">{item.name}</span>
                                    <span className="card-sub">{item.mobile || 'No Contact'}</span>
                                    <span className="card-date">{new Date(item.date).toLocaleDateString()}</span>
                                </div>
                                <div className="card-actions">
                                    <span className="card-amount" style={{color: '#EF4444'}}>LKR {item.amount.toFixed(2)}</span>
                                    <button className="action-btn" style={{backgroundColor: '#EF4444'}} onClick={() => handleInvestmentPaymentClick(item)}>Pay</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {activeTab !== 'admin' && (
            <div className="fab-container-floating">
               <button onClick={handleFabClick} className={`fab-btn ${activeTab}`}>
                   +
               </button>
            </div>
        )}
      </div>

      <PaymentModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handlePaymentSubmit}
        payeeName={selectedCustomer ? selectedCustomer.name : selectedSupplier ? selectedSupplier.name : selectedInvestment?.name}
      />

      <InvoiceModal
        visible={isInvoiceVisible}
        onClose={() => setIsInvoiceVisible(false)}
        transactionDetails={lastTransaction}
        adminProfile={adminProfile}
      />
    </div>
  );
};

export default DashboardScreen;
