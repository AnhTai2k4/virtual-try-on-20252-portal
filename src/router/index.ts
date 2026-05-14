import { createWebHistory, createRouter } from 'vue-router';
import { AppLayout } from '@/components';
import { AppConfig } from '@/configs';

import Dashboard from '@/pages/Dashboard.vue';
import Settings from '@/pages/Settings.vue';
import Analytics from '@/pages/Analytics.vue';
import Customize from '@/pages/Customize.vue';
import Products from '@/pages/Products.vue';
import Pricings from '@/pages/Pricings.vue';


const routes = [
  {
    path: '/',
    component: AppLayout,
    meta: {
      appSlug: AppConfig.APP_SLUG,
      appName: AppConfig.APP_NAME,
    },
    children: [
      {
        path: '', 
        name: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'settings', 
        name: 'settings',
        component: Settings,
      },
      {
        path: 'analytics',
        name: 'analytics',
        component: Analytics,
      },
      {
        path: 'customizes',
        name: 'customizes',
        component: Customize,
      },
      {
        path: 'pricings',
        name: 'pricings',
        component: Pricings,
      },
      {
        path: 'products',
        name: 'products',
        component: Products,
      }
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
