// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/live-axios';
import { dispatch } from '../index';

// types
import { DefaultRootStateProps } from 'types';
import { TSetUser } from 'types/user';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['user'] = {
	error: null,
	users: [],
	activeUsers: [],
	loggedUser: undefined,
};

const slice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		hasError(state, action) {
			state.error = action.payload;
		},

		getUsersSuccess(state, action) {
			state.users = action.payload;
		},

		getLoggedUserSuccess(state, action) {
			state.loggedUser = action.payload;
		},
	},
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const userApi = {
	getAll: () => async () => {
		try {
			const response = await axios.get('/user');
			dispatch(slice.actions.getUsersSuccess(response.data.data));
			console.log(response);
		} catch (error) {
			dispatch(slice.actions.hasError(error));
		}
	},
	get create() {
		return async (data: TSetUser, options: { sync?: boolean }) => {
			try {
				const response = await axios.post(`/user`, data);
				if (options?.sync === true) this.getAll()();

				return response.data;
			} catch (error) {
				if (options?.sync === true) dispatch(slice.actions.hasError(error));
				console.log(error);
			}
			console.log(data);
		};
	},
	get update() {
		return async (id: number, data: TSetUser, options: { sync?: boolean }) => {
			try {
				await axios.put(`/user/${id}`, data);
				if (options?.sync === true) this.getAll()();
			} catch (error) {
				if (options?.sync === true) dispatch(slice.actions.hasError(error));
			}
		};
	},
};

export function deleteUser(id: number, options: { sync?: boolean }) {
	return async () => {
		try {
			const response = await axios.delete(`/user/${id}`);
			console.log(response);
			if (options?.sync === true) userApi.getAll()();
		} catch (error) {
			dispatch(slice.actions.hasError(error));
			console.log(error);
		}
	};
}

export function getLoggedUser(response: any) {
	return async () => {
		try {
			console.log('userApi', response);
			dispatch(slice.actions.getLoggedUserSuccess(response));
		} catch (error) {
			dispatch(slice.actions.hasError(error));
			console.log(error);
		}
	};
}
