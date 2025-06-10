const db = require('../util/database');
module.exports = class WeeklyMenu {
  static fetchAll() {
    return db.execute('SELECT * FROM weekly_menus');
  }
};