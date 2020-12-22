const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');

const schema = Joi.object().keys({
	name: Joi.string(),
	email: Joi.string().trim().email().required().messages({
		'string.base': 'Invalid email',
		'string.empty': 'Please enter your email',
	}),
	password: PasswordComplexity({
		min: 8,
		max: 25,
		requirementCount: 2,
	})
		.required()
		.messages({
			'password.min': 'The password must be longer than 8 characters',
			'password.max': 'The password must be less than 25 characters',
		}),
});

module.exports = schema;
