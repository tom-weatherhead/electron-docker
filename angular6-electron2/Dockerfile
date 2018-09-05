# Create image based off of the official Node Slim image
# FROM node:10
FROM node:slim

# rm -rf dist/ && rm -f package-lock.json && rm -rf node_modules/ && npm i && npm run electron-build

RUN apt-get update

# RUN apt-get install -yq libgtk-3-dev libx11-xcb-dev libxss-dev libgconf2-dev libnss3-dev libasound2-dev libcanberra-gtk3-dev

# Adding audio support: See https://github.com/TheBiggerGuy/docker-pulseaudio-example
# See also https://stackoverflow.com/questions/41083436/how-to-play-sound-in-a-docker-container
RUN apt-get install -yq libgtk-3-dev libx11-xcb-dev libxss-dev libgconf2-dev libnss3-dev libasound2-dev libcanberra-gtk3-dev pulseaudio-utils

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
# ? ADD . .

# Serve the app
# CMD ["/usr/src/app/node_modules/.bin/electron", "/usr/src/app/"]
# CMD ["npm", "run", "electron"]
CMD ["npm", "run", "electron-build"]
