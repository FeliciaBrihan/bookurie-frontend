// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/live-axios';
import { dispatch } from '../index';

// types
import { DefaultRootStateProps } from 'types';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['raffle'] = {
	error: null,
	raffles: [],
	userRaffles: [],
};

const slice = createSlice({
	name: 'raffle',
	initialState,
	reducers: {
		hasError(state, action) {
			state.error = action.payload;
		},

		getRafflesSuccess(state, action) {
			state.raffles = action.payload;
		},
		getUserRaffles(state, action) {
			state.userRaffles = action.payload;
		},
	},
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const raffleApi = {
	getAll: () => async () => {
		try {
			const response = await axios.get('/raffle');
			dispatch(slice.actions.getRafflesSuccess(response.data.data));
		} catch (error) {
			dispatch(slice.actions.hasError(error));
		}
	},
};

export function deleteRaffle(id: number, options: { sync?: boolean }) {
	return async () => {
		try {
			const response = await axios.delete(`/raffle/${id}`);
			console.log(response);
			if (options?.sync === true) raffleApi.getAll()();
		} catch (error) {
			dispatch(slice.actions.hasError(error));
			console.log(error);
		}
	};
}
export function getUserRaffles() {
	return async () => {
		try {
			const response = await axios.get(`/raffle/won`);
			dispatch(slice.actions.getUserRaffles(response.data.data));
			console.log(response);
		} catch (error) {
			dispatch(slice.actions.hasError(error));
			console.log(error);
		}
	};
}
