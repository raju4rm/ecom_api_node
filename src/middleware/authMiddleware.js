const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const DB=require('../models');
const {sendSuccessResponse,sendRecordsResponse,sendErrorResponse}=require('../utils/response')
const {validationErrorCode,unauthErrorCode,notfoundErrorCode,successCode,serverErrorCode}=require('../utils/statusCode')


/*  databse  */
const sequelize=DB.sequelize;
const Op=DB.Sequelize.Op;
const user=DB.user;


//POST - admin/signup
const checkAuthUser = async (req, res, next) => {
    let token;
    const {authorization} = req.headers;
    
    try{
        if(authorization && authorization.startsWith('Bearer')){
            token=authorization.split(' ')[1];

            const {user_id,user_type,name,username,email} = jwt.verify(token,process.env.JWT_SECRET_KEY);
            req.authUser={
                "user_id" : user_id,
                "user_type" : user_type,
                "name" : name,
                "username" : username,
                "email" : email,
            }
            next();
        }else{
            const error= {
                "email":"nauthorized user"
            }
            sendErrorResponse(
                res,
                unauthErrorCode,
                "Unauthorized user",
                error
            );
        }
    }catch(error){
        sendErrorResponse(
            res,
            unauthErrorCode,
            "Unauthorized user",
            error
        );
    }
    
}





module.exports={
    checkAuthUser    
}