const DB=require('../../models');
const {validator}=require('../../validations/index');
const {sendSuccessResponse,sendRecordsResponse,sendErrorResponse}=require('../../utils/response')
const {validationErrorCode,unauthErrorCOde,notfoundErrorCode,successCode,serverErrorCode}=require('../../utils/statusCode');
const { Sequelize } = require('sequelize');
var routesList = require('../../../routes/routesList');

/*  databse  */
const sequelize=DB.sequelize;
const Op=DB.Sequelize.Op;
const Role=DB.Role;
const RolePermission=DB.RolePermission;
const User=DB.User;
const UserRole=DB.UserRole;
const Permission=DB.Permission;

//POST - admin/role
const create = async (req, res, next) => {
    // try{
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
            const {name}=req.body;
            const insertData={
                name:name,
                slug:name.replace(/\s/g, '').toLowerCase (),
                created_by:loggedInUser.user_id,
                created_at:new Date(),
                is_active:'y'
            };
            const create = await Role.create(insertData);
            sendSuccessResponse(
                res,
                successCode,
                "New role created successfully.",
            );
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

//GET - admin/role/:role_id

const edit = async (req, res, next) => {
    try{
        if (!req.params.role_id){
            sendErrorResponse(
                res,
                validationErrorCode,
                "Validation Error!",
                {"role_id":"Id not found"}
            );
        }else{
            const role_id=req.params.role_id;
            const results = await Role.findAll({
                where: {
                    role_id: role_id
                }
            });
            if(results.length==0){
                sendErrorResponse(
                    res,
                    validationErrorCode,
                    "Validation Error!",
                    {"role_id":"No data found"}
                );
            }else{
                sendRecordsResponse(
                    res,
                    successCode,
                    "role data get for edit",
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
    try{
        const errors = validator(req);
        if (Object.keys(errors).length !== 0){
            sendErrorResponse(
                res,
                validationErrorCode,
                "Validation Error!",
                errors
            );
        }else{
            const {role_id,name,is_active}=req.body;
            const loggedInUser=req.authUser;
            const updateData={
                name:name,
                slug:name.replace(/\s/g, '').toLowerCase(),
                is_active:is_active,
                updated_by:loggedInUser.user_id,
                updated_at:new Date()
            };
            const update = await Role.update(updateData, {
                where: {
                role_id: role_id
                }
            });
            if(update){
                sendSuccessResponse(
                    res,
                    successCode,
                    "role updated successfully.",
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
    }catch(error){
        sendErrorResponse(
            res,
            serverErrorCode,
            "Internal server error!",
            error
        );
    }
    
}

//GET - admin/role
const list = async (req, res, next) => {
    try{
        const {search,page,name,slug,isActive}=req.query
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
            'role_id',
            'name',
            'slug',
            'created_by',
            'is_active'
        ];

        var whereCondition={};

        

        if(name){
            whereCondition.name={
                [Op.iLike]: '%'+name+'%'
            }
        }
        if(slug){
            whereCondition.slug={
                [Op.iLike]: '%'+slug+'%'
            }
        }
        if(isActive){
            whereCondition.is_active={
                [Op.eq]: isActive
            }
        }

        let orderValue=[
            ['role_id','DESC']
        ];

        const result = await Role.findAll({
                attributes  : attributesFields,
                where       : whereCondition,
                offset      : start,
                limit       : limit,
                order       : orderValue
            }
        );
        
        const result_count = await Role.findAll({
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

//GET - admin/role
const dropdown = async (req, res, next) => {
    try{
        let attributesFields=[
            [Sequelize.literal('mst_category_id'), 'value'],
            [Sequelize.literal('name'), 'label'],
        ];

        var whereCondition={};

        let orderValue=[
            ['mst_category_id','DESC']
        ];

        const result = await category.findAll({
                attributes  : attributesFields,  
                order       : orderValue
            }
        ); 
        sendRecordsResponse(
            res,
            200,
            "All category data",
            result,
            result.length
        ); 
    }catch(error){
        sendErrorResponse(
            res,
            serverErrorCode,
            "Internal server error!",
            error
        );
    }
}

//POST - admin/role
const assignPermission = async (req, res, next) => {
    try{
        // console.log(req.body);return;
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
            const {role_id,permission_id}=req.body;
            //console.log(role_id);return; 
            const deleteInserted=await RolePermission.destroy({
                where:{
                    role_id : role_id
                }
            });
            let insertData=[];
            permission_id.map((value,index) => {
                insertData.push({role_id:role_id,permission_id:value})
            })
            const create = await RolePermission.bulkCreate(insertData);
            sendSuccessResponse(
                res,
                successCode,
                "New permission assigned successfully.",
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

const test = async (req, res, next) => {
    return res.json(1)
}

//GET - admin/assigned-permission
const assignedPermission = async (req, res, next) => {
    //try{
        // console.log(req.body);return;
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
            const {role_id}=req.body;
            const results = await RolePermission.findAll({
                where: {
                    role_id: role_id
                }
            }); 
            
            if(results.length==0){
                sendRecordsResponse(
                    res,
                    successCode,
                    "No data found",
                    results,
                    results.length
                );
            }else{
                sendRecordsResponse(
                    res,
                    successCode,
                    "All category data",
                    results,
                    results.length
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
module.exports={
    create,
    edit,
    update,
    list,
    dropdown,
    assignPermission,
    test,
    assignedPermission
}