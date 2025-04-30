const path = require('path');

const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
    res.render('index', { pageTitle: 'Diet Deli - Ăn kiêng thật dễ dàng'});
});

app.get('/vechungtoi', (req, res, nexzt) => {
    res.render('vechungtoi', { pageTitle: 'Về chúng tôi'});
});

app.get('/baomatthongtin', (req, res, nexzt) => {
    res.render('baomatthongtin', { pageTitle: 'Chính sách bảo mật thông tin'});
});

app.get('/chinhsachchung', (req, res, nexzt) => {
    res.render('chinhsachchung', { pageTitle: 'Chính sách và quy định chung'});
});

app.get('/chinhsachgiaohang', (req, res, nexzt) => {
    res.render('chinhsachgiaohang', { pageTitle: 'Chính sách vận chuyển và giao hàng'});
});

app.get('/moitruong', (req, res, nexzt) => {
    res.render('moitruong', { pageTitle: 'Môi trường'});
});

app.get('/muatheonhom', (req, res, nexzt) => {
    res.render('muatheonhom', { pageTitle: 'Mua theo nhóm'});
});

app.get('/quydinhthanhtoan', (req, res, nexzt) => {
    res.render('quydinhthanhtoan', { pageTitle: 'Quy định thanh toán'});
});

app.get('/faqs', (req, res, nexzt) => {
    res.render('faqs', { pageTitle: 'Những câu hỏi thường gặp'});
});

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})


app.listen(3000);