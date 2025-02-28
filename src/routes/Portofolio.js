import { lazy } from 'react';
// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
//const Appel = Loadable(lazy(() => import('pages/Issue/Appel/Dashboard/SuperUser')));
const Portofolio = Loadable(lazy(() => import('pages/Portofolio/Feedback')));
const Parametre = Loadable(lazy(() => import('pages/Portofolio/Parametre')));

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/portfolio',
      element: <Portofolio />
    },
    {
      path: '/p_parametre',
      element: <Parametre />
    }
  ]
};

export default MainRoutes;
