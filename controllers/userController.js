const User = require("../models/user");
const capitaliseVN = require("../util/capitaliseVN");
const axios = require("axios");
const querystring = require("querystring");
const weeklyMenu = require("../models/weeklymenu");
const dailyMenuItem = require("../models/dailymenuitem");
const userPackage = require("../models/userpackage");
const userMealSelection = require("../models/usermealselection");
const mealPackage = require("../models/mealpackage");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
require("moment/locale/vi");
const meal = require("../models/monan");
const mealChangeLog = require("../models/mealchangelogs");
const db = require("../util/database");
const { type } = require("os");

function isSameSelection(existing, incoming) {
  if (!existing) return false;

  if (incoming.selected_slot === "both") {
    return (
      existing.selected_slot === "both" &&
      existing.selected_meal_slot1 == incoming.selected_meal_slot1 &&
      existing.selected_meal_slot2 == incoming.selected_meal_slot2
    );
  }

  return (
    existing.selected_slot === incoming.selected_slot &&
    (incoming.selected_slot === "1"
      ? existing.selected_meal_slot1 == incoming.selected_meal_slot1
      : existing.selected_meal_slot2 == incoming.selected_meal_slot2)
  );
}

exports.getLoginPage = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect("/user/account");
    } else {
        res.render("user/login", {
            pageTitle: "Đăng nhập",
            isAuthenticated: req.session.isLoggedIn,
        });
    }
};

exports.getAccountPage = async (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/");
    } 
    try {
        const [weeks_data] = await userMealSelection.findWeeksByUserId(
            req.session.user.id
        );
        const weeks = weeks_data[0];
        const [user_package_data] = await userPackage.findActiveByUserId(
            req.session.user.id
        );
        const user_package = user_package_data[0];
        const [meal_package_data] = await mealPackage.findById(user_package.package_id);
        const meal_package = meal_package_data[0];
        res.render("user/account", {
            pageTitle: "Tài khoản",
            isAuthenticated: req.session.isLoggedIn,
            user: req.session.user,
            weeks,
            weeks_data,
            moment,
            user_package,
            meal_package,
        });
    } catch (err) {
        console.error(err);
        res.redirect("/user/account");
    }
};

