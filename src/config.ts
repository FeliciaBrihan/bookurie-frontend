import LAYOUT_CONST from 'constant';

// types
import { ConfigProps } from 'types/config';

export const JWT_API = {
	secret: 'SECRET-KEY',
	timeout: '1 days',
};

export const FIREBASE_API = {
	apiKey: 'AIzaSyDCq6Vfjqqnz6TxWqJkmDduUgsm0rgDzWU',
	authDomain: 'bookurie-7c568.firebaseapp.com',
	projectId: 'bookurie-7c568',
	storageBucket: 'bookurie-7c568.appspot.com',
	messagingSenderId: '1010156349012',
	appId: '1:1010156349012:web:15856c61c4d2ee0c9bafc1',
	measurementId: 'G-R4L47K11YL',
};

export const AUTH0_API = {
	client_id: '7T4IlWis4DKHSbG8JAye4Ipk0rvXkH9V',
	domain: 'dev-w0-vxep3.us.auth0.com',
};

export const AWS_API = {
	poolId: 'us-east-1_AOfOTXLvD',
	appClientId: '3eau2osduslvb7vks3vsh9t7b0',
};

// basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
// like '/berry-material-react/react/default'
export const BASE_PATH = '';

export const DASHBOARD_PATH = '/dashboard';

export const HORIZONTAL_MAX_ITEM = 6;

const config: ConfigProps = {
	layout: LAYOUT_CONST.VERTICAL_LAYOUT, // vertical, horizontal
	drawerType: LAYOUT_CONST.DEFAULT_DRAWER, // default, mini-drawer
	fontFamily: `'Roboto', sans-serif`,
	borderRadius: 8,
	outlinedFilled: true,
	navType: 'light', // light, dark
	presetColor: 'default', // default, theme1, theme2, theme3, theme4, theme5, theme6
	locale: 'en', // 'en' - English, 'fr' - French, 'ro' - Romanian, 'zh' - Chinese
	rtlLayout: false,
	container: false,
};

export const ENVIRONMENT = 'dev';

export default config;
