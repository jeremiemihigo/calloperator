import { useRoutes } from 'react-router-dom';

// project import
import Issue from './Issue';
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
// import Portfolio from './Portofolio';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([MainRoutes, LoginRoutes, Issue]);
}
