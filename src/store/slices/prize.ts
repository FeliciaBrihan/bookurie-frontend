// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/live-axios';
import { dispatch } from '../index';

// types
import { DefaultRootStateProps } from 'types';
import { TSetPrize } from 'types/prize';
import { alert } from 'utils/helpers/alert';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['prize'] = {
	error: null,
	prizes: [],
};

const slice = createSlice({
	name: 'prize',
	initialState,
	reducers: {
		hasError(state, action) {
			state.error = action.payload;
		},

		getPrizeSuccess(state, action) {
			state.prizes = action.payload;
		},
	},
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const prizeApi = {
	getAll: () => async () => {
		try {
			const response = await axios.get('/prize');
			dispatch(slice.actions.getPrizeSuccess(response.data.data));
		} catch (error) {
			dispatch(slice.actions.hasError(error));
		}
	},
	get update() {
		return async (data: TSetPrize, options: { sync?: boolean }) => {
			try {
				const response = await axios.put(`/prize`, data);
				if (response.status === 200) alert.display('Prize Update Success');
				if (options?.sync === true) this.getAll()();
			} catch (error) {
				if (options?.sync === true) dispatch(slice.actions.hasError(error));
			}
		};
	},
};
