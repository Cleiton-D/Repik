FROM node as builder

WORKDIR /usr/src/app
COPY . .
RUN yarn
RUN yarn tsc

FROM node
ENV NODE_ENV=production

WORKDIR /usr/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/ormconfig.js ./ormconfig.js

COPY init.sh ./init.sh
RUN chmod +x init.sh

EXPOSE 3333

CMD ["./init.sh"]
