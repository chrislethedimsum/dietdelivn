const guest = require("../models/guest");
const axios = require("axios");
const querystring = require('querystring');

exports.getBaoGia = (req, res, next) => {
  res.render("main/baogia", {
    pageTitle: "Báo giá",
    isAuthenticated: req.session.isLoggedIn,
  });
};

//nhận tất cả thông tin từ form khách hàng ở báo giá
exports.postBaoGia = async (req, res, next) => {
    const { phone, token, gender, age, height, weight, activity_level, goal } = req.body;
    const secret = "ES_26ac6b49ca2248bdab0cd14baa743aea";
    if (!token) {
      return res.json({ success: false, message: "Token không tồn tại" });
    }
  
    try {
      // Xác minh hCaptcha
      const verifyURL = "https://hcaptcha.com/siteverify";
      const response = await axios.post(
        verifyURL,
        querystring.stringify({ secret, response: token }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
  
      const data = response.data;
      console.log("Dữ liệu xác minh:", data);
      if (!data.success) {
        return res.json({ success: false, message: "Xác minh captcha thất bại" });
      }
  
      // Nếu captcha hợp lệ → lưu số điện thoại
      const guestNew = new guest(
        null, phone,
        age, gender, height,
        weight, goal, activity_level
      );
  
      await guestNew.save();
      return res.json({ success: true });
  
    } catch (error) {
      console.error("Lỗi khi lưu số điện thoại:", error);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

exports.getBaoMatThongTin = (req, res, next) => {
  res.render("main/baomatthongtin", {
    pageTitle: "Chính sách bảo mật thông tin",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getChinhSachChung = (req, res, next) => {
  res.render("main/chinhsachchung", {
    pageTitle: "Chính sách và quy định chung",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getChinhSachGiaoHang = (req, res, next) => {
  res.render("main/chinhsachgiaohang", {
    pageTitle: "Chính sách vận chuyển và giao hàng",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getFAQs = (req, res, next) => {
  res.render("main/faqs", {
    pageTitle: "Những câu hỏi thường gặp",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getIndex = (req, res, next) => {
  res.render("main/index", {
    pageTitle: "Diet Deli - Ăn kiêng thật dễ dàng",
    isAuthenticated: req.session.isLoggedIn,
  });
};

//POST số điện thoại khi user submit vào Index
exports.postTuVanSoDienThoaiQuaIndex = async (req, res, next) => {
    const { sdt, token } = req.body;
    const secret = "ES_26ac6b49ca2248bdab0cd14baa743aea";
    if (!token) {
      return res.json({ success: false, message: "Token không tồn tại" });
    }
  
    try {
      // Xác minh hCaptcha
      const verifyURL = "https://hcaptcha.com/siteverify";
      const response = await axios.post(
        verifyURL,
        querystring.stringify({ secret, response: token }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );
  
      const data = response.data;
      console.log("Dữ liệu xác minh:", data);
      if (!data.success) {
        return res.json({ success: false, message: "Xác minh captcha thất bại" });
      }
  
      // Nếu captcha hợp lệ → lưu số điện thoại
      const guestZalo = new guest(
        null, sdt,
        null, null, null,
        null, null, null
      );
  
      await guestZalo.save();
      return res.json({ success: true });
  
    } catch (error) {
      console.error("Lỗi khi lưu số điện thoại:", error);
      return res.status(500).json({ success: false, message: "Lỗi server" });
    }
  };

exports.getMoiTruong = (req, res, next) => {
  res.render("main/moitruong", {
    pageTitle: "Môi trường",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getMuaTheoNhom = (req, res, next) => {
  res.render("main/muatheonhom", {
    pageTitle: "Mua theo nhóm",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getQuyDinhThanhToan = (req, res, next) => {
  res.render("main/quydinhthanhtoan", {
    pageTitle: "Quy định thanh toán",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getVeChungToi = (req, res, next) => {
  res.render("main/vechungtoi", {
    pageTitle: "Về chúng tôi",
    isAuthenticated: req.session.isLoggedIn,
  });
};
