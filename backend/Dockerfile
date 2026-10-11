# ==============================================================================
# SHOPSPHERE BACKEND - Multi-Stage Production Docker Build for Render
# ==============================================================================

# Stage 1: Build the Spring Boot application using Java 21 & Maven
FROM maven:3.9.8-eclipse-temurin-21-alpine AS build
WORKDIR /workspace

# Copy POM and download dependencies to optimize caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and package JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Lightweight JRE runtime container
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as non-privileged user for container security
RUN addgroup -S shopsphere && adduser -S shopsphere -G shopsphere

# Copy built artifact from build stage
COPY --from=build /workspace/target/shopsphere-backend-*.jar app.jar

RUN chown -R shopsphere:shopsphere /app
USER shopsphere

# Cloud services (Render) set the PORT variable
ENV PORT=8080
EXPOSE 8080

# Production JVM options with container memory limits
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
