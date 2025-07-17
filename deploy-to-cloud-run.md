# Guía Simple: Desplegar Front-end en Google Cloud Run

## Archivos necesarios

### 1. Estructura del proyecto
```
front-end-cloud/
├── index.html
├── styles.css
├── proxy-script.js
├── nginx.conf
├── Dockerfile
└── deploy-to-cloud-run.md
```

### 2. Dockerfile (ya creado)
```dockerfile
FROM nginx:alpine

COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 3. nginx.conf (configuración de proxy)
```nginx
server {
    listen 80;
    server_name localhost;
    
    # Serve static files
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API calls to backend
    location /proxy/ {
        proxy_pass https://prueba-cloud-414030780526.southamerica-east1.run.app/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Add CORS headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type, Authorization";
        
        # Handle preflight requests
        if ($request_method = OPTIONS) {
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Content-Type, Authorization";
            return 204;
        }
    }
}
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
Edita el archivo `nginx.conf` y cambia la URL en la sección `proxy_pass`:

```nginx
location /proxy/ {
    proxy_pass https://tu-backend-url.run.app/;
    # ... resto de configuración
}
```

### Verificación
1. Accede a la URL proporcionada después del deploy
2. Verifica que puedas ver la lista de alumnos
3. Prueba agregar un nuevo alumno

## Troubleshooting

### Error de CORS
**Solucionado:** Este proyecto usa un proxy nginx que maneja automáticamente los headers CORS.

### Error de conexión
1. Verifica que la URL del backend en `nginx.conf` sea correcta
2. Verifica que el backend esté funcionando
3. Revisa los logs del contenedor: `gcloud run services describe front-end-cloud --region=us-central1`

### Error de proxy
Si el proxy no funciona, verifica que:
- La URL en `nginx.conf` sea correcta
- El backend esté desplegado y funcionando
- Las rutas en `proxy-script.js` usen `/proxy/` como prefijo