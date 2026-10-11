# ==============================================================================
# SHOPSPHERE - Backend Dockerfile for Render Web Service
# ==============================================================================

FROM maven:3.9.8-eclipse-temurin-21-alpine AS build
WORKDIR /workspace

# Copy POM from backend directory
COPY backend/pom.xml ./pom.xml
RUN mvn dependency:go-offline -B

# Copy backend source code and package executable JAR
COPY backend/src ./src
RUN mvn clean package -DskipTests -B

# Runtime container
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S shopsphere && adduser -S shopsphere -G shopsphere

COPY --from=build /workspace/target/shopsphere-backend-*.jar app.jar

RUN chown -R shopsphere:shopsphere /app
USER shopsphere

ENV PORT=10000
EXPOSE 10000

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
