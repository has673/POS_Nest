# Step 1: Use the official Node.js image as the base image
FROM node:20.9

# Step 2: Set the working directory inside the container
WORKDIR /app

COPY package*.json ./


RUN npm install 

COPY . .

RUN npm run build
# Step 7: Expose the port your app will run on
EXPOSE 4000

# Step 8: Define the command to run the app
CMD ["npm", "run", "start:prod"]