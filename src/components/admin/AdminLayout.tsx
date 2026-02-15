import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Calendar, 
  Scissors, 
  Users, 
  Receipt, 
  Settings,
  Menu,
  X,
  LogOut,
  UserCircle
} from 'lucide-react';
import { logout, User } from '@/lib/pocketbase';

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/turnos', label: 'Turnos', icon: Calendar },
  { path: '/admin/servicios', label: 'Servicios', icon: Scissors },
  { path: '/admin/empleadas', label: 'Empleadas', icon: Users },
  { path: '/admin/gastos', label: 'Gastos', icon: Receipt, roles: ['admin'] },
  { path: '/admin/config', label: 'Configuración', icon: Settings, roles: ['admin'] },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  user: User;
}

export default function AdminLayout({ children, user }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(user.role);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black text-white flex items-center justify-between px-4 z-50">
        <span className="font-bold text-xl">Blest Admin</span>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white hover:bg-gray-800"
        >
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 w-64 bg-black text-white transform transition-transform duration-200 z-40 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <span className="font-bold text-xl">Blest Admin</span>
        </div>
        
        <nav className="p-4 space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-white text-black font-medium" 
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <UserCircle className="w-8 h-8 text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.nombre}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Volver al sitio
          </Link>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64 pt-16 lg:pt-0">
        {children}
      </div>
    </div>
  );
}
