const db = require("../util/database");
const moment = require("moment");

module.exports = class UserMealSelection {
    static create({
        user_id,
        user_package_id,
        meal_date,
        selected_slot,
        selected_meal_slot1,
        selected_meal_slot2,
    }) {
        // Insert into user_meal_selections first
        return db.execute(
            "INSERT INTO user_meal_selections (user_id, user_package_id, meal_date, selected_slot, selected_meal_slot1, selected_meal_slot2, status) VALUES (?, ?, ?, ?, ?, ?, 'ordered')",
            [
                user_id,
                user_package_id,
                meal_date,
                selected_slot,
                selected_meal_slot1,
                selected_meal_slot2,
            ]
        );
        // Return the created record's ID, or anything you need
    }

    static updateByUserIdAndDate({
        user_id,
        meal_date,
        selected_slot,
        selected_meal_slot1,
        selected_meal_slot2,
        status,
    }) {
        return db.execute(
            "UPDATE user_meal_selections SET selected_slot=?, selected_meal_slot1=?, selected_meal_slot2=?, status=? WHERE meal_date=? AND user_id=?",
            [
                selected_slot,
                selected_meal_slot1,
                selected_meal_slot2,
                status,
                meal_date,
                user_id,
            ]
        );
    }


    static findByUserId(user_id) {
        return db.execute(
            "SELECT * FROM user_meal_selections WHERE user_id = ? ORDER BY meal_date DESC",
            [user_id]
        );
    }

    static findById(id) {
        return db.execute("SELECT * FROM user_meal_selections WHERE id = ?", [
            id,
        ]);
    }

    static async updateById(id, data) {
        await db.execute(
            "UPDATE user_meal_selections SET selected_meal_slot1=?, selected_meal_slot2=? WHERE id=?",
            [data.selected_meal_slot1, data.selected_meal_slot2, id]
        );
        return;
    }

    static deleteById = (id) =>
        db.execute("DELETE FROM user_meal_selections WHERE id=?", [id]);

    static async updateStatusCanceledbyId(id) {
        db.execute(
            "UPDATE user_meal_selections SET status = 'canceled' WHERE id=?",
            [
                id
            ]
        );
        return;
    }

    static findByUserIdAndDate = (user_id, meal_date) =>
        db.execute(
            "SELECT * FROM user_meal_selections WHERE user_id=? AND meal_date=?",
            [user_id, meal_date]
        );

    static findWeeksByUserId(user_id) {
        return db.execute(
            `SELECT wm.week_start_date
         FROM user_meal_selections ums
         JOIN weekly_menus wm
           ON ums.meal_date BETWEEN wm.week_start_date AND DATE_ADD(wm.week_start_date, INTERVAL 5 DAY)
         WHERE ums.user_id = ?
         GROUP BY wm.week_start_date
         ORDER BY wm.week_start_date DESC`,
            [user_id]
        );
    }

    static findByUserIdAndWeek(user_id, week_start_date) {
        return db.execute(
            `SELECT ums.*, wm.week_start_date
         FROM user_meal_selections ums
         JOIN weekly_menus wm
           ON ums.meal_date BETWEEN wm.week_start_date AND DATE_ADD(wm.week_start_date, INTERVAL 5 DAY)
         WHERE ums.user_id = ? AND wm.week_start_date = ?
         ORDER BY ums.meal_date ASC`,
            [user_id, week_start_date]
        );
    }
};
