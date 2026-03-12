import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface AddSupplierScreenProps {
  onGoBack: () => void;
}

const AddSupplierScreen: React.FC<AddSupplierScreenProps> = ({ onGoBack }) => {
  const { addSupplier } = useApp();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [amount, setAmount] = useState('');

  const handleSave = () => {
    if (!name || !mobile) {
      alert('Error: Name and Mobile are required');
      return;
    }
    try {
      addSupplier(name, mobile, amount);
      onGoBack();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="add-customer-container">
      <h2>Add New Supplier</h2>
      <div className="form-group">
        <label>Supplier Name</label>
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
        <label>Amount to Settle (Initial Credit)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter Amount"
          className="form-input"
        />
      </div>
      <div className="form-actions">
          <button onClick={onGoBack} className="cancel-btn">Cancel</button>
          <button onClick={handleSave} className="save-btn" style={{color: '#F59E0B'}}>Save Supplier</button>
      </div>
    </div>
  );
};

export default AddSupplierScreen;
