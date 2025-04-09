export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	
	{
		path: '/monhoc',
		name: 'Môn Học',
		component: './MonHoc',
		icon: 'PicRightOutlined',
	},
	{
		path: '/ProfileCard',
		name: 'ProfileCard',
		component: './ProfileCard',
		icon: 'BulbOutlined',
	},
	{
		name: 'TH4',
		path: '/TH4',
		icon: 'ClockCircleOutlined',
		routes: [
			{
				path: 'UngVienDangKy',
				name: 'Ứng Viên Đăng Ký',
				component: './TH4/UngVienDangKy',  
			},
			{
				path: 'QuanLyDonDangKy',
				name: 'Quản Lý Đơn Đăng Ký',
				component: './TH4/QuanLyDonDangKy',  
			},
			{
				path: 'Thong ke',
				name: 'Thống Kê',
				component: './TH4/ThongKe',  
			},
		]
	},
	
	

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
