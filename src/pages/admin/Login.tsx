import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { loginWithPocketID, isAuthenticated } from '@/lib/hornerodb';

export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    // Auto-redirect if token is present in URL or already authenticated
    const params = new URLSearchParams(window.location.search);
      if (params.get('token') || isAuthenticated()) {
      navigate({ pathname: '/admin', search: window.location.search });
    }
  }, [navigate]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithPocketID();
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#a8b5a0' }}>
      <Card className="w-full max-w-md mx-4 border-4 border-black shadow-[8px_8px_0px_0px_#000]">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Blest Admin</CardTitle>
          <p className="text-muted-foreground text-sm">Ingresá tus credenciales</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 border-2 border-black font-bold h-12 text-lg"
            >
              Iniciar Sesión con PocketID
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-muted-foreground hover:underline">
              ← Volver al inicio
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
