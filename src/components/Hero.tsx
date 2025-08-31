import { Button } from "@/components/ui/button";
import { Star, Award, Users } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center pt-20">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 gradient-hero"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl">
          <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gradient">Manicura</span>
            <br />
            <span className="text-foreground">Profesional</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
            Diseños únicos, técnicas avanzadas y productos de alta calidad 
            para tus uñas perfectas en Madrid.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 shadow-elegant hover:shadow-glow transition-all duration-300"
            >
              Reservar Cita Ahora
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
            >
              Ver Galería
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">4.9/5</div>
                <div className="text-sm text-muted-foreground">Valoración</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">1200+</div>
                <div className="text-sm text-muted-foreground">Clientas</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">5 años</div>
                <div className="text-sm text-muted-foreground">Experiencia</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;