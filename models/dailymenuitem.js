const db = require("../util/database");
module.exports = class DailyMenuItem {
    static create({ menu_id, day_of_week, meal_slot, meal_id }) {
        return db.execute(
            "INSERT INTO daily_menu_items (menu_id, day_of_week, meal_slot, meal_id) VALUES (?, ?, ?, ?)",
            [menu_id, day_of_week, meal_slot, meal_id]
        );
    }
    static findByMenuId(menu_id) {
        return db.execute(
            `SELECT d.*, m.name AS meal_name, m.description AS meal_description, m.image as meal_image
       FROM daily_menu_items d 
       JOIN meals m ON d.meal_id = m.id 
       WHERE d.menu_id = ?`,
            [menu_id]
        );
    }
};
