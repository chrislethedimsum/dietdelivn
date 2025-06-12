const monAn = require("../models/monan");
const Giohang = require("../models/giohang");
const nguoiDung = require("../models/user");
const mealPackage = require("../models/mealpackage");
const userPackage = require("../models/userpackage");
const weeklyMenu = require("../models/weeklymenu");
const dailyMenuItem = require("../models/dailymenuitem")
const moment = require("moment");
require("moment/locale/vi");

exports.getMonAn = (req, res, next) => {
  monAn
    .fetchAll()
    .then(([rows, fieldData]) => {
      res.render("admin/monan", {
        monan: rows,
        pageTitle: "Tổng hợp các món ăn",
        isAuthenticated: req.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.getSuaMon = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/admin/monan");
  }
  const monId = req.params.monAnID;
  monAn
    .findById(monId)
    .then((monan) => {
      if (!monan) {
        return res.redirect("/admin/monan");
      }
      res.render("admin/themmonan.ejs", {
        monan: monan,
        pageTitle: "Sữa món ăn",
        editing: editMode,
        isAuthenticated: req.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};

exports.postSuaMon = (req, res, next) => {
  const monId = req.body.monId;
  const updatedName = req.body.name;
  const updatedImage = req.body.image;
  const updatedDescription = req.body.description;
  const updatedServingsize = req.body.servingsize;
  const updatedCarb = req.body.carb;
  const updatedProtein = req.body.protein;
  const updatedFat = req.body.fat;

  monAn.findById(monId)
    .then((mon) => {
      mon.name = updatedName;
      mon.image = updatedImage;
      mon.description = updatedDescription;
      mon.servingsize = updatedServingsize;
      mon.carb = updatedCarb;
      mon.protein = updatedProtein;
      mon.fat = updatedFat;
      return mon.save();
    })
    .then(() => {
      console.log('Món ăn đã được cập nhật.');
      res.redirect('/admin/monan');
    })
    .catch((err) => {
      console.error(err);
      res.redirect('/admin/monan');
    });
};

exports.getThemMonAn = (req, res, next) => {
  res.render("admin/themmonan", {
    pageTitle: "Thêm món ăn",
    editing: false,
    isAuthenticated: req.isLoggedIn
  });
};

exports.postThemMonAn = (req, res, next) => {
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const servingsize = req.body.servingsize;
  const carb = req.body.carb;
  const protein = req.body.protein;
  const fat = req.body.fat;
  const monan = new monAn(
    null,
    name,
    image,
    description,
    servingsize,
    carb,
    protein,
    fat
  );
  monan
    .save()
    .then(() => {
      res.redirect("/admin/monan");
    })
    .catch((err) => console.log(err));
};

exports.postXoaMonAnKhoiData = (req, res, next) => {
  const monId = req.body.monId;
  monAn.xoaMonKhoiData(monId)
    .then(() => {
      console.log(`Đã xóa món có id: ${monId}`);
      res.redirect('/admin/monan');
    })
    .catch((err) => {
      console.error('Lỗi khi xóa món:', err);
      res.redirect('/admin/monan');
    });
};

exports.getGioHang = (req, res, next) => {
  Giohang.getGioHang((gioHang) => {
    monAn.fetchAll((cacmonan) => {
      const monAnTrongGio = [];
      for (let monan of cacmonan) {
        const monAnTrongGioData = gioHang.cacmonan.find(
          (mon) => mon.id === monan.id
        );
        if (monAnTrongGioData) {
          monAnTrongGio.push({ monAnData: monan, qty: monAnTrongGioData.qty });
        }
      }
      res.render("admin/giohang", {
        pageTitle: "Giỏ Hàng",
        cacmonan: monAnTrongGio,
        tongCalo: gioHang.tongCalo,
        isAuthenticated: req.isLoggedIn
      });
    });
  });
};

exports.postThemMonVaoGioHang = (req, res, next) => {
  const monId = req.body.monId;
  monAn.findById(monId, (monan) => {
    if (!monan) {
      return res.redirect("/admin/monan");
    }
    Giohang.themMonVaoGio(monId, monan.servingsize);
    res.redirect("/admin/monan");
  });
};

exports.postXoaMonAnKhoiGioHang = (req, res, next) => {
  const monId = req.body.monId;
  console.log(monId);
  monAn.findById(monId, (monan) => {
    Giohang.xoaMonTrongGio(monId, monan.servingsize);
    res.redirect("/admin/giohang");
  });
};

//Thêm người dùng
exports.getUser = (req, res, next) => {
  nguoiDung.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("admin/users", {
        users: rows,
        pageTitle: "Tất cả người dùng",
      });
    })
    .catch((err) => console.log(err));
};

// Gán gói ăn cho người dùng
exports.getGanGoiAn = async (req, res, next) => {
  try {
    const [users] = await nguoiDung.fetchAll();
    const [packages] = await mealPackage.fetchAll();
    res.render("admin/gan-goi-an", {
      users,
      packages,
      pageTitle: "Gán gói ăn cho người dùng",
    });
  } catch (err) {
    console.error(err);
    res.redirect("/admin/users");
  }
};

exports.postGanGoiAn = async (req, res, next) => {
  const { userId, packageId, startDate } = req.body;
  try {
    // Lấy duration_days từ meal_packages
    const [pkgRows] = await mealPackage.findById(packageId);
    const totalMeals = pkgRows[0].total_meals;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + pkgRows[0].duration_days);

    await userPackage.create({
      user_id: userId,
      package_id: packageId,
      start_date: startDate,
      end_date: endDate.toISOString().slice(0, 10),
      remaining_meals: totalMeals,
    });

    // TODO: Gửi email/thông báo cho user
    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.redirect("/admin/gan-goi-an");
  }
};

// Gán món ăn vào menu tuần
exports.getGanMonVaoMenu = async (req, res, next) => {
  try {
    const [menus] = await weeklyMenu.fetchAll();
    const [meals] = await monAn.fetchAll();
    res.render("admin/gan-mon-menu", {
      menus,
      meals,
      pageTitle: "Gán món ăn vào menu tuần",
      moment,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/admin/monan");
  }
};

exports.postGanMonVaoMenu = async (req, res, next) => {
  const { menuId, meals } = req.body;
  try {
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    for (const day of days) {
      for (const slot of [1,2]) {
        const mealId = meals?.[day]?.[slot - 1];
        if (mealId) {
          await dailyMenuItem.create({
            menu_id: menuId,
            day_of_week: day,
            meal_slot: slot,
            meal_id: mealId,
          });
        }
      }
    }
    res.redirect("/admin/gan-mon-menu");
  } catch (err) {
    console.error(err);
    res.redirect("/admin/gan-mon-menu");
  }
};