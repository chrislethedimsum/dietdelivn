const express = require('express');
const router = express.Router();
const monAnController = require('../controllers/adminController');

//xem list các mon
router.get('/monan', monAnController.getMonAn);

//thêm món ăn & sau khi thêm món ăn
router.get('/themmonan', monAnController.getThemMonAn);
router.post('/themmonan', monAnController.postThemMonAn);
router.get('/suamonan/:monAnID', monAnController.getSuaMon);
router.post('/suamonan', monAnController.postSuaMon);
router.get('/giohang', monAnController.getGioHang);
router.post('/monan', monAnController.postThemMonVaoGioHang);
router.post('/xoamonan', monAnController.postXoaMonAnKhoiData);
router.post('/xoamonankhoigio', monAnController.postXoaMonAnKhoiGioHang);

module.exports = router;