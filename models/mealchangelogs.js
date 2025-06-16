const db = require("../util/database");

module.exports = class MealChangeLog {
    static create({user_meal_selection_id, change_type}) {
        return db.execute(
            "INSERT INTO meal_change_logs (user_meal_selection_id, change_type) VALUES (?, ?)",
            [user_meal_selection_id, change_type]
        );
    };

    static async findLatestLogsForSelectionIds(selectionIds) {
        if (!selectionIds.length) return [];

        const placeholders = selectionIds.map(() => '?').join(',');
        const sql = `
            SELECT ml.*
            FROM meal_change_logs ml
            INNER JOIN (
                SELECT user_meal_selection_id, MAX(changed_at) AS latest
                FROM meal_change_logs
                WHERE user_meal_selection_id IN (${placeholders})
                GROUP BY user_meal_selection_id
            ) latest_logs ON ml.user_meal_selection_id = latest_logs.user_meal_selection_id
                        AND ml.changed_at = latest_logs.latest
        `;

        return db.execute(sql, selectionIds);
    }
}