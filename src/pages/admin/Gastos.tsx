import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { usePocketBase } from '@/hooks/usePocketBase';

interface Gasto {
  id: string;
  descripcion: string;
  monto: number;
  categoria: string;
  fecha: string;
  periodicidad: string;
}

const CATEGORIAS_GASTOS = ['Alquiler', 'Insumos', 'Servicios', 'Impuestos', 'Otros'];
const PERIODICIDADES = ['Único', 'Mensual', 'Semanal'];

export default function Gastos() {
  const { records, loading, error, fetchRecords, createRecord, deleteRecord } = usePocketBase({
    collection: 'gastos',
    autoFetch: false,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [formData, setFormData] = useState({
    descripcion: '',
    monto: 0,
    categoria: 'Insumos',
    fecha: new Date().toISOString().split('T')[0],
    periodicidad: 'Mensual',
  });

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRecord(formData);
      setIsDialogOpen(false);
      setFormData({
        descripcion: '',
        monto: 0,
        categoria: 'Insumos',
        fecha: new Date().toISOString().split('T')[0],
        periodicidad: 'Mensual',
      });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este gasto?')) {
      await deleteRecord(id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);
  };

  const gastosFiltrados = (records as Gasto[]).filter((gasto) => {
    return !filtroCategoria || gasto.categoria === filtroCategoria;
  });

  const totalGastos = (records as Gasto[]).reduce((sum, g) => sum + (g.monto || 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gastos</h1>
          <p className="text-muted-foreground">Control de gastos del salón</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800 border-2 border-black">
              + Nuevo Gasto
            </Button>
          </DialogTrigger>
          <DialogContent className="border-2 border-black">
            <DialogHeader>
              <DialogTitle>Nuevo Gasto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Descripción</Label>
                <Input value={formData.descripcion} onChange={(e) => setFormData({...formData, descripcion: e.target.value})} required />
              </div>
              <div>
                <Label>Monto</Label>
                <Input type="number" value={formData.monto} onChange={(e) => setFormData({...formData, monto: parseFloat(e.target.value)})} required />
              </div>
              <div>
                <Label>Categoría</Label>
                <select 
                  className="w-full border-2 border-black p-2 rounded"
                  value={formData.categoria}
                  onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                >
                  {CATEGORIAS_GASTOS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <Label>Fecha</Label>
                <Input type="date" value={formData.fecha} onChange={(e) => setFormData({...formData, fecha: e.target.value})} required />
              </div>
              <div>
                <Label>Periodicidad</Label>
                <select 
                  className="w-full border-2 border-black p-2 rounded"
                  value={formData.periodicidad}
                  onChange={(e) => setFormData({...formData, periodicidad: e.target.value})}
                >
                  {PERIODICIDADES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <Button type="submit" className="w-full bg-black text-white">Guardar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_#000]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalGastos)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button 
          variant={filtroCategoria === '' ? 'default' : 'outline'}
          onClick={() => setFiltroCategoria('')}
          className={filtroCategoria === '' ? 'bg-black text-white border-2 border-black' : 'border-2 border-black'}
        >
          Todos
        </Button>
        {CATEGORIAS_GASTOS.map((cat) => (
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

      <Card className="border-2 border-black shadow-[4px_4px_0px_0px_#000]">
        <CardHeader>
          <CardTitle>Lista de Gastos ({gastosFiltrados.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Cargando...</p>
          ) : gastosFiltrados.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No hay gastos registrados.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Periodicidad</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gastosFiltrados.map((gasto: any) => (
                  <TableRow key={gasto.id}>
                    <TableCell className="font-medium">{gasto.descripcion}</TableCell>
                    <TableCell><Badge variant="outline">{gasto.categoria}</Badge></TableCell>
                    <TableCell className="font-mono">{formatPrice(gasto.monto)}</TableCell>
                    <TableCell>{gasto.fecha}</TableCell>
                    <TableCell>{gasto.periodicidad}</TableCell>
                    <TableCell><Button variant="destructive" size="sm" onClick={() => handleDelete(gasto.id)}>Eliminar</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
