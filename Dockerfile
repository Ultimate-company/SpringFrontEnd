# Use a Maven image as a parent image
FROM maven:3.9.9-eclipse-temurin-21 AS build

# Set the working directory
WORKDIR /usr/src/app

# Clone and build Spring Models
RUN git clone https://nahushr18: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@github.com/nahushr18/SpringModels.git
WORKDIR /usr/src/app/SpringModels
RUN git checkout development
RUN mvn clean install

# Go back to the root of the project directory
WORKDIR /usr/src/app

# Clone Spring Frontend
RUN git clone https://nahushr18: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@github.com/nahushr18/SpringFrontEnd.git

# Create libs directory and copy the Spring Models jar to it
RUN mkdir -p SpringFrontEnd/libs && cp SpringModels/target/SpringModels-1.0-SNAPSHOT.jar SpringFrontEnd/libs/SpringModels-1.0-SNAPSHOT.jar

# Build the Spring frontend project
WORKDIR /usr/src/app/SpringFrontEnd
RUN git checkout development
RUN mvn clean package -DskipTests
RUN ls -l /usr/src/app/SpringFrontEnd/target

# Use a Java runtime image as a parent image
FROM openjdk:21-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the built project files from the Maven build stage
COPY --from=build /usr/src/app/SpringFrontEnd/target/SpringFrontEnd-0.0.1-SNAPSHOT.jar /app/SpringFrontEnd-0.0.1-SNAPSHOT.jar

# Define the command to run the application
EXPOSE 5566
CMD ["java", "-Dspring.profiles.active=development", "-jar", "SpringFrontEnd-0.0.1-SNAPSHOT.jar"]