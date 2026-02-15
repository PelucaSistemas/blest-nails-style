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

interface Empleada {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  user_id: string;
}

export default function Empleadas() {
  const { records, loading, error, fetchRecords, createRecord, deleteRecord } = usePocketBase({
    collection: 'empleados',
    autoFetch: false,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
  });

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRecord(formData);
      setIsDialogOpen(false);
      setFormData({ nombre: '', email: '', telefono: '' });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta empleada?')) {
      await deleteRecord(id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Empleadas</h1>
          <p className="text-muted-foreground">Gestión del equipo</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800 border-2 border-black">
              + Nueva Empleada
            </Button>
          </DialogTrigger>
          <DialogContent className="border-2 border-black">
            <DialogHeader>
              <DialogTitle>Nueva Empleada</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nombre</Label>
                <Input value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
              </div>
              <Button type="submit" className="w-full bg-black text-white">Guardar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_#000]">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Total Equipo</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{records.length}</div></CardContent>
        </Card>
      </div>

      <Card className="border-2 border-black shadow-[4px_4px_0px_0px_#000]">
        <CardHeader><CardTitle>Lista de Empleadas ({records.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Cargando...</p>
          ) : records.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No hay empleadas. Agregalas desde el panel de PocketBase.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((empleada: any) => (
                  <TableRow key={empleada.id}>
                    <TableCell className="font-medium">{empleada.nombre}</TableCell>
                    <TableCell>{empleada.email}</TableCell>
                    <TableCell>{empleada.telefono}</TableCell>
                    <TableCell><Button variant="destructive" size="sm" onClick={() => handleDelete(empleada.id)}>Eliminar</Button></TableCell>
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
