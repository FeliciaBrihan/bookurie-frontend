// third-party
import { FormattedMessage } from 'react-intl';

// assets
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
// import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import { IconDashboard } from '@tabler/icons';
import CollectionsIcon from '@mui/icons-material/Collections';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import EngineeringTwoToneIcon from '@mui/icons-material/EngineeringTwoTone';
import { NavItemType } from 'types';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import AutoStoriesTwoToneIcon from '@mui/icons-material/AutoStoriesTwoTone';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ShuffleOnIcon from '@mui/icons-material/ShuffleOn';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import CameraIcon from '@mui/icons-material/Camera';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

// constant
const icons = {
	IconDashboard,
	SupervisorAccountIcon,
	SettingsIcon,
	DashboardIcon,
	BookIcon,
	EngineeringTwoToneIcon,
	AutoStoriesTwoToneIcon,
	HowToRegIcon,
	ShoppingBagIcon,
	CollectionsIcon,
	ShuffleOnIcon,
	CardGiftcardIcon,
	ViewAgendaIcon,
	CameraIcon,
	ShoppingCartIcon,
	LibraryBooksIcon,
	TextSnippetIcon,
	AdminPanelSettingsIcon,
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const appMenu: NavItemType = {
	id: 'app-menu',
	title: <FormattedMessage id="app-menu" />,
	icon: icons.IconDashboard,
	type: 'group',
	children: [
		{
			id: 'dashboard',
			title: <FormattedMessage id="books" />,
			type: 'item',
			url: '/dashboard',
			icon: icons.AutoStoriesTwoToneIcon,
			breadcrumbs: false,
		},
		{
			id: 'book-list',
			title: <FormattedMessage id="book-list" />,
			type: 'item',
			url: '/books',
			icon: icons.LibraryBooksIcon,
			breadcrumbs: false,
		},
		{
			id: 'loans',
			title: <FormattedMessage id="loans" />,
			type: 'item',
			url: '/loans',
			icon: icons.TextSnippetIcon,
			breadcrumbs: false,
		},
		{
			id: 'purchases',
			title: <FormattedMessage id="purchases" />,
			type: 'item',
			url: '/purchases',
			icon: icons.ShoppingCartIcon,
			breadcrumbs: false,
		},
		{
			id: 'users',
			title: <FormattedMessage id="users" />,
			type: 'item',
			url: '/users',
			icon: icons.SupervisorAccountIcon,
			breadcrumbs: false,
		},
		{
			id: 'roles',
			title: <FormattedMessage id="roles" />,
			type: 'item',
			url: '/roles',
			icon: icons.AdminPanelSettingsIcon,
			breadcrumbs: false,
		},
		{
			id: 'raffle',
			title: <FormattedMessage id="raffle" />,
			type: 'item',
			url: '/raffles',
			icon: icons.CardGiftcardIcon,
			breadcrumbs: false,
		},
		{
			id: 'subscriptions',
			title: <FormattedMessage id="subscriptions" />,
			type: 'item',
			url: '/subscriptions',
			icon: icons.ViewAgendaIcon,
			breadcrumbs: false,
		},
		{
			id: 'account-settings',
			title: <FormattedMessage id="account-settings" />,
			type: 'item',
			url: '/account',
			icon: icons.SettingsIcon,
			breadcrumbs: false,
		},
	],
};

export default appMenu;
