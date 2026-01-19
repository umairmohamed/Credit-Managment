import React, { createContext, useState, useContext, type ReactNode } from 'react';

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  credit: number;
}

export interface Supplier {
  id: string;
  name: string;
  mobile: string;
  credit: number;
}

export interface Investment {
  id: string;
  name: string;
  mobile: string;
  amount: number;
  type: 'given' | 'taken';
  date: string;
}

export interface User {
  username: string;
}

interface AppContextType {
  user: User | null;
  customers: Customer[];
  suppliers: Supplier[];
  investments: Investment[];
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
  addCustomer: (name: string, mobile: string) => Customer;
  addPayment: (customerId: string, amount: string | number) => void;
  addDebt: (customerId: string, amount: string | number) => void;
  addSupplier: (name: string, mobile: string) => Supplier;
  addInvestment: (name: string, mobile: string, amount: string | number, type: 'given' | 'taken') => Investment;
  totalCredit: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState([{username: 'admin', password: 'admin'}]);

  const register = (username: string, password: string) => {
    if (registeredUsers.some(u => u.username === username)) {
      return false; // User exists
    }
    setRegisteredUsers([...registeredUsers, { username, password }]);
    return true;
  };

  const login = (username: string, password: string) => {
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

  const addCustomer = (name: string, mobile: string) => {
    if (!/^\d{9}$/.test(mobile)) {
      throw new Error('Mobile number must be exactly 9 digits.');
    }
    const newCustomer: Customer = {
      id: Date.now().toString() + Math.random().toString(), // Ensure unique ID
      name,
      mobile,
      credit: 0, // Initial credit is 0
    };
    setCustomers((prev) => [...prev, newCustomer]);
    return newCustomer;
  };

  const addPayment = (customerId: string, amount: string | number) => {
    const numAmount = parseFloat(amount.toString());
    if (isNaN(numAmount) || numAmount <= 0) return;

    setCustomers((prev) => prev.map(c => {
      if (c.id === customerId) {
        return { ...c, credit: c.credit - numAmount };
      }
      return c;
    }));
  };

  const addDebt = (customerId: string, amount: string | number) => {
    const numAmount = parseFloat(amount.toString());
    if (isNaN(numAmount) || numAmount <= 0) return;

    setCustomers((prev) => prev.map(c => {
      if (c.id === customerId) {
        return { ...c, credit: c.credit + numAmount };
      }
      return c;
    }));
  };

  const addSupplier = (name: string, mobile: string) => {
    if (!/^\d{9}$/.test(mobile)) {
      throw new Error('Mobile number must be exactly 9 digits.');
    }
    const newSupplier: Supplier = {
      id: Date.now().toString() + Math.random().toString(),
      name,
      mobile,
      credit: 0,
    };
    setSuppliers((prev) => [...prev, newSupplier]);
    return newSupplier;
  };

  const addInvestment = (name: string, mobile: string, amount: string | number, type: 'given' | 'taken') => {
    const numAmount = parseFloat(amount.toString());
    if (isNaN(numAmount) || numAmount <= 0) throw new Error('Invalid amount');

    const newInvestment: Investment = {
      id: Date.now().toString() + Math.random().toString(),
      name,
      mobile,
      amount: numAmount,
      type,
      date: new Date().toISOString(),
    };
    setInvestments((prev) => [...prev, newInvestment]);
    return newInvestment;
  };

  const totalCredit = customers.reduce((sum, c) => sum + c.credit, 0);

  return (
    <AppContext.Provider value={{
      user, login, register, logout,
      customers, suppliers, investments,
      addCustomer, addPayment, addDebt,
      addSupplier, addInvestment,
      totalCredit
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
