import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

const Appel = Loadable(lazy(() => import('pages/Issue/Appel')));
const Plainte = Loadable(lazy(() => import('pages/Issue/Plainte')));
const RapportVisite = Loadable(lazy(() => import('pages/Rapport/VisiteMenage')));
const Call = Loadable(lazy(() => import('pages/Rapport/Call')));

// const Actions = Loadable(lazy(() => import('pages/Actions')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/call',
      element: <Appel />
    },
    {
      path: '/plainte',
      element: <Plainte />
    },
    {
      path: '/rapport/visit',
      element: <RapportVisite />
    },
    {
      path: '/rapport/call',
      element: <Call />
    }
  ]
};

export default MainRoutes;
