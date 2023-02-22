// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/live-axios';
import { dispatch } from '../index';

// types
import { DefaultRootStateProps } from 'types';
import { getLoggedUser } from './user';
import { getLoggedUserSubscription } from './subscription';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['purchase'] = {
	error: null,
	purchases: [],
	userPurchases: [],
};

const slice = createSlice({
	name: 'purchase',
	initialState,
	reducers: {
		hasError(state, action) {
			state.error = action.payload;
		},

		getPurchasesSuccess(state, action) {
			state.purchases = action.payload;
		},
		getUserPurchasesSuccess(state, action) {
			state.userPurchases = action.payload;
		},
	},
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const purchaseApi = {
	getAll: () => async () => {
		try {
			const response = await axios.get('/purchase/all');
			dispatch(slice.actions.getPurchasesSuccess(response.data.data));
		} catch (error) {
			dispatch(slice.actions.hasError(error));
		}
	},
};

export function create(booksId: number[]) {
	return async () => {
		try {
			await axios.post(`/book/purchase`, { booksId });
			const res = await axios.get('/user/allowed');
			dispatch(getLoggedUser(res.data.loggedUser));
			dispatch(getLoggedUserSubscription(res.data.subscription));
		} catch (error) {
			dispatch(slice.actions.hasError(error));
			console.log(error);
		}
	};
}

export function getUserPurchases() {
	return async () => {
		try {
			const response = await axios.get(`/purchase`);
			dispatch(slice.actions.getUserPurchasesSuccess(response.data.data));
		} catch (error) {
			dispatch(slice.actions.hasError(error));
			console.log(error);
		}
	};
}

export function deletePurchase(id: number, options: { sync?: boolean }) {
	return async () => {
		try {
			const response = await axios.delete(`/purchase/${id}`);
			console.log(response);
			if (options?.sync === true) purchaseApi.getAll()();
		} catch (error) {
			dispatch(slice.actions.hasError(error));
			console.log(error);
		}
	};
}
