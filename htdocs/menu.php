<?php
session_start();
$today = date('N');
include_once('meal.php');
// AJAX Logic for Adding/Removing Meals
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['ajax_add_to_cart'])) {
        $mealName = $_POST['meal_name'];
        $day = $_POST['day'];

        if (!isset($_SESSION['cart'])) $_SESSION['cart'] = [];

        // Add meal if not already in the cart
        $isDuplicate = false;
        foreach ($_SESSION['cart'] as $item) {
            if ($item['meal'] === $mealName && $item['day'] === $day) {
                $isDuplicate = true;
                break;
            }
        }

        if (!$isDuplicate) {
            $_SESSION['cart'][] = ['meal' => $mealName, 'day' => $day];
        }

        echo json_encode($_SESSION['cart']);
        exit;
    }

    if (isset($_POST['ajax_remove_from_cart'])) {
        $mealName = $_POST['meal_name'];
        $day = $_POST['day'];

        foreach ($_SESSION['cart'] as $key => $item) {
            if ($item['meal'] === $mealName && $item['day'] === $day) {
                unset($_SESSION['cart'][$key]);
            }
        }
        $_SESSION['cart'] = array_values($_SESSION['cart']);
        echo json_encode($_SESSION['cart']);
        exit;
    }
}
    
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Menu - Diet Deli</title>
    <link rel="icon" type="image/png" href="assets/images/favicon.png" />
    <link rel="stylesheet" href="assets/css/bootstrap.min.css" />
    <link rel="stylesheet" href="assets/css/owl.carousel.min.css" />
    <link rel="stylesheet" href="assets/css/all.min.css" />
    <link rel="stylesheet" href="assets/css/aos.css" />
    <link rel="stylesheet" href="assets/css/jquery.fancybox.min.css" />
    <link rel="stylesheet" href="assets/css/nouislider.min.css" />
    <link rel="stylesheet" href="assets/css/nice-select.css" />
    <link rel="stylesheet" href="assets/css/style.css" />
