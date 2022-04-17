const Joi = require('joi');
const schemas = {
  userPost: Joi.object().keys({
    first_name: Joi.string().min(3).max(30).required(),
    last_name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(8).max(16).required(),
  }),
  loginPost: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  logoutDelete: Joi.object().keys({
    token: Joi.string().required(),
  }),
  refreshTokenPost: Joi.object().keys({
    token: Joi.string().required(),
  }),
  postPost: Joi.object().keys({
    title: Joi.string().min(10).max(50).required(),
    description: Joi.string().max(1000).required(),
  }),
  postPatch: Joi.object().keys({
    title: Joi.string().min(10).max(50).required(),
    description: Joi.string().max(1000).required(),
  }),
};

module.exports = schemas;
