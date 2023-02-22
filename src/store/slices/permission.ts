// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/live-axios';
import { dispatch } from '../index';

// types
import { DefaultRootStateProps } from 'types';
import { TGetPermission, TSetPermission } from 'types/permission';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['permission'] = {
	error: null,
	permissions: [],
};

const slice = createSlice({
	name: 'permission',
	initialState,
	reducers: {
		hasError(state, action) {
			state.error = action.payload;
		},

		getPermissionsSuccess(state, action) {
			state.permissions = action.payload;
		},
	},
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const permissionApi = {
	getAll: () => async () => {
		try {
			const response = await axios.get('/permission');
			dispatch(slice.actions.getPermissionsSuccess(response.data.data));
		} catch (error) {
			dispatch(slice.actions.hasError(error));
		}
	},
	get create() {
		return async (data: TSetPermission, options: { sync?: boolean }) => {
			try {
				const response = await axios.post<TGetPermission>(`/permission`, data);
				if (options?.sync === true) this.getAll()();
				return response.data;
			} catch (error) {
				if (options?.sync === true) dispatch(slice.actions.hasError(error));
			}
		};
	},
	get update() {
		return async (
			id: number,
			data: TSetPermission,
			options: { sync?: boolean }
		) => {
			try {
				await axios.put(`/permission/${id}`, data);
				if (options?.sync === true) this.getAll()();
			} catch (error) {
				console.log(error);
				if (options?.sync === true) dispatch(slice.actions.hasError(error));
			}
		};
	},
};
export function deletePermission(id: number, options: { sync?: boolean }) {
	return async () => {
		try {
			const response = await axios.delete(`/permission/${id}`);
			console.log(response);
			if (options?.sync === true) permissionApi.getAll()();
		} catch (error) {
			dispatch(slice.actions.hasError(error));
			console.log(error);
		}
	};
}