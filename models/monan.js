const giohang = require("./giohang");
const db = require("../util/database");

module.exports = class monAn {
  constructor(id, name, image, description) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.description = description;
  }

  save() {
    if (this.id) {
      // Update nếu có id
      return db.execute(
        `UPDATE meals SET name = ?, image = ?, description = ? WHERE id = ?`,
        [
          this.name,
          this.image,
          this.description,
        ]
      );
    } else {
      // Insert nếu chưa có id
      return db.execute(
        "INSERT INTO meals (name, image, description) VALUES (?, ?, ?)",
        [
          this.name,
          this.image,
          this.description,
        ]
      );
    }
  }

  static xoaMonKhoiData(id) {
    return db.execute("DELETE FROM meals WHERE id = ?", [id]);
  }

  static fetchAll() {
    return db.execute("SELECT * FROM meals");
  }

  static findById(id) {
    return db
      .execute("SELECT * FROM meals WHERE id = ?", [id]);
  }
};
