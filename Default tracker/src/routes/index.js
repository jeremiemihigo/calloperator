import { useRoutes } from 'react-router-dom';

// project import
import { useSelector } from 'react-redux';
import AdminRoute from './AdminRoute';
import LoginRoutes from './LoginRoutes';
import OtherRoutes from './Other';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  const user = useSelector((state) => state.user.user);
  return useRoutes(user?.fonction === 'superUser' ? [AdminRoute, LoginRoutes] : [OtherRoutes, LoginRoutes]);
}
