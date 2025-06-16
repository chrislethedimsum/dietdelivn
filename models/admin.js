const db = require("../util/database");

module.exports = class Admin {
  static async getByEmail(email) {
    const sql = `SELECT * FROM admin WHERE email = ? LIMIT 1`;
    return await db.execute(sql, [email]);
  }
};