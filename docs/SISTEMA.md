# Blest Nails - Sistema de Gestión

## 📋 Descripción

Sistema integral para gestión de salón de uñas Blest, incluyendo:
- Agenda de turnos
- Control de servicios y precios
- Gestión de clientes
- Control de gastos y costos
- Cálculo de nómina de empleadas

---

## 🗄️ Base de Datos (NocoDB)

### Configuración
- **URL**: https://nocodb.pelucasistemas.com.ar
- **Base ID**: `pm27oaltuuwfdbo`
- **Token API**: `iSPQZ-_DKyE3gNqFJGkPwjEADQtrwnTzyfXw7ISU`

### Tablas Existentes

#### 1. Servicios (`mk31xm09ctm9l5s`)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | ID | Auto-incremental |
| categoria | Selección | Manicuria, Pedicería, Cejas, etc. |
| nombre | Texto | Nombre del servicio |
| descripcion | Texto | Descripción del servicio |
| duracion | Texto | Duración (ej: "45 min") |
| precio | Moneda | Precio en ARS |
| enlace_reserva | Texto | URL de reserva externa |
| Solo Mujeres | Checkbox | |

**Registros**: 39 servicios

#### 2. Turnos (`mhws19ahzk8g3nn`)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | ID | Auto-incremental |
| Nombre | Texto | Nombre del cliente |
| Fecha | FechaTime | Fecha y hora del turno |
| Email | Email | Correo del cliente |
| Telefono | Teléfono | Teléfono del cliente |
| Servicio | Texto | Servicio solicitado |

**Registros**: 2 (ejemplo)

---

### Tablas a Crear (MANUALMENTE)

**Nota**: El token de API actual no tiene permisos de escritura. Debes crear estas tablas desde la interfaz de NocoDB.

#### 3. Clientes
| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | ID | Auto-incremental |
| Nombre | Texto | Nombre completo |
| Telefono | Teléfono | |
| Email | Email | |
| Notas | Texto largo | Preferencias, historial |
| TotalVisitas | Número | Conteo de visitas |

#### 4. Gastos
| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | ID | Auto-incremental |
| Categoria | Selección | Alquiler, Insumos, Servicios, Impuestos, Otros |
| Descripcion | Texto | Descripción del gasto |
| Monto | Moneda | Importe en ARS |
| Periodicidad | Selección | Único, Mensual, Semanal |
| Fecha | Fecha | Fecha del gasto |
| Comprobante | Archivo | Imagen del comprobante |

#### 5. Empleadas
| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | ID | Auto-incremental |
| Nombre | Texto | Nombre completo |
| Rol | Selección | Manicurista, Recepcionista, Socia |
| ComisionPorcentaje | Número | % de comisión por servicio |
| SueldoBase | Moneda | Sueldo base mensual |
| Horario | Texto | Horario de trabajo |
| Activa | Checkbox | Si está activa |

#### 6. Configuracion
| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | ID | Auto-incremental |
| Clave | Texto | Identificador |
| Valor | Texto | Valor de configuración |
| Descripcion | Texto | Descripción |

---

## 💻 Frontend (React)

### Rutas del Sistema

| Ruta | Descripción |
|------|-------------|
| `/` | Página pública del salón |
| `/admin` | Dashboard |
| `/admin/turnos` | Gestión de turnos |
| `/admin/servicios` | Catálogo de servicios |
| `/admin/empleadas` | Gestión del equipo |
| `/admin/gastos` | Control de gastos |
| `/admin/config` | Configuración y cálculo de costos |

### Archivos Creados

```
src/
├── lib/
│   └── nocodb.ts           # Configuración de NocoDB
├── hooks/
│   └── useNocoDB.ts       # Hook para API de NocoDB
├── components/
│   └── admin/
│       └── AdminLayout.tsx # Layout del admin
└── pages/
    └── admin/
        ├── Dashboard.tsx    # Dashboard principal
        ├── Turnos.tsx       # Gestión de turnos
        ├── Servicios.tsx     # Catálogo de servicios
        ├── Empleadas.tsx    # Gestión de equipo
        ├── Gastos.tsx       # Control de gastos
        └── Configuracion.tsx # Config y costos
```

