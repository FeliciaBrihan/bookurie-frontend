import { Navigate, useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
	return useRoutes([
		{ path: '/', element: <Navigate to="/login" /> },
		AuthenticationRoutes,
		LoginRoutes,
		MainRoutes,
	]);
}
