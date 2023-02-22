// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/live-axios';
import { dispatch } from '../index';

// types
import { DefaultRootStateProps } from 'types';
import { TGetRole, TSetRole } from 'types/roles';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['role'] = {
	error: null,
	roles: [],
};

const slice = createSlice({
	name: 'role',
	initialState,
	reducers: {
		hasError(state, action) {
			state.error = action.payload;
		},

		getRolesSuccess(state, action) {
			state.roles = action.payload;
		},
	},
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const roleApi = {
	getAll: () => async () => {
		try {
			const response = await axios.get('/role');
			dispatch(slice.actions.getRolesSuccess(response.data.data));
		} catch (error) {
			dispatch(slice.actions.hasError(error));
		}
	},
	get create() {
		return async (data: TSetRole, options: { sync?: boolean }) => {
			try {
				const response = await axios.post<TGetRole>(`/role`, data);
				if (options?.sync === true) this.getAll()();
				return response.data;
			} catch (error) {
				if (options?.sync === true) dispatch(slice.actions.hasError(error));
			}
		};
	},
	get update() {
		return async (id: number, data: TSetRole, options: { sync?: boolean }) => {
			try {
				await axios.put(`/role/${id}`, data);
				if (options?.sync === true) this.getAll()();
			} catch (error) {
				if (options?.sync === true) dispatch(slice.actions.hasError(error));
			}
		};
	},
};

export function deleteRole(id: number, options: { sync?: boolean }) {
	return async () => {
		try {
			const response = await axios.delete(`/role/${id}`);
			console.log(response);
			if (options?.sync === true) roleApi.getAll()();
		} catch (error) {
			dispatch(slice.actions.hasError(error));
			console.log(error);
		}
	};
}
