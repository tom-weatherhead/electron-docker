#!/bin/sh
xhost local:root
docker run --rm -m 512m --security-opt seccomp=unconfined -v /tmp/.X11-unix:/tmp/.X11-unix -e DISPLAY=$DISPLAY electron2-trading-app

# This works, but with a libudev error message: docker run --rm -m 512m -v /tmp/.X11-unix:/tmp/.X11-unix -e DISPLAY=$DISPLAY electron2-trading-app

# No: docker run --rm -m 512m --security-opt seccomp=unconfined -e DISPLAY=$DISPLAY electron2-trading-app
