const tuoiInput = document.getElementById("tuoi");
const chieucaoInput = document.getElementById("chieucao");
const cannangInput = document.getElementById("cannang");

chieucaoInput.addEventListener("blur", function () {
    let value = parseInt(this.value, 10);
    if (isNaN(value)) return; // Nếu người dùng để trống
    if (value < 130) this.value = 130;
    if (value > 250) this.value = 250;
});

cannangInput.addEventListener("blur", function () {
    let value = parseInt(this.value, 10);
    if (isNaN(value)) return; // Nếu người dùng để trống
    if (value < 40) this.value = 40;
    if (value > 180) this.value = 180;
});

tuoiInput.addEventListener("blur", function () {
    let value = parseInt(this.value, 10);
    if (isNaN(value)) return; // Nếu người dùng để trống
    if (value < 15) this.value = 15;
    if (value > 80) this.value = 80;
});

async function myFunction() {
    const sdt = document.getElementById("sdt").value;
    const phoneRegex = /^0\d{9,10}$/;
    if (!phoneRegex.test(sdt)) {
        Swal.fire({
            icon: "error",
            title: "Số điện thoại không hợp lệ!",
            text: "Vui lòng nhập số điện thoại hợp lệ (10 hoặc 11 chữ số, bắt đầu bằng 0).",
        });
        return;
    }

    const gioitinh = document.getElementsByName("gioitinh")[0].value;
    let gioitinhtext = "";
    const vandongStr = document.getElementsByName("vandong")[0].value;
    const vandong = vandongStr ? parseFloat(vandongStr) : null;
    let vandongtext = "";
    const tuoi = parseFloat(document.getElementsByName("tuoi")[0].value);
    const chieucao = parseFloat(
        document.getElementsByName("chieucao")[0].value
    );
    const cannang = parseFloat(document.getElementsByName("cannang")[0].value);

    const muctieuNodeList = document.getElementsByName("muctieu");
    let muctieu = "";
    let muctieutext = "";

    for (let i = 0; i < muctieuNodeList.length; i++) {
        if (muctieuNodeList[i].checked) {
            muctieu = muctieuNodeList[i].value;
            break;
        }
    }

    let missing = [];
    if (!sdt) missing.push("Số điện thoại");
    if (isNaN(tuoi)) missing.push("Tuổi");
    if (isNaN(chieucao)) missing.push("Chiều cao");
    if (isNaN(cannang)) missing.push("Cân nặng");
    if (!gioitinh) missing.push("Giới tính");
    if (!vandongStr) missing.push("Tính chất công việc");
    if (!muctieu) missing.push("Mục tiêu");
    if (missing.length > 0) {
        Swal.fire({
            icon: "warning",
            title: "Thiếu thông tin!",
            text: "Vui lòng chọn: " + missing.join(", "),
        });
        missing = [];
        return;
    } else {
        let muctieuCalo = 0;
        muctieutext = "Ăn uống lành mạnh";
        if (muctieu === "tangcan") {
            muctieuCalo = 350;
            muctieutext = "Tăng cân";
        } else if (muctieu === "giamcan") {
            muctieuCalo = -250;
            muctieutext = "Giảm cân";
        }

        if (gioitinh === "nam") {
            gioitinhtext = "Nam";
        } else {
            gioitinhtext = "Nữ";
        }
        if (vandong === 1.2) {
            vandongtext = "Ngồi là chủ yếu";
        } else if (vandong === 1.3) {
            vandongtext = "Đứng là chủ yếu";
        } else if (vandong === 1.5) {
            vandongtext = "Đứng và di chuyển nhẹ nhàng là chủ yếu ";
        } else {
            vandongtext = "Vận động thường xuyên trong công việc";
        }

        let bmr = 0;
        if (gioitinh === "nam") {
            bmr = cannang * 10 + 6.25 * chieucao - 5 * tuoi + 5;
        } else {
            bmr = cannang * 10 + 6.25 * chieucao - 5 * tuoi - 161;
        }

        let calo = bmr * vandong + muctieuCalo;
        recommendGoi(calo, bmr, vandong);

        let widgetId = null; // Biến để lưu widget ID sau khi render

        const result = await Swal.fire({
            title: "Captcha xác nhận",
            html: `
        <p>Mời hoàn thành captcha để tiếp tục</p>
        <div id="captcha-container">
          <div id="hcaptcha-container"></div>
        </div>
      `,
            showCancelButton: true,
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy",
            focusConfirm: false,
            didOpen: () => {
                widgetId = hcaptcha.render("hcaptcha-container", {
                    sitekey: "a574db68-d5a0-445c-b0a6-ae4ca3bc3a54", // ← thay bằng Site Key thật
                    theme: "light",
                });
            },
            preConfirm: () => {
                const token = hcaptcha.getResponse(widgetId);
                if (!token) {
                    Swal.showValidationMessage(
                        "Vui lòng hoàn thành Captcha trước khi gửi."
                    );
                    return false;
                }
                return token;
            },
        });

        if (!result.isConfirmed || !result.value) {
            Swal.fire("Đã hủy", "Bạn đã hủy gửi.", "info");
            return;
        }

        const token = result.value;

        try {
            Swal.fire({
                title: "Đang xử lý...",
                text: "Vui lòng chờ hệ thống xác minh.",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const response = await fetch("/baogiapost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone: sdt,
                    token: token,
                    gender: gioitinhtext,
                    age: tuoi,
                    height: chieucao,
                    weight: cannang,
                    activity_level: vandongtext,
                    goal: muctieutext,
                }),
            });

            Swal.close();

            const data = await response.json();

            if (data.success) {
                Swal.fire(
                    "Thành công!",
                    "Đăng ký của bạn đã được ghi nhận.",
                    "success"
                );
                document.getElementById("sdt").value = "";
                hcaptcha.reset(widgetId); // Reset widget nếu cần dùng lại
            } else {
                Swal.fire(
                    "Thất bại!",
                    data.message || "Xác minh thất bại.",
                    "error"
                );
            }
        } catch (error) {
            console.error("Lỗi khi gửi:", error);
            Swal.fire(
                "Lỗi",
                "Không thể gửi dữ liệu. Vui lòng thử lại.",
                "error"
            );
        }

        document.getElementById("thongTinKhach").innerHTML =
            '<div class="p-3"><div style="color:red;">**Chúng tôi đã nhận thông tin khách hàng, mời xem báo giá ! </div><br> Giới tính: ' +
            gioitinhtext +
            " | Tuổi: " +
            tuoi +
            " | Chiều cao: " +
            chieucao +
            " | Cân nặng: " +
            cannang +
            " | Tính chất công việc: " +
            vandongtext +
            " | Mục tiêu: " +
            muctieutext +
            '</div> <center><button type="submit" onclick="scrolltokhachhangForm(event)" class="mb-3 default-btn">Nhập lại thông tin</button></center>';
        document
            .getElementById("cacgoi")
            .scrollIntoView({ behavior: "smooth" });
    }
}

