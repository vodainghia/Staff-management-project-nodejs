//1888049 - Võ Đại Nghĩa - nghiadaivo@gmail.com - Ứng dụng nhân viên
//====== Xử lý Lưu trữ =======
const FS = require('fs');
const moment = require('moment');
var Thu_muc_Du_lieu = '..\\Du_lieu';
var Thu_muc_Nhan_vien = Thu_muc_Du_lieu + '\\Nhan_vien';
var Thu_muc_HTML = Thu_muc_Du_lieu + '\\HTML';
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

	Doc_Danh_sach_Nhan_vien() {
		var Danh_sach = [];

		var Danh_sach_Ten = FS.readdirSync(Thu_muc_Nhan_vien);
		Danh_sach_Ten.forEach((Ten) => {
			var Duong_dan = `${Thu_muc_Nhan_vien}\\${Ten}`;
			var Chuoi_JSON = FS.readFileSync(Duong_dan, 'utf8');
			var Nhan_vien = JSON.parse(Chuoi_JSON);
			Danh_sach.push(Nhan_vien);
		});
		return Danh_sach;
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

	//**********  Tạo Chuỗi HTML Danh sách
	Tao_Chuoi_HTML_Danh_sach_Nhan_vien(Danh_sach) {
		var Chuoi_HTML_Danh_sach = '<div>';
		Danh_sach.forEach((Nhan_vien) => {
			var Chuoi_Hinh = `<img src='/Media/${Nhan_vien.Ma_so}.png' style='width:60px;height:60px'/>`;
			var Chuoi_Ngoai_ngu = '';
			Nhan_vien.Danh_sach_Ngoai_ngu.forEach((Ngoai_ngu) => {
				Chuoi_Ngoai_ngu += Ngoai_ngu.Ten + ' ';
			});
			var Chuoi_Thong_tin = `
            <div class="btn" style="text-align:left"> 
                Họ và tên: ${Nhan_vien.Ho_ten} - Giới tính: ${Nhan_vien.Gioi_tinh}<br>
                CMND: ${Nhan_vien.CMND} - Ngày sinh: ${this.Tao_Chuoi_Ngay(
				Nhan_vien.Ngay_sinh
			)} - Lương: ${this.Tao_Chuoi_Tien_te(Nhan_vien.Muc_luong)}<br>
                Điện thoại: ${Nhan_vien.Dien_thoai} - Mail: ${Nhan_vien.Mail}<br>
                Địa chỉ: ${Nhan_vien.Dia_chi} - Đơn vị: ${Nhan_vien.Don_vi.Ten} - ${Nhan_vien.Don_vi.Chi_nhanh.Ten}<br>
                Khả năng ngoại ngữ: ${Chuoi_Ngoai_ngu}<br>
            </div>`;

			var Chuoi_HTML = `
                <div class='alert alert-primary' style="margin:10px">
                    ${Chuoi_Hinh} ${Chuoi_Thong_tin}
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
                </div>`;

			Chuoi_HTML = Chuoi_Thuc_don + Chuoi_HTML;
			Chuoi_HTML_Danh_sach += Chuoi_HTML;
		});
		Chuoi_HTML_Danh_sach += '</div>';
		return Chuoi_HTML_Danh_sach;
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
}

module.exports = new XL_3L();