</head>
<body>
    <!-- Preloader start-->
    <div id="preloader">
        <div class="preloader">
            <span></span>
            <span></span>
        </div>
    </div>
    <!-- Preloader end  -->
    <!-- Header Start -->
    <header class="header">
        <div class="primary-navigation sticky-header">
            <div class="container">
                <nav class="navbar navbar-expand-md  navbar-light">
                    <a class="navbar-brand pl-5" href="index.html"><img src="assets/images/logo.png" alt="BrandNav"></a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item active">
                                <a class="nav-link" href="index.html">Trang chủ</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="about.html">Về chúng tôi</a>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    Đặt hàng
                                    <i class="fas fa-angle-down"></i>
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a class="dropdown-item" href="services.html">Báo giá sản phẩm</a></li>
                                    <li><a class="dropdown-item" href="register.html">Đơn hàng đặc biệt</a></li>
                                </ul>
                            </li>
                            <!--
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    Pages
                                    <i class="fas fa-angle-down"></i>
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a class="dropdown-item" href="services.html">Services</a></li>
                                    <li><a class="dropdown-item" href="register.html">Sign Up</a></li>
                                    <li><a class="dropdown-item" href="account.html">Account</a></li>
                                    <li><a class="dropdown-item" href="checkout.html">Checkout</a></li>
                                    <li><a class="dropdown-item" href="track_order.html">Track Order</a></li>
                                    <li><a class="dropdown-item" href="blog_details.html">Blog Details</a></li>
                                    <li> <a class="dropdown-item" href="404.html">Error</a></li>
                                </ul>
                            </li>
                            -->
                            <li class="nav-item">
                                <a class="nav-link" href="blog.html">Mua theo nhóm</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="blog.html">Môi trường</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="contact.html">Liên hệ</a>
                            </li>
                            <li class="nav-item login-item">
                                <a class="nav-link" href="login.html"><i class="far fa-user"></i>
                                    Đăng nhập</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
    </header>
    <!-- Header End -->

    <!-- Start Page Header -->
    <div class="page-header-wrapper" style="background-image:url(assets/images/header_bg_01.jpg);">
            <div class="container">
                <div class="row">
                    <div class="col-md-12 mx-auto text-center">
                        <div class="page-header-container">
                            <div class="page-header-content">
                                <h1 class="heading-one">Our Menu</h1>
                                <div class="page-nav">
                                    <ul>
                                        <li><a href="#">Home ></a></li>
                                        <li>Menu</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
    <!-- End Page Header -->
    <!-- Page Start -->
    <div class="page-wrapper section-ptb">
        <div class="container">
            <div class="row">
                <div class="col-lg-4 col-md-12 order-lg-1 order-1">
                    <aside class="sidebar-wrapper">
                        <!-- Start Cateogiries Widget -->
                        <div class="categories-widget mb-4 custom-border p-4">
                            <div class="widget-title-2">
                                <h4 class="heading-4"><?php echo $today ?>Menu tuần (<?= htmlspecialchars($week1['startdate']) ?>)</h4>
                            </div>
                            <div class="widget-nav mt-3">
                                <ul>
                                <?php foreach ($week1 as $key => $day): if ($key === 'startdate') continue; ?>
                                    <li>
                                        <a href="javascript:void(0);" onclick="showMeals(<?= $key ?>, '<?= htmlspecialchars($day['Day']) ?>')">
                                            <i class="fas fa-angle-right"></i><?= htmlspecialchars($day['Day']) ?>
                                        </a>
                                    </li>
                                <?php endforeach; ?>
                                </ul>
                            </div>
                        </div>
                        <!-- End Cateogiries Widget -->
                    </aside>
                </div>
                <div class="col-lg-8 col-md-12 order-lg-2 order-2">
                    <!-- Start Sorting Form -->
                    <div class="shorting-form d-flex justify-content-between bg-semi-white align-items-center p-4">
                        <div class="filter-info">
                            <p class="mb-0"><span id="day-selected">ngày này</span> bạn đã chọn: <strong><span id="total-meals-day">0</span></strong> bữa</p>
                        </div>
                        <div class="filter-form-2">
                            <p class="mb-0">Tổng bữa đã chọn trong tuần: <strong><span id="total-meals-week">0</span></strong></p>
                        </div>
                    </div>
                    <!-- End Sorting Form -->
                    <!-- Start Products -->
                    <div class="all-products mt-5">
                        <div class="products-wrapper">
                        <div id="meal-container" class="row">
                                <?php 
                                $defaultMeals = $week1[$defaultDay];
                                foreach (['meal1', 'meal2'] as $mealKey): ?>
                                    <div class="col-lg-6 col-sm-6">
                                        <div class="card border-0 product-card custom-round">
                                            <div class="card-thumb">
                                                <a href="product_details.html" class="black-overlay"><img
                                                        src="<?= $defaultMeals[$mealKey]['image'] ?>" class="card-img-top" alt="food"></a>
                                                <a href="#" class="sm-btn"><i class="fas fa-plus"></i> Đã Chọn</a>
                                                <a href="#" class="sm-btn"><i class="fas fa-plus"></i> Hủy Chọn</a>
                                            </div>
                                            <div class="card-body">
                                                <h6 class="heading-6"><a href="product_details.html"><?= $defaultMeals[$mealKey]['name'] ?></a></h6>
                                                <div class="card-meta d-flex py-2">
                                                    <div class="product-price pl-4">
                                                        <span class="a">Khẩu phần: </span><span class="b"><?= $defaultMeals[$mealKey]['nutrient']['servingsize'] ?> cal</span>
                                                    </div>
                                                    <div class="product-price pl-4">
                                                        <span class="a">Carb: </span><span class="b"><?= $defaultMeals[$mealKey]['nutrient']['carbs'] ?> g</span>
                                                    </div>
                                                    <div class="product-price pl-4">
                                                        <span class="a">Protein: </span><span class="b"><?= $defaultMeals[$mealKey]['nutrient']['protein'] ?> g</span>
                                                    </div>
                                                    <div class="product-price pl-4">
                                                        <span class="a">Fat: </span><span class="b"><?= $defaultMeals[$mealKey]['nutrient']['fat'] ?> g</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                                <!-- product end -->
                            </div>
                        </div>
                    </div>
                    <!-- End Products -->
                </div>  
            </div>
            <div class="search-widget mb-4 py-5 py-sm-4 px-4 custom-round"
            style="background-image:url(assets/images/action_bg.jpg);">
                <center>
                    <div class="input-wrapper input-btn">
                        <button type="submit" class="default-btn">ĐẶT NGAY</button>
                    </div>
                </center>
            </div>
        </div>
    </div>
    <!-- End Start -->

    <!-- Start Subscribe Area -->
    <div class="subscribe-area section-ptb-2" style="background-image: url(assets/images/action_bg.jpg);">

    </div>
    <!-- End Subscribe Area -->

    <!-- Start Footer -->
    <footer class="footer-wrapper">
        <div class="footer-area py-5">
            <div class="container">
                <div class="row">
                    <div class="col-lg-3 col-sm-6 mb-sm-5 mb-lg-0 mb-xs-5">
                        <div class="footer-widget">
                            <div class="footer-logo">
                                <a href="index.html" class="d-inline-block mb-3"><img src="assets/images/white_logo.png"
                                        alt="logo" class="img-fluid" /></a>
                            </div>
                            <p class="text-white">Curabitur posuere felis in massa pulvinar, nec mollis nibh eleifend.
                                Maecenas turpis mi. Vivamus pulvinar lobortis vehicula pellentesque.</p>
                            <div class="social-profiles">
                                <ul>
                                    <li>
                                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                                    </li>
                                    <li>
                                        <a href="#"><i class="fab fa-twitter"></i></a>
                                    </li>
                                    <li>
                                        <a href="#"><i class="fab fa-instagram"></i></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-1 col-sm-3 mb-sm-5 mb-lg-0 mb-xs-5">
                        <div class="footer-widget">
                            <h3 class="widget-title"> Links</h3>
                            <div class="general-nav">
                                <ul>
                                    <li><a href="#">Home</a></li>
                                    <li><a href="#">About Us</a></li>
                                    <li><a href="#">Services</a></li>
                                    <li><a href="#">Menu</a></li>
                                    <li><a href="#">Blog</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-2 col-sm-3 mb-sm-5 mb-lg-0 mb-xs-5">
                        <div class="footer-widget link-widget">
                            <h3 class="widget-title">Other Links</h3>
                            <div class="general-nav">
                                <ul>
                                    <li><a href="#">Home</a></li>
                                    <li><a href="#">About Us</a></li>
                                    <li><a href="#">Services</a></li>
                                    <li><a href="#">Menu</a></li>
                                    <li><a href="#">Blog</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 mb-xs-5">
                        <div class="footer-widget">
                            <h3 class="widget-title">Instagram Gallery</h3>
                            <div class="photos-gallery">
                                <div class="single-gallery">
                                    <a href="#"><img src="assets/images/gallery/01.jpg" alt="gallery 01"
                                            class="img-fluid" /></a>
                                </div>
                                <div class="single-gallery">
                                    <a href="#"><img src="assets/images/gallery/02.jpg" alt="gallery 01"
                                            class="img-fluid" /></a>
                                </div>
                                <div class="single-gallery">
                                    <a href="#"><img src="assets/images/gallery/03.jpg" alt="gallery 01"
                                            class="img-fluid" /></a>
                                </div>
                                <div class="single-gallery">
                                    <a href="#"><img src="assets/images/gallery/04.jpg" alt="gallery 01"
                                            class="img-fluid" /></a>
                                </div>
                                <div class="single-gallery">
                                    <a href="#"><img src="assets/images/gallery/05.jpg" alt="gallery 01"
                                            class="img-fluid" /></a>
                                </div>
                                <div class="single-gallery">
                                    <a href="#"><img src="assets/images/gallery/06.jpg" alt="gallery 01"
                                            class="img-fluid" /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <div class="footer-widget">
                            <h3 class="widget-title">Contact Us</h3>
                            <div class="general-nav-2">
                                <ul>
                                    <li>
                                        <i class="fas fa-map-marker-alt"></i>
                                        203, Envato ka Yents, Behind Alis Str, Melbourne, Australia.
                                    </li>
                                    <li><i class="fas fa-phone-volume"></i> <span><a href="#">+000 123 456 789</a> <br>
                                            <a href="#">+000 12 48 57 665</a></span>
                                    </li>
                                    <li><i class="fas fa-envelope"></i> <span><a href="/cdn-cgi/l/email-protection#b5dfd4c5d6d4d3d0f5d2d8d4dcd99bd6dad8"><span class="__cf_email__" data-cfemail="e7948295918e848294a7818888838895c984888a">[email&#160;protected]</span>
                                            </a> <br>
                                            <a href="/cdn-cgi/l/email-protection#3c5f5d5a590e0e0f097c455d545353125f5351"><span class="__cf_email__" data-cfemail="365f585059765059595259441855595b">[email&#160;protected]</span></a></span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer-bottom bg-black-2 py-3">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <div class="copyright-text text-center">
                            <p>Copyright © 2021 <a href="#"><strong>Foodor.</strong></a> All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    <script>
    const week1 = <?= json_encode($week1) ?>;
        let cart = []; // Local cart to keep track of meals

        // Show meals for the selected day
        function showMeals(day, dayName) {
            const meals = week1[day];
            const container = document.getElementById('meal-container');
            container.innerHTML = '';

            document.getElementById('day-selected').textContent = dayName;

            ['meal1', 'meal2'].forEach(key => {
                const meal = meals[key];
                const isSelected = cart.some(item => item.meal === meal.name && item.day === dayName);

                container.innerHTML += `
                    <div class="col-lg-6 col-sm-6">
                        <div class="card border-0 product-card custom-round">
                            <div class="card-thumb">
                                <a href="product_details.html" class="black-overlay"><img
                                        src="${meal.image}" class="card-img-top" alt="food"></a>
                                <button onclick="${isSelected ? `removeFromCart('${meal.name}', '${dayName}')` : `addToCart('${meal.name}', '${dayName}')`}"
                                        class="btn ${isSelected ? 'btn-danger' : 'sm-btn'}">
                                    ${isSelected ? 'Xóa' : '<i class="fas fa-plus"></i> Chọn'}
                                </button>
                            </div>
                            <div class="card-body">
                                <h6 class="heading-6"><a href="product_details.html">${meal.name}</a></h6>
                                <div class="card-meta d-flex py-2">
                                    <div class="product-price pl-4">
                                        <span class="a">Khẩu phần: </span><span class="b">${meal.nutrient.servingsize} cal</span>
                                    </div>
                                    <div class="product-price pl-4">
                                        <span class="a">Carb: </span><span class="b">${meal.nutrient.carbs} g</span>
                                    </div>
                                    <div class="product-price pl-4">
                                        <span class="a">Protein: </span><span class="b">${meal.nutrient.protein} g</span>
                                    </div>
                                    <div class="product-price pl-4">
                                        <span class="a">Fat: </span><span class="b">${meal.nutrient.fat} g</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
            });
            updateMealCountForDay(dayName);
        }

        // Add meal to the cart
        function addToCart(mealName, day) {
            const formData = new FormData();
            formData.append('ajax_add_to_cart', true);
            formData.append('meal_name', mealName);
            formData.append('day', day);

            fetch('', { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    cart = data;
                    updateTotalMeals();
                    showMeals(Object.keys(week1).find(key => week1[key]['Day'] === day), day);
                });
        }

        // Remove meal from the cart
        function removeFromCart(mealName, day) {
            const formData = new FormData();
            formData.append('ajax_remove_from_cart', true);
            formData.append('meal_name', mealName);
            formData.append('day', day);

            fetch('', { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    cart = data;
                    updateTotalMeals();
                    showMeals(Object.keys(week1).find(key => week1[key]['Day'] === day), day);``
                });
        }

        // Update total meals of the week
        function updateTotalMeals() {
            document.getElementById('total-meals-week').textContent = cart.length;
        }

        // Update total meals for the selected day
        function updateMealCountForDay(day) {
            const count = cart.filter(item => item.day === day).length;
            document.getElementById('total-meals-day').textContent = count;
        }

        // Initialize the page with the default day's meals
        document.addEventListener('DOMContentLoaded', () => {
            showMeals(<?= $defaultDay ?>, '<?= htmlspecialchars($week1[$defaultDay]['Day']) ?>');
        });
    </script>
    </script>
    <script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script><script src="assets/js/jquery-3.5.1.min.js" type="a55977ac95d3a61579c11ff4-text/javascript"></script>
    <script src="assets/js/bootstrap.bundle.min.js" type="a55977ac95d3a61579c11ff4-text/javascript"></script>
    <script src="assets/js/aos.js" type="a55977ac95d3a61579c11ff4-text/javascript"></script>
    <script src="assets/js/owl.carousel.min.js" type="a55977ac95d3a61579c11ff4-text/javascript"></script>
    <script src="assets/js/jquery.fancybox.min.js" type="a55977ac95d3a61579c11ff4-text/javascript"></script>
    <script src="assets/js/jquery.waypoints.min.js" type="a55977ac95d3a61579c11ff4-text/javascript"></script>
    <script src="assets/js/jquery.counterup.min.js" type="a55977ac95d3a61579c11ff4-text/javascript"></script>
    <script src="assets/js/jquery.scrollUp.min.js" type="a55977ac95d3a61579c11ff4-text/javascript"></script>
    <script src="assets/js/jquery.nice-select.min.js" type="a55977ac95d3a61579c11ff4-text/javascript"></script>
    <script src="assets/js/nouislider.min.js" type="a55977ac95d3a61579c11ff4-text/javascript"></script>
    <script src="assets/js/main.js" type="a55977ac95d3a61579c11ff4-text/javascript"></script>

<script src="/cdn-cgi/scripts/7d0fa10a/cloudflare-static/rocket-loader.min.js" data-cf-settings="a55977ac95d3a61579c11ff4-|49" defer></script></body>

</html>