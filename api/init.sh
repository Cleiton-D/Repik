#!/bin/bash

node ./node_modules/typeorm/cli.js migration:run
node dist/shared/infra/http/server.js
