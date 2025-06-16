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
const mealChangeLog = require("../models/mealchangelogs");
const bcrypt = require("bcryptjs");
const { sendEmail } = require('../util/email');



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
        let meal_package = null;
        let structuredWeek = [];

        if (user_package) {
            const [meal_package_data] = await mealPackage.findById(user_package.package_id);
            meal_package = meal_package_data[0];
            // Tính ngày bắt đầu tuần hiện tại (thứ 2)
            const weekStart = moment().startOf("isoWeek");
            const weekStartStr = weekStart.format("YYYY-MM-DD");

            // Lấy các đơn đặt món trong tuần hiện tại
            const [userOrdersInWeek] = await userMealSelection.findByUserIdAndWeek(
                req.session.user.id,
                weekStartStr
            );

            // Build structuredWeek từ thứ 2 đến thứ 7

            for (let i = 0; i < 6; i++) {
                const day = moment(weekStart).add(i, "days");
                const dateStr = day.format("YYYY-MM-DD");
                const order = userOrdersInWeek.find((o) => moment(o.meal_date).format("YYYY-MM-DD") === dateStr);

                const isBeforeStart = day.isBefore(moment(user_package.start_date), "day");
                const isAfterEnd = day.isAfter(moment(user_package.end_date), "day");

                let meals = [];
                    if (order) {
                        if (["1", "both"].includes(order.selected_slot) && order.meal_slot1_name) {
                        meals.push(order.meal_slot1_name);
                    }
                    if (["2", "both"].includes(order.selected_slot) && order.meal_slot2_name) {
                        meals.push(order.meal_slot2_name);
                    }
                }

                const now = moment();
                
                const isWeekendBatchTime =
                    (now.isoWeekday() === 6 && now.hour() >= 12 && now.minute() >= 30) || // Thứ 7 sau 12:30
                    (now.isoWeekday() === 7 && now.hour() < 12);       


                const canEdit =
                    !isBeforeStart &&
                    !isAfterEnd &&
                    (
                        (
                        day.isAfter(now, "day") &&
                        now.isBefore(moment(day).subtract(1, "day").set({ hour: 12, minute: 0 }))
                        )
                        || isWeekendBatchTime
                );

                structuredWeek.push({
                    date: dateStr,
                    weekday: day.format("dddd"),
                    meals: meals.length ? meals : null,
                    status: order ? order.status : null,
                    canEdit,
                    outsidePackageStart: isBeforeStart,
                    outsidePackageEnd: isAfterEnd,
                });
            }
        } else {
            const weekStart = moment().startOf("isoWeek");
            structuredWeek = Array.from({ length: 6 }, (_, i) => {
                const day = moment(weekStart).add(i, "days");
                return {
                date: day.format("YYYY-MM-DD"),
                weekday: day.format("dddd"),
                meals: null,
                status: null,
                canEdit: false,
                outsidePackageStart: true,
                outsidePackageEnd: false,
                };
            });
        }
        

        const enrichedWeeks = await Promise.all(weeks_data.map(async (week) => {
            const [days] = await userMealSelection.findByUserIdAndWeek(
                req.session.user.id,
                moment(week.week_start_date).format("YYYY-MM-DD")
            );

            const orderedDays = days.length;

            const slotToCount = (slot) => {
                if (slot === "both") return 2;
                if (slot === "1" || slot === "2") return 1;
                return 0;
            };

            const delivered_meals = days
                .filter(d => d.status === "delivered")
                .reduce((sum, d) => sum + slotToCount(d.selected_slot), 0);

            const total_valid_meals = days
                .filter(d => d.status !== "canceled")
                .reduce((sum, d) => sum + slotToCount(d.selected_slot), 0);

            const deliveredMealNames = [];
            const orderedWeekdays = days
                .filter(d => d.status !== "canceled")
                .map(d => moment(d.meal_date).locale('vi').format("dddd"));

            days
                .filter(d => d.status === "delivered")
                .forEach(d => {
                if (d.meal_slot1_name) deliveredMealNames.push(d.meal_slot1_name);
                if (d.meal_slot2_name) deliveredMealNames.push(d.meal_slot2_name);
                });

            return {
                ...week,
                delivered_meals,
                ordered_days: orderedDays,
                total_valid_meals,
                meal_names: [...new Set(deliveredMealNames)],
                ordered_weekdays: [...new Set(orderedWeekdays)], // loại trùng
            };
        }));

        res.render("user/account", {
            pageTitle: "Tài khoản",
            isAuthenticated: req.session.isLoggedIn,
            user: req.session.user,
            weeks,
            weeks_data,
            moment,
            user_package,
            meal_package,
            structuredWeek,
            capitaliseVN,
            weeks_data: enrichedWeeks,
        });
    } catch (err) {
        console.error(err);
        res.redirect("/user/account");
    }
};

