// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/live-axios';
import { dispatch } from '../index';

// types
import { DefaultRootStateProps } from 'types';
import { Address } from 'types/e-commerce';
import { alert } from 'utils/helpers/alert';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['address'] = {
	error: null,
	address: {
		street: '',
		city: '',
		number: '',
		country: '',
		building: '',
		zipCode: '',
		contact: '',
	},
};

const slice = createSlice({
	name: 'address',
	initialState,
	reducers: {
		// HAS ERROR
		hasError(state, action) {
			state.error = action.payload;
		},

		// GET ADDRESSES
		getAddressSuccess(state, action) {
			state.address = action.payload;
		},

		// ADD ADDRESS
		addAddressSuccess(state, action) {
			state.address = action.payload;
		},

		// EDIT ADDRESS
		editAddressSuccess(state, action) {
			state.address = action.payload;
		},
	},
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------
export function getAddress() {
	return async () => {
		try {
			const response = await axios.get('/address');
			dispatch(slice.actions.getAddressSuccess(response.data.data));
		} catch (error) {
			dispatch(slice.actions.hasError(error));
			dispatch(slice.actions.addAddressSuccess(initialState.address));
		}
	};
}

export function addAddress(address: Address) {
	return async () => {
		try {
			const response = await axios.post('/address/', address);
			console.log(response);
			if (response.status === 201) alert.display('Address Add Success');
			dispatch(slice.actions.addAddressSuccess(response.data.data));
		} catch (error) {
			dispatch(slice.actions.hasError(error));
		}
	};
}

export function editAddress(id: number | string | undefined, address: Address) {
	return async () => {
		try {
			const response = await axios.put(`/address/${id}`, address);
			if (response.status === 200) alert.display('Address Update Success');
			dispatch(slice.actions.getAddressSuccess(response.data.data));
		} catch (error) {
			dispatch(slice.actions.hasError(error));
		}
	};
}
