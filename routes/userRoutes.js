const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const path = require('path');

router.get('/login', userController.getLoginPage);
router.post('/login', userController.postLoginPage);
router.get('/account', userController.getAccountPage);
router.get('/info-edit/:id', userController.getInfoEditPage);
router.post('/info-edit/:id', userController.postInfoEditPage);
router.post('/logout', userController.postLogout);

//đặt món ăn
router.get('/datmon', userController.getDatMon);
router.post('/datmon', userController.postDatMon);

//xem món đã đặt
router.get('/order-history', userController.getOrderHistory);
router.get('/order-history/:week_start_date', userController.getOrderHistoryDetail);

router.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, '..', 'views', 'main', '404.html'));
});

module.exports = router;