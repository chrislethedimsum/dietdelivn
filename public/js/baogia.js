function myFunction() {
    const gioitinh = document.getElementsByName("gioitinh")[0].value;
    let gioitinhtext = "";
    const vandongStr = document.getElementsByName("vandong")[0].value;
    const vandong = vandongStr ? parseFloat(vandongStr) : null;
    let vandongtext = "";
    const tuoi = parseFloat(document.getElementsByName("tuoi")[0].value);
    const chieucao = parseFloat(document.getElementsByName("chieucao")[0].value);
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

    if (gioitinh === "" && vandongStr === "" && muctieu === "") {
        alert("Vui lòng chọn Giới tính, Tính chất công việc và Mục tiêu!");
    } else if (gioitinh === "" && vandongStr === ""){
        alert("Vui lòng chọn Giới tính và Tính chất công việc!");
    } else if (gioitinh === "" && muctieu === ""){
        alert("Vui lòng chọn Giới tính và Mục tiêu!");
    } else if (muctieu === "" && vandong === ""){
        alert("Vui lòng chọn Tính chất công việc và Mục tiêu!");
    } else if (gioitinh === ""){
        alert("Vui lòng chọn Giới tính!");
    } else if (vandongStr === ""){
        alert("Vui lòng chọn Tính chất công việc!");
    } else if (muctieu === "") {
        alert("Vui lòng chọn Mục tiêu!");
    } else {
        let muctieuCalo = 0;
        muctieutext = "Ăn uống lành mạnh";
        if(muctieu === "tangcan"){
            muctieuCalo = 350;
            muctieutext = "Tăng cân";
        } else if (muctieu === "giamcan"){
            muctieuCalo = -250;
            muctieutext = "Giảm cân";
        }
        
        if(gioitinh === "nam"){
            gioitinhtext = "Nam";
        } else {
            gioitinhtext = "Nữ";
        }
        if(vandong === 1.2){
            vandongtext = "Ngồi là chủ yếu";
        } else if (vandong === 1.3){
            vandongtext = "Đứng là chủ yếu";
        } else if (vandong === 1.5){
            vandongtext = "Đứng và di chuyển nhẹ nhàng là chủ yếu ";
        } else {
            vangdongtext = "Vận động thường xuyên trong công việc";
        }

        let bmr = 0;
        if(gioitinh === "nam"){
            bmr = (cannang * 10) + (6.25 * chieucao) - (5 * tuoi) + 5;
        } else {
            bmr = (cannang * 10) + (6.25 * chieucao) - (5 * tuoi) - 161;
        }

        let calo = bmr * vandong + muctieuCalo;
        recommendGoi(calo, bmr, vandong);
        document.getElementById("thongTinKhach").innerHTML = '<div class="p-3"><div style="color:red;">**Chúng tôi đã nhận thông tin khách hàng, mời xem báo giá ! </div><br> Giới tính: ' + gioitinhtext + ' | Tuổi: ' + tuoi + ' | Chiều cao: ' + chieucao + ' | Cân năng: ' + cannang + '| Tính chất công việc: ' + vandongtext + ' | Mục tiêu: ' + muctieutext + '</div> <center><button type="submit" onclick="scrolltokhachhangForm(event)" class="mb-3 default-btn">Nhập lại thông tin</button></center>';
        document.getElementById("cacgoi").scrollIntoView({ behavior: "smooth" })
    }
}

