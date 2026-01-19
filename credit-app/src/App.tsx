import React, { useState } from 'react'
import './App.css'
import { AppProvider, useApp } from './context/AppContext'
import LoginScreen from './screens/LoginScreen'
import DashboardScreen, { type TabType } from './screens/DashboardScreen'
import AddCustomerScreen from './screens/AddCustomerScreen'
import AddSupplierScreen from './screens/AddSupplierScreen'
import AddInvestmentScreen from './screens/AddInvestmentScreen'

const MainApp: React.FC = () => {
  const { user } = useApp();
  const [currentScreen, setCurrentScreen] = useState('Dashboard');
  const [activeTab, setActiveTab] = useState<TabType>('customers');

  if (!user) {
    return <LoginScreen />;
  }

  if (currentScreen === 'AddCustomer') {
    return <AddCustomerScreen onGoBack={() => setCurrentScreen('Dashboard')} />;
  }

  if (currentScreen === 'AddSupplier') {
    return <AddSupplierScreen onGoBack={() => setCurrentScreen('Dashboard')} />;
  }

  if (currentScreen === 'AddInvestment') {
    return <AddInvestmentScreen onGoBack={() => setCurrentScreen('Dashboard')} />;
  }

  return (
    <DashboardScreen
      onNavigate={setCurrentScreen}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
}

function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  )
}

export default App
