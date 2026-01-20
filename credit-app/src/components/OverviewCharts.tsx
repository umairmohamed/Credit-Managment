import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface OverviewChartsProps {
  customerCredit: number;
  supplierCredit: number;
  investmentGiven: number;
  investmentTaken: number;
}

const OverviewCharts: React.FC<OverviewChartsProps> = ({
  customerCredit,
  supplierCredit,
  investmentGiven,
  investmentTaken,
}) => {
  const data = [
    {
      name: 'Credit Overview',
      CustomerCredit: customerCredit,
      SupplierCredit: supplierCredit,
      InvestmentGiven: investmentGiven,
      InvestmentTaken: investmentTaken,
    },
  ];

  return (
    <div style={{ width: '100%', height: 500, marginTop: 20, background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', boxSizing: 'border-box' }}>
      <h3 style={{ marginBottom: '20px', textAlign: 'left', color: '#374151', fontSize: '1.2rem', fontWeight: 700 }}>Financial Overview</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="CustomerCredit" fill="#3B82F6" name="Customer Credit" radius={[4, 4, 0, 0]} />
          <Bar dataKey="SupplierCredit" fill="#F59E0B" name="Supplier Credit" radius={[4, 4, 0, 0]} />
          <Bar dataKey="InvestmentGiven" fill="#10B981" name="Inv. Given" radius={[4, 4, 0, 0]} />
          <Bar dataKey="InvestmentTaken" fill="#EF4444" name="Inv. Taken" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OverviewCharts;
