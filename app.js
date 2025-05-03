const path = require('path');

const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
    res.render('index', { pageTitle: 'Diet Deli - Ăn kiêng thật dễ dàng'});
});

app.get('/vechungtoi', (req, res, next) => {
    res.render('vechungtoi', { pageTitle: 'Về chúng tôi'});
});

app.get('/baomatthongtin', (req, res, next) => {
    res.render('baomatthongtin', { pageTitle: 'Chính sách bảo mật thông tin'});
});

app.get('/chinhsachchung', (req, res, next) => {
    res.render('chinhsachchung', { pageTitle: 'Chính sách và quy định chung'});
});

app.get('/chinhsachgiaohang', (req, res, next) => {
    res.render('chinhsachgiaohang', { pageTitle: 'Chính sách vận chuyển và giao hàng'});
});

app.get('/moitruong', (req, res, next) => {
    res.render('moitruong', { pageTitle: 'Môi trường'});
});

app.get('/muatheonhom', (req, res, next) => {
    res.render('muatheonhom', { pageTitle: 'Mua theo nhóm'});
});

app.get('/quydinhthanhtoan', (req, res, next) => {
    res.render('quydinhthanhtoan', { pageTitle: 'Quy định thanh toán'});
});

app.get('/faqs', (req, res, next) => {
    res.render('faqs', { pageTitle: 'Những câu hỏi thường gặp'});
});

app.get('/baogia', (req, res, next) => {
    res.render('baogia', { pageTitle: 'Báo giá'});
});

app.get('/baogiatest', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'views', 'baogia.html'));
});


app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})


app.listen(3000);