#!/bin/bash
set -e

docker build -f docker/develop.dockerfile -t mqtt-monitor:latest .

docker run -it --rm \
  -p 1883:1883 \
  -p 4040:4040 \
  -p 8080:8080 \
  mqtt-monitor:latest
