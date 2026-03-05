# Stage 1: Build the application
FROM gradle:jdk17 AS builder
WORKDIR /app
COPY . .
# Executes during 'docker build' to compile the code and create the JAR
RUN gradle clean build -x test

# Stage 2: Create the lightweight production image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copies ONLY the compiled JAR from the builder stage, discarding source code and build tools
COPY --from=builder /app/build/libs/library-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
# Executes during 'docker run' to start the actual application
ENTRYPOINT ["java", "-jar", "app.jar"]
