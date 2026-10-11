# ==============================================================================
# SHOPSPHERE - Root Production Dockerfile for Render Web Service
# ==============================================================================

# Stage 1: Build the Spring Boot application using Java 21 & Maven
FROM maven:3.9.8-eclipse-temurin-21-alpine AS build
WORKDIR /workspace

# Copy POM from backend directory
COPY backend/pom.xml ./pom.xml
RUN mvn dependency:go-offline -B

# Copy backend source code and package executable JAR
COPY backend/src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Lightweight JRE runtime container
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as non-privileged user for security
RUN addgroup -S shopsphere && adduser -S shopsphere -G shopsphere

# Copy built artifact from build stage
COPY --from=build /workspace/target/shopsphere-backend-*.jar app.jar

RUN chown -R shopsphere:shopsphere /app
USER shopsphere

# Cloud services (Render) inject PORT variable
ENV PORT=10000
EXPOSE 10000

# Production JVM options with container memory limits for Render free tier (512MB RAM)
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
