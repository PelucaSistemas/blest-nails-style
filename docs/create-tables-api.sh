#!/bin/bash

# ===========================================
# CREAR TABLAS EN NOCODB - BLEST NAILS
# ===========================================
# Reemplaza YOUR_API_TOKEN con tu nuevo token
# ===========================================

TOKEN="YOUR_API_TOKEN_HERE"
BASE_ID="pm27oaltuuwfdbo"
URL="https://nocodb.pelucasistemas.com.ar"

echo "🔧 Creando tablas en NocoDB..."
echo "================================"

# Crear tabla Clientes
echo "📋 Creando tabla: Clientes..."
curl --request POST \
  --url "$URL/api/v2/tables" \
  --header "Content-Type: application/json" \
  --header "xc-token: $TOKEN" \
  --data "{
    \"base_id\": \"$BASE_ID\",
    \"table_name\": \"Clientes\",
    \"title\": \"Clientes\",
    \"columns\": [
      {\"column_name\": \"Nombre\", \"title\": \"Nombre\", \"uidt\": \"SingleLineText\", \"pk\": true},
      {\"column_name\": \"Telefono\", \"title\": \"Telefono\", \"uidt\": \"PhoneNumber\"},
      {\"column_name\": \"Email\", \"title\": \"Email\", \"uidt\": \"Email\"},
      {\"column_name\": \"Notas\", \"title\": \"Notas\", \"uidt\": \"LongText\"},
      {\"column_name\": \"TotalVisitas\", \"title\": \"TotalVisitas\", \"uidt\": \"Number\", \"np\": 10, \"ns\": 0}
    ]
  }"

echo -e "\n📋 Creando tabla: Gastos..."
curl --request POST \
  --url "$URL/api/v2/tables" \
  --header "Content-Type: application/json" \
  --header "xc-token: $TOKEN" \
  --data "{
    \"base_id\": \"$BASE_ID\",
    \"table_name\": \"Gastos\",
    \"title\": \"Gastos\",
    \"columns\": [
      {\"column_name\": \"Categoria\", \"title\": \"Categoria\", \"uidt\": \"SingleSelect\", \"dtxp\": \"'Alquiler','Insumos','Servicios','Impuestos','Otros'\"},
      {\"column_name\": \"Descripcion\", \"title\": \"Descripcion\", \"uidt\": \"SingleLineText\"},
      {\"column_name\": \"Monto\", \"title\": \"Monto\", \"uidt\": \"Currency\", \"dtxp\": \"19,2\", \"cdf\": \"0\"},
      {\"column_name\": \"Periodicidad\", \"title\": \"Periodicidad\", \"uidt\": \"SingleSelect\", \"dtxp\": \"'Unico','Mensual','Semanal'\"},
      {\"column_name\": \"Fecha\", \"title\": \"Fecha\", \"uidt\": \"Date\", \"dtxp\": \"DD/MM/YYYY\"},
      {\"column_name\": \"Comprobante\", \"title\": \"Comprobante\", \"uidt\": \"Attachment\"}
    ]
  }"

echo -e "\n📋 Creando tabla: Empleadas..."
curl --request POST \
  --url "$URL/api/v2/tables" \
  --header "Content-Type: application/json" \
  --header "xc-token: $TOKEN" \
  --data "{
    \"base_id\": \"$BASE_ID\",
    \"table_name\": \"Empleadas\",
    \"title\": \"Empleadas\",
    \"columns\": [
      {\"column_name\": \"Nombre\", \"title\": \"Nombre\", \"uidt\": \"SingleLineText\", \"pk\": true},
      {\"column_name\": \"Rol\", \"title\": \"Rol\", \"uidt\": \"SingleSelect\", \"dtxp\": \"'Manicurista','Recepcionista','Socia'\"},
      {\"column_name\": \"ComisionPorcentaje\", \"title\": \"ComisionPorcentaje\", \"uidt\": \"Number\", \"np\": 5, \"ns\": 2, \"cdf\": \"0\"},
      {\"column_name\": \"SueldoBase\", \"title\": \"SueldoBase\", \"uidt\": \"Currency\", \"dtxp\": \"19,2\", \"cdf\": \"0\"},
      {\"column_name\": \"Horario\", \"title\": \"Horario\", \"uidt\": \"SingleLineText\"},
      {\"column_name\": \"Activa\", \"title\": \"Activa\", \"uidt\": \"Checkbox\", \"cdf\": \"true\"}
    ]
  }"

echo -e "\n📋 Creando tabla: Configuracion..."
curl --request POST \
  --url "$URL/api/v2/tables" \
  --header "Content-Type: application/json" \
  --header "xc-token: $TOKEN" \
  --data "{
    \"base_id\": \"$BASE_ID\",
    \"table_name\": \"Configuracion\",
    \"title\": \"Configuracion\",
    \"columns\": [
      {\"column_name\": \"Clave\", \"title\": \"Clave\", \"uidt\": \"SingleLineText\", \"pk\": true},
      {\"column_name\": \"Valor\", \"title\": \"Valor\", \"uidt\": \"SingleLineText\"},
      {\"column_name\": \"Descripcion\", \"title\": \"Descripcion\", \"uidt\": \"SingleLineText\"}
    ]
  }"

echo -e "\n================================"
echo "✅ Proceso completado!"
echo "================================"
