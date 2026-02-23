import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { useHorneroDB } from '@/hooks/useHorneroDB';

interface Servicio {
  id: string;
  categoria: string;
  nombre: string;
  descripcion: string;
  duracion_minutos: number;
  precio: number;
}

const CATEGORIAS = ['manos', 'pies', 'cejas', 'pestanas', 'depilacion'];

export default function Servicios() {
  const { records, loading, error, fetchRecords } = useHorneroDB({
    collection: 'servicios',
    autoFetch: false,
  });

  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const serviciosFiltrados = (records as Servicio[]).filter((servicio) => {
    const coincideCategoria = !filtroCategoria || servicio.categoria === filtroCategoria;
    const coincideBusqueda = !busqueda || 
      servicio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (servicio.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ?? false);
    return coincideCategoria && coincideBusqueda;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  const getCategoriaColor = (categoria: string) => {
    const colors: Record<string, string> = {
      'manos': 'bg-yellow-100',
      'pies': 'bg-pink-100',
      'cejas': 'bg-purple-100',
      'pestanas': 'bg-blue-100',
      'depilacion': 'bg-red-100',
    };
    return colors[categoria] || 'bg-gray-100';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Servicios</h1>
          <p className="text-muted-foreground">Catálogo de servicios del salón</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {serviciosFiltrados.length} servicios
        </Badge>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input 
            placeholder="Buscar servicio..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border-2 border-black"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant={filtroCategoria === '' ? 'default' : 'outline'}
            onClick={() => setFiltroCategoria('')}
            className={filtroCategoria === '' ? 'bg-black text-white border-2 border-black' : 'border-2 border-black'}
          >
            Todos
          </Button>
          {CATEGORIAS.map((cat) => (
            <Button
              key={cat}
              variant={filtroCategoria === cat ? 'default' : 'outline'}
              onClick={() => setFiltroCategoria(cat)}
              className={filtroCategoria === cat ? 'bg-black text-white border-2 border-black' : 'border-2 border-black'}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <Card className="border-2 border-black shadow-[4px_4px_0px_0px_#000]">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Servicio</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead className="text-right">Precio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : serviciosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No se encontraron servicios
                  </TableCell>
                </TableRow>
              ) : (
                serviciosFiltrados.map((servicio) => (
                  <TableRow key={servicio.id}>
                    <TableCell className="font-medium">{servicio.nombre}</TableCell>
                    <TableCell>
                      <Badge className={getCategoriaColor(servicio.categoria)}>
                        {servicio.categoria}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {servicio.descripcion}
                    </TableCell>
                    <TableCell>{servicio.duracion_minutos ? `${servicio.duracion_minutos} min` : '-'}</TableCell>
                    <TableCell className="text-right font-bold">
                      {formatPrice(servicio.precio)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CATEGORIAS.map((cat) => {
          const count = (records as Servicio[]).filter(s => s.categoria === cat).length;
          return (
            <Card key={cat} className="border-2 border-black">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{cat}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">servicios</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
