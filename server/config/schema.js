const Joi = require('joi')
const PasswordComplexity = require('joi-password-complexity')

const schema = Joi.object().keys({
    name : Joi.string(),
    email : Joi.string().trim().email().required().messages({
        'string.base' : 'Invalid email',
        'string.empty' : 'Please enter your email'
    })
})

module.exports = schema