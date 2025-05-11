const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

router.get('/', mainController.getIndex);
router.post('/tuvansdt', mainController.postTuVanSoDienThoaiQuaIndex);
router.get('/baogia', mainController.getBaoGia);
router.post('/baogiapost', mainController.postBaoGia);
router.get('/baomatthongtin', mainController.getBaoMatThongTin);
router.get('/chinhsachchung', mainController.getChinhSachChung);
router.get('/chinhsachgiaohang', mainController.getChinhSachGiaoHang);
router.get('/faqs', mainController.getFAQs);
router.get('/moitruong', mainController.getMoiTruong);
router.get('/muatheonhom', mainController.getMuaTheoNhom);
router.get('/quydinhthanhtoan', mainController.getQuyDinhThanhToan);
router.get('/vechungtoi', mainController.getVeChungToi);

module.exports = router;