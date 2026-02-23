import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { isAuthenticated, getCurrentUser } from "@/lib/hornerodb";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      const user = getCurrentUser();
      setIsAdmin(auth && user?.role_name === 'admin');
    };
    checkAuth();
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}
      
      <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50 shadow-subtle">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="font-playfair text-2xl font-bold">
              <span className="text-gradient">Blest</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#inicio" className="text-foreground hover:text-primary transition-colors duration-300">
                Inicio
              </a>
              <a href="#servicios" className="text-foreground hover:text-primary transition-colors duration-300">
                Servicios
              </a>
              <a href="#galeria" className="text-foreground hover:text-primary transition-colors duration-300">
                Galería
              </a>
              <a href="#contacto" className="text-foreground hover:text-primary transition-colors duration-300">
                Contacto
              </a>
            </nav>

            {/* Contact Info & CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>11-4916-6036</span>
              </div>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="border-2 border-black">
                    Admin
                  </Button>
                </Link>
              )}
              <Link to="/reservar">
                <Button variant="default" className="shadow-elegant">
                  Reservar Cita
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button - Larger touch target (44px+) */}
            <button
              className="md:hidden min-w-11 min-h-11 flex items-center justify-center -mr-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden transition-all duration-300 ${isMenuOpen ? 'mt-4 pb-4' : ''}`}>
            {isMenuOpen && (
              <nav className="flex flex-col space-y-2">
                <a 
                  href="#inicio" 
                  className="text-foreground hover:text-primary transition-colors duration-300 py-3 px-4 min-h-11 flex items-center rounded-lg hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  Inicio
                </a>
                <a 
                  href="#servicios" 
                  className="text-foreground hover:text-primary transition-colors duration-300 py-3 px-4 min-h-11 flex items-center rounded-lg hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  Servicios
                </a>
                <a 
                  href="#galeria" 
                  className="text-foreground hover:text-primary transition-colors duration-300 py-3 px-4 min-h-11 flex items-center rounded-lg hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  Galería
                </a>
                <a 
                  href="#contacto" 
                  className="text-foreground hover:text-primary transition-colors duration-300 py-3 px-4 min-h-11 flex items-center rounded-lg hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  Contacto
                </a>
                <div className="pt-4 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground py-2 px-4">
                    <Phone className="w-5 h-5" />
                    <span>11-4916-6036</span>
                  </div>
                  <Link to="/reservar" onClick={closeMenu}>
                    <Button variant="default" className="w-full shadow-elegant min-h-12 text-base">
                      Reservar Cita
                    </Button>
                  </Link>
                </div>
              </nav>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
