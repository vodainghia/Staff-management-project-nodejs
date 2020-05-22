//1888049 - Võ Đại Nghĩa - nghiadaivo@gmail.com - Ứng dụng quản lý chi nhánh
//====== Khai báo sử dụng thư viện hàm
const EXPRESS = require('express');
const FILEUPLOAD = require('express-fileupload');
const SESSION = require('express-session');
const Xu_ly = require('./XL_3L');

//====== Khai báo và Cấu hình Ứng dụng
var Ung_dung = EXPRESS();
Ung_dung.use(SESSION({ secret: '123456789' }));
Ung_dung.use(FILEUPLOAD());
Ung_dung.use(EXPRESS.urlencoded({ extended: false }));
Ung_dung.use('/Media', EXPRESS.static('../Media'));
Ung_dung.listen(3001);

//====== Khai báo và Khởi động biến toàn cục
var Cong_ty = Xu_ly.Doc_Cong_ty();
var Chuoi_HTML_Khung = Xu_ly.Doc_Khung_HTML();

//****************** Biến cố khi người dùng Khởi động - Đăng nhập *************************
Ung_dung.get('/', (req, res) => {
	//===== Biến nguồn

	//=====Xử lý tạo giao diện
	var Chuoi_HTML = Xu_ly.Tao_Chuoi_HTML_Dang_nhap('QLCN_1', 'QLCN_1');
	Chuoi_HTML = Chuoi_HTML_Khung.replace('Chuoi_HTML', Chuoi_HTML);
	res.send(Chuoi_HTML);
});

Ung_dung.post('/Dang_nhap', (req, res) => {
	//===== Biến nguồn
	var Danh_sach_Quan_ly_Chi_nhanh = Xu_ly.Doc_Danh_sach_Quan_ly_Chi_nhanh();
	var Ten_Dang_nhap = req.body.Th_Ten_Dang_nhap;
	var Mat_khau = req.body.Th_Mat_khau;

	var Chuoi_HTML = '';
	var Hop_le = Danh_sach_Quan_ly_Chi_nhanh.some((x) => x.Ten_Dang_nhap === Ten_Dang_nhap && x.Mat_khau === Mat_khau);
	if (Hop_le) {
		//===== Biến đích
		//var Chuoi_Tra_cuu = '';
		var Quan_ly_Chi_nhanh = Xu_ly.Quan_ly_Chi_nhanh(Danh_sach_Quan_ly_Chi_nhanh, Ten_Dang_nhap, Mat_khau);
		var Danh_sach_Nhan_vien_Theo_Chi_nhanh = Xu_ly.Doc_Danh_sach_Nhan_vien(Quan_ly_Chi_nhanh);
		//===== Xử lý tạo giao diện
		req.session.Nguoi_dung = Quan_ly_Chi_nhanh;
		Chuoi_HTML =
			Xu_ly.Tao_Chuoi_Thuc_don_Nguoi_dung(Quan_ly_Chi_nhanh) +
			Xu_ly.Tao_Chuoi_HTML_Danh_sach_Nhan_vien(Danh_sach_Nhan_vien_Theo_Chi_nhanh, '');
		Chuoi_HTML = Chuoi_HTML_Khung.replace('Chuoi_HTML', Chuoi_HTML);
	} else {
		//===== Xử lý tạo giao diện
		Chuoi_HTML = Xu_ly.Tao_Chuoi_HTML_Dang_nhap('', '', 'Đăng nhập không hợp lệ');
		Chuoi_HTML = Chuoi_HTML_Khung.replace('Chuoi_HTML', Chuoi_HTML);
	}
	res.send(Chuoi_HTML);
});

