const db = require("../util/database");

module.exports = class Guest {
  constructor(id, name, sdt, tuoi, gioitinh, chieucao, cannang, tinhchatcongviec, muctieu) {
    this.id = id;
    this.name = name;
    this.sdt = sdt;
    this.tuoi = tuoi;
    this.gioitinh = gioitinh;
    this.chieucao = chieucao;
    this.cannang = cannang;
    this.tinhchatcongviec = tinhchatcongviec;
    this.muctieu = muctieu;
  }

  save() {
      // Insert nếu chưa có id
      return db.execute(
        "INSERT INTO guest (name, sdt, tuoi, gioitinh, chieucao, cannang, tinhchatcongviec, muctieu) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          this.name,
          this.sdt,
          this.tuoi,
          this.gioitinh,
          this.chieucao,
          this.cannang,
          this.tinhchatcongviec,
          this.muctieu
        ]
      );
  }

  static xoaMonKhoiData(id) {
    return db.execute("DELETE FROM cacmonan WHERE id = ?", [id]);
  }

  static fetchAll() {
    return db.execute("SELECT * FROM cacmonan");
  }
};
