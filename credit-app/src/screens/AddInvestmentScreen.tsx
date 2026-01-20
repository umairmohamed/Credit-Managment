import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface AddInvestmentScreenProps {
  onGoBack: () => void;
}

const AddInvestmentScreen: React.FC<AddInvestmentScreenProps> = ({ onGoBack }) => {
  const { addInvestment } = useApp();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'given' | 'taken'>('given');

  const handleSave = () => {
    if (!name || !amount) {
      alert('Error: Name and Amount are required');
      return;
    }
    try {
      addInvestment(name, mobile, amount, type);
      onGoBack();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="add-customer-container glass-panel" style={{ color: 'white' }}>
      <h2>Add New Investment</h2>
      <div className="form-group">
        <label>Investment Name / Title</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Investment Name"
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Contact Number</label>
        <input
          type="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Enter Contact Number (Optional)"
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter Amount"
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Type</label>
        <select
            value={type}
            onChange={(e) => setType(e.target.value as 'given' | 'taken')}
            className="form-input"
        >
            <option value="given">Given (Invested)</option>
            <option value="taken">Taken (Received)</option>
        </select>
      </div>
      <div className="form-actions">
          <button onClick={onGoBack} className="cancel-btn" style={{ color: 'white', borderColor: 'white' }}>Cancel</button>
          <button onClick={handleSave} className="save-btn" style={{backgroundColor: '#10B981'}}>Save Investment</button>
      </div>
    </div>
  );
};

export default AddInvestmentScreen;