function recommendGoi(calo, bmr, vandong) {
    const tdee = bmr * vandong;
    if (calo < 1200) {
        //2 suất 400
        document.getElementById("ngay-1-bua").innerHTML = "73.000đ";
        document.getElementById("ngay-2-bua").innerHTML = "140.000đ";
        document.getElementById("tuan-1-bua").innerHTML = "408.000đ";
        document.getElementById("tuan-2-bua").innerHTML = "816.000đ";
        document.getElementById("thang-1-bua").innerHTML = "1.512.000đ";
        document.getElementById("thang-2-bua").innerHTML = "3.024.000đ";
    } else if (calo >= 1200 && calo < 1800) {
        //2 suất 600
        document.getElementById("ngay-1-bua").innerHTML = "77.000đ";
        document.getElementById("ngay-2-bua").innerHTML = "150.000đ";
        document.getElementById("tuan-1-bua").innerHTML = "438.000đ";
        document.getElementById("tuan-2-bua").innerHTML = "876.000đ";
        document.getElementById("thang-1-bua").innerHTML = "1.584.000đ";
        document.getElementById("thang-2-bua").innerHTML = "3.168.000đ";
    } else {
        //2 suất 800
        document.getElementById("ngay-1-bua").innerHTML = "80.000đ";
        document.getElementById("ngay-2-bua").innerHTML = "155.000đ";
        document.getElementById("tuan-1-bua").innerHTML = "450.000đ";
        document.getElementById("tuan-2-bua").innerHTML = "900.000đ";
        document.getElementById("thang-1-bua").innerHTML = "1.680.000đ";
        document.getElementById("thang-2-bua").innerHTML = "3.360.000đ";
    }
}

