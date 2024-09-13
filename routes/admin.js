let express = require('express');
let router = express.Router();
require('express-group-routes');
const routesList = require('./routesList');


const authMiddleware=require('../src/middleware/authMiddleware');
const permissionMiddleware=require('../src/middleware/permissionMiddleware');

const {createValidator}=require('../src/validations/test');

const roleValidator=require('../src/validations/role');
const authValidator=require('../src/validations/auth');

const authController = require("../src/controllers/backend/authController")
const roleController = require("../src/controllers/backend/roleController")
const permissionController = require("../src/controllers/backend/permissionController")

/* Authentication */
router.post('/signup',authValidator.signupValidator(),authController.signup);
router.post('/login',authValidator.loginValidator(),authController.login);
router.get('/test',roleController.test);

router.group('', (router) => {
    router.use([authMiddleware.checkAuthUser,permissionMiddleware.checkPermission]); /* use like - router.use('/state',authMiddleware.checkAuthUser); to work only in 'state' route */
    //router.use([authMiddleware.checkAuthUser]);

    /* role  */
    router.group("/role", (router) => {
        routesList.push({ module: 'Role',permission: 'Create',method:'post', link: '/role' });
        router.post('',roleValidator.create(),roleController.create);

        routesList.push({ module: 'Role',permission: 'Edit',method:'get', link: '/role/edit/*' });
        router.get('/edit/:role_id',roleController.edit);

        routesList.push({ module: 'Role',permission: 'Update',method:'put', link: '/role' });
        router.put('',roleValidator.update(),roleController.update);

        routesList.push({ module: 'Role',permission: 'List',method:'get', link: '/role' });
        router.get('',roleController.list);
        
        routesList.push({ module: 'Role',permission: 'Assign Permission',method:'post', link: '/role/assign-permission' });
        router.post('/assign-permission',roleController.assignPermission);

        routesList.push({ module: 'Role',permission: 'Assigned Permission',method:'post', link: '/role/assigned-permission' });
        router.post('/assigned-permission',roleController.assignedPermission);
    });

    /* permission  */
    router.group("/permission", (router) => {
        routesList.push({ module: 'Permission',permission: 'Create',method:'post', link: '/permission' });
        router.post('',permissionController.create);

        routesList.push({ module: 'Permission',permission: 'List',method:'get', link: '/permission' });
        router.get('',permissionController.list);
    });

});
module.exports = {router,routesList}  ;
