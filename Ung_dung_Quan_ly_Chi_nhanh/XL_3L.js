//1888049 - Võ Đại Nghĩa - nghiadaivo@gmail.com - Ứng dụng quản lý chi nhánh
//====== Xử lý Lưu trữ =======
const FS = require('fs');
const moment  = require('moment');
var Thu_muc_Du_lieu = '..\\Du_lieu';
var Thu_muc_HTML = Thu_muc_Du_lieu + '\\HTML';
var Thu_muc_Nhan_vien = Thu_muc_Du_lieu + '\\Nhan_vien';
var Thu_muc_Quan_ly_Chi_nhanh = Thu_muc_Du_lieu + '\\Quan_ly_Chi_nhanh';
var Thu_muc_Cong_ty = Thu_muc_Du_lieu + '\\Cong_ty';

class XL_3L {
	//=========================================================================== Xử lý Lưu trữ
	Doc_Khung_HTML() {
		var Duong_dan = Thu_muc_HTML + '\\Khung.html';
		var Chuoi_HTML = FS.readFileSync(Duong_dan, 'utf-8');
		return Chuoi_HTML;
	}

	Doc_Cong_ty() {
		var Duong_dan = Thu_muc_Cong_ty + '\\Cong_ty.json';
		var Chuoi_JSON = FS.readFileSync(Duong_dan, 'utf-8');
		var Cong_ty = JSON.parse(Chuoi_JSON);
		return Cong_ty;
	}

	Doc_Danh_sach_Nhan_vien(Quan_ly_Chi_nhanh) {
		var Danh_sach = [];
		var Danh_sach_Ten = FS.readdirSync(Thu_muc_Nhan_vien);
		Danh_sach_Ten.forEach((Ten) => {
			var Duong_dan = `${Thu_muc_Nhan_vien}\\${Ten}`;
			var Chuoi_JSON = FS.readFileSync(Duong_dan, 'utf8');
			var Nhan_vien = JSON.parse(Chuoi_JSON);
			if (Nhan_vien.Don_vi.Chi_nhanh.Ma_so === Quan_ly_Chi_nhanh.Chi_nhanh.Ma_so) Danh_sach.push(Nhan_vien);
		});
		return Danh_sach;
	}

	Doc_Danh_sach_Quan_ly_Chi_nhanh() {
		var Danh_sach_Quan_ly_Chi_nhanh = [];

		var Danh_sach_Ten = FS.readdirSync(Thu_muc_Quan_ly_Chi_nhanh);
		Danh_sach_Ten.forEach((Ten) => {
			var Duong_dan = `${Thu_muc_Quan_ly_Chi_nhanh}\\${Ten}`;
			var Chuoi_JSON = FS.readFileSync(Duong_dan, 'utf8');
			var Quan_ly_Chi_nhanh = JSON.parse(Chuoi_JSON);
			Danh_sach_Quan_ly_Chi_nhanh.push(Quan_ly_Chi_nhanh);
		});
		return Danh_sach_Quan_ly_Chi_nhanh;
	}

	Ghi_Nhan_vien(Nhan_vien) {
		var Duong_dan = `${Thu_muc_Nhan_vien}\\${Nhan_vien.Ma_so}.json`;
		var Chuoi_JSON = JSON.stringify(Nhan_vien, null, 4);
		FS.writeFileSync(Duong_dan, Chuoi_JSON);
	}

	Ghi_Hinh_Nhan_vien(Nhan_vien, Hinh) {
		var Duong_dan = `..\\Media\\${Nhan_vien.Ma_so}.png`;
		FS.writeFileSync(Duong_dan, Hinh);
	}

	//=========================================================================== Xử lý Nghiệp vụ
	Quan_ly_Chi_nhanh(Danh_sach_Quan_ly_Chi_nhanh, Ten_Dang_nhap, Mat_khau) {
		var Quan_ly_Chi_nhanh;

		Danh_sach_Quan_ly_Chi_nhanh.forEach((x) => {
			var Thoa_Dieu_kien = x.Ten_Dang_nhap === Ten_Dang_nhap && x.Mat_khau === Mat_khau;
			if (Thoa_Dieu_kien) Quan_ly_Chi_nhanh = x;
		});
		return Quan_ly_Chi_nhanh;
	}

