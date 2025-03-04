import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
const NotFound = Loadable(lazy(() => import('pages/NotFound')));
const MesClients = Loadable(lazy(() => import('pages/mesClients')));
const ChangeByExcel = Loadable(lazy(() => import('pages/mesClients/ChangeByExcel')));
const Rapport = Loadable(lazy(() => import('pages/Rapport')));
const DetailClient = Loadable(lazy(() => import('pages/detailClient')));
const Historique = Loadable(lazy(() => import('pages/Historique')));
const Customer = Loadable(lazy(() => import('pages/mesClients/StatusDash/ShowCustomer')));
const Performance = Loadable(lazy(() => import('pages/Performance')));
const Arbitrage = Loadable(lazy(() => import('pages/Arbitrage')));

// ==============================|| MAIN ROUTING ||============================== //

const OtherRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/mesclients',
      element: <MesClients />
    },
    {
      path: '/',
      element: <DashboardDefault />
    },

    {
      path: '/excelFile',
      element: <ChangeByExcel />
    },
    {
      path: '/rapport',
      element: <Rapport />
    },

    {
      path: '/customer_information',
      element: <DetailClient />
    },
    {
      path: '/historique',
      element: <Historique />
    },

    {
      path: '/customers',
      element: <Customer />
    },
    {
      path: '/performance',
      element: <Performance />
    },
    {
      path: '/arbitrage',
      element: <Arbitrage />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ]
};

export default OtherRoutes;
