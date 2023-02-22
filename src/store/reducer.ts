// third-party
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// project imports
import snackbarReducer from './slices/snackbar';
import menuReducer from './slices/menu';
import cartReducer from './slices/cart';
import budgetRequestReducer from './slices/budgetRequest';
import currencyReducer from './slices/currency';
import paymentTypeReducer from './slices/paymentType';
import userReducer from './slices/user';
import roleReducer from './slices/role';
import actionReducer from './slices/action';
import loanReducer from './slices/loan';
import bookReducer from './slices/book';
import permissionReducer from './slices/permission';
import purchaseReducer from './slices/purchase';
import raffleReducer from './slices/raffle';
import prizeReducer from './slices/prize';
import subscriptionReducer from './slices/subscription';
import addressReducer from './slices/address';
import notistackReducer from './slices/notistack';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
	snackbar: snackbarReducer,
	menu: menuReducer,
	cart: persistReducer(
		{
			key: 'cart',
			storage,
			keyPrefix: 'berry-',
		},
		cartReducer
	),
	budgetRequest: budgetRequestReducer,
	currency: currencyReducer,
	paymentType: paymentTypeReducer,
	user: userReducer,
	role: roleReducer,
	action: actionReducer,
	loan: loanReducer,
	book: bookReducer,
	permission: permissionReducer,
	purchase: purchaseReducer,
	raffle: raffleReducer,
	prize: prizeReducer,
	subscription: subscriptionReducer,
	address: addressReducer,
	notistack: notistackReducer,
});

export default reducer;
