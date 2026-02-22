import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Share2, ZoomIn } from "lucide-react";

// Mano
import cafe from "@/assets/blestnailspa/extracto/cafe.jpg";
import colorMarron from "@/assets/blestnailspa/extracto/color-marron.jpg";
import gris from "@/assets/blestnailspa/extracto/gris.jpg";
import perladas from "@/assets/blestnailspa/extracto/perladas.jpg";
import libro from "@/assets/blestnailspa/extracto/libro.jpg";
import gallery4 from "@/assets/blestnailspa/extracto/gallery-4.jpg";

// Nail Art
import muchasManos from "@/assets/blestnailspa/extracto/muchas-manos-con-estilos-punteados.jpg";
import multicolor from "@/assets/blestnailspa/extracto/multicolor.jpg";
import punteada from "@/assets/blestnailspa/extracto/punteada.jpg";
import unasRosasDiseno from "@/assets/blestnailspa/extracto/unas-rosas-diseno.jpg";
import unasVerdesTornasoladas from "@/assets/blestnailspa/extracto/unas-verdes-tornasoladas.jpg";
import perladaNaranja from "@/assets/blestnailspa/extracto/perlada-naranja.jpg";
import gallery5 from "@/assets/blestnailspa/extracto/gallery-5.jpg";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("todos");

  const categories = [
    { id: "todos", label: "Todos" },
    { id: "manos", label: "Manos" },
    { id: "pies", label: "Pies" },
    { id: "nail-art", label: "Nail Art" }
  ];

  const galleryItems = [
    // Manos
    { id: 1, category: "manos", image: cafe, title: "Café Latte", likes: 42 },
    { id: 2, category: "manos", image: colorMarron, title: "Chocolate Brown", likes: 38 },
    { id: 3, category: "manos", image: gris, title: "Gris Elegante", likes: 25 },
    { id: 4, category: "manos", image: perladas, title: "Classy Pearl", likes: 51 },
    { id: 5, category: "manos", image: libro, title: "Cozy Reading", likes: 33 },
    { id: 6, category: "manos", image: gallery4, title: "Natural Vibes", likes: 29 },

    // Nail Art
    { id: 7, category: "nail-art", image: muchasManos, title: "Dotted Collection", likes: 45 },
    { id: 8, category: "nail-art", image: multicolor, title: "Rainbow Splash", likes: 56 },
    { id: 9, category: "nail-art", image: punteada, title: "Polka Dots", likes: 31 },
    { id: 10, category: "nail-art", image: unasRosasDiseno, title: "Pink Design", likes: 48 },
    { id: 11, category: "nail-art", image: unasVerdesTornasoladas, title: "Green Iridescent", likes: 39 },
    { id: 12, category: "nail-art", image: perladaNaranja, title: "Orange Pearl", likes: 34 },
    { id: 13, category: "nail-art", image: gallery5, title: "Modern Art", likes: 41 },

    // Pies
    //{ id: 14, category: "pies", image: gallery6, title: "Pediccura SPA", likes: 22 },
  ];

  const filteredItems = selectedCategory === "todos" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <section id="galeria" className="py-12 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            Nuestra <span className="text-gradient">Galería</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8">
            Descubre algunos de nuestros trabajos más destacados y 
            encuentra la inspiración para tu próximo diseño.
          </p>

          {/* Category Filter - Larger touch targets */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`min-h-11 px-4 sm:px-6 transition-all duration-300 ${
                  selectedCategory === category.id 
                    ? "shadow-elegant" 
                    : "hover:bg-primary/5 border-2 border-black"
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group overflow-hidden hover:shadow-elegant transition-all duration-300 border-border/50">
              <CardContent className="p-0 relative">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                      <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">{item.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-white/80">
                          <Heart className="w-5 h-5" />
                          <span className="text-sm">{item.likes}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                            aria-label="Zoom"
                          >
                            <ZoomIn className="w-5 h-5" />
                          </button>
                          <button 
                            className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                            aria-label="Share"
                          >
                            <Share2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
