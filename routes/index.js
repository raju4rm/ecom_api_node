var express = require('express');
var router = express.Router();
const dbconnection=require('../config/database');


/* GET home page. */
router.get('/', function(req, res, next) {
  try {
    dbconnection.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

module.exports = router;
