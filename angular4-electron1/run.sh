#!/bin/sh
xhost local:root
docker run --rm -m 512m --security-opt seccomp=unconfined -v /tmp/.X11-unix:/tmp/.X11-unix -e DISPLAY=$DISPLAY angular-electron
