import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

/* ***Layouts**** */
const FullLayout = lazy(() => import("../layouts/full/FullLayout"));
const BlankLayout = lazy(() => import("../layouts/blank/BlankLayout"));

/* ****Pages***** */
const Error = lazy(() => import("../views/authentication/Error"));
const Login = lazy(() => import("../views/authentication/Login"));

const Utilisateur = lazy(() => import("../views/Utilisateur"));
const Projet = lazy(() => import("../views/Projet"));
const Prospect = lazy(() => import("../views/Prospect"));
const DetailProjet = lazy(() => import("../views/Projet/Detail"));
const Action_en_cours = lazy(() => import("../views/Projet/ActionEncours"));
const Commentaire = lazy(() => import("../views/Commentaire"));

const Router = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/projets" /> },
      { path: "/utilisateurs", exact: true, element: <Utilisateur /> },
      { path: "/projets", exact: true, element: <Projet /> },
      { path: "/action_en_cours", exact: true, element: <Action_en_cours /> },
      { path: "/prospects", exact: true, element: <Prospect /> },
      { path: "/detail_projet", exact: true, element: <DetailProjet /> },
      { path: "/commentaire", exact: true, element: <Commentaire /> },
      { path: "*", element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: "/auth",
    element: <BlankLayout />,
    children: [
      { path: "404", element: <Error /> },
      { path: "/auth/login", element: <Login /> },
      { path: "*", element: <Navigate to="/auth/404" /> },
    ],
  },
];

const router = createBrowserRouter(Router);

export default router;
