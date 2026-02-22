import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Palette, Shield, Hand, Footprints, Eye, Scissors } from "lucide-react";
import servicesImage from "@/assets/blestnailspa/extracto/gallery-4.jpg";
import { fetchServicios } from "@/lib/hornerodb";

const getIconForCategory = (category: string) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('mano') || cat.includes('manicuria')) return <Hand className="w-8 h-8" />;
  if (cat.includes('pie') || cat.includes('pedicuria')) return <Footprints className="w-8 h-8" />;
  if (cat.includes('ceja') || cat.includes('pestaña')) return <Eye className="w-8 h-8" />;
  if (cat.includes('gel')) return <Palette className="w-8 h-8" />;
  return <Sparkles className="w-8 h-8" />;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(price);
};

interface Servicio {
  id: string;
  categoria?: string;
  nombre: string;
  descripcion?: string;
  precio: number;
}

const Services = () => {
  const [services, setServices] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchServicios();
        setServices(data.slice(0, 4) as Servicio[]);
      } catch (error) {
        console.error("Error fetching services", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  return (
    <section id="servicios" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
            Nuestros <span className="text-gradient">Servicios</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ofrecemos una gama completa de servicios profesionales de manicura 
            con los mejores productos y técnicas del mercado.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img 
              src={servicesImage} 
              alt="Servicios profesionales de manicura" 
              className="rounded-2xl shadow-elegant w-full h-[400px] object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <h3 className="font-playfair text-3xl font-bold text-foreground">
              Calidad y Profesionalidad
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              En Blest utilizamos únicamente productos de las mejores marcas internacionales 
              y aplicamos técnicas innovadoras para garantizar resultados perfectos y duraderos.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-foreground">Productos hipoalergénicos y veganos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-foreground">Instrumentos esterilizados y desechables</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-foreground">Técnicas innovadoras y actualizadas</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="text-center hover:shadow-elegant transition-all duration-300 border-border/50 hover:border-primary/20">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 text-white">
                  {getIconForCategory(service.categoria || '')}
                </div>
                <CardTitle className="text-xl font-playfair">{service.nombre}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {service.descripcion}
                </CardDescription>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">{formatPrice(service.precio)}</div>
                </div>
                <Link to="/reservar">
                  <Button variant="outline" className="w-full hover:bg-primary/5">
                    Reservar
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/reservar">
            <Button size="lg" className="shadow-elegant">
              Ver Todos los Servicios
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;