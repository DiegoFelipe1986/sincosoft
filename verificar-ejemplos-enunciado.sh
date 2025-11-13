#!/bin/bash

BASE_URL="http://localhost:3000"

echo "📋 VERIFICACIÓN DE LOS 9 EJEMPLOS DEL ENUNCIADO"
echo "================================================"
echo ""

# Ejemplo 1: Viernes 5:00 PM + 1 hora → Lunes 9:00 AM (14:00 UTC)
echo "Ejemplo 1: Viernes 5:00 PM + 1 hora"
echo "URL: ${BASE_URL}/working-days?hours=1&date=2025-01-17T22:00:00.000Z"
RESULT1=$(curl -s "${BASE_URL}/working-days?hours=1&date=2025-01-17T22:00:00.000Z" | jq -r '.date')
echo "Resultado: $RESULT1"
echo "Esperado: 2025-XX-XXT14:00:00Z (lunes 9:00 AM Colombia)"
if [[ "$RESULT1" == *"T14:00:00Z" ]]; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi
echo ""

# Ejemplo 2: Sábado 2:00 PM + 1 hora → Lunes 9:00 AM (14:00 UTC)
echo "Ejemplo 2: Sábado 2:00 PM + 1 hora"
echo "URL: ${BASE_URL}/working-days?hours=1&date=2025-01-18T19:00:00.000Z"
RESULT2=$(curl -s "${BASE_URL}/working-days?hours=1&date=2025-01-18T19:00:00.000Z" | jq -r '.date')
echo "Resultado: $RESULT2"
echo "Esperado: 2025-XX-XXT14:00:00Z (lunes 9:00 AM Colombia)"
if [[ "$RESULT2" == *"T14:00:00Z" ]]; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi
echo ""

# Ejemplo 3: Martes 3:00 PM + 1 día + 4 horas → Jueves 10:00 AM (15:00 UTC)
echo "Ejemplo 3: Martes 3:00 PM + 1 día + 4 horas"
echo "URL: ${BASE_URL}/working-days?days=1&hours=4&date=2025-01-14T20:00:00.000Z"
RESULT3=$(curl -s "${BASE_URL}/working-days?days=1&hours=4&date=2025-01-14T20:00:00.000Z" | jq -r '.date')
echo "Resultado: $RESULT3"
echo "Esperado: 2025-XX-XXT15:00:00Z (jueves 10:00 AM Colombia)"
if [[ "$RESULT3" == *"T15:00:00Z" ]]; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi
echo ""

# Ejemplo 4: Domingo 6:00 PM + 1 día → Lunes 5:00 PM (22:00 UTC)
echo "Ejemplo 4: Domingo 6:00 PM + 1 día"
echo "URL: ${BASE_URL}/working-days?days=1&date=2025-01-19T23:00:00.000Z"
RESULT4=$(curl -s "${BASE_URL}/working-days?days=1&date=2025-01-19T23:00:00.000Z" | jq -r '.date')
echo "Resultado: $RESULT4"
echo "Esperado: 2025-XX-XXT22:00:00Z (lunes 5:00 PM Colombia)"
if [[ "$RESULT4" == *"T22:00:00Z" ]]; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi
echo ""

# Ejemplo 5: Lunes 8:00 AM + 8 horas → Mismo día 5:00 PM (22:00 UTC)
echo "Ejemplo 5: Lunes 8:00 AM + 8 horas"
echo "URL: ${BASE_URL}/working-days?hours=8&date=2025-01-13T13:00:00.000Z"
RESULT5=$(curl -s "${BASE_URL}/working-days?hours=8&date=2025-01-13T13:00:00.000Z" | jq -r '.date')
echo "Resultado: $RESULT5"
echo "Esperado: 2025-XX-XXT22:00:00Z (mismo día 5:00 PM Colombia)"
if [[ "$RESULT5" == *"T22:00:00Z" ]]; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi
echo ""

# Ejemplo 6: Lunes 8:00 AM + 1 día → Martes 8:00 AM (13:00 UTC)
echo "Ejemplo 6: Lunes 8:00 AM + 1 día"
echo "URL: ${BASE_URL}/working-days?days=1&date=2025-01-13T13:00:00.000Z"
RESULT6=$(curl -s "${BASE_URL}/working-days?days=1&date=2025-01-13T13:00:00.000Z" | jq -r '.date')
echo "Resultado: $RESULT6"
echo "Esperado: 2025-XX-XXT13:00:00Z (martes 8:00 AM Colombia)"
if [[ "$RESULT6" == *"T13:00:00Z" ]]; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi
echo ""

# Ejemplo 7: Lunes 12:30 PM + 1 día → Martes 12:00 PM (17:00 UTC)
echo "Ejemplo 7: Lunes 12:30 PM + 1 día"
echo "URL: ${BASE_URL}/working-days?days=1&date=2025-01-13T17:30:00.000Z"
RESULT7=$(curl -s "${BASE_URL}/working-days?days=1&date=2025-01-13T17:30:00.000Z" | jq -r '.date')
echo "Resultado: $RESULT7"
echo "Esperado: 2025-XX-XXT17:00:00Z (martes 12:00 PM Colombia)"
if [[ "$RESULT7" == *"T17:00:00Z" ]]; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi
echo ""

# Ejemplo 8: Lunes 11:30 AM + 3 horas → Mismo día 3:30 PM (20:30 UTC)
echo "Ejemplo 8: Lunes 11:30 AM + 3 horas"
echo "URL: ${BASE_URL}/working-days?hours=3&date=2025-01-13T16:30:00.000Z"
RESULT8=$(curl -s "${BASE_URL}/working-days?hours=3&date=2025-01-13T16:30:00.000Z" | jq -r '.date')
echo "Resultado: $RESULT8"
echo "Esperado: 2025-XX-XXT20:30:00Z (mismo día 3:30 PM Colombia)"
if [[ "$RESULT8" == *"T20:30:00Z" ]]; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi
echo ""

# Ejemplo 9: 10 de abril + 5 días + 4 horas → 21 de abril 3:00 PM (20:00 UTC)
echo "Ejemplo 9: 10 de abril + 5 días + 4 horas (17 y 18 son festivos)"
echo "URL: ${BASE_URL}/working-days?days=5&hours=4&date=2025-04-10T15:00:00.000Z"
RESULT9=$(curl -s "${BASE_URL}/working-days?days=5&hours=4&date=2025-04-10T15:00:00.000Z" | jq -r '.date')
echo "Resultado: $RESULT9"
echo "Esperado: 2025-04-21T20:00:00.000Z (21 de abril 3:00 PM Colombia)"
if [[ "$RESULT9" == "2025-04-21T20:00:00Z" ]] || [[ "$RESULT9" == "2025-04-21T20:00:00.000Z" ]]; then
  echo "✅ PASS"
else
  echo "❌ FAIL"
fi
echo ""

echo "================================================"
echo "✅ VERIFICACIÓN COMPLETA"
echo "================================================"

