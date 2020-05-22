//1888049 - Võ Đại Nghĩa - nghiadaivo@gmail.com - Ứng dụng nhân viên
//====== Khai báo sử dụng thư viện hàm
const EXPRESS = require('express');
const FILEUPLOAD = require('express-fileupload');
const Xu_ly = require('./XL_3L');

//====== Khai báo và Cấu hình Ứng dụng
var Ung_dung = EXPRESS();
Ung_dung.use(EXPRESS.urlencoded({ extended: false }));
Ung_dung.use('/Media', EXPRESS.static('../Media'));
Ung_dung.use(FILEUPLOAD());
Ung_dung.listen(3000);

//====== Khai báo và Khởi động biến toàn cục
var Cong_ty = Xu_ly.Doc_Cong_ty();
var Chuoi_HTML_Khung = Xu_ly.Doc_Khung_HTML();

//****************** Biến cố khi người dùng Khởi động - Đăng nhập  *************************
Ung_dung.get('/', (req, res) => {
	//===== Biến nguồn
	var Chuoi_HTML_Khung = Xu_ly.Doc_Khung_HTML();
	//=====Xử lý tạo giao diện
	var Chuoi_HTML = Xu_ly.Tao_Chuoi_HTML_Dang_nhap('NV_1', 'NV_1');
	Chuoi_HTML = Chuoi_HTML_Khung.replace('Chuoi_HTML', Chuoi_HTML);
	res.send(Chuoi_HTML);
});

Ung_dung.post('/Dang_nhap', (req, res) => {
	//===== Biến nguồn
	var Danh_sach_Nhan_vien = Xu_ly.Doc_Danh_sach_Nhan_vien();

	var Ten_Dang_nhap = req.body.Th_Ten_Dang_nhap;
	var Mat_khau = req.body.Th_Mat_khau;
	var Chuoi_HTML = '';
	var Hop_le = Danh_sach_Nhan_vien.some((x) => x.Ten_Dang_nhap === Ten_Dang_nhap && x.Mat_khau === Mat_khau);
	if (Hop_le) {
		// Biến đích
		var Nhan_vien = Danh_sach_Nhan_vien.find((x) => x.Ten_Dang_nhap === Ten_Dang_nhap && x.Mat_khau === Mat_khau);
		var Danh_sach_Nhan_vien_Xem = [ Nhan_vien ];
		//=====Xử lý tạo giao diện
		Chuoi_HTML = Xu_ly.Tao_Chuoi_HTML_Danh_sach_Nhan_vien(Danh_sach_Nhan_vien_Xem);
		Chuoi_HTML = Chuoi_HTML_Khung.replace('Chuoi_HTML', Chuoi_HTML);
	} else {
		//=====Xử lý tạo giao diện
		Chuoi_HTML = Xu_ly.Tao_Chuoi_HTML_Dang_nhap('', '', 'Đăng nhập không hợp lệ');
		Chuoi_HTML = Chuoi_HTML_Khung.replace('Chuoi_HTML', Chuoi_HTML);
	}
	res.send(Chuoi_HTML);
});

//****************** Xử lý Biến cố Chọn Chức năng trên đối tượng *************************
Ung_dung.post('/Chon_Chuc_nang', (req, res) => {
	//===== Biến nguồn
	var Danh_sach_Nhan_vien = Xu_ly.Doc_Danh_sach_Nhan_vien();
	var Ma_so_Chuc_nang = req.body.Th_Ma_so_Chuc_nang;
	var Ma_so_Nhan_vien = req.body.Th_Ma_so_Nhan_vien;
	var Nhan_vien = Danh_sach_Nhan_vien.find((x) => x.Ma_so === Ma_so_Nhan_vien);
	//===== Tạo kết xuất
	if (Ma_so_Chuc_nang === 'Cap_nhat_Dien_thoai')
		var Chuoi_HTML = Xu_ly.Tao_Chuoi_HTML_Chuc_nang_Cap_nhat_Dien_thoai(Nhan_vien);
	else if (Ma_so_Chuc_nang === 'Cap_nhat_Dia_chi')
		var Chuoi_HTML = Xu_ly.Tao_Chuoi_HTML_Chuc_nang_Cap_nhat_Dia_chi(Nhan_vien);
	else if (Ma_so_Chuc_nang === 'Cap_nhat_Hinh')
		var Chuoi_HTML = Xu_ly.Tao_Chuoi_HTML_Chuc_nang_Cap_nhat_Hinh(Nhan_vien);
	else if (Ma_so_Chuc_nang === 'Bo_sung_Ngoai_ngu')
		var Chuoi_HTML = Xu_ly.Tao_Chuoi_HTML_Chuc_nang_Bo_sung_Ngoai_ngu(Nhan_vien, Cong_ty);
	Chuoi_HTML = Chuoi_HTML_Khung.replace('Chuoi_HTML', Chuoi_HTML);
	res.send(Chuoi_HTML);
});

