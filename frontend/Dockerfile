FROM node as builder

WORKDIR /usr/src/app
COPY . .

RUN yarn
RUN yarn test --watchAll=false --passWithNoTests

RUN yarn build

FROM nginx:alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
