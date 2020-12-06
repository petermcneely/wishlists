#!/usr/bin/env node
'use strict';

/**
 * Module dependencies.
 */
import app from './app.js';
import { createServer } from 'http';
import databaseIndexes from './DAL/dbIndexes.js';
import { default as debug } from 'debug';

const serverDebug = debug('wishlists:server');

/**
 * Normalize a port into a number, string, or false.
 * @param {string} val The port to normalize
 * @return {int} the normalized port number.
 */
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

(async () => {
  await databaseIndexes();
  const port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);

  const server = createServer(app);
  server.listen(port);
  server.on(
      'error',
      (error) => {
        if (error.syscall !== 'listen') {
          throw error;
        }

        const bind = typeof port === 'string' ?
          'Pipe ' + port :
          'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
          case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
          case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
          default:
            throw error;
        }
      });
  server.on(
      'listening',
      () => {
        const addr = server.address();
        const bind = typeof addr === 'string' ?
          'pipe ' + addr :
          'port ' + addr.port;
        if (process.env.NODE_ENV == 'development') {
          serverDebug(`Listening on ${bind}`);
        }
      });
})();
