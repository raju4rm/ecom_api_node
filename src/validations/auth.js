const { validationResult, check } = require('express-validator')
const {validator}=require('./index');
const DB=require('../models');
const sequelize=DB.sequelize;
const user=DB.User;

 
//Signup 'y'::enum_user_is_active
const signupValidator = () => {
  return [
    check('name').trim().notEmpty().withMessage('Name is required'),
    check('password').trim().notEmpty().withMessage('Password is required'),
    check('email').trim().notEmpty().withMessage('Email is required')
    .custom(async (email) => {
      const existingCode =
        await user.findAll({
          where:{
            email:email
          }
        });
      
      if (existingCode.length) {
        throw new Error('Email already in use')
      }
      return

  })
  ]
}


//Login
const loginValidator = () => {
  return [
    check('email').trim().notEmpty().withMessage('Email is required'),
    check('password').trim().notEmpty().withMessage('Password is required')
  ]
}



  //exports
  module.exports = {
    signupValidator,
    loginValidator
  }