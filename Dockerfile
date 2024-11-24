# Step 1: Use an official Node.js image as the base image
FROM node:18

# Install build dependencies for sqlite3
# RUN apk add --no-cache --virtual .build-deps \
#     build-base python3

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./
RUN npm install --production

# Install dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Clear the database (if exists)
RUN rm -f /usr/src/app/data/database.db

# Build the TypeScript code
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "run", "start:prod"]
