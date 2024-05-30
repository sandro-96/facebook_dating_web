# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install the application dependencies inside the container
RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Bundle the app source inside the Docker image
COPY . .

# Expose port 3000 for the app to be accessible outside the Docker container
EXPOSE 3000

# Define the command to run the app
CMD [ "npm", "start" ]