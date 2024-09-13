const { validationResult, check } = require('express-validator')
const {validator}=require('./index');

 
//create
const createValidator = () => {
  return [
    check('name').trim().notEmpty().withMessage('Name is required'),
    check('password').trim().notEmpty().withMessage('Password is required')
  ]
}

  //exports
  module.exports = {
    createValidator,
  }