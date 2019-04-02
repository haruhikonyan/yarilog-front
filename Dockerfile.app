FROM node:10.15.1-alpine
ENV LANG C.UTF-8

WORKDIR /yarilog-front
COPY . /yarilog-front
RUN echo "PWD: $PWD" && \
  echo "ls: $(ls -la)" && \
  echo "PATH: $(echo $PATH)" && \
  echo "node version: $(node -v)" && \
  echo "npm version: $(npm -v)"
  # yarn install --force node-sass

ENV PATH="/yarilog-front/node_modules/.bin:${PATH}"
CMD /bin/sh -c 'set -x echo $PATH && ls -1a && ls ./node_modules -la && ls ./node_modules/.bin/ -la'
