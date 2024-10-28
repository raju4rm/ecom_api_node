const DB=require('../../models');
const {validator}=require('../../validations/index');
const {sendSuccessResponse,sendRecordsResponse,sendErrorResponse}=require('../../utils/response')
const {validationErrorCode,unauthErrorCOde,notfoundErrorCode,successCode,serverErrorCode}=require('../../utils/statusCode');
const { Sequelize } = require('sequelize');
var routesList = require('../../../routes/routesList');

/*  databse  */
const sequelize=DB.sequelize;
const Op=DB.Sequelize.Op;
const MasterBrand=DB.MasterBrand;

//POST - admin/role
const create = async (req, res, next) => {
    try{
        const loggedInUser=req.authUser;
        const errors = validator(req);
        if (Object.keys(errors).length !== 0){
            sendErrorResponse(
                res,
                validationErrorCode,
                "Validation Error!",
                errors
            );
        }else{
            const {name,description}=req.body;
            const insertData={
                name:name,
                description:description,
                created_by:loggedInUser.user_id,
                created_at:new Date(),
                is_active:'y'
            };
            const create = await MasterBrand.create(insertData);
            sendSuccessResponse(
                res,
                successCode,
                "New brand created successfully.",
            );
        }
        
    }catch(error){

        sendErrorResponse(
            res,
            serverErrorCode,
            "Internal server error!",
            error
        );
    }
    
}

//GET - admin/role/:role_id

const edit = async (req, res, next) => {
    try{
        if (!req.params.brand_id){
            sendErrorResponse(
                res,
                validationErrorCode,
                "Validation Error!",
                {"brand_id":"Id not found"}
            );
        }else{
            const brand_id=req.params.brand_id;
            const results = await MasterBrand.findAll({
                where: {
                    master_brand_id: brand_id
                }
            });
            if(results.length==0){
                sendErrorResponse(
                    res,
                    validationErrorCode,
                    "Validation Error!",
                    {"brand_id":"No data found"}
                );
            }else{
                sendRecordsResponse(
                    res,
                    successCode,
                    "brand data get for edit",
                    results,
                    results.length
                );
            }
            
        }
        
    }catch(error){
        sendErrorResponse(
            res,
            serverErrorCode,
            "Internal server error!",
            error
        );
    }
    
}

//PUT - admin/role
const update = async (req, res, next) => {
    //try{
        const errors = validator(req);
        if (Object.keys(errors).length !== 0){
            sendErrorResponse(
                res,
                validationErrorCode,
                "Validation Error!",
                errors
            );
        }else{
            const {master_brand_id,description,name,is_active}=req.body;
            const loggedInUser=req.authUser;
            const updateData={
                name:name,
                description:description,
                is_active:is_active,
                updated_by:loggedInUser.user_id,
                updated_at:new Date()
            };
            const update = await MasterBrand.update(updateData, {
                where: {
                    master_brand_id: master_brand_id
                }
            });
            if(update){
                sendSuccessResponse(
                    res,
                    successCode,
                    "Brand updated successfully.",
                );
            }else{
                sendErrorResponse(
                    res,
                    serverErrorCode,
                    "Internal server error!",
                    {'errors':"Internal server error!"}
                );
            } 
        }
    // }catch(error){
    //     sendErrorResponse(
    //         res,
    //         serverErrorCode,
    //         "Internal server error!",
    //         error
    //     );
    // }
    
}

//GET - admin/role
const list = async (req, res, next) => {
    try{
        const {search,page,name,isActive}=req.query
        const loggedInUser=req.authUser;

        let per_page=10
        if(req.query.per_page){
            per_page=req.query.per_page;
        }

        let start;
        if(page > 1){
            start=(page-1)*per_page;
        } else {
            start=0;
        }
        const limit=per_page;

        let attributesFields=[
            'master_brand_id',
            'name',
            'description',
            'created_by',
            'is_active'
        ];

        var whereCondition={};

        

        if(name){
            whereCondition.name={
                [Op.iLike]: '%'+name+'%'
            }
        }
        
        if(isActive){
            whereCondition.is_active={
                [Op.eq]: isActive
            }
        }

        let orderValue=[
            ['master_brand_id','DESC']
        ];

        const result = await MasterBrand.findAll({
                attributes  : attributesFields,
                where       : whereCondition,
                offset      : start,
                limit       : limit,
                order       : orderValue
            }
        );
        
        const result_count = await MasterBrand.findAll({
                attributes  : attributesFields,
                where       : whereCondition,
                order       : orderValue
            }
        );
        
        if(result.length==0){
            sendRecordsResponse(
                res,
                successCode,
                "No data found",
                result,
                result_count.length
            );
        }else{
            sendRecordsResponse(
                res,
                successCode,
                "All category data",
                result,
                result_count.length
            );
        }
    }catch(error){
        sendErrorResponse(
            res,
            serverErrorCode,
            "Internal server error!",
            error
        );
    }
    
}


module.exports={
    create,
    edit,
    update,
    list
}