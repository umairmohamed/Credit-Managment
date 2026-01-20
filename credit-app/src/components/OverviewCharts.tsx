import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
    { name: 'Customer Credit', value: customerCredit, color: '#3B82F6' },
    { name: 'Supplier Credit', value: supplierCredit, color: '#F59E0B' },
    { name: 'Investment Given', value: investmentGiven, color: '#10B981' },
    { name: 'Investment Taken', value: investmentTaken, color: '#EF4444' },
  ];

  // Filter out zero values to avoid empty segments or label issues
  const activeData = data.filter(d => d.value > 0);

  return (
    <div style={{ width: '100%', height: 500, marginTop: 20, background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', boxSizing: 'border-box' }}>
      <h3 style={{ marginBottom: '20px', textAlign: 'left', color: '#374151', fontSize: '1.2rem', fontWeight: 700 }}>Financial Overview (Distribution)</h3>
      {activeData.length > 0 ? (
        <ResponsiveContainer width="100%" height="85%">
          <PieChart>
            <Pie
              data={activeData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {activeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number | undefined) => `LKR ${(value || 0).toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ width: '100%', height: '85%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: '1.1rem' }}>
          No financial data available to display.
        </div>
      )}
    </div>
  );
};

export default OverviewCharts;
