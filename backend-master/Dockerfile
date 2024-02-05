# Pull node v21.1 Official DockerHub Image
FROM node:21.1

# Create the working directory for ecom_backend inside the container
WORKDIR /ecom_backend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your app's source code to the working directory
COPY . .

# Expose a port for the Express app to listen on (usually 3000)
EXPOSE 3000

# Define the command to start your Express app
CMD ["node", "server.js"]