//****************** Xử lý Biến cố Chọn Chức năng Người dùng*************************
Ung_dung.post('/Quan_ly/Chon_chuc_nang', (req, res) => {
	//===== Biến nguồn
	var Quan_ly_Chi_nhanh = req.session.Nguoi_dung;
	var Danh_sach_Nhan_vien = Xu_ly.Doc_Danh_sach_Nhan_vien(Quan_ly_Chi_nhanh);
	var Danh_sach_Don_vi = Cong_ty.Danh_sach_Don_vi.filter(
		(x) => x.Chi_nhanh.Ma_so === Quan_ly_Chi_nhanh.Chi_nhanh.Ma_so
	);
	var Danh_sach_Ngoai_ngu = Cong_ty.Danh_sach_Ngoai_ngu;
	var Ma_so_Chuc_nang = req.body.Th_Ma_so_Chuc_nang;
	//===== Tạo kết xuất
	var Chuoi_HTML = Xu_ly.Tao_Chuoi_Thuc_don_Nguoi_dung(Quan_ly_Chi_nhanh);
	if (Ma_so_Chuc_nang === 'Quan_ly_Nhan_vien') {
		Chuoi_HTML += Xu_ly.Tao_Chuoi_HTML_Danh_sach_Nhan_vien(Danh_sach_Nhan_vien, '');
	} else if (Ma_so_Chuc_nang === 'Bao_cao_Don_vi') {
		var Bao_cao = Xu_ly.Lap_Bao_cao_Don_vi(Danh_sach_Don_vi, Danh_sach_Nhan_vien);
		Chuoi_HTML += Xu_ly.Tao_Chuoi_HTML_Bao_cao_Don_vi(Bao_cao);
	} else if (Ma_so_Chuc_nang === 'Bao_cao_Ngoai_ngu') {
		var Bao_cao = Xu_ly.Lap_Bao_cao_Ngoai_ngu(Danh_sach_Ngoai_ngu, Danh_sach_Nhan_vien);
		Chuoi_HTML += Xu_ly.Tao_Chuoi_HTML_Bao_cao_Ngoai_ngu(Bao_cao);
	}
	Chuoi_HTML = Chuoi_HTML_Khung.replace('Chuoi_HTML', Chuoi_HTML);
	res.send(Chuoi_HTML);
});

//****************** Biến cố khi người dùng tra cứu*************************
Ung_dung.post('/Tra_cuu', (req, res) => {
	//===== Biến nguồn
	var Quan_ly_Chi_nhanh = req.session.Nguoi_dung;
	var Danh_sach_Nhan_vien_Theo_Chi_nhanh = Xu_ly.Doc_Danh_sach_Nhan_vien(Quan_ly_Chi_nhanh);
	var Chuoi_Tra_cuu = req.body.Th_Chuoi_Tra_cuu !== undefined ? req.body.Th_Chuoi_Tra_cuu : '';
	//===Biến đích
	var Danh_sach_Kq = Xu_ly.Tra_cuu_Nhan_vien(Danh_sach_Nhan_vien_Theo_Chi_nhanh, Chuoi_Tra_cuu);
	//=======Xử lý tạo giao diện
	var Chuoi_HTML =
		Xu_ly.Tao_Chuoi_Thuc_don_Nguoi_dung(Quan_ly_Chi_nhanh) +
		Xu_ly.Tao_Chuoi_HTML_Danh_sach_Nhan_vien(Danh_sach_Kq, Chuoi_Tra_cuu);
	Chuoi_HTML = Chuoi_HTML_Khung.replace('Chuoi_HTML', Chuoi_HTML);
	res.send(Chuoi_HTML);
});

//****************** Xử lý Biến cố Chọn Chức năng trên đối tượng *************************
Ung_dung.post('/Chon_Chuc_nang', (req, res) => {
	//===== Biến nguồn
	var Quan_ly_Chi_nhanh = req.session.Nguoi_dung;
	var Danh_sach_Nhan_vien_Theo_Chi_nhanh = Xu_ly.Doc_Danh_sach_Nhan_vien(Quan_ly_Chi_nhanh);
	var Ma_so_Chuc_nang = req.body.Th_Ma_so_Chuc_nang;
	var Ma_so_Nhan_vien = req.body.Th_Ma_so_Nhan_vien;
	var Nhan_vien = Danh_sach_Nhan_vien_Theo_Chi_nhanh.find((x) => x.Ma_so === Ma_so_Nhan_vien);
	//===== Tạo kết xuất
	var Chuoi_HTML = Xu_ly.Tao_Chuoi_Thuc_don_Nguoi_dung(Quan_ly_Chi_nhanh);
	if (Ma_so_Chuc_nang === 'Cap_nhat_Dien_thoai')
		Chuoi_HTML += Xu_ly.Tao_Chuoi_HTML_Chuc_nang_Cap_nhat_Dien_thoai(Nhan_vien);
	else if (Ma_so_Chuc_nang === 'Cap_nhat_Dia_chi')
		Chuoi_HTML += Xu_ly.Tao_Chuoi_HTML_Chuc_nang_Cap_nhat_Dia_chi(Nhan_vien);
	else if (Ma_so_Chuc_nang === 'Cap_nhat_Hinh') Chuoi_HTML += Xu_ly.Tao_Chuoi_HTML_Chuc_nang_Cap_nhat_Hinh(Nhan_vien);
	else if (Ma_so_Chuc_nang === 'Bo_sung_Ngoai_ngu')
		Chuoi_HTML += Xu_ly.Tao_Chuoi_HTML_Chuc_nang_Bo_sung_Ngoai_ngu(Nhan_vien, Cong_ty);
	else if (Ma_so_Chuc_nang === 'Chuyen_Don_vi')
		Chuoi_HTML += Xu_ly.Tao_Chuoi_HTML_Chuc_nang_Chuyen_Don_vi(Nhan_vien, Cong_ty, Quan_ly_Chi_nhanh);
	Chuoi_HTML = Chuoi_HTML_Khung.replace('Chuoi_HTML', Chuoi_HTML);
	res.send(Chuoi_HTML);
});