//****************** Xử lý Biến cố Thực hiện Chức năng *************************
Ung_dung.post('/Thuc_hien_Chuc_nang', (req, res) => {
	//===== Biến nguồn
	var Danh_sach_Nhan_vien = Xu_ly.Doc_Danh_sach_Nhan_vien();
	var Ma_so_Chuc_nang = req.body.Th_Ma_so_Chuc_nang;
	var Ma_so_Nhan_vien = req.body.Th_Ma_so_Nhan_vien;
	var Nhan_vien = Danh_sach_Nhan_vien.find((x) => x.Ma_so === Ma_so_Nhan_vien);
	//===== Tạo kết xuất
	if (Ma_so_Chuc_nang === 'Cap_nhat_Dien_thoai') {
		//===== Biến nguồn
		var Dien_thoai = req.body.Th_Dien_thoai;
		//===== Biến đích
		Nhan_vien.Dien_thoai = Dien_thoai;
		var Danh_sach_Nhan_vien_Xem = [ Nhan_vien ];
		//===== Tạo kết xuất
		Xu_ly.Ghi_Nhan_vien(Nhan_vien);
		var Chuoi_HTML = Xu_ly.Tao_Chuoi_HTML_Danh_sach_Nhan_vien(Danh_sach_Nhan_vien_Xem);
	} else if (Ma_so_Chuc_nang === 'Cap_nhat_Dia_chi') {
		//===== Biến nguồn
		var Dia_chi = req.body.Th_Dia_chi;
		//===== Biến đích
		Nhan_vien.Dia_chi = Dia_chi;
		var Danh_sach_Nhan_vien_Xem = [ Nhan_vien ];
		//===== Tạo kết xuất
		Xu_ly.Ghi_Nhan_vien(Nhan_vien);
		var Chuoi_HTML = Xu_ly.Tao_Chuoi_HTML_Danh_sach_Nhan_vien(Danh_sach_Nhan_vien_Xem);
	} else if (Ma_so_Chuc_nang === 'Cap_nhat_Hinh') {
		//===== Biến nguồn
		var Tap_tin_Hinh = req.files.Th_Hinh;
		//===== Biến đích
		var Danh_sach_Nhan_vien_Xem = [ Nhan_vien ];
		//===== Tạo kết xuất
		Xu_ly.Ghi_Hinh_Nhan_vien(Nhan_vien, Tap_tin_Hinh.data);
		var Chuoi_HTML = Xu_ly.Tao_Chuoi_HTML_Danh_sach_Nhan_vien(Danh_sach_Nhan_vien_Xem);
	} else if (Ma_so_Chuc_nang === 'Bo_sung_Ngoai_ngu') {
		//===== Biến nguồn
		var Danh_sach_Ngoai_ngu_Moi = req.body.Th_Ma_so_Ngoai_ngu;
		var Ma_so_Ngoai_ngu = Array.isArray(Danh_sach_Ngoai_ngu_Moi)
			? Danh_sach_Ngoai_ngu_Moi
			: !Array.isArray(Danh_sach_Ngoai_ngu_Moi) && Danh_sach_Ngoai_ngu_Moi !== undefined
				? [ Danh_sach_Ngoai_ngu_Moi ]
				: [];

		Nhan_vien.Danh_sach_Ngoai_ngu = [];
		//===== Biến đích
		Ma_so_Ngoai_ngu.forEach((x) => {
			var Ngoai_ngu = Cong_ty.Danh_sach_Ngoai_ngu.find((y) => y.Ma_so === x);
			Nhan_vien.Danh_sach_Ngoai_ngu.push(Ngoai_ngu);
		});
		var Danh_sach_Nhan_vien_Xem = [ Nhan_vien ];
		//===== Tạo kết xuất
		Xu_ly.Ghi_Nhan_vien(Nhan_vien);
		var Chuoi_HTML = Xu_ly.Tao_Chuoi_HTML_Danh_sach_Nhan_vien(Danh_sach_Nhan_vien_Xem);
	}
	Chuoi_HTML = Chuoi_HTML_Khung.replace('Chuoi_HTML', Chuoi_HTML);
	res.send(Chuoi_HTML);
});
