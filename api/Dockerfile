FROM node as builder

WORKDIR /usr/src/app
COPY . .
RUN yarn
RUN yarn tsc

FROM node
RUN wget https://dl.google.com/go/go1.13.3.linux-amd64.tar.gz
RUN tar -xzf go1.13.3.linux-amd64.tar.gz
RUN mv go /usr/local
ENV GOROOT=/usr/local/go
ENV PATH=$GOROOT/bin:$PATH

RUN go get github.com/docker/distribution/registry/auth
RUN go get github.com/docker/libtrust

ENV NODE_ENV=production

WORKDIR /usr/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/external ./external
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/ormconfig.js ./ormconfig.js
COPY init.sh ./init.sh

RUN chmod +x init.sh

EXPOSE 3333
EXPOSE 3332

CMD ["./init.sh"]
