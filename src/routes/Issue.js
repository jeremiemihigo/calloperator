import { lazy } from 'react';
// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import Technical from 'pages/Rapport/Technical';
const Appel = Loadable(lazy(() => import('pages/Issue/Appel')));
const Plainte = Loadable(lazy(() => import('pages/Issue/Plainte')));
const RapportVisite = Loadable(lazy(() => import('pages/Rapport/VisiteMenage')));
const Call = Loadable(lazy(() => import('pages/Rapport/Call')));
const Contact = Loadable(lazy(() => import('pages/Rapport/Contact')));
const Promesse_Payement = Loadable(lazy(() => import('pages/Rapport/Promesse_Payement')));

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
      path: '/r_visit',
      element: <RapportVisite />
    },
    {
      path: '/r_call',
      element: <Call />
    },
    {
      path: '/r_callclient',
      element: <Contact />
    },
    {
      path: '/r_technical',
      element: <Technical />
    },
    {
      path: '/r_callback',
      element: <Promesse_Payement />
    }
  ]
};

export default MainRoutes;
