import Joi from 'joi';
import Regex from '../helpers/Regex';

export default {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string(),
      mobile: Joi.string().regex(Regex.Mobile).required(),
      password: Joi.string().required()
    }
  },

  // GET /api/users/:userId
  getUser: {
    params: {
      userId: Joi.string().regex(Regex.ObjectId).required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      username: Joi.string(),
      mobile: Joi.string().regex(Regex.Mobile)
    },
    params: {
      userId: Joi.string().regex(Regex.ObjectId).required()
    }
  },

  // DELETE /api/users/:userId
  deleteUser: {
    params: {
      userId: Joi.string().regex(Regex.ObjectId).required()
    }
  },
};