exports.getInfoEditPage = async (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/user/login");
    }
    const userId = req.params.userId;
    try {
        res.render("user/infoedit", {
            pageTitle: "Sửa thông tin",
            isAuthenticated: req.session.isLoggedIn,
            user: req.session.user,
        });
    } catch (err) {
        console.error(err);
        return res.redirect("/user/account");
    }
}

exports.postInfoEditPage = async (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/user/login");
    }

    const userId = req.session.user.id;
    const { email, phone, address, password, repassword } = req.body;

    try {
      let hashedPassword = req.session.user.password;
      if (password && password !== req.session.user.password) {
          if (password !== repassword) {
              return res.status(400).json({
                  success: false,
                  message: "Mật khẩu và xác nhận mật khẩu không khớp.",
              });
          }
          hashedPassword = await bcrypt.hash(password, 10);
      }

      await User.updateUserInfoById(userId, email, phone, address, hashedPassword);

      req.session.user.email = email;
      req.session.user.phone = phone;
      req.session.user.address = address;
      req.session.user.password = hashedPassword;

      return res.json({ success: true });
    } catch (err) {
        console.error("Lỗi cập nhật thông tin người dùng:", err);
        return res.status(500).json({
            success: false,
            message: "Lỗi cập nhật thông tin, vui lòng thử lại sau.",
        });
    }
};

