import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard

// render - sample page
const CreationTicket = Loadable(lazy(() => import('pages/Ticket/DemandeCreation')));
const Deadline = Loadable(lazy(() => import('pages/Ticket/DelaiHorsDelai')));
const Complaint = Loadable(lazy(() => import('pages/Ticket/Plainte')));

// const Actions = Loadable(lazy(() => import('pages/Actions')));

// ==============================|| MAIN ROUTING ||============================== //

const Ticket = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/creationTicket',
      element: <CreationTicket />
    },
    {
      path: '/deadline',
      element: <Deadline />
    },
    {
      path: '/complaint',
      element: <Complaint />
    }

    // {
    //   path: '/actions',
    //   element: <Actions />
    // }
  ]
};

export default Ticket;
