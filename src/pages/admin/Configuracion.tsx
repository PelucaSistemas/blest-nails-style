import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useHorneroDB } from '@/hooks/useHorneroDB';

export default function Configuracion() {
  const { records: servicios, fetchRecords: fetchServicios } = useHorneroDB({
    collection: 'servicios',
    autoFetch: false,
  });
  const { records: gastos, fetchRecords: fetchGastos } = useHorneroDB({
    collection: 'gastos',
    autoFetch: false,
  });

  const [config, setConfig] = useState<Record<string, string>>({
    impuesto_porcentaje: '21',
    ganancia_deseada: '30',
    horas_laborables_mes: '160',
    alquiler_mensual: '0',
  });

  useEffect(() => {
    fetchServicios();
    fetchGastos();
  }, [fetchServicios, fetchGastos]);

  const calcularCostos = useMemo(() => {
    const gastoMensual = gastos.reduce((sum: number, g: any) => {
      const monto = parseFloat(g.monto) || 0;
      if (g.periodicidad === 'Semanal') return sum + monto * 4.33;
      if (g.periodicidad === 'Mensual') return sum + monto;
      return sum;
    }, 0);

    const horasLaborables = parseInt(config.horas_laborables_mes) || 160;
    const cantidadEmpleadas = 1;
    const costoHora = horasLaborables > 0 ? gastoMensual / (horasLaborables * cantidadEmpleadas) : 0;
    const impuestoPorcentaje = parseFloat(config.impuesto_porcentaje) / 100;
    const gananciaPorcentaje = parseFloat(config.ganancia_deseada) / 100;

    const serviciosConCostos = servicios.map((servicio: any) => {
      const duracionHoras = (servicio.duracion_minutos || 60) / 60; 
      const costoInsumos = (servicio.precio || 0) * 0.15;
      const costoLaboral = costoHora * duracionHoras;
      const subtotal = costoInsumos + costoLaboral;
      const impuesto = subtotal * impuestoPorcentaje;
      const ganancia = (subtotal + impuesto) * gananciaPorcentaje;
      const precioSugerido = subtotal + impuesto + ganancia;

      return {
        ...servicio,
        costoInsumos,
        costoLaboral,
        precioSugerido: Math.ceil(precioSugerido / 100) * 100,
      };
    });

    return {
      gastoMensual,
      costoHora,
      cantidadEmpleadas,
      serviciosConCostos,
    };
  }, [servicios, gastos, config]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">Parámetros del sistema y cálculo de costos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_#000]">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Gasto Mensual</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatPrice(calcularCostos.gastoMensual)}</div></CardContent>
        </Card>
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_#000]">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Costo por Hora</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatPrice(calcularCostos.costoHora)}</div></CardContent>
        </Card>
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_#000]">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Empleadas</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{calcularCostos.cantidadEmpleadas}</div></CardContent>
        </Card>
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_#000]">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Servicios</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{servicios.length}</div></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_#000]">
          <CardHeader>
            <CardTitle>Parámetros de Cálculo</CardTitle>
            <CardDescription>Configura los parámetros para el cálculo de precios</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Impuesto (%)</Label>
              <Input 
                type="number" 
                value={config.impuesto_porcentaje}
                onChange={(e) => setConfig({...config, impuesto_porcentaje: e.target.value})}
                className="border-2 border-black"
              />
            </div>
            <div>
              <Label>Ganancia Deseada (%)</Label>
              <Input 
                type="number" 
                value={config.ganancia_deseada}
                onChange={(e) => setConfig({...config, ganancia_deseada: e.target.value})}
                className="border-2 border-black"
              />
            </div>
            <div>
              <Label>Horas Laborables/Mes</Label>
              <Input 
                type="number" 
                value={config.horas_laborables_mes}
                onChange={(e) => setConfig({...config, horas_laborables_mes: e.target.value})}
                className="border-2 border-black"
              />
            </div>
            <div>
              <Label>Alquiler Mensual</Label>
              <Input 
                type="number" 
                value={config.alquiler_mensual}
                onChange={(e) => setConfig({...config, alquiler_mensual: e.target.value})}
                className="border-2 border-black"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_#000] lg:col-span-2">
          <CardHeader>
            <CardTitle>Resumen de Costos</CardTitle>
            <CardDescription>Precio sugerido por servicio basado en los parámetros</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {calcularCostos.serviciosConCostos.map((servicio: any) => (
                <div key={servicio.id} className="flex justify-between items-center p-3 border-2 border-black bg-gray-50">
                  <div className="flex-1">
                    <p className="font-medium">{servicio.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      Insumos: {formatPrice(servicio.costoInsumos)} | Laboral: {formatPrice(servicio.costoLaboral)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm line-through text-muted-foreground">{formatPrice(servicio.precio)}</p>
                    <p className="font-bold text-green-600">{formatPrice(servicio.precioSugerido)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-black shadow-[4px_4px_0px_0px_#000]">
        <CardHeader>
          <CardTitle>Fórmula de Cálculo</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded border-2 border-black text-sm overflow-x-auto">
{`Precio = CostoInsumos + CostoLaboral + Impuestos + Ganancia

Donde:
- CostoInsumos = 15% del precio actual
- CostoLaboral = (Gastos Mensuales / Horas Laborables × Empleadas) × Duración
- Impuestos = (CostoInsumos + CostoLaboral) × ${config.impuesto_porcentaje}%
- Ganancia = (Subtotal + Impuestos) × ${config.ganancia_deseada}%`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
