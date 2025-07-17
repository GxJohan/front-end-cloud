# Configuración CORS para el Backend

Si quieres probar desde localhost, necesitas agregar esta configuración a tu backend Spring Boot:

## Archivo: CorsConfig.java
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

## O agregar anotación en el Controller:
```java
@RestController
@RequestMapping("/alumnos")
@CrossOrigin(origins = "*") // Agregar esta línea
public class AlumnoController {
    // ... resto del código
}
```

**IMPORTANTE:** Como dijiste que no modifique el backend, la mejor opción es desplegar directamente en Cloud Run.