	Tra_cuu_Nhan_vien(Danh_sach, Chuoi_Tra_cuu) {
		var Danh_sach_Kq = [];
		Chuoi_Tra_cuu = Chuoi_Tra_cuu.toUpperCase();
		Danh_sach.forEach((Nhan_vien) => {
			var Ho_ten = Nhan_vien.Ho_ten.toUpperCase();
			var Ten_Don_vi = Nhan_vien.Don_vi.Ten.toUpperCase();
			var Ten_Chi_nhanh = Nhan_vien.Don_vi.Chi_nhanh.Ten.toUpperCase();
			var Thoa_Dieu_kien_Tra_cuu =
				Ho_ten.includes(Chuoi_Tra_cuu) ||
				Ten_Don_vi.includes(Chuoi_Tra_cuu) ||
				Ten_Chi_nhanh.includes(Chuoi_Tra_cuu);
			if (Thoa_Dieu_kien_Tra_cuu) Danh_sach_Kq.push(Nhan_vien);
		});
		return Danh_sach_Kq;
	}

	Lap_Bao_cao_Ngoai_ngu(Danh_sach_Ngoai_ngu, Danh_sach_Nhan_vien) {
		var Bao_cao = {};
		Bao_cao.Tieu_de = 'Thống kê số nhân viên theo ngoại ngữ';
		Bao_cao.Danh_sach_Chi_tiet = [];
		Danh_sach_Ngoai_ngu.forEach((Ngoai_ngu) => {
			var Chi_tiet = {};
			Chi_tiet.Ten_Ngoai_ngu = Ngoai_ngu.Ten;
			var So_nhan_vien = 0;
			Danh_sach_Nhan_vien.forEach((Nhan_vien) => {
				if (Nhan_vien.Danh_sach_Ngoai_ngu.map((x) => x.Ma_so).join('_').includes(Ngoai_ngu.Ma_so))
					So_nhan_vien++;
			});
			Chi_tiet.So_nhan_vien = So_nhan_vien;
			var Ty_le = Chi_tiet.So_nhan_vien * 100.0 / Danh_sach_Nhan_vien.length;
			Chi_tiet.Ty_le = Ty_le.toFixed(2);
			Bao_cao.Danh_sach_Chi_tiet.push(Chi_tiet);
		});
		return Bao_cao;
	}

	Lap_Bao_cao_Don_vi(Danh_sach_Don_vi, Danh_sach_Nhan_vien) {
		var Bao_cao = {};
		Bao_cao.Tieu_de = 'Thống kê số nhân viên theo đơn vị';
		Bao_cao.Danh_sach_Chi_tiet = [];
		Danh_sach_Don_vi.forEach((Don_vi) => {
			var Chi_tiet = {};
			Chi_tiet.Ten_Don_vi = Don_vi.Ten;
			var So_nhan_vien = 0;
			Danh_sach_Nhan_vien.forEach((Nhan_vien) => {
				if (Nhan_vien.Don_vi.Ma_so === Don_vi.Ma_so) So_nhan_vien++;
			});
			Chi_tiet.So_nhan_vien = So_nhan_vien;
			var Ty_le = Chi_tiet.So_nhan_vien * 100.0 / Danh_sach_Nhan_vien.length;
			Chi_tiet.Ty_le = Ty_le.toFixed(2);
			Bao_cao.Danh_sach_Chi_tiet.push(Chi_tiet);
		});
		return Bao_cao;
	}
	//=========================================================================== Xử lý Thể hiện
	Tao_Chuoi_Tien_te(Muc_luong) {
		isNaN(Muc_luong) ? (Muc_luong = 0) : Muc_luong;
		var Chuoi = Muc_luong.toLocaleString('en-VN', { style: 'currency', currency: 'VND' }).replace(/,/g, '.');
		Chuoi = Chuoi.replace(Chuoi[0], '');
		return Chuoi;
	}

