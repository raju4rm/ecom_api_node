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
const Permission=DB.Permission;


//POST - admin/permission
const create = async (req, res, next) => {
    try{
        console.log(routesList);
        const loggedInUser=req.authUser; 
        const insertData=[];
        const getPermissionData=routesList.map(async (value, index) => {
            const duplicateCheck = await Permission.findAll({
                where: {
                    module: value.module,
                    permission: value.permission,
                }
            });
            console.log(duplicateCheck.length)
            if(duplicateCheck.length==0){
                insertData.push({
                    module      :value.module,
                    permission  :value.permission,
                    method      :value.method,
                    link        :value.link,
                    slug        :value.module.replace(/\s/g, '').toLowerCase()+'-'+value.permission.replace(/\s/g, '').toLowerCase(),
                    created_by  :loggedInUser.user_id,
                    created_at  :new Date(),
                })
            }
        });     
        await Promise.all(getPermissionData);

        const create = await Permission.bulkCreate(insertData);
        sendSuccessResponse(
            res,
            successCode,
            "New permission created successfully.",
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

//GET - admin/permission
const list = async (req, res, next) => {
    try{
        console.log(111111)
        const loggedInUser=req.authUser;

        let per_page=10
        if(req.query.per_page){
            per_page=req.query.per_page;
        }

        let attributesFields=[
            '*',
        ];

        var whereCondition={};

        let orderValue=[
            ['module','ASC'],
            ['permission','ASC'],
        ];

        const result = await Permission.findAll({
                where       : whereCondition,
                order       : orderValue
            }
        );
        let resultArray={};
        var newArray = result.map(function(value,index) {
            if (!resultArray[value.module]) {
                resultArray[value.module] = [];
            }
            let objkey=value.permission_id
            let KeyValue=value.permission
            resultArray[value.module].push({[objkey]: KeyValue});

        });
        if(result.length==0){
            sendRecordsResponse(
                res,
                successCode,
                "No data found",
                resultArray,
                0
            );
        }else{
            sendRecordsResponse(
                res,
                successCode,
                "All permission data",
                resultArray,
                resultArray.length
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
    list
}