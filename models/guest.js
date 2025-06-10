const db = require("../util/database");

module.exports = class Guest {
  constructor(id, phone, age, gender, height, weight, goal, activity_level) {
    this.id = id;
    this.phone = phone;
    this.age = age;
    this.gender = gender;
    this.height = height;
    this.weight = weight;
    this.goal = goal;
    this.activity_level = activity_level;
  }

  save() {
      // Insert nếu chưa có id
      return db.execute(
        "INSERT INTO guests (phone, age, gender, height, weight, goal, activity_level) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          this.phone,
          this.age,
          this.gender,
          this.height,
          this.weight,
          this.goal,
          this.activity_level
        ]
      );
  }

  static xoaMonKhoiData(id) {
    return db.execute("DELETE FROM guests WHERE id = ?", [id]);
  }

  static fetchAll() {
    return db.execute("SELECT * FROM guests");
  }
};
