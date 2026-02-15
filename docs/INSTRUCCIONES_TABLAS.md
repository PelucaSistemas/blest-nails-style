# Instrucciones para Crear Tablas en NocoDB

## Opción 1: Desde la Interfaz de NocoDB

### Pasos:
1. Ir a: https://nocodb.pelucasistemas.com.ar/dashboard/#/nc/pm27oaltuuwfdbo
2. Click en el botón "+" o "New Table"
3. Crear cada tabla con los campos indicados abajo

---

## Opción 2: Importar CSV

### Archivos CSV listos para importar:
- `import/Clientes.csv`
- `import/Gastos.csv`
- `import/Empleadas.csv`
- `import/Configuracion.csv`

### Pasos:
1. En NocoDB, ir a la base "Blest"
2. Click en "Import" → "Import from CSV"
3. Seleccionar el archivo CSV correspondiente

---

## Opción 3: Usar el Script (API)

### Ejecutar el script:
```bash
cd docs
chmod +x create-tables.sh
./create-tables.sh
```

**Nota:** El token actual puede no tener permisos de escritura. Si falla, usar la opción 1 o 2.

---

## Estructura de Cada Tabla

### 1. Clientes
| Campo | Tipo | Opciones |
|-------|------|----------|
| Nombre | SingleLineText | Primary Key |
| Telefono | PhoneNumber | - |
| Email | Email | - |
| Notas | LongText | - |
| TotalVisitas | Number | - |

### 2. Gastos
| Campo | Tipo | Opciones |
|-------|------|----------|
| Categoria | SingleSelect | Alquiler, Insumos, Servicios, Impuestos, Otros |
| Descripcion | SingleLineText | - |
| Monto | Currency | ARS |
| Periodicidad | SingleSelect | Unico, Mensual, Semanal |
| Fecha | Date | DD/MM/YYYY |
| Comprobante | Attachment | - |

### 3. Empleadas
| Campo | Tipo | Opciones |
|-------|------|----------|
| Nombre | SingleLineText | Primary Key |
| Rol | SingleSelect | Manicurista, Recepcionista, Socia |
| ComisionPorcentaje | Number | 0-100 |
| SueldoBase | Currency | ARS |
| Horario | SingleLineText | - |
| Activa | Checkbox | Default: true |

### 4. Configuracion
| Campo | Tipo | Opciones |
|-------|------|----------|
| Clave | SingleLineText | Primary Key |
| Valor | SingleLineText | - |
| Descripcion | SingleLineText | - |

---

## Datos Iniciales para Configuracion

Importar o crear estos registros:
| Clave | Valor | Descripcion |
|-------|-------|-------------|
| impuesto_porcentaje | 21 | Porcentaje de impuestos |
| ganancia_deseada | 30 | Porcentaje de ganancia deseada |
| horas_laborables_mes | 160 | Horas laborables por mes por persona |
| alquiler_mensual | 0 | Costo de alquiler mensual |

---

## Después de Crear las Tablas

1. Actualizar los TABLE_IDS en `src/lib/nocodb.ts` con los IDs de las nuevas tablas
2. El frontend automáticamente se conectará a las nuevas tablas
