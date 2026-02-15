import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, User, Sparkles, ChevronRight, ChevronLeft, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { pb } from "@/lib/pocketbase";

interface Servicio {
  id: string;
  categoria: string;
  nombre: string;
  descripcion: string;
  duracion_minutos: number;
  precio: number;
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"
];

export default function Reservar() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Servicio | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [clientData, setClientData] = useState({ nombre: "", email: "", telefono: "" });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const result = await pb.collection('servicios').getFullList();
        setServicios(result as unknown as Servicio[]);
      } catch (error) {
        console.error("Error fetching servicios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServicios();
  }, []);

  const serviciosAgrupados = servicios.reduce((acc: Record<string, Servicio[]>, servicio) => {
    const cat = servicio.categoria || "Otros";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(servicio);
    return acc;
  }, {});

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedService !== null;
      case 2: return true; 
      case 3: return selectedDate !== undefined;
      case 4: return selectedTime !== "";
      case 5: return clientData.nombre && clientData.telefono;
      default: return false;
    }
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;
    
    setIsSubmitting(true);
    try {
      const fechaHora = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(":");
      fechaHora.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      await pb.collection('turnos').create({
        cliente_nombre: clientData.nombre,
        cliente_telefono: clientData.telefono,
        cliente_email: clientData.email,
        servicio_id: selectedService.id,
        fecha_hora: fechaHora.toISOString().split('T')[0],
        estado: 'pendiente',
      });
      
      setBookingSuccess(true);
    } catch (error) {
      console.error("Error al guardar turno:", error);
      alert("Error al confirmar la reserva. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || date.getDay() === 0;
  };

  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#a8b5a0" }}>
        <Card className="max-w-md mx-4 border-4 border-black shadow-[8px_8px_0px_0px_#000]">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-black">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4">¡Reserva Confirmada!</h2>
            <p className="text-gray-600 mb-2">Gracias por elegirnos, <strong>{clientData.nombre}</strong></p>
            <div className="text-left bg-gray-100 p-4 rounded-lg border-2 border-black mt-4">
              <p><strong>Servicio:</strong> {selectedService?.nombre}</p>
              <p><strong>Fecha:</strong> {selectedDate?.toLocaleDateString("es-AR")}</p>
              <p><strong>Hora:</strong> {selectedTime}</p>
              <p><strong>Total:</strong> {formatPrice(selectedService?.precio || 0)}</p>
            </div>
            <p className="text-sm text-gray-500 mt-4">Te enviaremos un WhatsApp de confirmación.</p>
            <Link to="/">
              <Button className="mt-6 bg-black text-white hover:bg-gray-800 border-2 border-black">
                Volver al inicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#a8b5a0" }}>
      <div className="bg-white border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 text-black font-bold hover:underline">
              <ArrowLeft className="w-5 h-5" />
              Volver
            </Link>
            <div className="font-playfair text-2xl font-bold">
              <span className="text-gradient">Blest</span>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { number: 1, title: "Servicio", icon: Sparkles },
              { number: 2, title: "Profesional", icon: User },
              { number: 3, title: "Fecha", icon: Calendar },
              { number: 4, title: "Hora", icon: Clock },
              { number: 5, title: "Datos", icon: Check },
            ].map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all ${
                    isCompleted ? "bg-black border-black text-white" : isActive ? "bg-white border-black text-black" : "border-white/50 text-white/70"
                  }`}>
                    {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <div className="ml-2 hidden sm:block">
                    <div className={`text-sm font-bold ${isActive || isCompleted ? "text-white" : "text-white/70"}`}>
                      {step.title}
                    </div>
                  </div>
                  {index < 4 && <ChevronRight className="w-5 h-5 text-white/50 mx-2" />}
                </div>
              );
            })}
          </div>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-4 border-black">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-black">
              {currentStep === 1 && "Selecciona tu servicio"}
              {currentStep === 2 && "Elige tu profesional"}
              {currentStep === 3 && "Selecciona la fecha"}
              {currentStep === 4 && "Elige el horario"}
              {currentStep === 5 && "Tus datos de contacto"}
            </CardTitle>
          </CardHeader>

          <CardContent className="px-6 pb-8">
            {loading ? (
              <div className="text-center py-8">Cargando servicios...</div>
            ) : currentStep === 1 && (
              <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                {Object.entries(serviciosAgrupados).map(([categoria, items]) => (
                  <div key={categoria}>
                    <h3 className="text-lg font-bold text-black mb-3 border-b-4 border-black pb-2 inline-block capitalize">
                      {categoria}
                    </h3>
                    <RadioGroup
                      value={selectedService?.id || ""}
                      onValueChange={(value) => {
                        const servicio = items.find((s: Servicio) => s.id === value);
                        setSelectedService(servicio || null);
                      }}
                    >
                      <div className="grid gap-3">
                        {items.map((servicio: Servicio) => (
                          <div
                            key={servicio.id}
                            className="flex items-center space-x-3 p-4 rounded-lg border-4 border-black hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <RadioGroupItem value={servicio.id} id={servicio.id} className="border-2 border-black" />
                            <Label htmlFor={servicio.id} className="flex-1 cursor-pointer">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-bold text-black">{servicio.nombre}</div>
                                  <div className="text-sm text-gray-600">{servicio.duracion_minutos || 60} min</div>
                                </div>
                                <div className="text-xl font-bold text-black">
                                  {formatPrice(servicio.precio)}
                                </div>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 2 && (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Te asignaremos el primer manicurista disponible</p>
                <User className="w-16 h-16 mx-auto text-gray-400" />
              </div>
            )}

            {currentStep === 3 && (
              <div className="flex justify-center">
                <div className="border-4 border-black rounded-lg overflow-hidden">
                  <div className="bg-black text-white text-center py-2 font-bold">
                    {selectedDate?.toLocaleDateString("es-AR", { month: "long", year: "numeric" })}
                  </div>
                  <div className="grid grid-cols-7 gap-1 p-4 bg-white">
                    {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(d => (
                      <div key={d} className="text-center font-bold text-sm p-2">{d}</div>
                    ))}
                    {Array.from({ length: 35 }).map((_, i) => {
                      const date = new Date();
                      date.setDate(i - date.getDay() + 1);
                      const isCurrentMonth = date.getMonth() === (selectedDate?.getMonth() || new Date().getMonth());
                      const isDisabled = isDateDisabled(date);
                      const isSelected = selectedDate?.toDateString() === date.toDateString();
                      
                      return (
                        <button
                          key={i}
                          disabled={isDisabled || !isCurrentMonth}
                          onClick={() => setSelectedDate(date)}
                          className={`p-2 text-center rounded-lg font-bold transition-all border-2 ${
                            isSelected ? "bg-black text-white border-black" : 
                            isDisabled || !isCurrentMonth ? "text-gray-300 border-transparent cursor-not-allowed" :
                            "border-transparent hover:bg-gray-100"
                          }`}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <div className="mb-4 p-4 bg-yellow-100 rounded-lg border-4 border-black">
                  <div className="text-sm text-gray-600">Resumen:</div>
                  <div className="font-bold text-black">{selectedService?.nombre}</div>
                  <div className="text-sm text-gray-600">
                    {selectedDate?.toLocaleDateString("es-AR")} • {selectedTime}
                  </div>
                </div>

                <RadioGroup value={selectedTime} onValueChange={setSelectedTime}>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((time) => (
                      <div
                        key={time}
                        className="flex items-center justify-center p-3 rounded-lg border-4 border-black hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <RadioGroupItem value={time} id={time} className="sr-only" />
                        <Label htmlFor={time} className={`cursor-pointer font-bold ${selectedTime === time ? "bg-black text-white px-4 py-2 rounded" : ""}`}>
                          {time}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="mb-6 p-4 bg-yellow-100 rounded-lg border-4 border-black">
                  <div className="text-sm text-gray-600">Reserva:</div>
                  <div className="font-bold">{selectedService?.nombre}</div>
                  <div className="text-sm text-gray-600">
                    {selectedDate?.toLocaleDateString("es-AR")} • {selectedTime}
                  </div>
                  <div className="text-xl font-bold mt-2">{formatPrice(selectedService?.precio || 0)}</div>
                </div>

                <div>
                  <Label className="font-bold text-black">Nombre completo *</Label>
                  <input
                    type="text"
                    value={clientData.nombre}
                    onChange={(e) => setClientData({...clientData, nombre: e.target.value})}
                    className="w-full p-3 border-4 border-black rounded-lg font-bold"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <Label className="font-bold text-black">WhatsApp *</Label>
                  <input
                    type="tel"
                    value={clientData.telefono}
                    onChange={(e) => setClientData({...clientData, telefono: e.target.value})}
                    className="w-full p-3 border-4 border-black rounded-lg font-bold"
                    placeholder="11 1234 5678"
                  />
                </div>
                <div>
                  <Label className="font-bold text-black">Email (opcional)</Label>
                  <input
                    type="email"
                    value={clientData.email}
                    onChange={(e) => setClientData({...clientData, email: e.target.value})}
                    className="w-full p-3 border-4 border-black rounded-lg font-bold"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="bg-white border-4 border-black text-black hover:bg-gray-100 font-bold px-6"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          {currentStep < 5 ? (
            <Button 
              onClick={nextStep} 
              disabled={!canProceed()} 
              className="bg-black text-white hover:bg-gray-800 border-4 border-black font-bold px-6"
            >
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleBooking}
              disabled={!canProceed() || isSubmitting}
              className="bg-green-600 text-white hover:bg-green-700 border-4 border-black font-bold px-6"
            >
              {isSubmitting ? "Confirmando..." : "Confirmar Reserva"}
              <Check className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
