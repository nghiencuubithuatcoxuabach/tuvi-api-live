import express from 'express';
import { astro } from 'iztro';

const app = express();
app.use(express.json());

// Hàm tự động đổi số giờ đồng hồ (0h-23h) sang index của iztro (0: Tý, 1: Sửu, 2: Dần...)
function getCompassTimeIndex(hour) {
    const h = Number(hour);
    if (h >= 23 || h < 1) return 0;  // Giờ Tý
    if (h >= 1 && h < 3) return 1;   // Giờ Sửu
    if (h >= 3 && h < 5) return 2;   // Giờ Dần
    if (h >= 5 && h < 7) return 3;   // Giờ Mão
    if (h >= 7 && h < 9) return 4;   // Giờ Thìn
    if (h >= 9 && h < 11) return 5;  // Giờ Tỵ
    if (h >= 11 && h < 13) return 6; // Giờ Ngọ
    if (h >= 13 && h < 15) return 7; // Giờ Mùi
    if (h >= 15 && h < 17) return 8; // Giờ Thân
    if (h >= 17 && h < 19) return 9; // Giờ Dậu
    if (h >= 19 && h < 21) return 10;// Giờ Tuất
    if (h >= 21 && h < 23) return 11;// Giờ Hợi
    return 0;
}

app.get('/api/lasotuvi', (req, res) => {
    const { year, month, day, hour, gender } = req.query;
    
    if (!year || !month || !day || !hour) {
        return res.status(400).json({ success: false, error: "Vui lòng nhập đầy đủ: year, month, day, hour" });
    }
    
    try {
        // 1. Định dạng ngày chuẩn: "YYYY-M-D"
        const solarDateStr = `${Number(year)}-${Number(month)}-${Number(day)}`;
        
        // 2. Chuyển đổi giờ đồng hồ sang mã giờ Tử Vi an toàn
        const timeIndex = getCompassTimeIndex(hour);
        
        // 3. Giới tính
        const sex = (gender === 'female') ? 'female' : 'male';
        
        // 4. Gọi thư viện an sao (Bật chế độ tiếng Việt 'vi-VN')
        const astrolabe = astro.bySolar(solarDateStr, timeIndex, sex, true, 'vi-VN');
        
        res.json({ success: true, data: astrolabe });
        
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Đổi cổng 3000 cố định cũ thành cấu hình động nhận diện cổng Đám mây
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server Tử Vi đang chạy tại port: ${PORT}`);
});
