import config from './env';
import jwt from 'express-jwt';

const authenticate = jwt({
  secret: config.jwt.client_secret,
  audience: config.jwt.client_id
});

export default authenticate;
