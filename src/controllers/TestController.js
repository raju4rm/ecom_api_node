const DB=require('../models');
const {validator}=require('../validations/index');
const {sendSuccessResponse,sendRecordsResponse,sendErrorResponse}=require('../utils/response')
const {validationErrorCode,unauthErrorCOde,notfoundErrorCode,successCode,serverErrorCode}=require('../utils/statusCode')

const sequelize=DB.sequelize;
const state=DB.state;
//const { sequelize,QueryTypes } = require('sequelize');



const Create = async (req, res, next) => { 
    const errors = validator(req);
    try{
        if (!errors.isEmpty()){
            sendErrorResponse(
                res,
                validationErrorCode,
                "Validation Error!",
                errors
            );
        }else{
            sendErrorResponse(
                res,
                validationErrorCode,
                "Validation Error!",
                errors
            );
        }
        
    }catch(error){
        sendErrorResponse(
            res,
            serverErrorCode,
            "Internal server error!",
            errors
        );
    }
    
    //console.log(metadata)
    
}

const Update = async (req, res, next) => {
    //const jane = await state.create({ name: "Jane", code:"ttt", created_by:'1' });
    try {
        sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}


module.exports={
    Create,
    Update,
}