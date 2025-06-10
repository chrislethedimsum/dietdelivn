document
  .getElementById("tuvansdt")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const sdt = document.getElementById("sdt").value.trim();
    const phoneRegex = /^0\d{9}$/;

    if (!phoneRegex.test(sdt)) {
      Swal.fire({
        icon: "error",
        title: "Số điện thoại không hợp lệ!",
        text: "Vui lòng nhập số điện thoại hợp lệ (10 chữ số, bắt đầu bằng 0).",
      });
      return;
    } else {
      let widgetId = null; // Biến để lưu widget ID sau khi render

      const result = await Swal.fire({
        title: "Xác nhận số điện thoại",
        html: `
        <p>Bạn có chắc muốn đăng ký với số: <strong>${sdt}</strong>?</p>
        <div id="captcha-container">
          <div id="hcaptcha-container"></div>
        </div>
      `,
        showCancelButton: true,
        confirmButtonText: "Gửi",
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
        Swal.fire("Đã hủy", "Bạn đã hủy đăng ký.", "info");
        return;
      }

      const token = result.value;

      try {
        const response = await fetch("/tuvansdt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sdt: sdt,
            token: token,
          }),
        });

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
          Swal.fire("Thất bại!", data.message || "Xác minh thất bại.", "error");
        }
      } catch (error) {
        console.error("Lỗi khi gửi:", error);
        Swal.fire("Lỗi", "Không thể gửi dữ liệu. Vui lòng thử lại.", "error");
      }
    }
});
