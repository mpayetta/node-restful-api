import mongoose from 'mongoose';
import config from './config/env';
import app from './config/express';

// Set mongoose promise library to the native Promise lib
mongoose.Promise = global.Promise;

// connect to mongo db
mongoose.connect(config.db, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.db}`);
});

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}

const debug = require('debug')('skin-api:index');

// listen on port config.port
app.listen(config.port, () => {
  debug(`server started on port ${config.port} (${config.env})`);
});

export default app;
