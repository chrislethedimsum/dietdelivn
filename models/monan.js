const giohang = require("./giohang");
const db = require("../util/database");

module.exports = class monAn {
  constructor(id, name, image, description, servingsize, carb, protein, fat) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.description = description;
    this.servingsize = servingsize;
    this.carb = carb;
    this.protein = protein;
    this.fat = fat;
  }

  save() {
    if (this.id) {
      // Update nếu có id
      return db.execute(
        `UPDATE cacmonan SET name = ?, image = ?, description = ?, servingsize = ?, carb = ?, protein = ?, fat = ? WHERE id = ?`,
        [
          this.name,
          this.image,
          this.description,
          this.servingsize,
          this.carb,
          this.protein,
          this.fat,
          this.id,
        ]
      );
    } else {
      // Insert nếu chưa có id
      return db.execute(
        "INSERT INTO cacmonan (name, image, description, servingsize, carb, protein, fat) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          this.name,
          this.image,
          this.description,
          this.servingsize,
          this.carb,
          this.protein,
          this.fat,
        ]
      );
    }
  }

  static xoaMonKhoiData(id) {
    return db.execute("DELETE FROM cacmonan WHERE id = ?", [id]);
  }

  static fetchAll() {
    return db.execute("SELECT * FROM cacmonan");
  }

  static findById(id) {
    return db
      .execute("SELECT * FROM cacmonan WHERE id = ?", [id])
      .then(([rows, fields]) => {
        if (rows.length > 0) {
          const mon = rows[0];
          return new monAn(
            mon.id,
            mon.name,
            mon.image,
            mon.description,
            mon.servingsize,
            mon.carb,
            mon.protein,
            mon.fat
          );
        } else {
          throw new Error("Không tìm thấy món ăn.");
        }
      });
  }
};
