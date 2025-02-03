# Use the official Node.js 18 Alpine image as the base for the builder stage
FROM node:22-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies using npm in a clean environment
RUN npm ci

# Copy the entire application source code to the working directory
COPY . .

# Build the application (assumes there's a build script in package.json)
RUN npm run build

# Ensure the public/.well-known directory is included in dist
RUN mkdir -p dist/public/.well-known && cp -r public/.well-known dist/public/

# Use the official Node.js 18 Alpine image as the base for the production stage
FROM node:22-alpine AS production

# Set the Node.js environment to production
ENV NODE_ENV=production

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install production dependencies only, ignoring optional and dev dependencies
RUN npm ci --ignore-scripts --omit=dev

# Copy the built application from the builder stage to the production stage
COPY --from=builder /app/dist ./

# Expose port 5500 to allow external access to the application
EXPOSE 5501

# Specify the command to start the application
CMD ["node", "src/server.js"]