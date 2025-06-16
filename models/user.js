const db = require("../util/database");

module.exports = class User {
  constructor(id, name, email, password, phone, age, gender, height, weight, goal, activity_level) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
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
        "INSERT INTO users (name, email, password, phone, age, gender, height, weight, goal, activity_level) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          this.name,
          this.email,
          this.password,
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
    return db.execute("DELETE FROM users WHERE id = ?", [id]);
  }

  static getByEmail(email) {
    return db.execute("SELECT * FROM users WHERE email = ?", [email]);
  }

  static async updateUserInfoById(user_id, email, phone, address, password) {
    return db.execute(
      "UPDATE users SET email = ?, phone = ?, address = ?, password = ? WHERE id = ?",
      [email, phone, address, password, user_id]
    );
  }
  
  static async getByEmailOrPhone(input) {
    const query = `SELECT * FROM users WHERE email = ? OR phone = ? LIMIT 1`;
    return await db.execute(query, [input, input]);
  }

  static fetchAll() {
    return db.execute("SELECT * FROM users");
  }
};
