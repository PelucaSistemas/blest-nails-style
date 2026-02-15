import { Heart, Instagram, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-charcoal-soft text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="font-playfair text-2xl font-bold">
              <span className="text-gradient">Blest</span> Nail Spa
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Tu salón de manicura de confianza en Palermo, Buenos Aires. 
              Somos especialistas en diseños únicos y cuidado profesional de uñas.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://instagram.com/blestnailspa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center hover:shadow-glow transition-all duration-300"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-playfair text-lg font-semibold">Servicios</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#servicios" className="hover:text-primary transition-colors">Manicura Clásica</a></li>
              <li><a href="#servicios" className="hover:text-primary transition-colors">Nail Art Personalizado</a></li>
              <li><a href="#servicios" className="hover:text-primary transition-colors">Semi-permanente</a></li>
              <li><a href="#servicios" className="hover:text-primary transition-colors">Manicura Express</a></li>
              <li><a href="#servicios" className="hover:text-primary transition-colors">Diseños para Eventos</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-playfair text-lg font-semibold">Enlaces</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#inicio" className="hover:text-primary transition-colors">Inicio</a></li>
              <li><a href="#servicios" className="hover:text-primary transition-colors">Servicios</a></li>
              <li><a href="#galeria" className="hover:text-primary transition-colors">Galería</a></li>
              <li><a href="#contacto" className="hover:text-primary transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Política de Privacidad</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-playfair text-lg font-semibold">Contacto</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Av. Scalabrini Ortiz 2446<br />Palermo, Buenos Aires</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>11-4916-6036</span>
              </div>
            </div>

            <div className="pt-4">
              <h4 className="font-semibold text-sm mb-2">Horarios</h4>
              <div className="text-xs text-gray-400 space-y-1">
                <p>Lun - Sáb: 9:00 - 19:00</p>
                <p>Dom: Cerrado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2026 Blest. Todos los derechos reservados.
            </p>
            <p className="text-sm text-gray-400 flex items-center space-x-1">
              <span>Hecho con</span>
              <Heart className="w-4 h-4 text-primary fill-current" />
              <span>en Buenos Aires</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;