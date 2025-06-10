const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const monAn = require('../models/monan');
const path = require('path');

//xem list các mon
router.get('/monan', adminController.getMonAn);

//thêm món ăn & sau khi thêm món ăn
router.get('/themmonan', adminController.getThemMonAn);
router.post('/themmonan', adminController.postThemMonAn);
router.get('/suamonan/:monAnID', adminController.getSuaMon);
router.post('/suamonan', adminController.postSuaMon);
router.get('/giohang', adminController.getGioHang);
router.post('/monan', adminController.postThemMonVaoGioHang);
router.post('/xoamonan', adminController.postXoaMonAnKhoiData);
router.post('/xoamonankhoigio', adminController.postXoaMonAnKhoiGioHang);

//phần xem người dùng
router.get('/users', adminController.getUser);

//gán gói ăn cho người dùng
router.get("/gan-goi-an", adminController.getGanGoiAn);
router.post("/gan-goi-an", adminController.postGanGoiAn);

//gán món vào menu
router.get("/gan-mon-menu", adminController.getGanMonVaoMenu);
router.post("/gan-mon-menu", adminController.postGanMonVaoMenu);

module.exports = router;