exports.postLoginPage = async (req, res, next) => {
    const { email, password, token } = req.body; // `email` có thể là email hoặc phone
    const secret = "ES_26ac6b49ca2248bdab0cd14baa743aea";

    try {
        // ✅ Xác minh hCaptcha
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
        }

        // ✅ Tìm user theo email **hoặc** phone
        const [rows] = await User.getByEmailOrPhone(email); // ← cập nhật DB layer
        if (rows.length === 0) {
            return res.json({
                success: false,
                message: "Email hoặc số điện thoại không tồn tại",
            });
        }

        const user = rows[0];

        // ✅ So sánh mật khẩu đã hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({
                success: false,
                message: "Mật khẩu không đúng",
            });
        }

        // ✅ Đăng nhập thành công
        req.session.isLoggedIn = true;
        req.session.user = user;

        return res.json({
            success: true,
            message: "Đăng nhập thành công",
        });

    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
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
    const now = moment().tz("Asia/Ho_Chi_Minh");
    const [userPackages] = await userPackage.findActiveByUserId(req.session.user.id);
    const user_package = userPackages[0];

    const [menus] = await weeklyMenu.fetchAll();
    const menusSorted = menus.sort((a, b) =>
      new Date(a.week_start_date) - new Date(b.week_start_date)
    );

    // === CHỌN MENU PHÙ HỢP DỰA TRÊN THỨ 7 12:30 ===
    let selectedMenu = null;
    for (let i = 0; i < menusSorted.length; i++) {
      const candidate = menusSorted[i];
      const candidateStart = moment(candidate.week_start_date);
      const switchTime = candidateStart.clone().add(5, 'days').hour(12).minute(30); // Thứ 7 12:30

      if (now.isBefore(switchTime)) {
        selectedMenu = candidate;
        break;
      }
    }

    if (!selectedMenu) {
      selectedMenu = menusSorted[menusSorted.length - 1]; // fallback menu cuối cùng
    }

    const menu = selectedMenu;
    const weekStart = moment(menu.week_start_date);
    const weekStartStr = weekStart.format("YYYY-MM-DD");

    const [items] = await dailyMenuItem.findByMenuId(menu.id);
    const user_package_id = user_package.id;
    const [mealPackages] = await mealPackage.findById(user_package.package_id);
    const meals_per_day = mealPackages[0].meals_per_day;

    // === Xác định allowed time để đặt toàn bộ tuần ===
    const allowedStart = weekStart.clone().add(5, "days").hour(12).minute(30); // Thứ 7 12:30
    const allowedEnd = allowedStart.clone().add(1, "days").hour(12).minute(0); // Chủ nhật 12:00

    const [userOrdersInWeek] = await userMealSelection.findByUserIdAndWeek(
      req.session.user.id,
      weekStartStr
    );

    // === Tạo menuByDay ===
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const menuByDay = {};
    days.forEach((day) => {
      menuByDay[day] = {
        1: items.find((i) => i.day_of_week === day && i.meal_slot == 1),
        2: items.find((i) => i.day_of_week === day && i.meal_slot == 2),
      };
    });

    // === Tạo dayDates và cartFromDb ===
    const dayDates = days.map((_, idx) =>
      weekStart.clone().add(idx, "days").format("YYYY-MM-DD")
    );

    const start_date_moment = moment(user_package.start_date);

    const validMealDates = dayDates.filter((dateStr) => {
      const day = moment(dateStr, "YYYY-MM-DD");
      const isAfterStart = day.isSameOrAfter(start_date_moment, "day");

      if (day.isSame(now, "day")) {
        return now.hour() < 12;
      }

      return isAfterStart && day.isAfter(now, "day");
    });

    const cartFromDb = userOrdersInWeek
      .filter((order) => order.status === "ordered")
      .flatMap((order) => {
        const day = moment(order.meal_date).format("YYYY-MM-DD");
        if (order.selected_slot === "both") {
          return [
            { day, slot: 1, meal_id: order.selected_meal_slot1 },
            { day, slot: 2, meal_id: order.selected_meal_slot2 },
          ];
        } else {
          return [
            {
              day,
              slot: parseInt(order.selected_slot),
              meal_id:
                order.selected_slot === "1"
                  ? order.selected_meal_slot1
                  : order.selected_meal_slot2,
            },
          ];
        }
      });

    // === Tính availableDays ===
    const availableDays = days.map((dayName, index) => {
        const date = weekStart.clone().add(index, "days");
        const dateStr = date.format("YYYY-MM-DD");

        let isAvailable = false;
        const isAfterStartDate = date.isSameOrAfter(start_date_moment, "day");

        if (now.isBetween(allowedStart, allowedEnd)) {
            // Trong khung đặt món (Thứ 7 12:30 - CN 12:00) → cho đặt toàn bộ tuần
            isAvailable = isAfterStartDate;
        } else {
            // Ngoài khung → chỉ cho đặt món trước 12h trưa của ngày hôm trước
            const deadline = date.clone().subtract(1, 'days').hour(12).minute(0).second(0);
            isAvailable = isAfterStartDate && now.isBefore(deadline);
        }

        return {
            name: dayName,
            date: dateStr,
            formatted: date.format("DD/MM/YYYY"),
            isAvailable,
        };
        }).filter((d) => d.isAvailable);

    // === Render view ===
    res.render("user/datmon", {
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
      remaining_meals: user_package.remaining_meals,
      weekStartStr,
      validMealDates,
      start_date_moment,
      cartFromDb,
      availableDays,
      isAuthenticated: req.session.isLoggedIn,
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
    const user = req.session.user;

    const currentWeekStartDate = moment().tz("Asia/Ho_Chi_Minh").startOf("isoWeek").format("YYYY-MM-DD");
    const [userOrdersInWeek] = await userMealSelection.findByUserIdAndWeek(user_id, currentWeekStartDate);

    const existingMap = {};
    userOrdersInWeek.forEach(order => {
      const day = moment(order.meal_date).format("YYYY-MM-DD");
      existingMap[day] = order;
    });

    // ===== STEP 1: GROUP CART BY DAY =====
    const groupedCart = {};
    for (const item of cart) {
      const meal_date = moment(item.day).format("YYYY-MM-DD");
      if (!groupedCart[meal_date]) {
        groupedCart[meal_date] = { day: meal_date, meals: [] };
      }

      if (item.meals) {
        groupedCart[meal_date].meals = item.meals;
      } else {
        groupedCart[meal_date].meals.push({
          slot: item.slot,
          meal_id: item.meal_id
        });
      }
    }

    const updatedDays = [];

    // ===== STEP 2: PROCESS EACH DAY =====
    for (const meal_date in groupedCart) {
      const item = groupedCart[meal_date];
      const existing = existingMap[meal_date] || null;
      const meals = item.meals;

      const slot1 = meals.find(m => m.slot === 1)?.meal_id || null;
      const slot2 = meals.find(m => m.slot === 2)?.meal_id || null;

      const selected_slot = slot1 && slot2 ? "both" : slot1 ? "1" : slot2 ? "2" : null;
      if (!selected_slot) continue;

      updatedDays.push(meal_date);

      const newMealCount = selected_slot === "both" ? 2 : 1;
      const oldMealCount = existing
        ? (existing.selected_slot === "both" ? 2 : 1)
        : 0;

      if (existing) {
        await userMealSelection.updateByUserIdAndDate({
          user_id,
          meal_date,
          selected_slot,
          selected_meal_slot1: slot1,
          selected_meal_slot2: slot2,
          status: "ordered",
        });

        if (newMealCount > oldMealCount) {
          await userPackage.reduceRemainingMeals(user_id, newMealCount - oldMealCount);
        } else if (newMealCount < oldMealCount) {
          await userPackage.increaseRemainingMeals(user_id, oldMealCount - newMealCount);
        }

        await mealChangeLog.create({
          user_meal_selection_id: existing.id,
          change_type: "update",
        });
      } else {
        const [insertResult] = await userMealSelection.create({
          user_id,
          user_package_id,
          meal_date,
          selected_slot,
          selected_meal_slot1: slot1,
          selected_meal_slot2: slot2,
        });

        await userPackage.reduceRemainingMeals(user_id, newMealCount);

        await mealChangeLog.create({
          user_meal_selection_id: insertResult.insertId,
          change_type: "initial",
        });
      }
    }

    // ===== STEP 3: CANCEL DAYS NO LONGER SELECTED =====
    const updatedSet = new Set(updatedDays);
    for (const order of userOrdersInWeek) {
      const day = moment(order.meal_date).format("YYYY-MM-DD");
      if (!updatedSet.has(day) && order.status === "ordered") {
        const slotCount = order.selected_slot === "both" ? 2 : 1;

        await userMealSelection.updateStatusCanceledbyId(order.id);
        await userPackage.increaseRemainingMeals(user_id, slotCount);

        await mealChangeLog.create({
          user_meal_selection_id: order.id,
          change_type: "cancel",
        });
      }
    }

    const momentTz = require("moment-timezone");
    const daysMap = {
      "Monday": "Thứ Hai",
      "Tuesday": "Thứ Ba",
      "Wednesday": "Thứ Tư",
      "Thursday": "Thứ Năm",
      "Friday": "Thứ Sáu",
      "Saturday": "Thứ Bảy"
    };

    // Lấy lại danh sách đã đặt mới nhất sau cập nhật
    const [finalOrders] = await userMealSelection.findByUserIdAndWeek(user_id, currentWeekStartDate);

    let tableRows = "";
    for (const order of finalOrders.filter(o => o.status === "ordered")) {
      const dayName = momentTz(order.meal_date).tz("Asia/Ho_Chi_Minh").format("dddd");
      const dayVN = daysMap[dayName] || dayName;
      const dayStr = momentTz(order.meal_date).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
      const meal1 = order.meal_slot1_name || "";
      const meal2 = order.meal_slot2_name || "";

      tableRows += `
        <tr>
          <td style="padding: 6px 12px; border: 1px solid #ddd;">${dayVN}, ${dayStr}</td>
          <td style="padding: 6px 12px; border: 1px solid #ddd;">${meal1}</td>
          <td style="padding: 6px 12px; border: 1px solid #ddd;">${meal2}</td>
        </tr>`;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>🎉 Xin chúc mừng ${user.name}!</h2>
        <p>Bạn đã đặt món thành công cho tuần bắt đầu từ <strong>${moment(currentWeekStartDate).format("DD/MM/YYYY")}</strong>.</p>
        <p>Dưới đây là thực đơn của bạn:</p>
        <table style="border-collapse: collapse; width: 100%; margin-top: 10px; font-size: 14px;">
          <thead>
            <tr style="background-color: #f8f8f8;">
              <th style="padding: 8px 12px; border: 1px solid #ccc;">📅 Ngày</th>
              <th style="padding: 8px 12px; border: 1px solid #ccc;">🍽️ Món 1</th>
              <th style="padding: 8px 12px; border: 1px solid #ccc;">🥗 Món 2</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <p style="margin-top: 16px;">Chúc bạn một tuần thật ngon miệng và khỏe mạnh cùng Diet Deli! 💪</p>
        <p style="font-size: 12px; color: #888;">
          Đây là email tự động từ hệ thống Diet Deli. Vui lòng không phản hồi email này.
        </p>
      </div>
    `;

    await sendEmail(
      user.email,
      "🎉 Đặt món thành công – Cùng khám phá thực đơn của bạn nào!",
      htmlContent
    );

    res.status(200).json({ message: "Đặt món thành công!" });
  } catch (err) {
    console.error("Lỗi postDatMon:", err);
    res.status(500).json({ message: "Đặt món thất bại!" });
  }
};



exports.getOrderHistoryDetail = async (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/user/login");
    }
    try {
        const { week_start_date } = req.params;
        const [weeks_data] = await userMealSelection.findWeeksByUserId(
                req.session.user.id
            );
        const weeks = weeks_data[0];
        const [user_package_data] = await userPackage.findActiveByUserId(
            req.session.user.id
        );
        const user_package = user_package_data[0];
        const [userOrdersInWeek] = await userMealSelection.findByUserIdAndWeek(
            req.session.user.id,
            week_start_date
        );
        const selectionIds = userOrdersInWeek.map(d => d.id);
        const [changeLogs] = await mealChangeLog.findLatestLogsForSelectionIds(selectionIds);
        const changeLogMap = new Map();
        changeLogs.forEach(log => {
          changeLogMap.set(log.user_meal_selection_id, log.changed_at);
        }); 
        let structuredWeek = [];
        for (let i = 0; i < 6; i++) {
            const day = moment(week_start_date).add(i, "days");
            const dateStr = day.format("YYYY-MM-DD");
            const order = userOrdersInWeek.find((o) => moment(o.meal_date).format("YYYY-MM-DD") === dateStr);

            const isBeforeStart = day.isBefore(moment(user_package.start_date), "day");
            const isAfterEnd = day.isAfter(moment(user_package.end_date), "day");

            let meals = [];
                if (order) {
                    if (["1", "both"].includes(order.selected_slot) && order.meal_slot1_name) {
                    meals.push(order.meal_slot1_name);
                }
                if (["2", "both"].includes(order.selected_slot) && order.meal_slot2_name) {
                    meals.push(order.meal_slot2_name);
                }
            }

            const now = moment();
            
            const isWeekendBatchTime =
                (now.isoWeekday() === 6 && now.hour() >= 12 && now.minute() >= 30) || // Thứ 7 sau 12:30
                (now.isoWeekday() === 7 && now.hour() < 12);       


            const canEdit =
                !isBeforeStart &&
                !isAfterEnd &&
                (
                    (
                    day.isAfter(now, "day") &&
                    now.isBefore(moment(day).subtract(1, "day").set({ hour: 12, minute: 0 }))
                    )
                    || isWeekendBatchTime
            );

            structuredWeek.push({
                date: dateStr,
                weekday: day.format("dddd"),
                meals: meals.length ? meals : null,
                status: order ? order.status : null,
                canEdit,
                outsidePackageStart: isBeforeStart,
                outsidePackageEnd: isAfterEnd,
                changed_at: order ? changeLogMap.get(order.id) : null,
            });
        }

        res.render("user/order_history_detail", {
            pageTitle: `Chi tiết tuần ` + moment(week_start_date).format("DD/MM/YYY"),
            isAuthenticated: req.session.isLoggedIn,
            moment,
            capitaliseVN,
            structuredWeek,
            week_start_date,
        });
    } catch (err) {
        console.error(err);
        res.redirect("/user/order-history");
    }
};