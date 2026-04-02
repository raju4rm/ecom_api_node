const { validationResult, check } = require('express-validator')
const {validator}=require('./index');
const DB=require('../models');
const sequelize=DB.sequelize;
const Op=DB.Sequelize.Op;
const Role=DB.Role;

 
//create
const create = () => {
  return [
    check('name').trim().notEmpty().withMessage('Name is required')
    .custom(async (name) => {
      const existingCode =
        await Role.findAll({
          where:{
            name:name
          }
        });
      if (existingCode.length) {
        throw new Error('Name already in use')
      }
      return
    }),
    check('is_active').trim().notEmpty().withMessage('Status is required')
    
  ]
}


//edit
const edit = () => {
  return [
    check('role_id').trim().notEmpty().withMessage('Id is required'),
  ]
}
//update
const update = () => {
  return [
    check('role_id').trim().notEmpty().withMessage('Id is required'),
    check('name').trim().notEmpty().withMessage('Name is required')
    .custom(async (name,{req}) => {
      const existingCode =
        await Role.findAll({
          where:{
            name:{
              [Op.eq]: name
            },
            role_id:{
              [Op.ne]: req.body.role_id
            }
          }
        });
      if (existingCode.length) {
        throw new Error('Name already in use in other role')
      }
      return
    })
  ]
}

  //exports
  module.exports = {
    create,
    edit,
    update
  }