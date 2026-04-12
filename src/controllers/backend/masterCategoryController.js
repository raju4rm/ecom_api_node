const DB = require('../../models');
const { validator } = require('../../validations/index');
const { sendSuccessResponse, sendRecordsResponse, sendErrorResponse } = require('../../utils/response')
const { validationErrorCode, unauthErrorCOde, notfoundErrorCode, successCode, serverErrorCode } = require('../../utils/statusCode');
const { Sequelize, where } = require('sequelize');
var routesList = require('../../../routes/routesList');
const { slugify } = require('../../helpers/helpers')
const multer = require('multer');
const masterCategory = require('../../validations/masterCategory')
const { validationResult } = require('express-validator');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;

    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        const error = new Error('Wrong file type');
        error.code = 'INVALID_FILE_TYPE';
        error.field = file.fieldname; // 👈 IMPORTANT
        cb(error);
    }
};
const upload = multer({ 
    storage:storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 200000  // 2MB
    },
 });

/*  databse  */
const sequelize = DB.sequelize;
const Op = DB.Sequelize.Op;
const MasterCategory = DB.MasterCategory;

//POST - admin/role
const create = async (req, res, next) => {
    upload.fields([
        { name: 'icon', maxCount: 1 },
        { name: 'image', maxCount: 1 }
    ])(req, res, async (err) => {
        req.fileValidationErrors = {};

        if (err) {
            let errors = {};
            if (err.code === 'LIMIT_FILE_SIZE') {
                req.fileValidationErrors[err.field || 'file'] = 'File size exceeds limit';
            } else if (err.code === 'INVALID_FILE_TYPE') {
                req.fileValidationErrors[err.field] = 'Wrong file type';
            } else {
                req.fileValidationErrors['file'] = err.message;
            }
            // return sendErrorResponse(
            //     res,
            //     serverErrorCode,
            //     "File upload error",
            //     errors
            // );
        }
        try {
            let errors = await validator(req, masterCategory.create());
            if (!req.files?.icon?.length) {
                errors.icon = 'Icon file is required';
            }
            if (req.fileValidationErrors && Object.keys(req.fileValidationErrors).length > 0) {
                errors = { ...errors, ...req.fileValidationErrors };
            }
            if (Object.keys(errors).length !== 0) {
                return sendErrorResponse(
                    res,
                    validationErrorCode,
                    "Validation Error!",
                    errors
                );
            }
            const loggedInUser = req.authUser;
            let { name, parent_id, sort_order } = req.body;

            let level = 1;
            if(parent_id === null || parent_id === undefined || parent_id.toString().trim() === ''){
                level=1;
                parent_id=null
            }else{
                const getLevel = await MasterCategory.findOne({
                    where:{
                        master_category_id:parent_id
                    },
                    orderBy:['level','desc']
                })
                if(getLevel){
                    level=getLevel.level + 1;
                }
            }

            if (!sort_order || sort_order.toString().trim() === '' || sort_order === 'null') {
                sort_order = null; // or 0 if required
            } else {
                sort_order = parseInt(sort_order);
            }

            let icon_path = '';
            let image_path = '';

            if (req.files?.icon) {
                icon_path = req.files.icon[0].path;
            }

            if (req.files?.image) {
                image_path = req.files.image[0].path;
            }

            const insertData = {
                name: name,
                slug: slugify(name),
                parent_id: parent_id,
                level: level,
                sort_order: sort_order,
                icon: icon_path,
                image: image_path,
                created_by: loggedInUser.user_id,
                created_at: new Date(),
                is_active: 'y'
            };

            await MasterCategory.create(insertData);
            return sendSuccessResponse(
                res,
                successCode,
                "New category created successfully."
            );

        } catch (error) {
            return sendErrorResponse(
                res,
                serverErrorCode,
                "Internal server error!",
                error
            );
        }
    });
};

//GET - admin/role/:role_id

const edit = async (req, res, next) => {
    try {
        if (!req.params.category_id) {
            sendErrorResponse(
                res,
                validationErrorCode,
                "Validation Error!",
                { "category_id": "Id not found" }
            );
        } else {
            const category_id = req.params.category_id;
            const results = await MasterCategory.findAll({
                where: {
                    master_category_id: category_id
                }
            });
            if (results.length == 0) {
                sendErrorResponse(
                    res,
                    validationErrorCode,
                    "Validation Error!",
                    { "category_id": "No data found" }
                );
            } else {
                sendRecordsResponse(
                    res,
                    successCode,
                    "category data get for edit",
                    results,
                    results.length
                );
            }

        }

    } catch (error) {
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
    if (Object.keys(errors).length !== 0) {
        sendErrorResponse(
            res,
            validationErrorCode,
            "Validation Error!",
            errors
        );
    } else {
        const { master_category_id, description, name, is_active } = req.body;
        const loggedInUser = req.authUser;
        const updateData = {
            name: name,
            description: description,
            is_active: is_active,
            updated_by: loggedInUser.user_id,
            updated_at: new Date()
        };
        const update = await MasterCategory.update(updateData, {
            where: {
                master_category_id: master_category_id
            }
        });
        if (update) {
            sendSuccessResponse(
                res,
                successCode,
                "Category updated successfully.",
            );
        } else {
            sendErrorResponse(
                res,
                serverErrorCode,
                "Internal server error!",
                { 'errors': "Internal server error!" }
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
    try {
        const { search, page, name, isActive } = req.query
        const loggedInUser = req.authUser;

        let per_page = 10
        if (req.query.per_page) {
            per_page = req.query.per_page;
        }

        let start;
        if (page > 1) {
            start = (page - 1) * per_page;
        } else {
            start = 0;
        }
        const limit = per_page;

        let attributesFields = [
            'master_category_id',
            'name',
            'icon',
            'image',
            'sort_order',
            'created_by',
            'is_active'
        ];

        var whereCondition = {};



        if (name) {
            whereCondition.name = {
                [Op.iLike]: '%' + name + '%'
            }
        }

        if (isActive) {
            whereCondition.is_active = {
                [Op.eq]: isActive
            }
        }

        let orderValue = [
            ['master_category_id', 'DESC']
        ];

        const result = await MasterCategory.findAll({
            attributes: attributesFields,
            include:[
                {
                    model:MasterCategory,
                    as:'parent',
                    attributes:['name'],
                    required:false
                }
            ],
            where: whereCondition,
            offset: start,
            limit: limit,
            order: orderValue
        }
        );

        const result_count = await MasterCategory.findAll({
            attributes: attributesFields,
            where: whereCondition,
            order: orderValue
        }
        );

        if (result.length == 0) {
            sendRecordsResponse(
                res,
                successCode,
                "No data found",
                result,
                result_count.length
            );
        } else {
            sendRecordsResponse(
                res,
                successCode,
                "All category data",
                result,
                result_count.length
            );
        }
    } catch (error) {
        sendErrorResponse(
            res,
            serverErrorCode,
            "Internal server error!",
            error
        );
    }

}

const all = async (req,res) =>{
    try{
        const result = await MasterCategory.findAll({
            attributes : [
                'master_category_id',
                'name'
            ],
            order : [
                'name'
            ]
        });
        return sendRecordsResponse(
            res,
            successCode,
            "All category data",
            result,
            result.length
        );
    } catch (error) {
        sendErrorResponse(
            res,
            serverErrorCode,
            "Internal server error!",
            error
        );
    }
}

module.exports = {
    create,
    edit,
    update,
    list,
    all
}