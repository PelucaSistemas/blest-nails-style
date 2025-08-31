import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";

const Contact = () => {
  return (
    <section id="contacto" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">Contacta</span> con Nosotros
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Estamos aquí para hacer realidad el diseño de uñas que siempre has soñado. 
            ¡Reserva tu cita o consúltanos cualquier duda!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="font-playfair text-2xl font-bold mb-6 text-foreground">
                Información de Contacto
              </h3>
              
              <div className="space-y-6">
                <Card className="border-border/50">
                  <CardContent className="flex items-center space-x-4 p-6">
                    <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Dirección</h4>
                      <p className="text-muted-foreground">Calle Gran Vía, 25, 2º piso<br />28013 Madrid, España</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="flex items-center space-x-4 p-6">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Teléfono</h4>
                      <p className="text-muted-foreground">+34 123 456 789</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="flex items-center space-x-4 p-6">
                    <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Email</h4>
                      <p className="text-muted-foreground">info@blest-nails.com</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="flex items-center space-x-4 p-6">
                    <div className="w-12 h-12 rounded-full gradient-secondary flex items-center justify-center">
                      <Clock className="w-6 h-6 text-charcoal-soft" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Horarios</h4>
                      <div className="text-muted-foreground text-sm">
                        <p>Lun - Vie: 10:00 - 20:00</p>
                        <p>Sáb: 10:00 - 18:00</p>
                        <p>Dom: Cerrado</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-playfair text-xl font-bold mb-4 text-foreground">
                Síguenos en Redes
              </h3>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon" className="hover:bg-primary/5">
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="hover:bg-primary/5">
                  <Facebook className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="shadow-elegant border-border/50">
            <CardHeader>
              <CardTitle className="font-playfair text-2xl">Reserva tu Cita</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Nombre *
                  </label>
                  <Input placeholder="Tu nombre completo" className="border-border/50" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Teléfono *
                  </label>
                  <Input placeholder="+34 123 456 789" className="border-border/50" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Email *
                </label>
                <Input type="email" placeholder="tu.email@ejemplo.com" className="border-border/50" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Servicio
                  </label>
                  <select className="w-full px-3 py-2 border border-border/50 rounded-md bg-background text-foreground">
                    <option>Manicura Clásica</option>
                    <option>Nail Art Personalizado</option>
                    <option>Semi-permanente</option>
                    <option>Manicura Express</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Fecha Preferida
                  </label>
                  <Input type="date" className="border-border/50" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Mensaje
                </label>
                <Textarea 
                  placeholder="Cuéntanos qué tipo de diseño tienes en mente..."
                  className="border-border/50 min-h-[100px]"
                />
              </div>

              <Button className="w-full shadow-elegant">
                Enviar Solicitud
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Te contactaremos en un plazo máximo de 24 horas para confirmar tu cita.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;