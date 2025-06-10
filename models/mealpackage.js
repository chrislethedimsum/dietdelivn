const db = require("../util/database");

module.exports = class mealPackage {
    constructor(
        id,
        name,
        calories_per_meal,
        meals_per_day,
        duration_days,
        price
    ) {
        this.id = id;
        this.name = name;
        this.calories_per_meal = calories_per_meal;
        this.meals_per_day = meals_per_day;
        this.duration_days = duration_days;
        this.price = price;
    }

    static fetchAll() {
        return db.execute("SELECT * FROM meal_packages");
    }
    static findById(id) {
        return db.execute("SELECT * FROM meal_packages WHERE id = ?", [id]);
    }
};
