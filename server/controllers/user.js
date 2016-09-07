import User from '../models/user';

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.findById(id)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: 404,
          error: "User not found"
        });
      }
      req.dbUser = user;		// eslint-disable-line no-param-reassign
      return next();
    }, (e) => next(e));
}

/**
 * @api {get} /api/users/:userId Get user information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam (Path) {String} id User mongo ObjectId
 *
 * @apiUse AuthorizationHeader
 *
 * @apiSuccess {String} username Username of the user, usually same as mobile.
 * @apiSuccess {String} mobile  Mobile number of the user.
 * @apiSuccess {String} fullname Full name (first name + last name) of the user.
 * @apiSuccess {String} refresh Refresh token to ask for a new JWT without
 * username/password combination.
 * @apiSuccess {Date} created_at Date when the user was created.
 * @apiSuccess {Date} updated_at Date when the user was last updated.
 *
 * @apiUse UserNotFoundError
 * @apiUse NotAuthorizedError
 * @apiUse InternalServerError
 */
function get(req, res) {
  return res.json(req.dbUser);
}

/**
 * @api {post} /api/users Create new user
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam (Body) {String} mobile Mobile number of the user.
 * @apiParam (Body) {String} password Password for the new user.
 *
 * @apiSuccess {String} _id Mongo ObjectId of the new user.
 * @apiSuccess {String} username Username of the user, usually same as mobile.
 * @apiSuccess {String} mobile  Mobile number of the user.
 * @apiSuccess {Date} created_at Date when the user was created.
 *
 * @apiUse InternalServerError
 *
 */
function create(req, res, next) {
  User.create({
    username: req.body.mobile,
    mobile: req.body.mobile,
    password: req.body.password
  }).then((savedUser) => {
    delete savedUser.password; // eslint-disable-line no-param-reassign
    return res.json(savedUser);
  }, (e) => next(e));
}

/**
 * @api {put} /api/users/:userId Update user
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiUse AuthorizationHeader
 *
 * @apiParam (Path) {String} id User mongo ObjectId
 *
 * @apiParam (Body) {String} mobile Mobile number of the user.
 * @apiParam (Body) {String} password New password for the user  user.
 * @apiParam (Body) {String} fullname Full name of the user.
 * @apiParam (Body) {String} username New username for the user.
 *
 * @apiSuccess {String} username Username of the user, usually same as mobile.
 * @apiSuccess {String} mobile  Mobile number of the user.
 * @apiSuccess {String} fullname Full name (first name + last name) of the user.
 * @apiSuccess {String} refresh Refresh token to ask for a new JWT without
 * username/password combination.
 * @apiSuccess {Date} created_at Date when the user was created.
 * @apiSuccess {Date} updated_at Date when the user was last updated.
 *
 * @apiUse UserNotFoundError
 * @apiUse NotAuthorizedError
 * @apiUse InternalServerError
 *
 */
function update(req, res, next) {
  const user = req.dbUser;
  user.username = req.body.username;
  user.mobile = req.body.mobile;

  user.save()
    .then((savedUser) => res.json(savedUser),
      (e) => next(e));
}

/**
 * @api {get} /api/users Get list of users
 * @apiName ListUser
 * @apiGroup User
 *
 * @apiUse AuthorizationHeader
 *
 * @apiSuccess {Object[]} users List of users
 * @apiSuccess {String} users.username Username of the user, usually same as mobile.
 * @apiSuccess {String} users.mobile  Mobile number of the user.
 * @apiSuccess {String} users.fullname Full name (first name + last name) of the user.
 * @apiSuccess {String} users.refresh Refresh token to ask for a new JWT without
 * username/password combination.
 * @apiSuccess {Date} users.created_at Date when the user was created.
 * @apiSuccess {Date} users.updated_at Date when the user was last updated.
 * @apiUse PaginationResponse
 *
 * @apiUse UserNotFoundError
 * @apiUse NotAuthorizedError
 * @apiUse InternalServerError
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then((users) => res.json(users),
      (e) => next(e));
}

/**
 * @api {delete} /api/users/:userId Remove user
 * @apiName RemoveUser
 * @apiGroup User
 *
 * @apiUse AuthorizationHeader
 *
 * @apiParam (Path) {String} id User mongo ObjectId
 *
 * @apiUse ResultSuccessResponse
 *
 * @apiUse UserNotFoundError
 * @apiUse NotAuthorizedError
 * @apiUse InternalServerError
 *
 */
function remove(req, res, next) {
  const user = req.dbUser;
  user.remove()
    .then((deletedUser) => res.status(204).send(),
      (e) => next(e));
}

export default { load, get, create, update, list, remove };
