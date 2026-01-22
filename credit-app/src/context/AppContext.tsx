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
  mobile?: string;
}

export interface AdminProfile {
  shopName: string;
  adminName: string;
  contactNumber: string;
  address: string;
  shopLogo?: string;
}

export interface Check {
  id: string;
  number: string;
  bank: string;
  amount: number;
  name: string;
  contact: string;
  type: 'coming' | 'given';
  date: string;
  status: 'pending' | 'cleared' | 'bounced';
}

interface AppContextType {
  user: User | null;
  customers: Customer[];
  suppliers: Supplier[];
  investments: Investment[];
  checks: Check[];
  adminProfile: AdminProfile;
  login: (username: string, password: string) => boolean;
  validateCredentials: (username: string, password: string) => {username: string, mobile?: string} | null;
  register: (username: string, password: string, mobile: string) => boolean;
  logout: () => void;
  addCustomer: (name: string, mobile: string) => Customer;
  addPayment: (customerId: string, amount: string | number) => void;
  addSupplierPayment: (supplierId: string, amount: string | number) => void;
  addDebt: (customerId: string, amount: string | number) => void;
  addSupplier: (name: string, mobile: string, initialCredit?: string | number) => Supplier;
  addInvestment: (name: string, mobile: string, amount: string | number, type: 'given' | 'taken') => Investment;
  processInvestmentPayment: (investmentId: string, amount: string | number) => void;
  addCheck: (data: Omit<Check, 'id' | 'status'>) => void;
  passCheck: (checkId: string) => void;
  bounceCheck: (checkId: string) => void;
  updateAdminProfile: (profile: AdminProfile) => void;
  totalCredit: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [checks, setChecks] = useState<Check[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<{username: string, password: string, mobile?: string}[]>(() => {
    const saved = localStorage.getItem('creditApp_users');
    return saved ? JSON.parse(saved) : [{username: 'admin', password: 'admin', mobile: '000000000'}];
  });
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    shopName: '',
    adminName: '',
    contactNumber: '',
    address: '',
    shopLogo: ''
  });

  const register = (username: string, password: string, mobile: string) => {
    if (registeredUsers.some(u => u.username === username)) {
      return false; // User exists
    }
    const newUsers = [...registeredUsers, { username, password, mobile }];
    setRegisteredUsers(newUsers);
    localStorage.setItem('creditApp_users', JSON.stringify(newUsers));
    return true;
  };

  const validateCredentials = (username: string, password: string) => {
    const validUser = registeredUsers.find(u => u.username === username && u.password === password);
    return validUser || null;
  };

  const login = (username: string, password: string) => {
    const validUser = registeredUsers.find(u => u.username === username && u.password === password);
    if (validUser) {
      setUser({ username, mobile: validUser.mobile });
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

  const processInvestmentPayment = (investmentId: string, amount: string | number) => {
    const numAmount = parseFloat(amount.toString());
    if (isNaN(numAmount) || numAmount <= 0) return;

    setInvestments((prev) => prev.map(i => {
      if (i.id === investmentId) {
        return { ...i, amount: i.amount - numAmount };
      }
      return i;
    }));
  };

  const addCheck = (data: Omit<Check, 'id' | 'status'>) => {
    const newCheck: Check = {
      ...data,
      id: Date.now().toString() + Math.random().toString(),
      status: 'pending',
    };
    setChecks(prev => [...prev, newCheck]);
  };

  const passCheck = (checkId: string) => {
    setChecks(prev => prev.map(c => {
      if (c.id === checkId) {
        return { ...c, status: 'cleared' };
      }
      return c;
    }));
  };

  const bounceCheck = (checkId: string) => {
    setChecks(prev => prev.map(c => {
      if (c.id === checkId) {
        return { ...c, status: 'bounced' };
      }
      return c;
    }));
  };

  const updateAdminProfile = (profile: AdminProfile) => {
    setAdminProfile(profile);
  };

  const totalCredit = customers.reduce((sum, c) => sum + c.credit, 0);

  return (
    <AppContext.Provider value={{
      user, login, register, validateCredentials, logout,
      customers, suppliers, investments,
      checks,
      adminProfile,
      addCustomer, addPayment, addSupplierPayment, addDebt,
      addSupplier, addInvestment, processInvestmentPayment,
      addCheck, passCheck, bounceCheck,
      updateAdminProfile,
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
