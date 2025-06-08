import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
const NotFound = Loadable(lazy(() => import('pages/NotFound')));
const Feedback = Loadable(lazy(() => import('pages/Feedback')));
const Clients = Loadable(lazy(() => import('pages/Clients')));
const MesClients = Loadable(lazy(() => import('pages/mesClients')));
const ChangeByExcel = Loadable(lazy(() => import('pages/mesClients/ChangeByExcel')));
const Rapport = Loadable(lazy(() => import('pages/Rapport')));
const DetailClient = Loadable(lazy(() => import('pages/detailClient')));
const Historique = Loadable(lazy(() => import('pages/Historique')));
const Customer = Loadable(lazy(() => import('pages/mesClients/StatusDash/ShowCustomer')));
//const Performance = Loadable(lazy(() => import('pages/Performance')));
const Arbitrage = Loadable(lazy(() => import('pages/Arbitrage')));
const Action = Loadable(lazy(() => import('pages/Validation')));
const Decision = Loadable(lazy(() => import('pages/Decision')));
const ChangeByFile = Loadable(lazy(() => import('pages/Decision/ChangeByFile')));
const ArbitrageExcel = Loadable(lazy(() => import('pages/Arbitrage/ChangeByExcel')));
const ValidationActionByFile = Loadable(lazy(() => import('pages/Validation/ExcelValidation')));
const Appel = Loadable(lazy(() => import('pages/Appel')));
const ChangeStatusExcel = Loadable(lazy(() => import('pages/mesClients/ChangeByExcel')));
const ChangeDecisionExcel = Loadable(lazy(() => import('pages/mesClients/DecisionExcel')));
const ChangeActionExcel = Loadable(lazy(() => import('pages/mesClients/ActionExcel')));

// ==============================|| MAIN ROUTING ||============================== //

const AdminRoute = {
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
      path: '/feedback',
      element: <Feedback />
    },
    {
      path: '/folder',
      element: <Clients />
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
      path: '/arbitrage',
      element: <Arbitrage />
    },
    {
      path: '/action',
      element: <Action />
    },
    {
      path: '/excel_decision',
      element: <ChangeByFile />
    },
    {
      path: '/action_validation',
      element: <ValidationActionByFile />
    },
    {
      path: '/arbitrage_excel',
      element: <ArbitrageExcel />
    },
    {
      path: '/import_excel_call',
      element: <Appel />
    },
    {
      path: '/change_status_excel',
      element: <ChangeStatusExcel />
    },
    {
      path: '/change_decision_excel',
      element: <ChangeDecisionExcel />
    },
    {
      path: '/change_action_excel',
      element: <ChangeActionExcel />
    },
    {
      path: '/decision',
      element: <Decision />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ]
};

export default AdminRoute;