	Tao_Chuoi_Ngay(Ngay) {
		var Sinh_nhat = moment.utc(Ngay);
		var Nam_sinh = Sinh_nhat.format('YYYY');
		var Thang_sinh = Sinh_nhat.format('MM');
        var Ngay_sinh = Sinh_nhat.format('DD');
		var Chuoi = `${Ngay_sinh}/${Thang_sinh}/${Nam_sinh}`;
		return Chuoi;
	}

	Tao_Chuoi_HTML_Thong_bao(Thong_bao) {
		var Chuoi_HTML = `
            <div class='alert alert-info alert-dismissible' >
	            <button type="button" class="close" data-dismiss="alert">&times;</button>
	                ${Thong_bao}
	        </div>`;
		return Chuoi_HTML;
	}

	//********** Tạo Chuỗi HTML Danh sách
	Tao_Chuoi_HTML_Danh_sach_Nhan_vien(Danh_sach, Chuoi_Tra_cuu) {
		var Chuoi_HTML_Danh_sach = '<div>';
		Danh_sach.forEach((Nhan_vien) => {
			var Chuoi_Hinh = `<img src="/Media/${Nhan_vien.Ma_so}.png" style="width:60px;height:60px"/>`;
			var Chuoi_Ngoai_ngu = '';
			Nhan_vien.Danh_sach_Ngoai_ngu.forEach((Ngoai_ngu) => {
				Chuoi_Ngoai_ngu += Ngoai_ngu.Ten + ' ';
			});
			var Chuoi_Thong_tin = `
                <div class="btn" style="text-align:left"> 
					Họ và tên: ${Nhan_vien.Ho_ten} - Giới tính: ${Nhan_vien.Gioi_tinh}<br>
					CMND: ${Nhan_vien.CMND} - Ngày sinh: ${this.Tao_Chuoi_Ngay(Nhan_vien.Ngay_sinh)} - Lương: ${this.Tao_Chuoi_Tien_te(Nhan_vien.Muc_luong)}<br>
                    Điện thoại: ${Nhan_vien.Dien_thoai} - Mail: ${Nhan_vien.Mail}<br>
                    Địa chỉ: ${Nhan_vien.Dia_chi} - Đơn vị: ${Nhan_vien.Don_vi.Ten} - ${Nhan_vien.Don_vi.Chi_nhanh.Ten}<br>
                    Khả năng ngoại ngữ: ${Chuoi_Ngoai_ngu}<br>
                </div>`;

			var Chuoi_Thuc_don = `
                <div>
                    <form action="/Chon_chuc_nang" method="post" class="btn">
                        <input name="Th_Ma_so_Chuc_nang" value="Cap_nhat_Dien_thoai" type="hidden">
                        <input name="Th_Ma_so_Nhan_vien" value="${Nhan_vien.Ma_so}" type="hidden">
                        <button class="btn btn-outline-primary" type="submit">Cập nhật Điện thoại</button>
                    </form>
                    <form action="/Chon_chuc_nang" method="post" class="btn">
                        <input name="Th_Ma_so_Chuc_nang" value="Cap_nhat_Dia_chi" type="hidden">
                        <input name="Th_Ma_so_Nhan_vien" value="${Nhan_vien.Ma_so}" type="hidden">
                        <button class="btn btn-outline-primary" type="submit">Cập nhật Địa chỉ</button>
                    </form>
                    <form action="/Chon_chuc_nang" method="post" class="btn">
                        <input name="Th_Ma_so_Chuc_nang" value="Cap_nhat_Hinh" type="hidden">
                        <input name="Th_Ma_so_Nhan_vien" value="${Nhan_vien.Ma_so}" type="hidden">
                        <button class="btn btn-outline-primary" type="submit">Cập nhật Ảnh đại diện</button>
                    </form>
                    <form action="/Chon_chuc_nang" method="post" class="btn">
						<input name="Th_Ma_so_Chuc_nang" value="Bo_sung_Ngoai_ngu" type="hidden">
						<input name="Th_Ma_so_Nhan_vien" value="${Nhan_vien.Ma_so}" type="hidden">
						<button class="btn btn-outline-primary" type="submit">Bổ sung Ngoại ngữ</button>
					</form>
					<form action="/Chon_chuc_nang" method="post" class="btn">
						<input name="Th_Ma_so_Chuc_nang" value="Chuyen_Don_vi" type="hidden">
						<input name="Th_Ma_so_Nhan_vien" value="${Nhan_vien.Ma_so}" type="hidden">
						<button class="btn btn-outline-primary" type="submit">Chuyển đơn vị</button>
					</form>
                </div>`;

			var Chuoi_HTML = `
                <div class="alert alert-info">
                    ${Chuoi_Thuc_don} ${Chuoi_Hinh} ${Chuoi_Thong_tin}
                </div>`;

			Chuoi_HTML_Danh_sach += Chuoi_HTML;
		});
		Chuoi_HTML_Danh_sach += '</div>';
		var Chuoi_Thuc_don_Danh_sach = `
            <div style="background-color:gray; margin:10px">
                <form action="/Tra_cuu" method="post" class="btn">
					<input name="Th_Chuoi_Tra_cuu" value="${Chuoi_Tra_cuu}" spellcheck="false" placeholder="Tìm kiếm nhân viên" class="mr-2">
					<button type="submit" class="btn btn-outline-warning">Tìm kiếm</button>
                </form>
                <div class="badge badge-info">${Danh_sach.length}</div>
            </div>`;
		return Chuoi_Thuc_don_Danh_sach + Chuoi_HTML_Danh_sach;
	}

