import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface AddCheckScreenProps {
  onGoBack: () => void;
}

const AddCheckScreen: React.FC<AddCheckScreenProps> = ({ onGoBack }) => {
  const { addCheck } = useApp();
  const [number, setNumber] = useState('');
  const [bank, setBank] = useState('');
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [type, setType] = useState<'coming' | 'given'>('coming');
  const [date, setDate] = useState('');

  const handleSave = () => {
    if (!number || !bank || !amount || !name || !contact || !date) {
      alert('Error: All fields are required');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Error: Invalid amount');
      return;
    }

    try {
      addCheck({
        number,
        bank,
        amount: numAmount,
        name,
        contact,
        type,
        date
      });
      onGoBack();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div style={{ height: '100vh', overflowY: 'auto', width: '100%' }}>
      <div className="add-customer-container">
        <h2>Add New Check</h2>
        <div className="form-group">
          <label>Check Type</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                name="checkType"
                checked={type === 'coming'}
                onChange={() => setType('coming')}
              />
              Coming (Received)
            </label>
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                name="checkType"
                checked={type === 'given'}
                onChange={() => setType('given')}
              />
              Given (Issued)
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Check Number</label>
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter Check Number"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Bank Name</label>
          <input
            type="text"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            placeholder="Enter Bank Name"
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
          <label>Person Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Person Name"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Contact Number</label>
          <input
            type="tel"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Enter Contact Number"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-actions">
            <button onClick={onGoBack} className="cancel-btn">Cancel</button>
            <button onClick={handleSave} className="save-btn">Save Check</button>
        </div>
      </div>
    </div>
  );
};

export default AddCheckScreen;
