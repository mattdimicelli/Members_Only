const debug = require('debug')('server');

function onError(error, port) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);  // tells the OS to terminate this module immediately.  1 means "uncaught
        // fatal exception"
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }


function onListening(server) {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }


function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
}

module.exports.normalizePort = normalizePort;
module.exports.onListening = onListening;
module.exports.onError = onError;