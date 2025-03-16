FROM node:latest

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Make sure the start script is executable
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Expose the port the app runs on
EXPOSE 3000

# Start the application using the custom start script
CMD ["/usr/local/bin/start.sh"]
