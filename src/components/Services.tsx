import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Palette, Shield, Hand, Footprints, Eye, Scissors } from "lucide-react";
import servicesImage from "@/assets/gallery-3.jpg";

const Services = () => {
  const allServices = [
    {
      category: "Manos",
      icon: <Hand className="w-8 h-8" />,
      title: "Manicuría",
      description: "Cuidado completo. Repujado, cutículas, limado e hidratación.",
      price: "$29.000"
    },
    {
      category: "Manos",
      icon: <Sparkles className="w-8 h-8" />,
      title: "Semi-permanente",
      description: "Esmaltado duradero hasta 3 semanas.",
      price: "$32.000"
    },
    {
      category: "Manos",
      icon: <Shield className="w-8 h-8" />,
      title: "Kapping Uñas Cortas",
      description: "Refuerzo en gel sobre uña natural. Ideal para uñas débiles.",
      price: "$38.000"
    },
    {
      category: "Manos",
      icon: <Palette className="w-8 h-8" />,
      title: "Soft Gel",
      description: "Extensiones con tips de gel. Rápidas y ligeras.",
      price: "$44.000"
    },
    {
      category: "Pies",
      icon: <Footprints className="w-8 h-8" />,
      title: "Pedicuría",
      description: "Remoción de durezas y callos con bisturí.",
      price: "$36.000"
    },
    {
      category: "Pies",
      icon: <Sparkles className="w-8 h-8" />,
      title: "Belleza de Pies",
      description: "Exfoliación, hidratación y esmaltado.",
      price: "$33.000"
    },
    {
      category: "Cejas",
      icon: <Eye className="w-8 h-8" />,
      title: "Perfilado de Cejas",
      description: "Depilación con cera o pinza. Forma acorde al rostro.",
      price: "$23.000"
    },
    {
      category: "Cejas",
      icon: <Sparkles className="w-8 h-8" />,
      title: "Lifting de Pestañas",
      description: "Alarga y da curva natural. Con bótox y tinte opcional.",
      price: "$41.000"
    }
  ];

  const services = allServices.slice(0, 4);

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
                  {service.icon}
                </div>
                <CardTitle className="text-xl font-playfair">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {service.description}
                </CardDescription>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">{service.price}</div>
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