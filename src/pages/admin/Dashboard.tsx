import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePocketBase } from '@/hooks/usePocketBase';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { records: servicios, loading: loadingServicios, fetchRecords: fetchServicios } = usePocketBase({
    collection: 'servicios',
    autoFetch: false,
  });
  
  const { records: turnos, loading: loadingTurnos, fetchRecords: fetchTurnos } = usePocketBase({
    collection: 'turnos',
    autoFetch: false,
  });

  useEffect(() => {
    fetchServicios();
    fetchTurnos();
    
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [fetchServicios, fetchTurnos]);

  const hoy = new Date().toISOString().split('T')[0];
  const turnosHoy = turnos.filter((t: any) => t.fecha_hora?.startsWith(hoy));

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {currentTime.toLocaleDateString('es-AR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {currentTime.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_#000]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Turnos Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{turnosHoy.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {loadingTurnos ? 'Cargando...' : `${turnos.length} total`}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_#000]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Servicios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{servicios.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {loadingServicios ? 'Cargando...' : 'Disponibles'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_#000]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ingresos (Mes)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Configure Gastos
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_#000]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gastos (Mes)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Configure Gastos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_#000]">
          <CardHeader>
            <CardTitle>Turnos de Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            {turnosHoy.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No hay turnos agendados para hoy
              </p>
            ) : (
              <div className="space-y-3">
                {turnosHoy.map((turno: any) => (
                  <div 
                    key={turno.id} 
                    className="flex justify-between items-center p-3 border-2 border-black bg-yellow-50"
                  >
                    <div>
                      <p className="font-bold">{turno.cliente_nombre}</p>
                      <p className="text-sm text-muted-foreground">{turno.estado}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono">
                        {new Date(turno.fecha_hora).toLocaleTimeString('es-AR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      <p className="text-sm">{turno.cliente_telefono}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_#000]">
          <CardHeader>
            <CardTitle>Próximos Turnos</CardTitle>
          </CardHeader>
          <CardContent>
            {turnos.filter((t: any) => t.fecha_hora > new Date().toISOString()).length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No hay turnos próximos
              </p>
            ) : (
              <div className="space-y-3">
                {turnos
                  .filter((t: any) => t.fecha_hora > new Date().toISOString())
                  .slice(0, 5)
                  .map((turno: any) => (
                    <div 
                      key={turno.id} 
                      className="flex justify-between items-center p-3 border-2 border-black"
                    >
                      <div>
                        <p className="font-bold">{turno.cliente_nombre}</p>
                        <p className="text-sm text-muted-foreground">{turno.estado}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono">
                          {new Date(turno.fecha_hora).toLocaleDateString('es-AR')}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-black shadow-[4px_4px_0px_0px_#000]">
        <CardHeader>
          <CardTitle>Información del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Base de Datos</p>
              <p className="font-mono">PocketBase</p>
            </div>
            <div>
              <p className="text-muted-foreground">API Status</p>
              <Badge variant="outline">Conectado</Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Colecciones</p>
              <p>3 configuradas</p>
            </div>
            <div>
              <p className="text-muted-foreground">Versión</p>
              <p>2.0.0</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
