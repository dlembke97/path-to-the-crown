# Step 1: Build the React app
FROM node:16 AS build

WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Step 2: Serve the app with a simple Node server
FROM node:16

WORKDIR /app
COPY server.js ./
COPY package*.json ./
RUN npm install

# Copy built React app
COPY --from=build /app/build ./build

# Expose the port the app runs on
EXPOSE 4000

# Run the application
CMD ["node", "server.js"]