---

## 💰 Cálculo de Costos

### Fórmula de Precio de Servicio

```
Precio = CostoInsumos + CostoLaboral + Impuestos + Ganancia

Donde:
- CostoInsumos = 15% del precio actual
- CostoLaboral = (Gastos Mensuales / Horas Laborables × Empleadas) × Duración
- Impuestos = (Subtotal) × %
- Ganancia = (Subtotal + Impuestos) × %
```

### Parámetros de Configuración (en la página)

| Parámetro | Descripción | Valor por defecto |
|-----------|-------------|-------------------|
| Impuesto (%) | % de impuestos | 21% |
| Ganancia Deseada (%) | % de ganancia objetivo | 30% |
| Horas Laborables/Mes | Horas trabajadas por mes por persona | 160 |
| Alquiler Mensual | Costo de alquiler mensual | 0 |

---

## ⚙️ Integración con Typebot

### Configuración
- **URL Typebot**: A configurar
- **Webhook**: Guardar turnos en NocoDB

### Flujo del Chatbot
1. Saludo → Opciones: "Agendar" / "Consultar"
2. Selección de servicio (fetch desde NocoDB)
3. Selección de fecha y hora
4. Datos del cliente
5. Confirmación → Guarda en NocoDB Turnos

### Ejemplo de webhook hacia NocoDB
```javascript
// En Typebot - HTTP Request
URL: https://nocodb.pelucasistemas.com.ar/api/v2/tables/mhws19ahzk8g3nn/records
Method: POST
Headers:
  xc-token: iSPQZ-_DKyE3gNqFJGkPwjEADQtrwnTzyfXw7ISU
  Content-Type: application/json
Body:
{
  "Nombre": "{{nombre}}",
  "Fecha": "{{fecha}}",
  "Email": "{{email}}",
  "Telefono": "{{telefono}}",
  "Servicio": "{{servicio}}"
}
```

---

## 🔧 Endpoints de API NocoDB

### Listar registros
```
GET https://nocodb.pelucasistemas.com.ar/api/v2/tables/{tableId}/records?offset=0&limit=25
```

### Crear registro
```
POST https://nocodb.pelucasistemas.com.ar/api/v2/tables/{tableId}/records
Headers: xc-token: {token}
```

### Actualizar registro
```
PATCH https://nocodb.pelucasistemas.com.ar/api/v2/tables/{tableId}/records/{id}
```

### Eliminar registro
```
DELETE https://nocodb.pelucasistemas.com.ar/api/v2/tables/{tableId}/records/{id}
```

---

## 🚀 Cómo Ejecutar

```bash
cd blest-nails-style

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

---

## 👥 Equipo (configurar en NocoDB)

| Nombre | Rol | Comisión |
|--------|-----|----------|
| (Por configurar) | Manicurista | % |
| (Por configurar) | Manicurista | % |
| (Por configurar) | Manicurista | % |
| (Por configurar) | Recepcionista | - |
| (Socia 1) | Socia | - |
| (Socia 2) | Socia | - |

---

## 📅 Próximos Pasos

1. [x] Crear documentación del sistema
2. [x] Desarrollar páginas del sistema de gestión
3. [ ] Crear tablas en NocoDB (Clientes, Gastos, Empleadas, Config) - MANUAL
4. [ ] Completar datos de empleadas
5. [ ] Configurar Typebot con webhook a NocoDB
6. [ ] Desplegar frontend

---

## ⚠️ Nota Importante

**El token de API actual no tiene permisos de escritura.** Para poder crear/editar registros desde el frontend, necesitas:

1. Ir a NocoDB → Configuración → API Tokens
2. Generar un nuevo token con permisos completos
3. Actualizar el token en `src/lib/nocodb.ts`

Alternativamente, las tablas pueden gestionarse directamente desde la interfaz de NocoDB.

---

*Documentación actualizada: 2025-02-14*
