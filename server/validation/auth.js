import Joi from 'joi';
import Regex from '../helpers/Regex';

export default {
  // POST /api/users
  getToken: {
    body: {
      mobile: Joi.string().regex(Regex.Mobile).required(),
      password: Joi.string().required()
    }
  },

  refreshToken: {
    body: {
      mobile: Joi.string().regex(Regex.Mobile).required(),
      refresh: Joi.string().required()
    }

  }
};
