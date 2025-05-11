const monAn = require("../models/monan");
const Giohang = require("../models/giohang");

exports.getMonAn = (req, res, next) => {
  monAn
    .fetchAll()
    .then(([rows, fieldData]) => {
      res.render("admin/monan", {
        monan: rows,
        pageTitle: "Tổng hợp các món ăn",
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
