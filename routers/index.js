var express = require('express');
var router = express.Router();
var firstImage = require('../modules/firstimage');
var ChuDe = require('../models/chude');
var BaiViet = require('../models/baiviet');

// GET: Trang chủ
router.get('/', async (req, res) => {
	//Lay chuyen muc hiem thi vao menu
	var cm = await ChuDe.find();

	//Lay 12 bai viet moi nhat
	var bv = await BaiViet.find({ KiemDuyet: 1})
		.sort({ NgayDang: -1 })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.limit(12).exec();
	
	// Lay 3 bai viet xem nhieu nhat hiem thi vao cot phai
	var xnn = await BaiViet.find({ KiemDuyet: 1})
		.sort({ LuotXem: -1 })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.limit(3).exec();

	res.render('index', {
		title: 'Trang chủ',
		chuyenmuc: cm,
		baiviet: bv,
		xemnhieunhat: xnn,
		firstImage: firstImage
	});

});

// GET: Lấy các bài viết cùng mã chủ đề
router.get('/baiviet/chude/:id', async (req, res) => {
	var id = req.params.id;

	// Lay chuyen muc hiem thi vao menu
	var cm = await ChuDe.find();

	// Lay thong tin chu de hien thi
	var cd = await ChuDe.findById(id);

	// Lay 8 bai viet moi nhat cung chuyen muc
	var bv = await BaiViet.find({ ChuDe: id })
		.sort({ NgayDang: -1 })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.limit(8).exec();
	
	// Lay 3 bai viet xem nhieu nhat hien thi vao cot phai
	var xnn = await BaiViet.find({ ChuDe: id, KiemDuyet: 1 })
		.sort({ LuotXem: -1 })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.limit(3).exec();
	
	res.render('baiviet_chude', {
		title: 'Bài viết cung chuyen muc',
		chuyenmuc: cm,
		chude: cd,
		baiviet: bv,
		xemnhieunhat: xnn,
		firstImage: firstImage
	});
});

// GET: Xem bài viết
router.get('/baiviet/chitiet/:id', async (req, res) => {
	var id = req.params.id;

	// Lay chuyen muc hiem thi vao menu
	var cm = await ChuDe.find();

	// Lay thong tin bai viet hien thi
	var bv = await BaiViet.findById(id)
		.populate('ChuDe')
		.populate('TaiKhoan')
		.exec();
	
	// xu ly tang luot xem bai viet
	await BaiViet.findByIdAndUpdate(id, {
		LuotXem: bv.LuotXem + 1 });

	// Lay 3 bai viet xem nhieu nhat hien thi vao cot phai
	var xnn = await BaiViet.find({ KiemDuyet: 1 })
		.sort({ LuotXem: -1 })
		.populate('ChuDe')
		.populate('TaiKhoan')
		.limit(3).exec();

	res.render('baiviet_chitiet', {
		title: 'Bài viết chi tiết',
		chuyenmuc: cm,
		baiviet: bv,
		xemnhieunhat: xnn,
		firstImage: firstImage
	});
});

// GET: Tin mới nhất
router.get('/tinmoi', async (req, res) => {
	res.render('tinmoinhat', {
		title: 'Tin mới nhất'
	});
});

// POST: Kết quả tìm kiếm
router.post('/timkiem', async (req, res) => {
	var tukhoa = req.body.tukhoa;
	
	// Xử lý tìm kiếm bài viết
	var bv = await BaiViet.find({
		KiemDuyet: 1,
		$or: [ // tìm kiếm theo từ khoá ko phân biệt hoa thường
			{ TieuDe: { $regex: tukhoa, $options: 'i' } },
			{ NoiDung: { $regex: tukhoa, $options: 'i' } }
		]
	})
	.populate('ChuDe')
	.populate('TaiKhoan');
	
	res.render('timkiem', {
		title: 'Kết quả tìm kiếm',
		baiviet: bv,
		tukhoa: tukhoa,
		firstImage: firstImage // hiển thị hình ảnh đi kèm
	});
});

// GET: Lỗi
router.get('/error', async (req, res) => {
	res.render('error', {
		title: 'Lỗi'
	});
});

// GET: Thành công
router.get('/success', async (req, res) => {
	res.render('success', {
		title: 'Hoàn thành'
	});
});

module.exports = router;