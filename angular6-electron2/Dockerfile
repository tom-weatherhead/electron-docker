# Create image based off of the official Node Slim image
# FROM node:10
FROM node:slim
LABEL maintainer="tom.weatherhead@example.com"

ENV UNAME tomw

RUN apt-get update

# RUN apt-get install -yq libgtk-3-dev libx11-xcb-dev libxss-dev libgconf2-dev libnss3-dev libasound2-dev libcanberra-gtk3-dev alsa-base alsa-utils pulseaudio pulseaudio-utils

# RUN apt-get install -yq libgtk-3-common libx11-xcb1 libxss1 libgconf-2-4 libnss3 libasound2 libcanberra-gtk3-0 alsa-base alsa-utils pulseaudio-utils

# RUN apt-get install -yq libgtk-3-common libx11-xcb1 libxss1 libgconf-2-4 libnss3 libasound2 libcanberra-gtk3-0 alsa-base pulseaudio-utils

# Yes: RUN apt-get install -yq libgtk-3-common libx11-xcb1 libxss1 libgconf-2-4 libnss3 libasound2 libcanberra-gtk3-0 pulseaudio-utils

# No: RUN apt-get install -yq libgtk-3-common libx11-xcb1 libxss1 libgconf-2-4 libnss3 libasound2 libcanberra-gtk3-0

# Yes: RUN apt-get install -yq libx11-xcb1 libxss1 libgconf-2-4 libnss3 libasound2 libcanberra-gtk3-0 pulseaudio-utils

RUN apt-get install -yq libxss1 libgconf-2-4 libnss3 libasound2 libcanberra-gtk3-0 pulseaudio-utils

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

# CMD ["npm", "run", "build", "--prod"]
RUN npm run build --prod

# COPY ./dist/ /usr/src/app/dist/

# RUN rm -rf /usr/src/app/dist
# RUN mkdir -p /usr/src/app/dist

# RUN apt-get update \
#  && DEBIAN_FRONTEND=noninteractive apt-get install --yes pulseaudio-utils

# The user "node" is using UID 1000 and GID 1000, so "tomw" will use 1001.

# Set up the user
# Stolen from https://github.com/TheBiggerGuy/docker-pulseaudio-example
RUN export UNAME=$UNAME UID=1001 GID=1001 && \
    mkdir -p "/home/${UNAME}" && \
    echo "${UNAME}:x:${UID}:${GID}:${UNAME} User,,,:/home/${UNAME}:/bin/bash" >> /etc/passwd && \
    echo "${UNAME}:x:${UID}:" >> /etc/group && \
    mkdir -p /etc/sudoers.d && \
    echo "${UNAME} ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/${UNAME} && \
    chmod 0440 /etc/sudoers.d/${UNAME} && \
    chown ${UID}:${GID} -R /home/${UNAME} && \
    chown ${UID}:${GID} -R /usr/src/app/dist && \
    gpasswd -a ${UNAME} audio

COPY pulse-client.conf /etc/pulse/client.conf

USER $UNAME
ENV HOME /home/tomw

# Serve the app
# CMD ["/usr/src/app/node_modules/.bin/electron", "/usr/src/app/"]
CMD ["npm", "run", "electron"]
# CMD ["npm", "run", "electron-build"]
