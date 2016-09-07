import express from 'express';
import validate from 'express-validation';
import jwt from 'jsonwebtoken';
import uuid from 'node-uuid';
import config from '../../config/env';
import validation from '../validation/auth';
import authCtrl from '../controllers/auth';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/token')
  /** POST /api/auth/token Get JWT authentication token */
  .post(validate(validation.getToken),
    authCtrl.authenticate,
    generateToken,
    respond);

router.route('/refresh')
  /** POST /api/auth/token Get JWT authentication token */
  .post(validate(validation.refreshToken),
    authCtrl.refresh,
    generateToken,
    respond);

function generateToken(req, res, next) {
  if (!req.user) return next();

  const jwtPayload = {
    id: req.user._id
  };
  const jwtData = {
    expiresIn: config.jwt.duration,
    audience: config.jwt.client_id
  };
  const secret = config.jwt.client_secret;
  req.token = jwt.sign(jwtPayload, secret, jwtData); // eslint-disable-line no-param-reassign

  next();
}

function respond(req, res) {
  if (!req.user) {
    res.status(401).json({
      error: 'Unauthorized'
    });
  } else {
    req.user.refresh = uuid.v4(); // eslint-disable-line no-param-reassign
    req.user.save(() => {
      delete req.user.password; // eslint-disable-line no-param-reassign
      res.status(200).json({
        user: req.user,
        token: req.token
      });
    });
  }
}

export default router;
