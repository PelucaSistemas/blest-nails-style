import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useHorneroDB } from '@/hooks/useHorneroDB';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Servicio {
  id: string;
  categoria: string;
  nombre: string;
  descripcion: string;
  duracion_minutos: number | null;
  precio: number;
}

const EMPTY_FORM: Omit<Servicio, 'id'> = {
  nombre: '',
  categoria: '',
  precio: 0,
  descripcion: '',
  duracion_minutos: null,
};

export default function Servicios() {
  const { records, loading, fetchRecords, createRecord, updateRecord, deleteRecord } = useHorneroDB({
    collection: 'servicios',
    autoFetch: false,
  });
  const { toast } = useToast();

  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Servicio | null>(null);
  const [form, setForm] = useState<Omit<Servicio, 'id'>>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Servicio | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  // Derive categories dynamically from loaded records
  const categorias = useMemo(() => {
    const set = new Set<string>();
    (records as Servicio[]).forEach(s => { if (s.categoria) set.add(s.categoria); });
    return Array.from(set).sort();
  }, [records]);

  const serviciosFiltrados = (records as Servicio[]).filter(s => {
    const cat = !filtroCategoria || s.categoria === filtroCategoria;
    const search = !busqueda ||
      s.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
    return cat && search;
  });

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (s: Servicio) => {
    setEditTarget(s);
    setForm({ nombre: s.nombre, categoria: s.categoria, precio: s.precio, descripcion: s.descripcion ?? '', duracion_minutos: s.duracion_minutos });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.nombre.trim()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        precio: Number(form.precio) || 0,
        duracion_minutos: form.duracion_minutos != null ? Number(form.duracion_minutos) : null,
      };
      if (editTarget) {
        await updateRecord(editTarget.id, payload);
        toast({ title: 'Servicio actualizado' });
      } else {
        await createRecord(payload);
        toast({ title: 'Servicio creado' });
      }
      setDialogOpen(false);
    } catch {
      toast({ title: 'Error al guardar', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteRecord(deleteTarget.id);
      toast({ title: 'Servicio eliminado' });
      setDeleteTarget(null);
    } catch {
      toast({ title: 'Error al eliminar', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Servicios</h1>
          <p className="text-muted-foreground">Catálogo de servicios del salón</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-lg px-4 py-2">
            {serviciosFiltrados.length} servicios
          </Badge>
          <Button onClick={openCreate} className="bg-black text-white border-2 border-black">
            <Plus className="w-4 h-4 mr-2" /> Nuevo Servicio
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Buscar servicio..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
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
          {categorias.map(cat => (
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

      {/* Table */}
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
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Cargando...</TableCell>
                </TableRow>
              ) : serviciosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No se encontraron servicios
                  </TableCell>
                </TableRow>
              ) : (
                serviciosFiltrados.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.nombre}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{s.categoria}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground text-sm">
                      {s.descripcion || '—'}
                    </TableCell>
                    <TableCell>
                      {s.duracion_minutos ? `${s.duracion_minutos} min` : '—'}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatPrice(s.precio)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-end">
                        <Button
                          size="icon" variant="ghost"
                          onClick={() => openEdit(s)}
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon" variant="ghost"
                          onClick={() => setDeleteTarget(s)}
                          title="Eliminar"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg border-2 border-black">
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Editar Servicio' : 'Nuevo Servicio'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={form.nombre}
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                placeholder="Ej: Manicura + Esmaltado semipermanente"
                className="border-2 border-black"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría</Label>
                <Input
                  id="categoria"
                  list="categorias-list"
                  value={form.categoria}
                  onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                  placeholder="Ej: Manicuria"
                  className="border-2 border-black"
                />
                <datalist id="categorias-list">
                  {categorias.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>
              <div className="space-y-2">
                <Label htmlFor="precio">Precio (ARS)</Label>
                <Input
                  id="precio"
                  type="number"
                  value={form.precio}
                  onChange={e => setForm(f => ({ ...f, precio: Number(e.target.value) }))}
                  placeholder="26000"
                  className="border-2 border-black"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duracion">Duración (minutos)</Label>
              <Input
                id="duracion"
                type="number"
                value={form.duracion_minutos ?? ''}
                onChange={e => setForm(f => ({ ...f, duracion_minutos: e.target.value ? Number(e.target.value) : null }))}
                placeholder="60"
                className="border-2 border-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={form.descripcion}
                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                placeholder="Descripción del servicio..."
                className="border-2 border-black min-h-[90px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-2 border-black">
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.nombre.trim()}
              className="bg-black text-white border-2 border-black"
            >
              {saving ? 'Guardando...' : editTarget ? 'Guardar cambios' : 'Crear servicio'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="border-2 border-black">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar servicio?</AlertDialogTitle>
            <AlertDialogDescription>
              Vas a eliminar <strong>"{deleteTarget?.nombre}"</strong>. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-2 border-black">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground border-2 border-destructive"
            >
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
