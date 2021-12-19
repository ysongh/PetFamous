import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/create-pet',
    name: 'Create Pet',
    component: () => import('../views/CreatePet.vue'),
  },
  {
    path: '/pet/:id',
    name: 'Pet Detail',
    component: () => import('../views/PetDetail.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  // history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
