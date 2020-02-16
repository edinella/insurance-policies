FROM launcher.gcr.io/google/nodejs

COPY . /app/

RUN npm install --unsafe-perm || \
  ((if [ -f npm-debug.log ]; then \
      cat npm-debug.log; \
    fi) && false)

ENV SERVICE_VERSION v1

CMD npm start
