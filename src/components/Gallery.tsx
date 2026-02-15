import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Share2, ZoomIn } from "lucide-react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import gallery7 from "@/assets/gallery-7.jpg";
import gallery8 from "@/assets/gallery-8.jpg";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("todos");

  const categories = [
    { id: "todos", label: "Todos" },
    { id: "manos", label: "Manos" },
    { id: "pies", label: "Pies" },
    { id: "nail-art", label: "Nail Art" }
  ];

  const galleryItems = [
    { id: 1, category: "nail-art", image: gallery1, title: "Nail Art Diseño", likes: 24 },
    { id: 2, category: "manos", image: gallery2, title: "Semipermanente Rosa", likes: 18 },
    { id: 3, category: "nail-art", image: gallery3, title: "Degradado Sunset", likes: 32 },
    { id: 4, category: "manos", image: gallery4, title: "Kapping Natural", likes: 45 },
    { id: 5, category: "nail-art", image: gallery5, title: "French Moderno", likes: 28 },
    { id: 6, category: "pies", image: gallery6, title: "Pediccura SPA", likes: 22 },
    { id: 7, category: "manos", image: gallery7, title: "Soft Gel", likes: 35 },
    { id: 8, category: "nail-art", image: gallery8, title: "Glitter Party", likes: 29 }
  ];

  const filteredItems = selectedCategory === "todos" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <section id="galeria" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
            Nuestra <span className="text-gradient">Galería</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Descubre algunos de nuestros trabajos más destacados y 
            encuentra la inspiración para tu próximo diseño.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`transition-all duration-300 ${
                  selectedCategory === category.id 
                    ? "shadow-elegant" 
                    : "hover:bg-primary/5"
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-white/80">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{item.likes}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                            <ZoomIn className="w-4 h-4" />
                          </button>
                          <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                            <Share2 className="w-4 h-4" />
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

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="hover:bg-primary/5">
            Ver Más Trabajos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;