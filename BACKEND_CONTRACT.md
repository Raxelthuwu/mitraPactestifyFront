# Contrato Backend para el Frontend

Este documento describe las peticiones que hace el frontend y las respuestas que espera del backend.

## Configuracion

El frontend usa una variable de entorno para apuntar al backend:

```env
VITE_API_BASE_URL=http://IP_O_DOMINIO_DEL_BACKEND
```

Ejemplo:

```env
VITE_API_BASE_URL=http://123.45.67.89:8000
```

El frontend puede trabajar con HTTP. Si el frontend se sirve por `http://`, el backend tambien puede estar en `http://`.

El backend debe habilitar CORS para la URL donde se publique el frontend.

## Autenticacion JWT

Despues del login, el frontend guarda el token y lo manda automaticamente en todas las peticiones protegidas:

```http
Authorization: Bearer <token>
```

Si cualquier endpoint protegido responde `401`, el frontend cierra la sesion local.

## Endpoints

### 1. Login

```http
POST /login/iniciar/
Content-Type: application/json
```

Body enviado por el frontend:

```json
{
  "correo": "abogado@demo.com",
  "cedula": 123456789,
  "password": "demo123"
}
```

Respuesta esperada si inicia sesion:

```json
{
  "token": "JWT_AQUI",
  "status": 200,
  "inicio": true
}
```

Tambien acepta `inicio` como string:

```json
{
  "token": "JWT_AQUI",
  "status": 200,
  "inicio": "true"
}
```

Respuesta para cuenta ocupada o login rechazado:

```json
{
  "status": 400,
  "inicio": false
}
```

Caso importante:

Si `inicio` es `false`, el frontend NO guarda el token y muestra error de sesion activa.

### 2. Obtener Usuario Actual

Primero intenta:

```http
GET /user/get
Authorization: Bearer <token>
```

Si `/user/get` responde `404`, intenta como fallback:

```http
GET /asignations/user
Authorization: Bearer <token>
```

Respuesta para testigo:

```json
{
  "status": 200,
  "user": {
    "name": "Juan Perez",
    "role": "TESTIGO",
    "Puesto de votacion": "ISER",
    "Mesas": 22
  }
}
```

Respuesta para abogado o coordinador:

```json
{
  "status": 200,
  "user": {
    "name": "Equipo Juridico",
    "role": "Abogado"
  }
}
```

Roles validos:

```txt
TESTIGO
Abogado
Coordinador
```

El frontend usa el rol para redirigir:

- `TESTIGO` -> modulo testigo
- `Abogado` o `Coordinador` -> modulo abogado

### 3. Logout

```http
POST /logout/
Authorization: Bearer <token>
```

Respuesta esperada:

```json
{
  "status": 200
}
```

Aunque falle, el frontend limpia la sesion local.

### 4. Crear Reporte del Testigo

```http
POST /report/testigo/
Authorization: Bearer <token>
Content-Type: application/json
```

Body enviado:

```json
{
  "Reporte": "Texto del reporte",
  "Mesa": 1,
  "Problem_Grade": 3
}
```

Mapa de gravedad:

```txt
bajo  -> 1
medio -> 2
alto  -> 3
```

Respuesta esperada:

```json
{
  "status": 200
}
```

Si falla:

```json
{
  "status": 500
}
```

### 5. Listar Puestos de Votacion

```http
GET /places/
Authorization: Bearer <token>
```

Respuesta esperada:

```json
{
  "status": 200,
  "places": [
    {
      "name": "ISER",
      "tables": 22
    }
  ]
}
```

El frontend tambien acepta estos nombres alternativos:

```json
{
  "status": 200,
  "places": [
    {
      "Name_place": "ISER",
      "Cuantity_tables": 22
    }
  ]
}
```

El frontend usa `tables` o `Cuantity_tables` para construir las mesas:

```txt
Mesa 1, Mesa 2, Mesa 3...
```

### 6. Consultar Reportes por Puesto y Mesa

```http
GET /places/report?puesto=ISER&mesa=1&Puesto=ISER&Mesa=1
Authorization: Bearer <token>
```

Query params:

```txt
puesto: string
mesa: number
Puesto: string
Mesa: number
```

El frontend envia los parametros duplicados en minuscula y mayuscula para compatibilidad. El backend puede usar cualquiera de las dos formas, pero se recomienda soportar `puesto` y `mesa`.

Respuesta esperada:

```json
{
  "status": 200,
  "reports": [
    {
      "id": "rep-1",
      "text": "Falta material electoral en la mesa.",
      "severity": "alto",
      "testigo": "Ana Torres",
      "hora": "08:42"
    }
  ]
}
```

El frontend tambien acepta esta forma:

```json
{
  "status": 200,
  "reports": [
    {
      "Repord": "Falta material electoral en la mesa.",
      "Problem_Grade": 3,
      "testigo": "Ana Torres",
      "hora": "08:42"
    }
  ]
}
```

Gravedad aceptada:

```txt
"alto"  o 3
"medio" o 2
"bajo"  o 1
```

Si no hay reportes, responder:

```json
{
  "status": 200,
  "reports": []
}
```

### 7. Exportar Reportes

```http
GET /reports/export?puesto=ISER&mesa=1&Puesto=ISER&Mesa=1
Authorization: Bearer <token>
```

El frontend envia los parametros duplicados en minuscula y mayuscula para compatibilidad:

```txt
puesto=ISER
mesa=1
Puesto=ISER
Mesa=1
```

El backend puede usar cualquiera de las dos formas, pero se recomienda soportar:

```txt
puesto
mesa
```

Respuesta esperada:

Archivo binario `.xlsx`.

Headers recomendados:

```http
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="reportes-ISER-mesa-1.xlsx"
```

Si no se manda `Content-Disposition`, el frontend usa un nombre por defecto:

```txt
reportes-<puesto>-mesa-<mesa>.xlsx
```

## Errores

Para errores generales, el frontend puede recibir:

```json
{
  "status": 500
}
```

Para token invalido o vencido, responder:

```http
401 Unauthorized
```

Con `401`, el frontend cierra sesion local automaticamente.

## Resumen Rapido

| Accion | Metodo | Ruta | Auth |
|---|---:|---|---|
| Login | POST | `/login/iniciar/` | No |
| Usuario actual | GET | `/user/get` | Si |
| Usuario fallback | GET | `/asignations/user` | Si |
| Logout | POST | `/logout/` | Si |
| Crear reporte | POST | `/report/testigo/` | Si |
| Listar puestos | GET | `/places/` | Si |
| Reportes por puesto y mesa | GET | `/places/report?puesto=ISER&mesa=1` | Si |
| Exportar Excel | GET | `/reports/export?puesto=ISER&mesa=1` | Si |
