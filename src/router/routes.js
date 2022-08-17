
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ActiveEmployees.vue') },
      { path: '/sample_page', component: () => import('pages/IndexPage.vue') },
      { path: '/employee_details', component: () => import('components/EmployeeTable.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
