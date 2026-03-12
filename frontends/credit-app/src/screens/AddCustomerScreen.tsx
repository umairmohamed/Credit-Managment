import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface AddCustomerScreenProps {
  onGoBack: () => void;
}

const AddCustomerScreen: React.FC<AddCustomerScreenProps> = ({ onGoBack }) => {
  const { addCustomer, addDebt } = useApp();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [initialCredit, setInitialCredit] = useState('');

  const handleSave = () => {
    if (!name || !mobile) {
      alert('Error: Name and Mobile are required');
      return;
    }
    try {
      const newCustomer = addCustomer(name, mobile);
      if (initialCredit && !isNaN(parseFloat(initialCredit)) && parseFloat(initialCredit) > 0) {
          addDebt(newCustomer.id, initialCredit);
      }
      onGoBack();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="add-customer-container">
      <h2>Add New Customer</h2>
      <div className="form-group">
        <label>Customer Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Name"
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Mobile Number</label>
        <input
          type="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Enter 9-digit Mobile Number"
          maxLength={9}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Initial Credit (Debt) - Optional</label>
        <input
          type="number"
          value={initialCredit}
          onChange={(e) => setInitialCredit(e.target.value)}
          placeholder="Enter Initial Credit Amount"
          className="form-input"
        />
      </div>
      <div className="form-actions">
          <button onClick={onGoBack} className="cancel-btn">Cancel</button>
          <button onClick={handleSave} className="save-btn">Save Customer</button>
      </div>
    </div>
  );
};

export default AddCustomerScreen;
