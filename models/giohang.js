const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename), 
    'data', 
    'giohang.json'
);

module.exports = class Cart {
    static themMonVaoGio(id, monServingsize) {
        // Tạo file nếu chưa có
        if (!fs.existsSync(p)) {
            fs.writeFileSync(p, JSON.stringify({ cacmonan: [], tongCalo: 0 }));
        }
    
        let giohang = { cacmonan: [], tongCalo: 0 };
        try {
            const fileContent = fs.readFileSync(p, 'utf8');
            // Nếu file rỗng, giữ nguyên giá trị mặc định
            if (fileContent.trim()) {
                giohang = JSON.parse(fileContent);
            }
        } catch (err) {
            console.error('Lỗi parse JSON:', err);
        }
    
        // Tìm món đã có
        const existingMonIndex = giohang.cacmonan.findIndex(mon => mon.id === id);
        const existingMon = giohang.cacmonan[existingMonIndex];
        let updatedMon;
    
        if (existingMon) {
            updatedMon = { ...existingMon };
            updatedMon.qty += 1;
            giohang.cacmonan[existingMonIndex] = updatedMon;
        } else {
            updatedMon = { id: id, qty: 1 };
            giohang.cacmonan.push(updatedMon);
        }
    
        giohang.tongCalo += +monServingsize;
    
        fs.writeFileSync(p, JSON.stringify(giohang));
    }

    static getGioHang(cb) {
        fs.readFile(p, (err, fileContent) => {
            const gioHang = JSON.parse(fileContent);
            if (err) {
                cb(null);
            } else {
                cb(gioHang);
            };
        });
    }
    
    static xoaMonTrongGio(id, servingSize) {
        fs.readFile(p, (err, fileContent) => {
            if(err){
                return;
            }
            const updatedCacMonAn = { ...JSON.parse(fileContent) };
            const monAn = updatedCacMonAn.cacmonan.find(mon => mon.id === id);
            if (!monAn) {
                return;
            }
            const monAnQty = monAn.qty;
            updatedCacMonAn.cacmonan = updatedCacMonAn.cacmonan.filter(
                mon => mon.id !== id
            );
            updatedCacMonAn.tongCalo -= servingSize * monAnQty;
            fs.writeFile(p, JSON.stringify(updatedCacMonAn), err => {
                console.log(err);
            });
        });
    }
};