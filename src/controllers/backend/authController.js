const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const DB=require('../../models');
const {validator}=require('../../validations/index');
const {sendSuccessResponse,sendRecordsResponse,sendErrorResponse}=require('../../utils/response')
const {validationErrorCode,unauthErrorCode,notfoundErrorCode,successCode,serverErrorCode}=require('../../utils/statusCode')

/*  databse  */
const sequelize=DB.sequelize;
const Op=DB.Sequelize.Op;
const user=DB.User;


//POST - admin/signup
const signup = async (req, res, next) => {
    try{
        const errors = validator(req);
        if (Object.keys(errors).length !== 0){
            return sendErrorResponse(
                res,
                validationErrorCode,
                "Validation Error!",
                errors
            );
        }else{
            const {name,email,password,username,phone_no}=req.body;
            const loggedInUser=1;
            const saltRounds = 10;
            const user_type_id = 1;
            const salt=await bcrypt.genSalt(saltRounds);
            const hashPassword=await bcrypt.hash(password,salt);

            const insertDate={
                name:name,
                username:username,
                email:email,
                phone_no:phone_no,
                user_type_id:user_type_id,
                password:hashPassword,
                is_active:'y',
                is_ban:'n',
                created_by:loggedInUser,
                created_at: new Date(),
            };

            const create = await user.create(insertDate);

            return sendSuccessResponse(
                res,
                successCode,
                "New user created successfully.",
            );
        }
        
    }catch(error){
        return sendErrorResponse(
            res,
            serverErrorCode,
            "Internal server error!",
            error
        );
    }
    
}



//POST - admin/login
const login = async (req, res, next) => {
    console.log(req.body)
    try{
        const errors = validator(req);
        if (Object.keys(errors).length !== 0){
            return sendErrorResponse(
                res,
                validationErrorCode,
                "Validation Error!",
                errors
            );
        }else{
            const {email,password}=req.body;
            
            const userResult = await user.findOne({
                where:{
                  email:email
                }
            });
            
            if(userResult !=null){
                const isPasswordMatch = await bcrypt.compare(password,userResult.password);
                if(email == userResult.email && isPasswordMatch){
                    const token=jwt.sign({
                        user_id : userResult.user_id,
                        user_type : userResult.user_type_id,
                        name : userResult.name, 
                        username : userResult.username, 
                        email : userResult.email, 
                    },
                    process.env.JWT_SECRET_KEY,
                    {
                        expiresIn : '10d'
                    });

                    return sendRecordsResponse(
                        res,
                        successCode,
                        "Successfully logged in",
                        [
                            {
                                "token":token
                            }
                        ],
                    );

                }else{
                    const error= {
                        "email":"Invalid email or password"
                    }
                    return sendErrorResponse(
                        res,
                        validationErrorCode,
                        "Invalid email or password",
                        error
                    );
                }
            }else{
                const error= {
                    "email":"Invalid email or password"
                }
                return sendErrorResponse(
                    res,
                    validationErrorCode,
                    "Invalid email or password",
                    error
                );
            }
        }
        
    }catch(error){
        return sendErrorResponse(
            res,
            serverErrorCode,
            "Internal server error!",
            error
        );
    }
    
}


module.exports={
    signup,
    login
    
}