//****************** Xử lý Biến cố Thực hiện Chức năng *************************
Ung_dung.post('/Thuc_hien_Chuc_nang', (req, res) => {
	//===== Biến nguồn
	var Quan_ly_Chi_nhanh = req.session.Nguoi_dung;
	var Danh_sach_Nhan_vien_Theo_Chi_nhanh = Xu_ly.Doc_Danh_sach_Nhan_vien(Quan_ly_Chi_nhanh);
	var Ma_so_Chuc_nang = req.body.Th_Ma_so_Chuc_nang;
	var Ma_so_Nhan_vien = req.body.Th_Ma_so_Nhan_vien;
	var Nhan_vien = Danh_sach_Nhan_vien_Theo_Chi_nhanh.find((x) => x.Ma_so === Ma_so_Nhan_vien);
	//===== Tạo kết xuất
	var Chuoi_HTML = Xu_ly.Tao_Chuoi_Thuc_don_Nguoi_dung(Quan_ly_Chi_nhanh);
	if (Ma_so_Chuc_nang === 'Cap_nhat_Dien_thoai') {
		//===== Biến nguồn
		var Dien_thoai = req.body.Th_Dien_thoai;
		//===== Biến đích
		Nhan_vien.Dien_thoai = Dien_thoai;
		var Danh_sach_Nhan_vien_Xem = [ Nhan_vien ];
		//===== Tạo kết xuất
		Xu_ly.Ghi_Nhan_vien(Nhan_vien);
		Chuoi_HTML += Xu_ly.Tao_Chuoi_HTML_Danh_sach_Nhan_vien(Danh_sach_Nhan_vien_Xem, '');
	} else if (Ma_so_Chuc_nang === 'Cap_nhat_Dia_chi') {
		//===== Biến nguồn
		var Dia_chi = req.body.Th_Dia_chi;
		//===== Biến đích
		Nhan_vien.Dia_chi = Dia_chi;
		var Danh_sach_Nhan_vien_Xem = [ Nhan_vien ];
		//===== Tạo kết xuất
		Xu_ly.Ghi_Nhan_vien(Nhan_vien);
		Chuoi_HTML += Xu_ly.Tao_Chuoi_HTML_Danh_sach_Nhan_vien(Danh_sach_Nhan_vien_Xem, '');
	} else if (Ma_so_Chuc_nang === 'Cap_nhat_Hinh') {
		//===== Biến nguồn
		var Tap_tin_Hinh = req.files.Th_Hinh;
		//===== Biến đích
		var Danh_sach_Nhan_vien_Xem = [ Nhan_vien ];
		//===== Tạo kết xuất
		Xu_ly.Ghi_Hinh_Nhan_vien(Nhan_vien, Tap_tin_Hinh.data);
		Chuoi_HTML += Xu_ly.Tao_Chuoi_HTML_Danh_sach_Nhan_vien(Danh_sach_Nhan_vien_Xem, '');
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
		Chuoi_HTML += Xu_ly.Tao_Chuoi_HTML_Danh_sach_Nhan_vien(Danh_sach_Nhan_vien_Xem, '');
	} else if (Ma_so_Chuc_nang === 'Chuyen_Don_vi') {
		//===== Biến nguồn
		var Ma_so_Don_vi = req.body.Th_Ma_so_Don_vi;
		var Danh_sach_Don_vi_Trong_Chi_nhanh = Xu_ly.Doc_Danh_sach_Don_vi_Trong_Chi_nhanh(Cong_ty, Quan_ly_Chi_nhanh);
		//===== Biến đích
		var Don_vi_Moi = Danh_sach_Don_vi_Trong_Chi_nhanh.find((x) => x.Ma_so === Ma_so_Don_vi);
		Nhan_vien.Don_vi = Object.assign({}, Don_vi_Moi);
		var Danh_sach_Nhan_vien_Xem = [ Nhan_vien ];
		//===== Tạo kết xuất
		Xu_ly.Ghi_Nhan_vien(Nhan_vien);
		Chuoi_HTML += Xu_ly.Tao_Chuoi_HTML_Danh_sach_Nhan_vien(Danh_sach_Nhan_vien_Xem, '');
	}
	Chuoi_HTML = Chuoi_HTML_Khung.replace('Chuoi_HTML', Chuoi_HTML);
	res.send(Chuoi_HTML);
});