exports.postLoginPage = async (req, res, next) => {
    const { email, password, token } = req.body;
    const secret = "ES_26ac6b49ca2248bdab0cd14baa743aea";
    try {
        // Xác minh hCaptcha
        const verifyURL = "https://hcaptcha.com/siteverify";
        const response = await axios.post(
            verifyURL,
            querystring.stringify({ secret, response: token }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        const data = response.data;
        if (!data.success) {
            return res.json({
                success: false,
                message: "Xác minh captcha thất bại",
            });
        } else {
            const [rows, fieldData] = await User.getByEmail(email);

            if (rows.length === 0) {
                return res.json({
                    success: false,
                    message: "Email không tồn tại",
                });
            }

            const user = rows[0];

            if (user.password !== password) {
                return res.json({
                    success: false,
                    message: "Mật khẩu không đúng",
                });
            }

            req.session.isLoggedIn = true;
            req.session.user = user;

            return res.json({
                success: true,
                message: "Đăng nhập thành công",
            });
        }
    } catch (error) {
        console.error("Server xảy ra lỗi lúc đăng nhập", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server, liên hệ với admin để sửa",
        });
    }
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    });
};
exports.getDatMon = async (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.render("user/login", {
            pageTitle: "Đăng nhập",
            isAuthenticated: false,
        });
    }

    try {
        // Xác định thời gian hiện tại
        const now = moment().tz("Asia/Ho_Chi_Minh");  // TESTING NHỚ XÓA
        // Lấy gói ăn đang active của user
        const [userPackages] = await userPackage.findActiveByUserId(
            req.session.user.id
        );
        const user_package = userPackages[0];
        //Lấy tất cả menu theo tuần
        const [menus] = await weeklyMenu.fetchAll();
        let menu = null;
        // Lọc menu hợp lệ gần nhất
        for (const currentMenu of menus.sort(
            (a, b) => new Date(a.week_start_date) - new Date(b.week_start_date)
        )) {
            const weekStart = moment(currentMenu.week_start_date);

            if (now.isSameOrAfter(weekStart, "day")) {
                menu = currentMenu; // cập nhật menu hợp lệ gần nhất
            } else {
                break; // các tuần còn lại nằm trong tương lai, bỏ qua
            }
        }
        //Lấy món ăn của menu đó
        const [items] = await dailyMenuItem.findByMenuId(menu.id);
        const user_package_id = user_package.id;
        const [mealPackages] = await mealPackage.findById(
            user_package.package_id
        );
        const meals_per_day = mealPackages[0].meals_per_day;
        let weekStart = moment(menu.week_start_date);
        const allowedStart = weekStart
            .clone()
            .add(5, "days")
            .hour(12)
            .minute(30)
            .second(0)
            .millisecond(0); // Thứ 7 12:30
        const allowedEnd = allowedStart
            .clone()
            .add(1, "days")
            .hour(12)
            .minute(0)
            .second(0)
            .millisecond(0); // Chủ nhật 12:00
        const weekStartStr = weekStart.format("YYYY-MM-DD");

        // Kiểm tra user đã đặt món trong tuần này chưa
        const [userOrdersInWeek] = await userMealSelection.findByUserIdAndWeek(
            req.session.user.id,
            weekStartStr
        );
        // Group items theo ngày và slot
        const days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        const menuByDay = {};
        days.forEach((day) => {
            menuByDay[day] = {
                1: items.find((i) => i.day_of_week === day && i.meal_slot == 1),
                2: items.find((i) => i.day_of_week === day && i.meal_slot == 2),
            };
        });
        // Tạo mảng dayDates cho từng ngày trong tuần
        const dayDates = days.map((_, idx) =>
            weekStart.clone().add(idx, "days").format("YYYY-MM-DD")
        );

        // Xác định danh sách ngày hợp lệ dựa vào start_date và now
        const start_date_moment = moment(user_package.start_date);

        const validMealDates = dayDates.filter(dateStr => {
            const day = moment(dateStr, "YYYY-MM-DD");
            const isAfterStart = day.isSameOrAfter(moment(user_package.start_date), 'day');
            const isAfterToday = day.isSameOrAfter(now, 'day');
            return isAfterStart && isAfterToday;
        });

        // Tạo mảng cart ban đầu từ dữ liệu đã đặt trong DB
        const cartFromDb = userOrdersInWeek
            .filter(order => order.status === 'ordered')
            .map(order => {
            if (order.selected_slot === "both") {
                return {
                day: moment(order.meal_date).format("YYYY-MM-DD"),
                meals: [
                    { slot: 1, meal_id: order.selected_meal_slot1 },
                    { slot: 2, meal_id: order.selected_meal_slot2 }
                ]
                };
            } else {
                return {
                day: moment(order.meal_date).format("YYYY-MM-DD"),
                slot: parseInt(order.selected_slot),
                meal_id: order.selected_slot === "1" ? order.selected_meal_slot1 : order.selected_meal_slot2
                };
            }
            });

        // Truyền thêm biến để EJS disable checkbox nếu quá hạn từng ngày
        res.render("user/datmon", {
            user_package,
            user_package_id,
            menuByDay,
            days,
            dayDates,
            now,
            allowedStart,
            allowedEnd,
            meals_per_day,
            userOrdersInWeek,
            pageTitle: "Đặt món",
            moment,
            remaining_days: user_package.remaining_days,
            weekStartStr,
            validMealDates,
            start_date_moment,
            cartFromDb,
        });
    } catch (err) {
        console.error(err);
        res.redirect("/");
    }
};

