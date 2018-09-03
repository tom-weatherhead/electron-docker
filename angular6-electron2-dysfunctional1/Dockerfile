# Create image based off of the official Node 10 image
FROM node:8

RUN apt-get update

RUN apt-get install -yq libgtk-3-dev libx11-xcb-dev libxss-dev libgconf2-dev libnss3-dev libasound2-dev libcanberra-gtk3-dev

# Create a directory where our app will be placed
RUN mkdir -p /usr/src/app

# Change directory so that our commands run inside this new dir
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package.json /usr/src/app

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . .

EXPOSE 4200

# Serve the app
CMD ["/usr/src/app/node_modules/.bin/electron", "/usr/src/app"]
# CMD ["npm", "start"]
