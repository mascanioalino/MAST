import Vue from 'vue';
import VueRouter from 'vue-router';

import AccountPage from './components/Account/AccountPage.vue';
import HomePage from './components/Home/HomePage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import ScanPage from './components/Scan/ScanPage.vue';
import AddWorkPage from './components/Scan/AddWorkPage.vue';
import NotFound from './NotFound.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/', name: 'Home', component: HomePage},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '/login', name: 'Login', component: LoginPage},
  {path: '/scan', name: 'Scan', component: ScanPage},
  {path: '/work/:harvardId', name: 'Add Work', component: AddWorkPage},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.username) {
      next({name: 'Account'}); // Go to Account page if user navigates to Login and are signed in
      return;
    }

    if (to.name === 'Account' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Account and are not signed in
      return;
    }
  }

  next();
});

export default router;