exports.postDatMon = async (req, res) => {
  try {
    const { cart, user_package_id } = req.body;
    const user_id = req.session.user.id;

    const currentWeekStartDate = moment()
      .tz("Asia/Ho_Chi_Minh")
      .startOf("isoWeek")
      .format("YYYY-MM-DD");

    const [userOrdersInWeek] = await userMealSelection.findByUserIdAndWeek(
      user_id,
      currentWeekStartDate
    );

    for (const item of cart) {
      const meal_date = item.day;
      const [result] = await userMealSelection.findByUserIdAndDate(user_id, meal_date);
      const existing = result[0] || null;

      if (item.meals) {
        const slot1 = item.meals.find(m => m.slot === 1)?.meal_id || null;
        const slot2 = item.meals.find(m => m.slot === 2)?.meal_id || null;

        const incoming = {
          selected_slot: "both",
          selected_meal_slot1: slot1,
          selected_meal_slot2: slot2
        };

        if (existing) {
          if (!isSameSelection(existing, incoming)) {
            await userMealSelection.updateByUserIdAndDate({
              user_id,
              meal_date,
              ...incoming,
              status: "ordered"
            });

            await mealChangeLog.create({
              user_meal_selection_id: existing.id,
              change_type: "update"
            });
          }
        } else {
          const [insertResult] = await userMealSelection.create({
            user_id,
            user_package_id,
            meal_date,
            ...incoming
          });

          await mealChangeLog.create({
            user_meal_selection_id: insertResult.insertId,
            change_type: "initial"
          });
        }
      } else {
        const slot = item.slot;
        const meal_id = item.meal_id;
        const slot1 = slot === 1 ? meal_id : null;
        const slot2 = slot === 2 ? meal_id : null;

        const incoming = {
          selected_slot: slot.toString(),
          selected_meal_slot1: slot1,
          selected_meal_slot2: slot2
        };

        if (existing) {
          if (!isSameSelection(existing, incoming)) {
            await userMealSelection.updateByUserIdAndDate({
              user_id,
              meal_date,
              ...incoming,
              status: "ordered"
            });

            await mealChangeLog.create({
              user_meal_selection_id: existing.id,
              change_type: "reselect"
            });
          }
        } else {
          const [insertResult] = await userMealSelection.create({
            user_id,
            user_package_id,
            meal_date,
            ...incoming
          });

          await mealChangeLog.create({
            user_meal_selection_id: insertResult.insertId,
            change_type: "initial"
          });
        }
      }
    }

    const daysInCart = cart.map(item => item.day);

    for (const existingOrder of userOrdersInWeek) {
      const orderDate = moment(existingOrder.meal_date).format("YYYY-MM-DD");
      const isStillSelected = daysInCart.includes(orderDate);

      if (!isStillSelected && existingOrder.status === "ordered") {
        await userMealSelection.updateStatusCanceledbyId(existingOrder.id);
        await mealChangeLog.create({
          user_meal_selection_id: existingOrder.id,
          change_type: "cancel"
        });
      }
    }

    res.status(200).json({ message: "Đặt món thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Đặt món thất bại!" });
  }
};

exports.getOrderHistory = async (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/user/login");
    }
    try {
        // Lấy tất cả user_meal_selection của user, group theo week_start_date
        const [weeks] = await userMealSelection.findWeeksByUserId(
            req.session.user.id
        );

        res.render("user/order_history", {
            pageTitle: "Lịch sử đặt món",
            isAuthenticated: req.session.isLoggedIn,
            weeks, // [{ week_start_date: '2024-05-13' }, ...]
            moment,
            capitaliseVN,
        });
    } catch (err) {
        console.error(err);
        res.redirect("/user/account");
    }
};
exports.getOrderHistoryDetail = async (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/user/login");
    }
    const { week_start_date } = req.params;
    try {
        // Lấy các order của user trong tuần này
        const [orders] = await userMealSelection.findByUserIdAndWeek(
            req.session.user.id,
            week_start_date
        );

        // Lấy changed_at mới nhất cho từng order
        for (const order of orders) {
            if (order.selected_meal_slot1) {
                const [meal1] = await meal.findById(order.selected_meal_slot1);
                order.meal1 = meal1[0];
            }
            if (order.selected_meal_slot2) {
                const [meal2] = await meal.findById(order.selected_meal_slot2);
                order.meal2 = meal2[0];
            }

            // Lấy changed_at mới nhất từ meal_change_logs
            const [changeLog] = await db.query(
                `SELECT MAX(changed_at) AS latest_changed_at 
                 FROM meal_change_logs 
                 WHERE user_meal_selection_id = ?`,
                [order.id]
            );
            order.changed_at = changeLog[0].latest_changed_at || order.created_at;

            // Kiểm tra quyền sửa/xóa
            const mealDate = moment.tz(order.meal_date, "YYYY-MM-DD", "Asia/Ho_Chi_Minh");
            const cutoff = mealDate.clone().subtract(1, "days").hour(12).minute(0);
            const now = moment();
            order.canEditDelete = now.isBefore(cutoff);
        }
        console.log("Orders for week:", orders);
        const isCurrentWeek = moment()
            .tz("Asia/Ho_Chi_Minh")
            .isBetween(
                moment.tz(week_start_date, "YYYY-MM-DD", "Asia/Ho_Chi_Minh"),
                moment.tz(week_start_date, "YYYY-MM-DD", "Asia/Ho_Chi_Minh").clone().add(6, "days"),
                null,
                "[]"
            );

        res.render("user/order_history_detail", {
            pageTitle: `Chi tiết tuần ${week_start_date}`,
            isAuthenticated: req.session.isLoggedIn,
            orders,
            week_start_date,
            moment,
            capitaliseVN,
            isCurrentWeek,
        });
    } catch (err) {
        console.error(err);
        res.redirect("/user/order-history");
    }
};