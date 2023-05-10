# write dockerfile

# Base image
FROM node:14-alpine

# Create app directory
WORKDIR /app

# Copy files
COPY package*.json ./

RUN npm install

COPY . .

# Expose port
EXPOSE 3000

# Run command
# CMD ["npm", "run", "build:dev"]
CMD ["npx", "nodemon"]