	//**********  Tạo Chuỗi HTML Chức năng
	Tao_Chuoi_HTML_Dang_nhap(Ten_Dang_nhap = '', Mat_khau = '', Thong_bao = '') {
		var Chuoi_HTML = `
            <form action="/Dang_nhap" method="post" >
                <div class="alert" style="height:10px">
                    Đăng nhập
                </div>
                <div class="alert" style="height:30px">
                    <input name="Th_Ten_Dang_nhap" required="required" value="${Ten_Dang_nhap}" placeholder="Tên đăng nhập">
                </div>
                <div class="alert" style="height:30px">
                    <input name="Th_Mat_khau" type="password" required="required" value="${Mat_khau}" placeholder="Mật khẩu">
                </div>
                <div class="alert" style="height:30px">
                    <button class="btn btn-danger" type="submit">Đồng ý</button>
                </div>
                <div>${Thong_bao}</div>
            </form>`;
		return Chuoi_HTML;
	}

	Tao_Chuoi_HTML_Chuc_nang_Cap_nhat_Dien_thoai(Nhan_vien) {
		var Chuoi_HTML = `
            <form action="/Thuc_hien_Chuc_nang" method="post" >
                <div class="alert" style="height:10px">
                    Cập nhật điện thoại
                </div>
                <div class="alert" style="height:30px">
                    <input name="Th_Ma_so_Chuc_nang" value="Cap_nhat_Dien_thoai" type="hidden">
                    <input name="Th_Ma_so_Nhan_vien" value="${Nhan_vien.Ma_so}" type="hidden">
                    <input name="Th_Dien_thoai" value="${Nhan_vien.Dien_thoai}" required="required" spellcheck="false" autocomplete="off"/>
                </div>
                <div class="alert" style="height:40px">
                    <button class="btn btn-danger" type="submit">Đồng ý</button>
                </div>
            </form>`;
		return Chuoi_HTML;
	}

	Tao_Chuoi_HTML_Chuc_nang_Cap_nhat_Dia_chi(Nhan_vien) {
		var Chuoi_HTML = `
            <form action="/Thuc_hien_Chuc_nang" method="post">
                <div class="alert" style="height:10px">
                    Cập nhật địa chỉ
                </div>
                <div class="alert" style="height:50px">
                    <input name="Th_Ma_so_Chuc_nang" value="Cap_nhat_Dia_chi" type="hidden">
                    <input name="Th_Ma_so_Nhan_vien" value="${Nhan_vien.Ma_so}" type="hidden">
                    <textarea name="Th_Dia_chi" required="required" cols="100" rows="2">${Nhan_vien.Dia_chi}</textarea>
                </div>
                <div class="alert" style="height:40px">
                    <button class="btn btn-danger" type="submit">Đồng ý</button>
                </div>
            </form>`;
		return Chuoi_HTML;
	}