function recommendGoi(calo, bmr, vandong){
    const tdee = bmr * vandong;
    if (calo < 1200){
        document.getElementById("ngay-1-bua").innerHTML = "73.000đ";
        document.getElementById("ngay-2-bua").innerHTML = "140.000đ";
        document.getElementById("tuan-1-bua").innerHTML = "408.000đ";
        document.getElementById("tuan-2-bua").innerHTML = "816.000đ";
        document.getElementById("thang-1-bua").innerHTML = "1.512.000đ";
        document.getElementById("thang-2-bua").innerHTML = "3.024.000đ";
        console.log(`BMR của bạn là ${bmr}\nTDEE của bạn là ${tdee}\nNăng lượng calo bạn cần nạp là ${calo}\nRecommend 2 suất 400`);
        
    } else if (calo >= 1200 && calo < 1800){
        document.getElementById("ngay-1-bua").innerHTML = "77.000đ";
        document.getElementById("ngay-2-bua").innerHTML = "150.000đ";
        document.getElementById("tuan-1-bua").innerHTML = "438.000đ";
        document.getElementById("tuan-2-bua").innerHTML = "876.000đ";
        document.getElementById("thang-1-bua").innerHTML = "1.584.000đ";
        document.getElementById("thang-2-bua").innerHTML = "3.168.000đ";
        console.log(`BMR của bạn là ${bmr}\nTDEE của bạn là ${tdee}\nNăng lượng calo bạn cần nạp là ${calo}\nRecommend 2 suất 600`);
    } else {
        document.getElementById("ngay-1-bua").innerHTML = "80.000đ";
        document.getElementById("ngay-2-bua").innerHTML = "155.000đ";
        document.getElementById("tuan-1-bua").innerHTML = "450.000đ";
        document.getElementById("tuan-2-bua").innerHTML = "900.000đ";
        document.getElementById("thang-1-bua").innerHTML = "1.680.000đ";
        document.getElementById("thang-2-bua").innerHTML = "3.360.000đ";
        console.log(`BMR của bạn là ${bmr}\nTDEE của bạn là ${tdee}\nNăng lượng calo bạn cần nạp là ${calo}\nRecommend 2 suất 800`);
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
    const gioitinh = document.getElementsByName("gioitinh")[0].value;
    const vandongStr = document.getElementsByName("vandong")[0].value;
    const vandong = vandongStr ? parseFloat(vandongStr) : null;
    const tuoi = parseFloat(document.getElementsByName("tuoi")[0].value);
    const chieucao = parseFloat(document.getElementsByName("chieucao")[0].value);
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
    
    let sections = ["ngay", "tuan", "thang", "dacbiet", "ngaybaogia", "tuanbaogia", "thangbaogia"];
    let specialSections = ["ngaybaogia", "tuanbaogia", "thangbaogia"]
    
    if (specialSections.includes(targetId)) {
        if (!gioitinh || !vandongStr || isNaN(tuoi) || isNaN(chieucao) || isNaN(cannang) || !muctieu) {
                alert("Vui lòng nhập đầy đủ thông tin trước khi xem các gói phù hợp!");
                sections.forEach(id => {
                let section = document.getElementById(id);
                    if (section && id !== targetId) {
                        let bsCollapse = new bootstrap.Collapse(section, { toggle: false });
                        bsCollapse.hide(); // Close section
                    }
                });
                let formElement = document.getElementById("khachhangForm");
                if (formElement) {
                    setTimeout(() => {
                        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 300); // Delay để chờ collapse animation hoàn tất
                }
                return;
            } else {
                sections.forEach(id => {
                let section = document.getElementById(id);
                    if (section && id !== targetId) {
                        let bsCollapse = new bootstrap.Collapse(section, { toggle: false });
                        bsCollapse.hide(); // Close section
                    }
                });
                let newbscollapse = new bootstrap.Collapse(targetElement, { toggle: true });
                newbscollapse.show(); 
                if (targetElement) {
                    setTimeout(() => {
                       targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 300); // Delay để chờ collapse animation hoàn tất
                }
            }
    } else {
        sections.forEach(id => {
            let section = document.getElementById(id);
            if (section && id !== targetId) {
                let bsCollapse = new bootstrap.Collapse(section, { toggle: false });
                bsCollapse.hide(); // Close section
            }});
        // Expand and scroll to the target section
        if (targetElement) {
                let bsCollapse = new bootstrap.Collapse(targetElement, { toggle: true });
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 300);
        }
    }
}