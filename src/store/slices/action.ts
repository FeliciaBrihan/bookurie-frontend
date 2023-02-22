// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/live-axios';
import { dispatch } from '../index';

// types
import { DefaultRootStateProps } from 'types';
import { TGetAction, TSetAction } from 'types/action';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['action'] = {
	error: null,
	actions: [],
};

const slice = createSlice({
	name: 'action',
	initialState,
	reducers: {
		hasError(state, action) {
			state.error = action.payload;
		},

		getActionSuccess(state, action) {
			state.actions = action.payload;
		},
	},
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const actionApi = {
	getAll: () => async () => {
		try {
			const response = await axios.get('/action');
			dispatch(slice.actions.getActionSuccess(response.data.data));
		} catch (error) {
			dispatch(slice.actions.hasError(error));
		}
	},
	get create() {
		return async (data: TSetAction, options: { sync?: boolean }) => {
			try {
				const response = await axios.post<TGetAction>(`/action`, data);
				if (options?.sync === true) this.getAll()();
				return response.data;
			} catch (error) {
				dispatch(slice.actions.hasError(error));
			}
		};
	},
	get update() {
		return async (
			id: number,
			data: TSetAction,
			options: { sync?: boolean }
		) => {
			try {
				await axios.put(`/action/${id}`, data);
				if (options?.sync === true) this.getAll()();
			} catch (error) {
				dispatch(slice.actions.hasError(error));
			}
		};
	},
};

export function deleteAction(id: number, options: { sync?: boolean }) {
	return async () => {
		try {
			const response = await axios.delete(`/action/${id}`);
			console.log(response);
			if (options?.sync === true) actionApi.getAll()();
		} catch (error) {
			dispatch(slice.actions.hasError(error));
			console.log(error);
		}
	};
}
