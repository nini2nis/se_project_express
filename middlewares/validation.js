const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error("string.email");
};

module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.base": 'The "name" field must be a string',
      "string.min": 'The minimun length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      // "string.empty": 'The "name" field must be filled in',
      "any.required": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid url',
    }),
    weather: Joi.string().required().valid("hot", "warm", "cold").messages({
      "any.required": 'The "weather" field must be filled in',
      "any.only": 'The "weather" field must be one of: hot, warm, cold',
    }),
  }),
});

module.exports.validateSignupBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email address',
    }),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .messages({
        "string.empty": 'The "password" field must be filled in',
        "string.pattern.base":
          "The password must be between 3-30 characters and contain only letters and numbers",
      }),
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimun length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'The "avatar" field must be a valid url',
    }),
  }),
});

module.exports.validateSigninBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email address',
    }),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .messages({
        "string.empty": 'The "password" field must be filled in',
        "string.pattern.base":
          "The password must be between 3-30 characters and contain only letters and numbers",
      }),
  }),
});

module.exports.validateItemId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24).messages({
      "string.base": "ID must be a string",
      "string.hex": "ID must be a hexadecimal value",
      "string.length": "ID must be exactly 24 characters",
      "any.required": "ID is required",
    }),
  }),
});

module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24).messages({
      "string.base": "ID must be a string",
      "string.hex": "ID must be a hexadecimal value",
      "string.length": "ID must be exactly 24 characters",
      "any.required": "ID is required",
    }),
  }),
});

module.exports.validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimun length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
    }),
    avatar: Joi.string().custom(validateURL).messages({
      "string.uri": 'The "avatar" field must be a valid url',
    }),
  }),
});
