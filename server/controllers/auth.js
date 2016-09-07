import uuid from 'node-uuid';
import User from '../models/user';

/**
 * @api {post} /api/auth/token Get a JWT access token
 * @apiName GetToken
 * @apiGroup Authentication
 *
 * @apiParam (Body) {String} mobile The user mobile number
 * @apiParam (Body) {String} password The user password
 *
 * @apiSuccess {String} token The JWT for the logged in user (valid for 1 day)
 * @apiSuccess {Object} user Information of the logged in user
 * @apiSuccess {String} user.username Username of the user, usually same as mobile.
 * @apiSuccess {String} user.mobile  Mobile number of the user.
 * @apiSuccess {String} user.fullname Full name (first name + last name) of the user.
 * @apiSuccess {String} user.refresh Refresh token to ask for a new JWT without
 * username/password combination.
 * @apiSuccess {Date} user.created_at Date when the user was created.
 * @apiSuccess {Date} user.updated_at Date when the user was last updated.
 *
 * @apiUse InternalServerError
 */
function authenticate(req, res, next) {
  User.findOne({
    mobile: req.body.mobile
  })
  .exec()
  .then((user) => {
    if (!user) return next();
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (err) return next(err);

      if (isMatch) {
        user.refresh = uuid.v4(); // eslint-disable-line no-param-reassign
        user.save()
          .then((savedUser) => {
            req.user = savedUser; // eslint-disable-line no-param-reassign
            next();
          }, (e) => next(e));
      } else {
        return next();
      }
    });
  }, (e) => next(e));
}

/**
 * @api {post} /api/auth/refresh Refresh the JWT access token
 * @apiName RefreshToken
 * @apiGroup Authentication
 *
 * @apiParam (Body) {String} mobile The user mobile number
 * @apiParam (Body) {String} refresh The user refresh token
 *
 * @apiSuccess {String} token The new JWT for the logged in user (valid for 1 day)
 * @apiSuccess {Object} user Information of the logged in user
 * @apiSuccess {String} user.username Username of the user, usually same as mobile.
 * @apiSuccess {String} user.mobile  Mobile number of the user.
 * @apiSuccess {String} user.fullname Full name (first name + last name) of the user.
 * @apiSuccess {String} user.refresh Refresh token to ask for a new JWT without
 * username/password combination.
 * @apiSuccess {Date} user.created_at Date when the user was created.
 * @apiSuccess {Date} user.updated_at Date when the user was last updated.
 *
 * @apiUse InternalServerError
 */
function refresh(req, res, next) {
  User.findOne({
    mobile: req.body.mobile
  }).exec()
    .then((user) => {
      if (user && user.refresh === req.body.refresh) {
        req.user = user; // eslint-disable-line no-param-reassign
      }
      return next();
    }, (e) => next(e));
}

export default { authenticate, refresh };
