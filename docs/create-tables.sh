#!/bin/bash

# ===========================================
# CREAR TABLAS EN HORNERODB - BLEST NAILS
# ===========================================

# Read .env values automatically
source "$(dirname "$0")/../.env"

TOKEN="${VITE_API_KEY}"
WORKSPACE_ID="${VITE_WORKSPACE_ID}"
URL="${VITE_API_URL%/}"

echo "🔧 Creando tablas en HorneroDB..."
echo "================================"

# Check if auth header needs 'Bearer ' prefix
AUTH_HEADER="Bearer ${TOKEN#Bearer }"

create_table() {
  local name=$1
  local slug=$2
  
  local resp=$(curl -s -X POST "$URL/workspaces/$WORKSPACE_ID/tables" \
    -H "Authorization: $AUTH_HEADER" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"$name\", \"slug\": \"$slug\"}")
    
  echo "$resp" | grep -o '"id":"[^"]*"' | head -1 | cut -d '"' -f 4
}

create_column() {
  local table_id=$1
  local name=$2
  local slug=$3
  local field_type=$4

  curl -s -X POST "$URL/workspaces/$WORKSPACE_ID/tables/$table_id/columns" \
    -H "Authorization: $AUTH_HEADER" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"$name\", \"slug\": \"$slug\", \"field_type\": \"$field_type\"}" > /dev/null
}

echo "📋 Creando tabla: Clientes..."
CLIENTES_ID=$(create_table "Clientes" "clientes")
if [ -n "$CLIENTES_ID" ] && [ "$CLIENTES_ID" != "null" ]; then
  create_column "$CLIENTES_ID" "Nombre" "nombre" "text"
  create_column "$CLIENTES_ID" "Telefono" "telefono" "text"
  create_column "$CLIENTES_ID" "Email" "email" "email"
  create_column "$CLIENTES_ID" "Notas" "notas" "long_text"
  create_column "$CLIENTES_ID" "Total Visitas" "total_visitas" "integer"
  echo "✅ Clientes creada (ID: $CLIENTES_ID)"
else
  echo "❌ Error al crear tabla Clientes"
fi

echo -e "\n📋 Creando tabla: Gastos..."
GASTOS_ID=$(create_table "Gastos" "gastos")
if [ -n "$GASTOS_ID" ] && [ "$GASTOS_ID" != "null" ]; then
  create_column "$GASTOS_ID" "Categoria" "categoria" "select"
  create_column "$GASTOS_ID" "Descripcion" "descripcion" "text"
  create_column "$GASTOS_ID" "Monto" "monto" "float"
  create_column "$GASTOS_ID" "Periodicidad" "periodicidad" "select"
  create_column "$GASTOS_ID" "Fecha" "fecha" "date"
  create_column "$GASTOS_ID" "Comprobante" "comprobante" "file"
  echo "✅ Gastos creada (ID: $GASTOS_ID)"
else
  echo "❌ Error al crear tabla Gastos"
fi

echo -e "\n📋 Creando tabla: Empleadas..."
EMPLEADAS_ID=$(create_table "Empleadas" "empleadas")
if [ -n "$EMPLEADAS_ID" ] && [ "$EMPLEADAS_ID" != "null" ]; then
  create_column "$EMPLEADAS_ID" "Nombre" "nombre" "text"
  create_column "$EMPLEADAS_ID" "Rol" "rol" "select"
  create_column "$EMPLEADAS_ID" "Comision Porcentaje" "comision_porcentaje" "number"
  create_column "$EMPLEADAS_ID" "Sueldo Base" "sueldo_base" "float"
  create_column "$EMPLEADAS_ID" "Horario" "horario" "text"
  create_column "$EMPLEADAS_ID" "Activa" "activa" "boolean"
  echo "✅ Empleadas creada (ID: $EMPLEADAS_ID)"
else
  echo "❌ Error al crear tabla Empleadas"
fi

echo -e "\n📋 Creando tabla: Configuracion..."
CONFIG_ID=$(create_table "Configuracion" "configuracion")
if [ -n "$CONFIG_ID" ] && [ "$CONFIG_ID" != "null" ]; then
  create_column "$CONFIG_ID" "Clave" "clave" "text"
  create_column "$CONFIG_ID" "Valor" "valor" "text"
  create_column "$CONFIG_ID" "Descripcion" "descripcion" "text"
  echo "✅ Configuracion creada (ID: $CONFIG_ID)"
else
  echo "❌ Error al crear tabla Configuracion"
fi

echo -e "\n================================"
echo "✅ Proceso completado!"
echo "================================"
