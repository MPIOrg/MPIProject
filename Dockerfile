# ETAPA 1: Construirea aplicației 
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
# Copiem fișierele de configurare și codul sursă
COPY pom.xml .
COPY src ./src
# Compilăm codul și sărim peste teste la acest pas
RUN mvn clean package -DskipTests

# ETAPA 2: Rularea aplicației  - Folosim o imagine "alpine" optimizată
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Luăm fișierul .jar construit la Etapa 1
COPY --from=build /app/target/*.jar app.jar
# Spunem sistemului că folosim portul 8080
EXPOSE 8080
# Comanda de pornire a aplicației
ENTRYPOINT ["java", "-jar", "app.jar"]