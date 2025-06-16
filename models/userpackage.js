const db = require("../util/database");

module.exports = class UserPackage {
    constructor(
        id,
        user_id,
        package_id,
        start_date,
        end_date,
        remaining_days,
        is_active
    ) {
        this.id = id;
        this.user_id = user_id;
        this.package_id = package_id;
        this.start_date = start_date;
        this.end_date = end_date;
        this.remaining_days = remaining_days;
        this.is_active = is_active;
    }

    static create({
        user_id,
        package_id,
        start_date,
        end_date,
        remaining_days,
    }) {
        return db.execute(
            "INSERT INTO user_packages (user_id, package_id, start_date, end_date, remaining_days) VALUES (?, ?, ?, ?, ?)",
            [user_id, package_id, start_date, end_date, remaining_days]
        );
    }

    static fetchAll() {
        return db.execute("SELECT * FROM user_packages");
    }

    static findActiveByUserId(user_id) {
        return db.execute(
            "SELECT * FROM user_packages WHERE user_id = ? AND is_active = 1 LIMIT 1",
            [user_id]
        );
    }

    static reduceRemainingMeals(user_id, meals) {
        return db.execute(
            "UPDATE user_packages SET remaining_meals = remaining_meals - ? WHERE user_id = ? AND is_active = 1",
            [meals, user_id]
        );
    }

    static increaseRemainingMeals(user_id, meals) {
        return db.execute(
            "UPDATE user_packages SET remaining_meals = remaining_meals + ? WHERE user_id = ? AND is_active = 1",
            [meals, user_id]
        );
    }
    
};
