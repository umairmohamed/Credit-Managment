import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([{username: 'admin', password: 'admin'}]);

  const register = (username, password) => {
    if (registeredUsers.some(u => u.username === username)) {
      return false; // User exists
    }
    setRegisteredUsers([...registeredUsers, { username, password }]);
    return true;
  };

  const login = (username, password) => {
    const validUser = registeredUsers.find(u => u.username === username && u.password === password);
    if (validUser) {
      setUser({ username });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const addCustomer = (name, mobile) => {
    if (!/^\d{9}$/.test(mobile)) {
      throw new Error('Mobile number must be exactly 9 digits.');
    }
    const newCustomer = {
      id: Date.now().toString() + Math.random().toString(), // Ensure unique ID
      name,
      mobile,
      credit: 0, // Initial credit is 0
    };
    setCustomers((prev) => [...prev, newCustomer]);
    return newCustomer;
  };

  const addPayment = (customerId, amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    setCustomers((prev) => prev.map(c => {
      if (c.id === customerId) {
        return { ...c, credit: c.credit - numAmount };
      }
      return c;
    }));
  };

  // Helper to add debt (not explicitly requested but needed for a functional credit system)
  const addDebt = (customerId, amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    setCustomers((prev) => prev.map(c => {
      if (c.id === customerId) {
        return { ...c, credit: c.credit + numAmount };
      }
      return c;
    }));
  };

  const totalCredit = customers.reduce((sum, c) => sum + c.credit, 0);

  return (
    <AppContext.Provider value={{
      user, login, register, logout,
      customers, addCustomer, addPayment, addDebt,
      totalCredit
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
