import { ReactNode } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Calendar,
  Wrench,
  Package,
  Users,
  BarChart3,
  Menu
} from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

type View = 'dashboard' | 'work-orders' | 'maintenance-schedule' | 'equipment' | 'inventory' | 'technicians' | 'reports';

interface LayoutProps {
  children: ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
}

export function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'work-orders', label: 'Órdenes de Trabajo', icon: ClipboardList },
    { id: 'maintenance-schedule', label: 'Programacion', icon: Calendar },
    { id: 'equipment', label: 'Equipos', icon: Wrench },
    { id: 'inventory', label: 'Repuestos', icon: Package },
    { id: 'technicians', label: 'Técnicos', icon: Users },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-slate-900 text-white transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {sidebarOpen && <span>Sistema de Mantenimiento</span>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <nav className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as View)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1>
              {menuItems.find((item) => item.id === currentView)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Usuario: Admin</span>
            </div>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
