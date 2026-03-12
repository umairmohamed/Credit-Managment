import React from 'react';
import type { AdminProfile } from '../context/AppContext';
import { Printer, X } from 'lucide-react';

interface InvoiceModalProps {
  visible: boolean;
  onClose: () => void;
  transactionDetails: {
    amount: string;
    date: string;
    payeeName: string;
  } | null;
  adminProfile: AdminProfile;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ visible, onClose, transactionDetails, adminProfile }) => {
  if (!visible || !transactionDetails) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content invoice-modal-content">
        <div id="invoice-area" className="invoice-box">
          <div className="invoice-header">
            {adminProfile.shopLogo && (
              <img
                src={adminProfile.shopLogo}
                alt="Logo"
                style={{
                  width: '80px',
                  height: '80px',
                  marginBottom: '10px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            )}
            <h2>{adminProfile.shopName || 'Shop Name'}</h2>
            <p>Admin: {adminProfile.adminName || 'Admin'}</p>
            <p>Contact: {adminProfile.contactNumber || 'N/A'}</p>
            <p>Address: {adminProfile.address || 'N/A'}</p>
          </div>
          <hr />
          <div className="invoice-details">
            <p><strong>Date:</strong> {transactionDetails.date}</p>
            <p><strong>Payee:</strong> {transactionDetails.payeeName}</p>
            <p className="invoice-amount"><strong>Amount Paid:</strong> LKR {parseFloat(transactionDetails.amount).toFixed(2)}</p>
          </div>
          <div className="invoice-footer">
            <p>Thank you!</p>
          </div>
        </div>

        <div className="modal-actions no-print">
          <button onClick={onClose} className="cancel-btn" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
             <X size={16} />
             Close
          </button>
          <button onClick={handlePrint} className="confirm-btn" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
             <Printer size={16} />
             Print Invoice
          </button>
        </div>
      </div>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .invoice-modal-content, .invoice-modal-content * {
            visibility: visible;
          }
          .invoice-modal-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            background: white;
            color: black;
          }
          .no-print {
            display: none !important;
          }
          .modal-overlay {
            background: white;
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 9999;
          }
        }
        .invoice-box {
          background: white;
          color: black;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
        }
        .invoice-header h2 {
            margin-top: 0;
        }
        .invoice-amount {
            font-size: 1.2em;
            margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default InvoiceModal;
