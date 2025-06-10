const path = require("path");

const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const errorController = require("./controllers/error");
const mainRoute = require("./routes/mainRoutes");
const adminRoute = require("./routes/adminRoutes");
const userRoute = require("./routes/userRoutes");

const app = express();

const options = {
  host: "103.151.239.67",
  port: 3306,
  user: "admin",
  password: "Haynhoko123@",
  database: "dietdeli-test2",
  connectTimeout: 15000,
};
const sessionStore = new MySQLStore(options);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "diet deli secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    maxAge: 1000 * 60 * 15 // 15 phút
  })
);

app.use("/", mainRoute);
app.use("/admin", adminRoute);
app.use("/user", userRoute);

app.use(errorController.get404);

app.listen(2000);
