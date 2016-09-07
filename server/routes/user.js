import express from 'express';
import validate from 'express-validation';
import paramValidation from '../validation/user';
import userCtrl from '../controllers/user';
import auth from '../../config/jwt';

const router = express.Router();	// eslint-disable-line new-cap

router.route('/')
  /** GET /api/users - Get list of users */
  .get(auth, userCtrl.list)

  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(auth, validate(paramValidation.getUser), userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(auth, validate(paramValidation.updateUser), userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(auth, validate(paramValidation.deleteUser), userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

export default router;
