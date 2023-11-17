const Joi = require('joi');

const createFeedbackValidator = Joi.object({
  feedbackText: Joi.string().min(5).required().messages({
    'string.base': 'Feedback must be a string',
    'string.min': 'Feedback must be at least {#limit} characters long',
    'any.required': 'Feedback is required',
  }),
  details: Joi.string().required().messages({
    'string.base': 'Feedback details must be a string',
    'any.required': 'Feedback details is required',
  }),
});

const feedbackStatusValidator = Joi.object({
  status: Joi.string()
    .valid('pending', 'accepted', 'rejected')
    .required()
    .messages({
      'string.base': 'Status must be a string',
      'any.only': 'Invalid status. Allowed values: pending, accepted, rejected',
      'any.required': 'Status is required',
    }),
});

module.exports = { createFeedbackValidator, feedbackStatusValidator };
