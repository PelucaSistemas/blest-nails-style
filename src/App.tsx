import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Reservar from "./pages/Reservar";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Turnos from "./pages/admin/Turnos";
import Servicios from "./pages/admin/Servicios";
import Empleadas from "./pages/admin/Empleadas";
import Gastos from "./pages/admin/Gastos";
import Configuracion from "./pages/admin/Configuracion";
import { isAuthenticated, getCurrentUser, User } from "./lib/pocketbase";

const queryClient = new QueryClient();

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [auth, setAuth] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const authenticated = isAuthenticated();
    const currentUser = getCurrentUser();
    setAuth(authenticated);
    setUser(currentUser);
  }, []);

  if (auth === null) {
    return null;
  }

  if (!auth || !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <AdminLayout user={user}>{children}</AdminLayout>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reservar" element={<Reservar />} />
          <Route path="/admin/login" element={<Login />} />
          
          {/* Admin Routes - Protected */}
          <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/turnos" element={<AdminRoute><Turnos /></AdminRoute>} />
          <Route path="/admin/servicios" element={<AdminRoute><Servicios /></AdminRoute>} />
          <Route path="/admin/empleadas" element={<AdminRoute><Empleadas /></AdminRoute>} />
          <Route path="/admin/gastos" element={<AdminRoute><Gastos /></AdminRoute>} />
          <Route path="/admin/config" element={<AdminRoute>< Configuracion /></AdminRoute>} />
          
          {/* Redirect old routes */}
          <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
