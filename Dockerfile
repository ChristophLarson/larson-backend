# Step 1: Use an official Node.js image as the base image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files into the container
COPY . .

# Step 6: Build the TypeScript code
RUN npm run build

# Step 7: Expose the port the app will run on
EXPOSE 3000

# Step 8: Define the command to run the app
CMD ["npm", "run", "start:prod"]
