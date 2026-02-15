import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Instagram } from "lucide-react";

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
                      <p className="text-muted-foreground">Av. Scalabrini Ortiz 2446<br />Palermo, Buenos Aires</p>
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
                      <p className="text-muted-foreground">11-4916-6036</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="flex items-center space-x-4 p-6">
                    <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">WhatsApp</h4>
                      <p className="text-muted-foreground">11-4916-6036</p>
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
                        <p>Lun - Sáb: 9:00 - 19:00</p>
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
                Síguenos en Instagram
              </h3>
              <div className="flex space-x-4">
                <a href="https://instagram.com/blestnailspa" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="hover:bg-primary/5">
                    <Instagram className="w-5 h-5" />
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="shadow-elegant border-border/50">
            <CardHeader>
              <CardTitle className="font-playfair text-2xl">Reserva tu Cita</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  ¿Querés reservar tu turno? Escribinos por WhatsApp y te ayudamos a coordinar tu cita.
                </p>
              </div>
              
              <a 
                href="https://wa.me/1149166036?text=Hola!%20Quiero%20reservar%20un%20turno" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full shadow-elegant bg-green-600 hover:bg-green-700">
                  <Phone className="w-4 h-4 mr-2" />
                  Reservar por WhatsApp
                </Button>
              </a>

              <p className="text-xs text-muted-foreground text-center">
                Lunes a Sábados de 9 a 19 hs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;