	Tao_Chuoi_HTML_Chuc_nang_Cap_nhat_Hinh(Nhan_vien) {
		var Chuoi_HTML = `
            <form action="/Thuc_hien_Chuc_nang" method="post" enctype="multipart/form-data">
                <div class="alert" style="height:10px">
                    Cập nhật hình
                </div>
                <div class="alert" style="height:30px">
                    <input name="Th_Ma_so_Chuc_nang" value="Cap_nhat_Hinh" type="hidden">
                    <input name="Th_Ma_so_Nhan_vien" value="${Nhan_vien.Ma_so}" type="hidden">
                    <input type="file" name="Th_Hinh" accept="image/png">
                </div>
                <div class="alert" style="height:40px">
                    <button class="btn btn-danger" type="submit" id="submit_button1" disabled>Đồng ý</button>
                </div>
			</form>`;
		return Chuoi_HTML;
	}

	Tao_Chuoi_HTML_Chuc_nang_Bo_sung_Ngoai_ngu(Nhan_vien, Cong_ty) {
		var Chuoi_HTML_Bo_sung = '';
		Cong_ty.Danh_sach_Ngoai_ngu.forEach((Ngoai_ngu) => {
			Nhan_vien.Danh_sach_Ngoai_ngu.find((x) => x.Ma_so === Ngoai_ngu.Ma_so)
				? (Chuoi_HTML_Bo_sung += `
					<label>
						<input type="checkbox" name="Th_Ma_so_Ngoai_ngu" value="${Ngoai_ngu.Ma_so}" checked="checked"> ${Ngoai_ngu.Ten}
					</label><br>`)
				: (Chuoi_HTML_Bo_sung += `
					<label>
						<input type="checkbox" name="Th_Ma_so_Ngoai_ngu" value="${Ngoai_ngu.Ma_so}"> ${Ngoai_ngu.Ten}
					</label><br>`);
		});
		var Chuoi_HTML = `
            <form action="/Thuc_hien_Chuc_nang" method="post">
                <div class="alert" style="height:40px">
					Bổ sung ngoại ngữ 
					<button class="btn btn-danger ml-2" type="submit" id="submit_button2" disabled>Đồng ý</button>
                </div>
                <div class="alert" style="height:30px">
                    <input name="Th_Ma_so_Chuc_nang" value="Bo_sung_Ngoai_ngu" type="hidden">
					<input name="Th_Ma_so_Nhan_vien" value="${Nhan_vien.Ma_so}" type="hidden">
                    ${Chuoi_HTML_Bo_sung}
				</div>
			</form>`;
		return Chuoi_HTML;
	}

	Doc_Danh_sach_Don_vi_Trong_Chi_nhanh(Cong_ty, Quan_ly_Chi_nhanh) {
		var Danh_sach_Don_vi = [];
		Cong_ty.Danh_sach_Don_vi.forEach((Don_vi) => {
			if (Don_vi.Chi_nhanh.Ma_so === Quan_ly_Chi_nhanh.Chi_nhanh.Ma_so) Danh_sach_Don_vi.push(Don_vi);
		});

		return Danh_sach_Don_vi;
	}

