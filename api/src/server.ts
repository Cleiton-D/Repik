import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

import './database';
import { certs } from './config/paths';

import app from './app';

const privateKey = fs.readFileSync(path.join(certs, 'server-key.pem'));
const certificate = fs.readFileSync(path.join(certs, 'server-cert.pem'));

const credentitals = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentitals, app);
const httpServer = http.createServer(app);

httpsServer.listen(3333, () =>
  console.log('🚀 HTTPS Server stated on port 3333!'),
);

httpServer.listen(3332, () =>
  console.log('🚀 HTTP Server stated on port 3332!'),
);
