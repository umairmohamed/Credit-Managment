import React, { useState } from 'react'
import './App.css'
import { AppProvider, useApp } from './context/AppContext'
import LoginScreen from './screens/LoginScreen'
import DashboardScreen from './screens/DashboardScreen'
import AddCustomerScreen from './screens/AddCustomerScreen'

const MainApp: React.FC = () => {
  const { user } = useApp();
  const [currentScreen, setCurrentScreen] = useState('Dashboard');

  if (!user) {
    return <LoginScreen />;
  }

  if (currentScreen === 'AddCustomer') {
    return <AddCustomerScreen onGoBack={() => setCurrentScreen('Dashboard')} />;
  }

  return <DashboardScreen onNavigate={setCurrentScreen} />;
}

function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  )
}

export default App
