# Solución Simple: Agregar CORS al Backend

## Pasos para solucionar el problema de CORS:

### 1. Crear archivo CorsConfig.java
En tu backend Spring Boot, crear el archivo:
`src/main/java/com/example/demo/config/CorsConfig.java`

```java
package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}
```

### 2. Redesplegar el backend
```bash
cd /home/gxjohan/projects/dwi/prueba-cloud
gcloud builds submit --tag gcr.io/TU_ID_PROYECTO/prueba-cloud
gcloud run deploy prueba-cloud --image gcr.io/TU_ID_PROYECTO/prueba-cloud --platform managed --region us-central1 --allow-unauthenticated
```

### 3. Redesplegar el frontend (sin proxy)
```bash
cd /home/gxjohan/projects/dwi/front-end-cloud
gcloud builds submit --tag gcr.io/TU_ID_PROYECTO/front-end-cloud
gcloud run deploy front-end-cloud --image gcr.io/TU_ID_PROYECTO/front-end-cloud --platform managed --region us-central1 --allow-unauthenticated --port 80
```

## ¿Por qué esta solución es mejor para pruebas?

1. **Más simple**: Solo agregar un archivo al backend
2. **Menos configuración**: No necesitas proxy nginx
3. **Funciona inmediatamente**: Sin problemas de configuración
4. **Estándar**: Es la forma normal de manejar CORS en Spring Boot

## Resultado esperado
- ✅ Frontend funciona sin errores de CORS
- ✅ Puedes agregar y ver alumnos
- ✅ Código más limpio y mantenible