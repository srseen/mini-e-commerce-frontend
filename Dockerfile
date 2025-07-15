# base image
FROM node:20-alpine

# set working directory
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies inside container
RUN npm install

# copy source code
COPY . .

# Start the application in development mode
CMD ["npm", "run", "dev"]
