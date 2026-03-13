import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Database, KeyRound, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { setWorkspaceConfig, API_URL } from '@/lib/hornerodb';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export default function Setup() {
  const [workspaceId, setWorkspaceId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDownloadSchema = () => {
    const link = document.createElement('a');
    link.href = '/schema.json';
    link.download = 'blest-nails-schema.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const verifyAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceId || !apiKey) {
      toast({
        title: "Error",
        description: "Completá ambos campos",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Intentar obtener servicios para validar acceso
      const response = await fetch(`${API_URL}/workspaces/${workspaceId}/data/servicios`, {
        headers: {
          'Authorization': apiKey,
          'X-Workspace-ID': workspaceId
        }
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas o workspace no encontrado');
      }

      setWorkspaceConfig(workspaceId, apiKey);
      
      toast({
        title: "¡Éxito!",
        description: "Conexión a HorneroDB establecida correctamente",
      });
      
      // Recargar para que los Guards y Hooks tomen la nueva configuración
      window.location.href = '/';
      
    } catch (error: any) {
      toast({
        title: "Error de conexión",
        description: error.message || "No se pudo conectar a HorneroDB",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-xl w-full mx-auto shadow-lg border-t-4 border-t-primary">
        <CardHeader className="text-center pb-8 border-b border-slate-100">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Instalación de Base de Datos</CardTitle>
          <CardDescription className="text-lg mt-2">
            Falta configurar la conexión a HorneroDB.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-8 space-y-8">
          
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">1</div>
            <div className="space-y-3 flex-1">
              <div>
                <h3 className="font-semibold text-lg">Descargar Esquema</h3>
                <p className="text-sm text-slate-500">Descargá el archivo JSON con la estructura de tablas necesaria para Blest Nails.</p>
              </div>
              <Button onClick={handleDownloadSchema} variant="outline" className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Descargar schema.json
              </Button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">2</div>
            <div className="space-y-3 flex-1">
              <div>
                <h3 className="font-semibold text-lg">Importar en HorneroDB</h3>
                <p className="text-sm text-slate-500">
                  Ingresá a tu panel de HorneroDB, creá un Workspace nuevo usando la opción "Importar" y subí el archivo descargado.
                </p>
              </div>
            </div>
          </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
              <div className="space-y-4 flex-1">
                <div>
                  <h3 className="font-semibold text-lg">Configurar Acceso</h3>
                  <div className="text-sm text-slate-500 space-y-2 mt-1">
                    <p>
                      Al importar el Schema, HorneroDB te mostrará la nueva API Key generada. 
                    </p>
                    <p className="bg-yellow-50 text-yellow-800 p-3 rounded-md border border-yellow-200">
                      <strong>Si no la copiaste:</strong> Entrá a tu HorneroDB → Configuración del Workspace → API Keys. Hacé click en el botón <strong>"Regenerate"</strong> (icono de recarga) para generar una calve nueva.
                    </p>
                    <p>
                      Pegá el ID del Workspace y tu Clave API para finalizar.
                    </p>
                  </div>
                </div>
              
              <form onSubmit={verifyAndSave} className="space-y-4 bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                <div className="space-y-2">
                  <Label htmlFor="workspace">Workspace ID</Label>
                  <div className="relative">
                    <Database className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input 
                      id="workspace" 
                      placeholder="Ej: f47ac10b-58cc-4372-a567-0e02b2c3d479" 
                      className="pl-9"
                      value={workspaceId}
                      onChange={(e) => setWorkspaceId(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apikey">API Key Pública / Master Key</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <Input 
                      id="apikey" 
                      type="password"
                      placeholder="key_..." 
                      className="pl-9"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full mt-2" disabled={loading}>
                  {loading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Conectando...</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4 mr-2" /> Verificar y Conectar <ArrowRight className="w-4 h-4 ml-1" /></>
                  )}
                </Button>
              </form>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
