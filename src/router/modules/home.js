export default [{
	path: '',
	name: 'homeName',
	meta: {
		title: 'undefined',
		hideInMenu: true,
		access: ['super_admin', 'admin', 'user'],
		icon: 'undefined',
		hideInBread: true,
		notCache: true
	},
	component: () => import('@/layout/parentHeader'),
	children: [{
		path: '/home',
		name: 'home',
		meta: {
			title: 'undefined',
			hideInMenu: true,
			access: ['super_admin', 'admin', 'user'],
			icon: 'undefined',
			hideInBread: true,
			notCache: true
		},
		component: () => import('@/views/home/home.vue')
	}]
}]