import path from 'path';

export const certs =
  process.env.NODE_ENV === 'development'
    ? path.resolve(__dirname, '..', '..', '..', 'ssl')
    : path.resolve('/', 'certs');

export const externalScripts =
  process.env.NODE_ENV === 'development'
    ? path.resolve(__dirname, '..', '..', 'external')
    : path.resolve(__dirname, '..', '..', 'external');
