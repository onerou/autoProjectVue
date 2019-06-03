export default [{
	path: '',
	name: 'loginName',
	meta: {
		"title": "undefined",
		"hideInMenu": true,
		"access": ['super_admin', 'admin', 'user'],
		"icon": "undefined",
		"hideInBread": true,
		"notCache": true
	},
	component: () => import('@/layout/iframe'),
	children: [{
		path: '/login',
		name: 'login',
		meta: {
			"title": "undefined",
			"hideInMenu": true,
			"access": ['super_admin', 'admin', 'user'],
			"icon": "undefined",
			"hideInBread": true,
			"notCache": true
		},
		component: () => import('@/views/login/login.vue')
	}]
}]