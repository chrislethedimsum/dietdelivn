# 🥗 Diet Deli - Web Application

> **"Ăn kiêng thật dễ dàng"** — Website giới thiệu dịch vụ, tư vấn dinh dưỡng và cung cấp các gói ăn kiêng/eat clean tiện lợi hàng ngày.

---

## 📖 Giới thiệu (Overview)

**Diet Deli** là nền tảng web phục vụ khách hàng có nhu cầu ăn uống lành mạnh, giảm cân, tăng cơ hoặc duy trì vóc dáng. Dự án được xây dựng trên nền tảng **Node.js** và **Express**, sử dụng **EJS** làm template engine để kết xuất giao diện động nhanh chóng, thân thiện với người dùng và tối ưu hiển thị trên mọi thiết bị.

---

## ✨ Tính năng chính (Key Features)

- 🏠 **Trang chủ & Menu:** Giới thiệu thương hiệu, thông điệp dinh dưỡng và danh mục các món ăn lành mạnh.
- 🧮 **Báo giá & Dự toán:** Công cụ hỗ trợ khách hàng tính toán chi phí, tham khảo các gói ăn theo ngày/tuần/tháng.
- 👥 **Mua theo nhóm:** Chính sách và ưu đãi dành riêng cho đặt món theo nhóm, doanh nghiệp/văn phòng.
- 🌿 **Cam kết môi trường:** Chia sẻ giải pháp bao bì thân thiện (hộp bã mía tự hủy sinh học).
- ❓ **Hỏi đáp & Chính sách minh bạch:** Hệ thống trang FAQs, Quy định thanh toán, Chính sách giao hàng và Bảo mật thông tin khách hàng.
- 📱 **Giao diện Responsive:** Tối ưu trải nghiệm liền mạch trên cả điện thoại (Mobile), máy tính bảng (Tablet) và máy tính để bàn (Desktop).

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

| Lớp (Layer) | Công nghệ / Thư viện |
| :--- | :--- |
| **Runtime & Core** | [Node.js](https://nodejs.org/) (>= 16.x) |
| **Backend Framework** | [Express.js](https://expressjs.com/) (v5.x) |
| **Template Engine** | [EJS](https://ejs.co/) |
| **Middleware & Parser** | `body-parser` |
| **Frontend & UI** | HTML5, CSS3, JavaScript, Bootstrap, jQuery, FontAwesome |
| **Dev Tooling** | [Nodemon](https://nodemon.io/) |

---

## 📁 Cấu trúc thư mục (Project Structure)

```text
DietDeli NodeJs/
├── app.js                 # Entry point khởi tạo Express server và định tuyến
├── package.json           # Danh sách dependencies và npm scripts
├── package-lock.json      # Khóa phiên bản dependencies
├── public/                # Tài nguyên tĩnh phục vụ client
│   ├── css/               # File định kiểu CSS (Bootstrap, tùy chỉnh, animation)
│   ├── js/                # Client-side JavaScript (jQuery, carousel, sliders)
│   ├── images/            # Hình ảnh banner, sản phẩm, bài viết
│   └── webfonts/          # Bộ font và icon FontAwesome
├── routes/                # Module định tuyến (routes)
│   └── webpage.js
├── util/                  # Helper utilities / Path resolver
│   └── path.js
└── views/                 # Giao diện EJS Templates
    ├── includes/          # Header, footer, navbar dùng chung
    ├── index.ejs          # Trang chủ
    ├── baogia.ejs         # Trang báo giá
    ├── vechungtoi.ejs     # Trang giới thiệu
    ├── faqs.ejs           # Câu hỏi thường gặp
    └── ...                # Các trang chính sách & 404
```

---

## 🚀 Hướng dẫn cài đặt & Chạy ứng dụng (Getting Started)

### 1. Yêu cầu hệ thống (Prerequisites)
- [Node.js](https://nodejs.org/) (khuyến nghị phiên bản LTS từ v18 trở lên)
- Trình quản lý gói `npm` (đi kèm Node.js)

### 2. Cài đặt các gói phụ thuộc (Dependencies)
Mở terminal tại thư mục dự án và chạy:

```bash
npm install
```

### 3. Khởi chạy ứng dụng

* **Chế độ phát triển (Development mode với Nodemon tự reload khi code thay đổi):**
  ```bash
  npm start
  ```
* **Chế độ thông thường:**
  ```bash
  node app.js
  ```

### 4. Truy cập website
Mở trình duyệt web và điều hướng tới:
```text
http://localhost:3000
```

---

## 🌐 Danh sách Route chính (Key Endpoints)

| Đường dẫn (URL) | Mô tả trang |
| :--- | :--- |
| `/` | Trang chủ Diet Deli |
| `/vechungtoi` | Giới thiệu câu chuyện thương hiệu & sứ mệnh |
| `/baogia` | Báo giá chi tiết các gói ăn |
| `/muatheonhom` | Chính sách đặt món theo nhóm |
| `/moitruong` | Dự án bao bì xanh & bảo vệ môi trường |
| `/faqs` | Các câu hỏi thường gặp |
| `/chinhsachgiaohang` | Quy định vận chuyển và khu vực giao hàng |
| `/quydinhthanhtoan` | Phương thức & hướng dẫn thanh toán |
| `/baomatthongtin` | Chính sách quyền riêng tư & bảo mật dữ liệu |

---

## 📄 Bản quyền (License)

Dự án thuộc sở hữu của **Diet Deli**. Mọi quyền được bảo lưu.

