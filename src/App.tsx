import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { WorkOrders } from './components/WorkOrders';
import { MaintenanceSchedule } from './components/MaintenanceSchedule';
import { Equipment } from './components/Equipment';
import { Inventory } from './components/Inventory';
import { Technicians } from './components/Technicians';
import { Reports } from './components/Reports';

type View = 'dashboard' | 'work-orders' | 'maintenance-schedule' | 'equipment' | 'inventory' | 'technicians' | 'reports';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'work-orders':
        return <WorkOrders />;
      case 'maintenance-schedule':
        return <MaintenanceSchedule />;
      case 'equipment':
        return <Equipment />;
      case 'inventory':
        return <Inventory />;
      case 'technicians':
        return <Technicians />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </Layout>
  );
}
