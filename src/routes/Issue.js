import { lazy } from 'react';
// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import Technical from 'pages/Rapport/Technical';
const AppelDsh = Loadable(lazy(() => import('pages/Issue/Appel')));
//const Appel = Loadable(lazy(() => import('pages/Issue/Appel/Dashboard/SuperUser')));
const Plainte = Loadable(lazy(() => import('pages/Issue/Plainte')));
const RapportVisite = Loadable(lazy(() => import('pages/Rapport/VisiteMenage')));
const Contact = Loadable(lazy(() => import('pages/Rapport/Contact')));
const Tech_value = Loadable(lazy(() => import('pages/Issue/Appel/Table/Technical')));
const Promesse_Payement = Loadable(lazy(() => import('pages/Rapport/Promesse_Payement')));
const IndexEdit = Loadable(lazy(() => import('pages/Issue/Appel/Component/IndexEdit')));
const Non_Technique = Loadable(lazy(() => import('pages/Issue/Appel/Table/N_Technical')));
const Renseignement = Loadable(lazy(() => import('pages/Rapport/Renseignement')));
// const Actions = Loadable(lazy(() => import('pages/Actions')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/call',
      element: <AppelDsh />
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
    },
    {
      path: '/edit',
      element: <IndexEdit />
    },

    {
      path: '/tech_value',
      element: <Tech_value />
    },
    {
      path: '/n_tech_value',
      element: <Non_Technique />
    },
    {
      path: '/r_renseignement',
      element: <Renseignement />
    }
  ]
};

export default MainRoutes;
