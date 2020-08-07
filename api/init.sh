#!/bin/bash

node ./node_modules/typeorm/cli.js migration:run
node dist/server.js