function scrolltokhachhangForm(event) {
    event.preventDefault();
    let formElement = document.getElementById("khachhangForm");
    if (formElement) {
        setTimeout(() => {
            formElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100); // Delay để chờ collapse animation hoàn tất
    }
}

function expandAndScroll(event) {
    event.preventDefault(); // Luôn ngăn nhảy link
    let status = document.getElementById("statusForm");
    const gioitinh = document.getElementsByName("gioitinh")[0].value;
    const vandongStr = document.getElementsByName("vandong")[0].value;
    const vandong = vandongStr ? parseFloat(vandongStr) : null;
    const tuoi = parseFloat(document.getElementsByName("tuoi")[0].value);
    const chieucao = parseFloat(
        document.getElementsByName("chieucao")[0].value
    );
    const cannang = parseFloat(document.getElementsByName("cannang")[0].value);
    const muctieuNodeList = document.getElementsByName("muctieu");
    let muctieu = "";
    for (let i = 0; i < muctieuNodeList.length; i++) {
        if (muctieuNodeList[i].checked) {
            muctieu = muctieuNodeList[i].value;
            break;
        }
    }

    // Nếu đầy đủ thông tin thì mới xử lý tiếp
    let targetId = event.target.getAttribute("href").substring(1); // Get target div ID
    let targetElement = document.getElementById(targetId);

    let sections = [
        "ngay",
        "tuan",
        "thang",
        "dacbiet",
        "ngaybaogia",
        "tuanbaogia",
        "thangbaogia",
    ];
    let specialSections = ["ngaybaogia", "tuanbaogia", "thangbaogia"];

    if (specialSections.includes(targetId)) {
        if (
            !gioitinh ||
            !vandongStr ||
            isNaN(tuoi) ||
            isNaN(chieucao) ||
            isNaN(cannang) ||
            !muctieu
        ) {
            Swal.fire({
                icon: "warning",
                title: "Thiếu thông tin!",
                text: "Vui lòng nhập đầy đủ thông tin của bạn để chúng tôi báo giá các gói phù hợp!",
            }).then((result) => {
                if (result.isConfirmed) {
                    sections.forEach((id) => {
                        let section = document.getElementById(id);
                        if (section && id !== targetId) {
                            let bsCollapse = new bootstrap.Collapse(section, {
                                toggle: false,
                            });
                            bsCollapse.hide(); // Close section
                        }
                    });
                    let formElement = document.getElementById("khachhangForm");
                    if (formElement) {
                        setTimeout(() => {
                            formElement.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            });
                        }, 300); // Delay để chờ collapse animation hoàn tất
                    }
                    return;
                }
            });
        } else {
            sections.forEach((id) => {
                let section = document.getElementById(id);
                if (section && id !== targetId) {
                    let bsCollapse = new bootstrap.Collapse(section, {
                        toggle: false,
                    });
                    bsCollapse.hide(); // Close section
                }
            });
            let newbscollapse = new bootstrap.Collapse(targetElement, {
                toggle: true,
            });
            newbscollapse.show();
            if (targetElement) {
                setTimeout(() => {
                    targetElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }, 300); // Delay để chờ collapse animation hoàn tất
            }
        }
    } else {
        sections.forEach((id) => {
            let section = document.getElementById(id);
            if (section && id !== targetId) {
                let bsCollapse = new bootstrap.Collapse(section, {
                    toggle: false,
                });
                bsCollapse.hide(); // Close section
            }
        });
        // Expand and scroll to the target section
        if (targetElement) {
            let bsCollapse = new bootstrap.Collapse(targetElement, {
                toggle: true,
            });
            setTimeout(() => {
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 300);
        }
    }
}
