// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/live-axios';
import { dispatch } from '../index';

// types
import { DefaultRootStateProps } from 'types';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['paymentType'] = {
	error: null,
	paymentTypes: [],
};

const slice = createSlice({
	name: 'currency',
	initialState,
	reducers: {
		hasError(state, action) {
			state.error = action.payload;
		},

		getPaymentTypesSuccess(state, action) {
			state.paymentTypes = action.payload;
		},
	},
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const PaymentTypeApi = {
	getAll: () => async () => {
		try {
			const response = await axios.get('/paymentType');
			dispatch(slice.actions.getPaymentTypesSuccess(response.data));
		} catch (error) {
			dispatch(slice.actions.hasError(error));
		}
	},
};
