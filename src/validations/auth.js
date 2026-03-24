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

    }),
    check('username').trim().notEmpty().withMessage('Username is required')
    .custom(async (username) => {
      const exitingUsername = 
        await user.findAll({
          where:{
            username:username
          }
        });
      if (exitingUsername.length) {
        throw new Error('Username already in use')
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

const forgotPasswordValidator = () => {
  return [
    check('email').trim().notEmpty().withMessage('Email is required')
    .custom(async (email) => {
      const existingCode =
        await user.findAll({
          where:{
            email:email
          }
        });
      if (existingCode.length==0) {
        throw new Error('Email does not exist')
      }
      return
    })
  ]
}


const resetPasswordValidator = () => {
  return [
    check('password').trim().notEmpty().withMessage('Password is required'),
    check('cpassword').trim().notEmpty().withMessage('Confirm Password is required')
    .custom(async (cpassword, {req}) => {  
      if (cpassword !== req.body.password) {
        throw new Error('Confirm Password does not match with Password')
      }
      return
    })
  ]
}
  //exports
  module.exports = {
    signupValidator,
    loginValidator,
    forgotPasswordValidator,
    resetPasswordValidator
  }