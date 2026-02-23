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
import { useHorneroDB } from '@/hooks/useHorneroDB';

interface Turno {
  id: string;
  cliente_nombre: string;
  cliente_telefono: string;
  cliente_email: string;
  fecha_hora: string;
  estado: string;
  observaciones: string;
}

export default function Turnos() {
  const { records, loading, error, fetchRecords, createRecord, updateRecord, deleteRecord } = useHorneroDB({
    collection: 'turnos',
    autoFetch: false,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    cliente_nombre: '',
    cliente_telefono: '',
    cliente_email: '',
    fecha_hora: '',
    observaciones: '',
    estado: 'pendiente',
  });

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRecord({
        ...formData,
        fecha_hora: new Date(formData.fecha_hora).toISOString().split('T')[0],
      });
      setIsDialogOpen(false);
      setFormData({
        cliente_nombre: '',
        cliente_telefono: '',
        cliente_email: '',
        fecha_hora: '',
        observaciones: '',
        estado: 'pendiente',
      });
    } catch (err) {
      console.error('Error creating record:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este turno?')) {
      await deleteRecord(id);
    }
  };

  const handleStatusChange = async (id: string, estado: string) => {
    await updateRecord(id, { estado });
  };

  const getStatusBadge = (estado: string) => {
    const colors: Record<string, string> = {
      pendiente: 'bg-yellow-500',
      confirmado: 'bg-blue-500',
      completado: 'bg-green-500',
      cancelado: 'bg-red-500',
    };
    return <Badge className={colors[estado] || 'bg-gray-500'}>{estado}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Turnos</h1>
          <p className="text-muted-foreground">Gestión de turnos y reservas</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black text-white hover:bg-gray-800 border-2 border-black">
              + Nuevo Turno
            </Button>
          </DialogTrigger>
          <DialogContent className="border-2 border-black">
            <DialogHeader>
              <DialogTitle>Nuevo Turno</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="cliente_nombre">Nombre del Cliente</Label>
                <Input 
                  id="cliente_nombre" 
                  value={formData.cliente_nombre}
                  onChange={(e) => setFormData({...formData, cliente_nombre: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fecha_hora">Fecha</Label>
                <Input 
                  id="fecha_hora" 
                  type="date"
                  value={formData.fecha_hora}
                  onChange={(e) => setFormData({...formData, fecha_hora: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cliente_email">Email</Label>
                <Input 
                  id="cliente_email" 
                  type="email"
                  value={formData.cliente_email}
                  onChange={(e) => setFormData({...formData, cliente_email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="cliente_telefono">Teléfono</Label>
                <Input 
                  id="cliente_telefono" 
                  value={formData.cliente_telefono}
                  onChange={(e) => setFormData({...formData, cliente_telefono: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Input 
                  id="observaciones" 
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full bg-black text-white">
                Guardar Turno
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-2 border-black shadow-[4px_4px_0px_0px_#000]">
        <CardHeader>
          <CardTitle>Lista de Turnos ({records.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8">Cargando...</p>
          ) : error ? (
            <p className="text-center py-8 text-red-500">Error: {error}</p>
          ) : records.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No hay turnos</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(records as Turno[]).map((turno) => (
                  <TableRow key={turno.id}>
                    <TableCell className="font-medium">{turno.cliente_nombre}</TableCell>
                    <TableCell className="font-mono">
                      {new Date(turno.fecha_hora).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{turno.cliente_telefono}</div>
                      <div className="text-xs text-muted-foreground">{turno.cliente_email}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(turno.estado)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(turno.id, 'confirmado')}
                        >
                          Confirmar
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(turno.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
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
