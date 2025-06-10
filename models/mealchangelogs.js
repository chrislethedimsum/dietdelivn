const db = require("../util/database");

module.exports = class MealChangeLog {
    static create({user_meal_selection_id, change_type}) {
        return db.execute(
            "INSERT INTO meal_change_logs (user_meal_selection_id, change_type) VALUES (?, ?)",
            [user_meal_selection_id, change_type]
        );
    };
}