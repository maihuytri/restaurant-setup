
# Use the official Maven image to build the project
FROM maven AS build

# Set the working directory in the container
WORKDIR /app

# Copy the pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the source code to the container
COPY src ./src

# Package the application
RUN mvn package -DskipTests

# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the packaged application from the build stage
COPY --from=build /app/target/RestaurantSetup-0.0.1-SNAPSHOT.jar /app/RestaurantSetup-0.0.1-SNAPSHOT.jar

# Expose the port the application runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "RestaurantSetup-0.0.1-SNAPSHOT.jar"]