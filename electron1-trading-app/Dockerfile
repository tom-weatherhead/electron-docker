# Create image based off of the official Node Slim image
FROM node:slim

RUN apt-get update

# This works! :
# (TODO: Remove any unneeded packages from this list)
# RUN apt-get install -yq libgtkextra-dev libgconf2-dev libnss3 libasound2 libxtst-dev libxss1 libx11-xcb-dev libcanberra-gtk-module

# This works! :
# RUN apt-get install -yq libgtk2.0-dev libx11-xcb-dev libxss-dev libgconf-2-4 libnss3 libasound2 libxtst-dev libcanberra-gtk-module

# This works! :
# RUN apt-get install -yq libgtk2.0-bin libx11-xcb-dev libxss-dev libgconf-2-4 libnss3 libasound2 libxtst-dev libcanberra-gtk-module

# This works! :
# RUN apt-get install -yq libgtk2.0-dev libx11-xcb-dev libxss-dev libgconf2-dev libnss3-dev libasound2-dev libxtst-dev libcanberra-gtk-module

RUN apt-get install -yq libgtk2.0-dev libx11-xcb-dev libxss-dev libgconf2-dev libnss3-dev libasound2-dev libxtst-dev libcanberra-gtk-dev

# This fails: RUN apt-get install -yq ttf-mscorefonts-installer

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
CMD ["/usr/src/app/node_modules/.bin/electron", "/usr/src/app/"]
