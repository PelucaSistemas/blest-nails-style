import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
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
import { isAuthenticated, getCurrentUser, fetchCurrentUser, setAuthToken, getWorkspaceId, getApiKey } from "./lib/hornerodb";
import Setup from "./pages/Setup";

const queryClient = new QueryClient();

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [auth, setAuth] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null); // HorneroDB user shape
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Check if returning from OIDC login with a token
      const params = new URLSearchParams(window.location.search);
      const tokenParam = params.get('token');
      
      if (tokenParam) {
        setAuthToken(tokenParam);
        // Clean URL without reloading
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // 2. Load user and set state
      try {
        if (isAuthenticated() || tokenParam) {
          const currentUser = await fetchCurrentUser();
          setUser(currentUser);
          setAuth(true);
        } else {
          setAuth(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (auth === null) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!auth || !user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <AdminLayout user={user}>{children}</AdminLayout>;
};

const DatabaseGuard = ({ children }: { children: React.ReactNode }) => {
  const wsId = getWorkspaceId();
  const apiKey = getApiKey();
  const location = useLocation();

  if (!wsId || !apiKey || wsId === 'badcde1e-7dbc-4f83-961c-8ab522964df8') {
    if (location.pathname !== '/setup') {
      return <Navigate to="/setup" replace />;
    }
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/setup" element={<Setup />} />
          
          {/* Public Routes */}
          <Route path="/" element={<DatabaseGuard><Index /></DatabaseGuard>} />
          <Route path="/reservar" element={<DatabaseGuard><Reservar /></DatabaseGuard>} />
          
          <Route path="/admin/login" element={<DatabaseGuard><Login /></DatabaseGuard>} />
          
          {/* Admin Routes - Protected */}
          <Route path="/admin" element={<DatabaseGuard><AdminRoute><Dashboard /></AdminRoute></DatabaseGuard>} />
          <Route path="/admin/turnos" element={<DatabaseGuard><AdminRoute><Turnos /></AdminRoute></DatabaseGuard>} />
          <Route path="/admin/servicios" element={<DatabaseGuard><AdminRoute><Servicios /></AdminRoute></DatabaseGuard>} />
          <Route path="/admin/empleadas" element={<DatabaseGuard><AdminRoute><Empleadas /></AdminRoute></DatabaseGuard>} />
          <Route path="/admin/gastos" element={<DatabaseGuard><AdminRoute><Gastos /></AdminRoute></DatabaseGuard>} />
          <Route path="/admin/config" element={<DatabaseGuard><AdminRoute>< Configuracion /></AdminRoute></DatabaseGuard>} />
          
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
