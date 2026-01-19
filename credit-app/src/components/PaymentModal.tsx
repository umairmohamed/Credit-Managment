import React, { useState } from 'react';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (amount: string) => void;
  customerName: string | undefined;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ visible, onClose, onSubmit, customerName }) => {
  const [amount, setAmount] = useState('');

  if (!visible) return null;

  const handlePay = () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      alert('Error: Please enter a valid amount');
      return;
    }
    onSubmit(amount);
    setAmount('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add Payment</h3>
        <p>For: {customerName}</p>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="modal-input"
        />
        <div className="modal-actions">
          <button onClick={onClose} className="cancel-btn">Cancel</button>
          <button onClick={handlePay} className="confirm-btn">Confirm Payment</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
