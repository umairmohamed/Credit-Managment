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

export interface AdminProfile {
  shopName: string;
  adminName: string;
  contactNumber: string;
  address: string;
}

interface AppContextType {
  user: User | null;
  customers: Customer[];
  suppliers: Supplier[];
  investments: Investment[];
  adminProfile: AdminProfile;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
  addCustomer: (name: string, mobile: string) => Customer;
  addPayment: (customerId: string, amount: string | number) => void;
  addSupplierPayment: (supplierId: string, amount: string | number) => void;
  addDebt: (customerId: string, amount: string | number) => void;
  addSupplier: (name: string, mobile: string, initialCredit?: string | number) => Supplier;
  addInvestment: (name: string, mobile: string, amount: string | number, type: 'given' | 'taken') => Investment;
  updateAdminProfile: (profile: AdminProfile) => void;
  totalCredit: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState([{username: 'admin', password: 'admin'}]);
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    shopName: '',
    adminName: '',
    contactNumber: '',
    address: ''
  });

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

  const addSupplierPayment = (supplierId: string, amount: string | number) => {
    const numAmount = parseFloat(amount.toString());
    if (isNaN(numAmount) || numAmount <= 0) return;

    setSuppliers((prev) => prev.map(s => {
      if (s.id === supplierId) {
        return { ...s, credit: s.credit - numAmount };
      }
      return s;
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

  const addSupplier = (name: string, mobile: string, initialCredit: string | number = 0) => {
    if (!/^\d{9}$/.test(mobile)) {
      throw new Error('Mobile number must be exactly 9 digits.');
    }

    let creditAmount = 0;
    if (initialCredit) {
      const parsed = parseFloat(initialCredit.toString());
      if (!isNaN(parsed)) {
        creditAmount = parsed;
      }
    }

    const newSupplier: Supplier = {
      id: Date.now().toString() + Math.random().toString(),
      name,
      mobile,
      credit: creditAmount,
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

  const updateAdminProfile = (profile: AdminProfile) => {
    setAdminProfile(profile);
  };

  const totalCredit = customers.reduce((sum, c) => sum + c.credit, 0);

  return (
    <AppContext.Provider value={{
      user, login, register, logout,
      customers, suppliers, investments,
      adminProfile,
      addCustomer, addPayment, addSupplierPayment, addDebt,
      addSupplier, addInvestment, updateAdminProfile,
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
