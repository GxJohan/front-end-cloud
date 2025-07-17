# Guía Simple: Desplegar Front-end en Google Cloud Run

## Archivos necesarios

### 1. Estructura del proyecto
```
front-end-cloud/
├── index.html
├── styles.css
├── script.js
├── Dockerfile
└── deploy-to-cloud-run.md
```

### 2. Dockerfile (ya creado)
```dockerfile
FROM nginx:alpine

COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## Comandos para desplegar (ejecutar en orden)

### Paso 1: Navegar al directorio del proyecto
```bash
cd /home/gxjohan/projects/dwi/front-end-cloud
```

### Paso 2: Configurar tu proyecto GCP
```bash
gcloud auth login
gcloud config set project TU_ID_PROYECTO
```

### Paso 3: Activar servicios
```bash
gcloud services enable cloudbuild.googleapis.com run.googleapis.com
```

### Paso 4: Construir y subir imagen
```bash
gcloud builds submit --tag gcr.io/TU_ID_PROYECTO/front-end-cloud
```

### Paso 5: Desplegar
```bash
gcloud run deploy front-end-cloud --image gcr.io/TU_ID_PROYECTO/front-end-cloud --platform managed --region us-central1 --allow-unauthenticated --port 80
```

## Resultado
Al final obtendrás una URL como: https://front-end-cloud-xxxxx.run.app

## Configuración adicional

### Si necesitas cambiar la URL del backend:
Edita el archivo `script.js` y cambia la variable `API_BASE_URL` con la URL de tu backend:

```javascript
const API_BASE_URL = 'https://tu-backend-url.run.app';
```

### Verificación
1. Accede a la URL proporcionada después del deploy
2. Verifica que puedas ver la lista de alumnos
3. Prueba agregar un nuevo alumno

## Troubleshooting

### Error de CORS
Si encuentras errores de CORS, asegúrate de que tu backend tenga habilitado CORS para el dominio del frontend.

### Error de conexión
Verifica que la URL del backend en `script.js` sea correcta y que el backend esté funcionando.