	Tao_Chuoi_HTML_Chuc_nang_Chuyen_Don_vi(Nhan_vien, Cong_ty, Quan_ly_Chi_nhanh) {
		var Danh_sach_Don_vi_Trong_Chi_nhanh = this.Doc_Danh_sach_Don_vi_Trong_Chi_nhanh(Cong_ty, Quan_ly_Chi_nhanh);
		var Chuoi_HTML_Bo_sung = '';
		Danh_sach_Don_vi_Trong_Chi_nhanh.forEach((Don_vi) => {
			Nhan_vien.Don_vi.Ma_so === Don_vi.Ma_so
				? (Chuoi_HTML_Bo_sung += `
					<label>
						<input type="radio" name="Th_Ma_so_Don_vi" value="${Don_vi.Ma_so}" checked="checked"> ${Don_vi.Ten}
					</label><br>`)
				: (Chuoi_HTML_Bo_sung += `
					<label>
						<input type="radio" name="Th_Ma_so_Don_vi" value="${Don_vi.Ma_so}"> ${Don_vi.Ten}
					</label><br>`);
		});
		var Chuoi_HTML = `
            <form action="/Thuc_hien_Chuc_nang" method="post">
                <div class="alert" style="height:40px">
					Chuyển đơn vị
					<button class="btn btn-danger ml-2" type="submit">Đồng ý</button>
                </div>
                <div class="alert" style="height:30px">
                    <input name="Th_Ma_so_Chuc_nang" value="Chuyen_Don_vi" type="hidden">
					<input name="Th_Ma_so_Nhan_vien" value="${Nhan_vien.Ma_so}" type="hidden">
                    ${Chuoi_HTML_Bo_sung}
				</div>
			</form>`;
		return Chuoi_HTML;
	}
	Tao_Chuoi_HTML_Bao_cao_Don_vi(Bao_cao) {
		var Chuoi_HTML_Bao_cao = `<div class="alert alert-info">${Bao_cao.Tieu_de}</div>`;
		Chuoi_HTML_Bao_cao += `
            <div class="row" style="margin:10px">
                <div class="col-md-2 btn btn-info">Đơn vị</div>
                <div class="col-md-2 btn btn-info">Số nhân viên</div>
                <div class="col-md-2 btn btn-info">Tỷ lệ</div>
            </div>`;
		Bao_cao.Danh_sach_Chi_tiet.forEach((Chi_tiet) => {
			Chuoi_HTML_Bao_cao += `
                <div class="row" style="margin:10px">
                    <div class="col-md-2">${Chi_tiet.Ten_Don_vi}</div>
                    <div class="col-md-2">${Chi_tiet.So_nhan_vien}</div>
                    <div class="col-md-2">${Chi_tiet.Ty_le}%</div>
                </div>`;
		});
		return Chuoi_HTML_Bao_cao;
	}

	Tao_Chuoi_HTML_Bao_cao_Ngoai_ngu(Bao_cao) {
		var Chuoi_HTML_Bao_cao = `<div class="alert alert-info">${Bao_cao.Tieu_de}</div>`;

		Bao_cao.Danh_sach_Chi_tiet.forEach((Chi_tiet) => {
			var Chuoi_Hinh = '';
			var Chuoi_Thong_tin = `<div class="btn">
                                        <div class="btn btn-primary">${Chi_tiet.Ten_Ngoai_ngu}</div><br>
                                        ${Chi_tiet.So_nhan_vien} Nhân viên<br>
                                        ${Chi_tiet.Ty_le}%
                                    </div>`;
			var Chuoi_HTML = `<div class="btn">
                                ${Chuoi_Hinh}
                                ${Chuoi_Thong_tin}
                            </div>`;
			Chuoi_HTML_Bao_cao += Chuoi_HTML;
		});
		return Chuoi_HTML_Bao_cao;
	}

	Tao_Chuoi_Thuc_don_Nguoi_dung(Nguoi_dung) {
		var Chuoi_Thuc_don = `
            <div>
                <form action="/Quan_ly/Chon_chuc_nang" method="post" class="btn">
                    <input name="Th_Ma_so_Chuc_nang" value="Quan_ly_Nhan_vien" type="hidden">
                    <button type="submit" class="btn btn-danger">Quản lý<br>Nhân viên</button>
                </form>
                <form action="/Quan_ly/Chon_chuc_nang" method="post" class="btn">
                    <input name="Th_Ma_so_Chuc_nang" value="Bao_cao_Don_vi" type="hidden">
                    <button type="submit" class="btn btn-danger">Báo cáo<br>Đơn vị</button>
                </form>
                <form action="/Quan_ly/Chon_chuc_nang" method="post" class="btn">
                    <input name="Th_Ma_so_Chuc_nang" value="Bao_cao_Ngoai_ngu" type="hidden">
                    <button type="submit" class="btn btn-danger">Báo cáo<br>Ngoại ngữ</button>
                </form>
            </div>`;
		return Chuoi_Thuc_don;
	}
}
module.exports = new XL_3L();
