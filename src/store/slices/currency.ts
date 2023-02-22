// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/live-axios';
import { dispatch } from '../index';

// types
import { DefaultRootStateProps } from 'types';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['currency'] = {
	error: null,
	currencies: [],
};

const slice = createSlice({
	name: 'currency',
	initialState,
	reducers: {
		hasError(state, action) {
			state.error = action.payload;
		},

		getCurrenciesSuccess(state, action) {
			state.currencies = action.payload;
		},
	},
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const currencyApi = {
	getAll: () => async () => {
		try {
			const response = await axios.get('/currency');
			dispatch(slice.actions.getCurrenciesSuccess(response.data));
		} catch (error) {
			dispatch(slice.actions.hasError(error));
		}
	},
};
