const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const transporter = require('../../utils/mail');
require('dotenv').config();

const DB=require('../../models');
const {validator}=require('../../validations/index');
const {sendSuccessResponse,sendRecordsResponse,sendErrorResponse}=require('../../utils/response')
const {validationErrorCode,unauthErrorCode,notfoundErrorCode,successCode,serverErrorCode,accessDeniedErrorCode}=require('../../utils/statusCode')
const crypto = require("crypto");
const UAParser = require("ua-parser-js");

const {userEmitter}=require('../../events/userEvents');

/*  databse  */
const sequelize=DB.sequelize;
const Op=DB.Sequelize.Op;
const user=DB.User;
const refreshTokenTable=DB.RefreshToken;


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

            userEmitter.emit('userRegistered', insertDate)

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
    test();
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
                        expiresIn : '1m'
                    });

                    const refreshToken=crypto.randomBytes(64).toString("hex");
                    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
                    const parser = new UAParser(req.headers["user-agent"]);
                    const result = parser.getResult();

                    const browser = result.browser.name;     // Chrome
                    const deviceType = result.device.type || "desktop";
                    const os = result.os.name;               // Windows
                    const deviceName = `${os} ${deviceType}`;
                    

                    const insertRefreshTokenData={
                        user_id : userResult.user_id,
                        token_hash : crypto.createHash("sha256").update(refreshToken).digest("hex"),
                        device_name : deviceName,
                        device_type : deviceType,
                        browser : browser,
                        ip_address : ipAddress,
                        expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
                        created_at: new Date(),
                        updated_at: new Date()
                    };

                    await refreshTokenTable.create(insertRefreshTokenData);

                    res.cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        secure: false, // Set to true in production
                        sameSite: "strict",
                        maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days
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

const refreshToken = async (req, res, next) => {
    // try {
        console.log('------',req.cookies);
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            const error= {
                "email":"No refresh token provided"
            }
            return sendErrorResponse(
                res,
                unauthErrorCode,
                "No refresh token provided",
                error
            );
        }

        const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
        const tokenRecord = await refreshTokenTable.findOne({
            where: { token_hash: hashedToken },
        });

        if (!tokenRecord) {
            const error= {
                "email":"Invalid refresh token"
            }
            return sendErrorResponse(
                res,
                accessDeniedErrorCode,
                "Invalid refresh token",
                error
            );
        }
        if (new Date() > tokenRecord.expires_at) {
            await tokenRecord.destroy();
            const error= {
                "email":"Refresh token expired"
            }
            return sendErrorResponse(
                res,
                accessDeniedErrorCode,
                "Refresh token expired",
                error
            );
        }
        const userResult = await user.findOne({
            where: { user_id: tokenRecord.user_id }
        });

        if (!userResult) {
            const error= {
                "email":"User not found"
            }
            return sendErrorResponse(
                res,
                notfoundErrorCode,
                "User not found",
                error
            );
        }

        await tokenRecord.destroy();

        // Generate new refresh token
        const newRefreshToken = crypto.randomBytes(64).toString("hex");
        const newHashedToken = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
        const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const parser = new UAParser(req.headers["user-agent"]);
        const result = parser.getResult();

        const browser = result.browser.name;     // Chrome
        const deviceType = result.device.type || "desktop";
        const os = result.os.name;               // Windows
        const deviceName = `${os} ${deviceType}`;

        const insertRefreshTokenData={
            user_id : userResult.user_id,
            token_hash : newHashedToken,
            device_name : deviceName,
            device_type : deviceType,
            browser : browser,
            ip_address : ipAddress,
            expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
            created_at: new Date(),
            updated_at: new Date()
        };

        await refreshTokenTable.create(insertRefreshTokenData);
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false, // Set to true in production
            sameSite: "strict",
            maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days

        });

        const newAccessToken = jwt.sign({
                user_id : userResult.user_id,
                user_type : userResult.user_type_id,
                name : userResult.name,
                username : userResult.username,
                email : userResult.email,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn : '1m'
            }
        );

        return sendRecordsResponse(
            res,
            successCode,
            "Successfully logged in",
            [
                {
                    "token":newAccessToken
                }
            ],
        );
    // } catch (error) {
    //     return sendErrorResponse(
    //         res,
    //         serverErrorCode,
    //         "Internal server error!",
    //         error
    //     );
    // }
}

const logout = async (req, res, next) => {
    try {
        console.log("Logout cookies:", req.cookies);

        const refreshToken = req.cookies.refreshToken;

        // If no cookie → already logged out
        if (!refreshToken) {
            return sendRecordsResponse(
                res,
                successCode,
                "Already logged out",
                []
            );
        }

        // Hash token (because DB stores hashed version)
        const hashedToken = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");

        // Find token in DB
        const tokenRecord = await refreshTokenTable.findOne({
            where: { token_hash: hashedToken }
        });

        // If exists → delete it
        if (tokenRecord) {
            await tokenRecord.destroy();
        }

        // Clear cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,      // true in production (HTTPS)
            sameSite: "strict"
        });

        return sendRecordsResponse(
            res,
            successCode,
            "Logged out successfully",
            []
        );

    } catch (error) {
        return sendErrorResponse(
            res,
            serverErrorCode,
            "Internal server error!",
            error
        );
    }
};

const forgotPassword = async (req,res,next) => {
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
            const {email}=req.body;
            const userDetails = await user.findOne({
                where: {email:email}
            });
            const resetToken = jwt.sign(
                { user_id: userDetails.user_id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "15m" }
            );
            const link = `http://127.0.0.1:3000/reset-password/${resetToken}`;
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Password Reset",
                html: `<h1>Hello</h1><p>This is HTML email</p><p>Click <a href="${link}">here</a> to reset your password.</p>`
            })
            return sendSuccessResponse(
                res,
                successCode,
                "Password reset email sent successfully."
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

const resetPassword = async (req,res,next) => {
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
            const {password,cpassword} = req.body;
            const token = req.params.token;
            console.log(password,cpassword,token)
            const {user_id,user_type,name,username,email} = jwt.verify(token,process.env.JWT_SECRET_KEY);
            console.log(user_id);
            const enc_password = await bcrypt.hash(password, 10);
            await user.update({
                    password:enc_password
                },{
                    where:{
                        user_id:user_id
                    }
                }
            );
            return sendSuccessResponse(
                res,
                successCode,
                "Password reset successfully."
            );

        }
    }catch(error){
        console.log('----',error.name,'------');
        let message = "Internal server error!!";

        if (error.name == "TokenExpiredError") {
            message = "Reset password link has expired. Please request a new link.";
        } 
        
        else if (error.name == "JsonWebTokenError") {
            message = "Invalid reset password token.";
        }

        return sendErrorResponse(
            res,
            serverErrorCode,
            message,
            error
        );
    }
}

const test = () => {
    console.log('test');
}
module.exports={
    signup,
    login,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword
}