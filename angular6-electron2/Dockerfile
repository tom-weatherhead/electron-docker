# Create image based off of the official Node Slim image
# FROM node:10
FROM node:slim
LABEL maintainer="tom.weatherhead@example.com"

# **** START **** from https://github.com/TheBiggerGuy/docker-pulseaudio-example

# ENV UNAME pacat

# RUN apt-get update \
#  && DEBIAN_FRONTEND=noninteractive apt-get install --yes pulseaudio-utils

# Set up the user
# RUN export UNAME=$UNAME UID=1000 GID=1000 && \
#     mkdir -p "/home/${UNAME}" && \
#     echo "${UNAME}:x:${UID}:${GID}:${UNAME} User,,,:/home/${UNAME}:/bin/bash" >> /etc/passwd && \
#     echo "${UNAME}:x:${UID}:" >> /etc/group && \
#     mkdir -p /etc/sudoers.d && \
#     echo "${UNAME} ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/${UNAME} && \
#     chmod 0440 /etc/sudoers.d/${UNAME} && \
#     chown ${UID}:${GID} -R /home/${UNAME} && \
#     gpasswd -a ${UNAME} audio

# COPY pulse-client.conf /etc/pulse/client.conf

# USER $UNAME
# ENV HOME /home/pacat

# run
# CMD ["pacat", "-vvvv", "/dev/urandom"]

# **** END ****

# rm -rf dist/ && rm -f package-lock.json && rm -rf node_modules/ && npm i && npm run electron-build

ENV UNAME tomw

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

# RUN apt-get update \
#  && DEBIAN_FRONTEND=noninteractive apt-get install --yes pulseaudio-utils

# Set up the user
RUN export UNAME=$UNAME UID=1000 GID=1000 && \
    mkdir -p "/home/${UNAME}" && \
    echo "${UNAME}:x:${UID}:${GID}:${UNAME} User,,,:/home/${UNAME}:/bin/bash" >> /etc/passwd && \
    echo "${UNAME}:x:${UID}:" >> /etc/group && \
    mkdir -p /etc/sudoers.d && \
    echo "${UNAME} ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/${UNAME} && \
    chmod 0440 /etc/sudoers.d/${UNAME} && \
    chown ${UID}:${GID} -R /home/${UNAME} && \
    gpasswd -a ${UNAME} audio

COPY pulse-client.conf /etc/pulse/client.conf

USER $UNAME
ENV HOME /home/tomw

# Serve the app
# CMD ["/usr/src/app/node_modules/.bin/electron", "/usr/src/app/"]
# CMD ["npm", "run", "electron"]
CMD ["npm", "run", "electron-build"]
