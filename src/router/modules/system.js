
export default [
  {
    path: '',
		name: 'systemName',
		meta:{
			"title": "undefined",
			"hideInMenu": true,
			"access":['super_admin','admin','user'],
			"icon": "undefined",
			"hideInBread": true,
			"notCache": true
		},
    component: () => import('@/layout/parentHeader'),
    children: [
      {
        path: '/system',
				name: 'system',
				meta:{
					"title": "undefined",
					"hideInMenu": true,
					"access":['super_admin','admin','user'],
					"icon": "undefined",
					"hideInBread": true,
					"notCache": true
				},
        component: () => import('@/views/system/system.vue')
      }
    ]
  }
]
