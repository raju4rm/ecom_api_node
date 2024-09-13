const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const DB=require('../models');
const {sendSuccessResponse,sendRecordsResponse,sendErrorResponse}=require('../utils/response')
const {validationErrorCode,unauthErrorCode,notfoundErrorCode,successCode,serverErrorCode,accessDeniedErrorCode}=require('../utils/statusCode')


/*  databse  */
const sequelize=DB.sequelize;
const Op=DB.Sequelize.Op;
const Role=DB.Role;
const RolePermission=DB.RolePermission;
const User=DB.User;
const UserRole=DB.UserRole;
const Permission=DB.Permission;


//POST - admin/signup
const checkPermission = async (req, res, next) => {
    let token;
    const {authorization} = req.headers;
    
    try{
        if(authorization && authorization.startsWith('Bearer')){
            token=authorization.split(' ')[1];

            const {user_id,user_type,name,username,email} = jwt.verify(token,process.env.JWT_SECRET_KEY);
            const userWithProfile = await User.findAll({
                where: {user_id:user_id},
                attributes: ['user_id'],
                include: [
                {
                    model: UserRole,
                    required: true,
                    attributes: ['user_role_id'],
                    include: [
                    {
                        model: Role,
                        required: true,
                        attributes: ['role_id'],
                        include: [
                            {
                                model: RolePermission,
                                required: true,
                                attributes: ['role_permission_id'],
                                include: [
                                    {
                                        model: Permission,
                                        required: true,
                                        attributes: [
                                            'permission_id',
                                            'permission',
                                            'slug',
                                            'module',
                                            'method',
                                            'link'
                                        ],
                                    }
                                ]
                            }
                          ]
                        }
                    ]
                }],
            });
        
            //console.log(JSON.stringify(userWithProfile, null, 2));return;
            //console.log(userWithProfile);return;
            const permissionList=[];
            userWithProfile.map(user=>{
                var UserRoles=user.UserRoles
                UserRoles.map(role=>{
                    var rolePermission=role.Role.RolePermissions;
                    if(rolePermission){
                        rolePermission.map(permission=>{
                            permissionList.push({
                                permission_id:  permission.Permission.permission_id,
                                permission:     permission.Permission.permission,
                                slug:           permission.Permission.slug,
                                module:         permission.Permission.module,
                                method:         permission.Permission.method,
                                link:           permission.Permission.link
                            });
                        })
                    }
                })
            })
            
            const currentFullUrl = req.originalUrl;
            const currentMethod = req.method;
            const path = currentFullUrl.split('?')[0]; 
            const currentPermissionUrl = path.split('/admin')[1];

            const isRouteMatch = permissionList.some(permission => {
                const regexPattern = new RegExp(
                  `^${permission.link.replace('*', '.*')}$`
                );
              
                return regexPattern.test(currentPermissionUrl);
              });
              

            //console.log(currentPermissionUrl,permissionList,'-------');
            const isValid = permissionList.some(
                item => isRouteMatch  && item.method.toUpperCase() === currentMethod.toUpperCase()
            );
            if(isValid){
                //console.log(999);
                next();
            }else{
                //console.log(444);
                sendErrorResponse(
                    res,
                    accessDeniedErrorCode,
                    "Access Denied1",
                    accessDeniedErrorCode,
                );  
            }
                
        }else{
            sendErrorResponse(
                res,
                accessDeniedErrorCode,
                "Access Denied1",
                error
            );
        }
    }catch(error){
        sendErrorResponse(
            res,
            accessDeniedErrorCode,
            "Access Denied",
            error
        );
    } 
    
}

function createPattern(basePath) {
    return new RegExp(`^${basePath}(?:/\\d+)?(?:\\?.*)?$`);
  }
  
  function matchesPattern(url, basePath) {
    const pattern = createPattern(basePath);
    return pattern.test(url);
  }



module.exports={
    checkPermission    
}