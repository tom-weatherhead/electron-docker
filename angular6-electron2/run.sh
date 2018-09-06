#!/bin/sh
xhost local:root
# docker run --rm -m 512m --security-opt seccomp=unconfined -v /tmp/.X11-unix:/tmp/.X11-unix -e DISPLAY=$DISPLAY angular6-electron2

USER_UID=$(id -u)

docker run -t -i --rm -m 512m \
  --security-opt seccomp=unconfined \
  -v /tmp/.X11-unix:/tmp/.X11-unix \
  -v /run/user/${USER_UID}/pulse:/run/user/1000/pulse \
  -e DISPLAY=$DISPLAY \
  angular6-electron2:latest
