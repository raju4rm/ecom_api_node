const { validationResult, check } = require('express-validator')
const {validator}=require('./index');
const DB=require('../models');
const sequelize=DB.sequelize;
const Op=DB.Sequelize.Op;
const MasterCategory=DB.MasterCategory;

 
//create
const create = () => {
  return [
    check('name').trim().notEmpty().withMessage('Name is required')
    .custom(async (name) => {
      const existingCode =
        await MasterCategory.findAll({
          where:{
            name:name
          }
        });
      if (existingCode.length) {
        throw new Error('Name already in use')
      }
      return
    }),
    check('sort_order').trim().notEmpty().withMessage('Sort order is required')
    .trim().isInt().withMessage('Sort Order must be a number '),

  ]
}


//edit
const edit = () => {
  return [
    check('master_brand_id').trim().notEmpty().withMessage('Id is required'),
  ]
}
//update
const update = () => {
  return [
    check('master_brand_id').trim().notEmpty().withMessage('Id is required'),
    check('name').trim().notEmpty().withMessage('Name is required')
    .custom(async (name,{req}) => {
      const existingCode =
        await MasterCategory.findAll({
          where:{
            name:{
              [Op.eq]: name
            },
            master_brand_id:{
              [Op.ne]: req.body.master_brand_id
            }
          }
        });
      if (existingCode.length) {
        throw new Error('Name already in use in other brand')
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