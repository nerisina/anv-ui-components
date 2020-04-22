# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:alpine as build-stage

RUN apk update \
    && apk add --no-cache \
        ca-certificates curl wget lsof \
        busybox-extras \
        nethogs \
        unzip wget python gcc \
        libc-dev bash make g++

ENV APP_DIR /home/node/anv-ui-components
WORKDIR $APP_DIR

COPY ./ ./

## Copy Artifact certificate for login + install + build
COPY .npmrc .npmrc
RUN npm config set @anyvision:registry https://anyvision.jfrog.io/anyvision/api/npm/npm/
RUN npm --verbose ci
RUN rm .npmrc
RUN PYTHON=/usr/bin/python
RUN npm run build-storybook


# ---- Release ----
FROM nginx:1.15
ENV APP_DIR /home/node/anv-ui-components

RUN apt-get update && apt-get -y install procps vim git curl net-tools

# Nginx config
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx
COPY --from=build-stage $APP_DIR/storybook-static/ /usr/share/nginx/html


# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html

# Start Nginx server
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]
