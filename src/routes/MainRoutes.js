import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import NotFound from 'pages/NotFound';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const Parametre = Loadable(lazy(() => import('pages/Parametre')));
const Region = Loadable(lazy(() => import('pages/Region')));
const Agent = Loadable(lazy(() => import('pages/Agent')));
const Statistiques = Loadable(lazy(() => import('pages/Statistique')));
const Reponse = Loadable(lazy(() => import('pages/Reponse')));
const Demande = Loadable(lazy(() => import('pages/Demandes')));
const Rapport = Loadable(lazy(() => import('pages/Rapport')));
const Access = Loadable(lazy(() => import('pages/Access')));
const Delai = Loadable(lazy(() => import('pages/Delai')));
const Communication = Loadable(lazy(() => import('pages/Communication')));
const Search_history = Loadable(lazy(() => import('pages/Search_history')));
const Detail = Loadable(lazy(() => import('pages/Communication/Servey/Detail')));
// const Actions = Loadable(lazy(() => import('pages/Actions')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: '*',
      element: <NotFound />
    },
    {
      path: '/clients',
      element: <Parametre />
    },
    {
      path: '/access',
      element: <Access />
    },
    {
      path: '/region',
      element: <Region />
    },
    {
      path: '/agent',
      element: <Agent />
    },
    {
      path: '/reponses',
      element: <Reponse />
    },
    {
      path: '/demandes',
      element: <Demande />
    },
    {
      path: '/statistiques',
      element: <Statistiques />
    },
    {
      path: '/rapport',
      element: <Rapport />
    },
    {
      path: '/delai',
      element: <Delai />
    },
    {
      path: '/communication',
      element: <Communication />
    },
    {
      path: '/search_history',
      element: <Search_history />
    },
    {
      path: '/servey/:id',
      element: <Detail />
    }
  ]
};

export default MainRoutes;
