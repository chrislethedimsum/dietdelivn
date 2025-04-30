const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();


// /admin/add-product => GET
router.get('/', (req, res, next) => {
  res.render('index');
});


exports.routes = router;