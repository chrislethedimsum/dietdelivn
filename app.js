const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mainRoute = require('./routes/mainRoutes');
const adminRoute = require('./routes/adminRoutes');

const db = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', mainRoute);
app.use('/admin', adminRoute);
app.use(errorController.get404);


app.listen(2000);