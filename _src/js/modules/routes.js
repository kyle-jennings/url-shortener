// views
import HomeView from '../views/Home';
import NewAlias from '../views/NewAlias';
import ListAll from '../views/ListAll';

export default [
  // home
  {
    name: 'home',
    label: 'home',
    path: '/',
    component: HomeView,
    meta: {
      navbar: false,
    },
  },
  {
    name: 'new',
    label: 'new',
    path: '/new',
    component: NewAlias,
    meta: {
      navbar: true,
    },
  },
  {
    name: 'list',
    label: 'list',
    path: '/list',
    component: ListAll,
    meta: {
      navbar: true,
    },
  },
  {
    name: 'delete',
    label: 'delete',
    path: '/delete',
    component: null,
    meta: {
      navbar: false,
    },
  },
  // catch all
  {
    name: 'default',
    path: '*',
    component: null,
  },
];
