const Joi = require('joi');

const registerValidator = Joi.object({
  username: Joi.string().alphanum().min(3).max(20).required().messages({
    'string.base': 'Username must be a string',
    'string.alphanum': 'Username must only contain alphanumeric characters',
    'string.min': 'Username must be at least {#limit} characters long',
    'string.max': 'Username cannot be more than {#limit} characters long',
    'any.required': 'Username is required',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password length must be at least {#limit} characters long',
    'any.required': 'Password is required',
  }),
});

const loginValidator = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

const editProfileValidator = Joi.object({
  username: Joi.string().alphanum().min(3).max(20).messages({
    'string.base': 'Username must be a string',
    'string.alphanum': 'Username must only contain alphanumeric characters',
    'string.min': 'Username must be at least {#limit} characters long',
    'string.max': 'Username cannot be more than {#limit} characters long',
  }),
  email: Joi.string().email().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email',
  }),
});

const changePasswordValidator = Joi.object({
  oldPassword: Joi.string().required().messages({
    'any.required': 'Old password is required',
  }),
  newPassword: Joi.string().min(8).required().messages({
    'string.min': 'New password must be at least {#limit} characters long',
    'any.required': 'New password is required',
  }),
});

module.exports = {
  registerValidator,
  loginValidator,
  editProfileValidator,
  changePasswordValidator,
};
