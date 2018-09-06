#!/bin/sh

xhost local:root

# docker run --rm -m 512m --security-opt seccomp=unconfined -v /tmp/.X11-unix:/tmp/.X11-unix -e DISPLAY=$DISPLAY angular6-electron2

USER_UID=$(id -u)

# docker run -t -i --rm -m 512m ...
#   ... angular6-electron2:latest /bin/bash

docker run --rm -m 512m \
  --security-opt seccomp=unconfined \
  --group-add $(getent group audio | cut -d: -f3) \
  -e DISPLAY=$DISPLAY \
  -e PULSE_SERVER=unix:${XDG_RUNTIME_DIR}/pulse/native \
  -v /tmp/.X11-unix:/tmp/.X11-unix \
  -v /run/user/${USER_UID}/pulse:/run/user/1001/pulse \
  -v ${XDG_RUNTIME_DIR}/pulse/native:${XDG_RUNTIME_DIR}/pulse/native \
  -v ~/.config/pulse/cookie:/root/.config/pulse/cookie \
  angular6-electron2:latest
