import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Explore',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Profile',
    path: '/profile',
    icon: icon('ic_user'),
  },
  {
    title: 'Journey',
    path: '/journey',
    icon: icon('ic_cart'),
  },
  {
    title: 'logout',
    path: '/login',
    icon: icon('ic_lock'),
  },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
