// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/live-axios';
import { dispatch } from '../index';
import { alert } from 'utils/helpers/alert';
import { getLoggedUser } from './user';

// types
import { DefaultRootStateProps } from 'types';
import { TSetLoan } from 'types/loan';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['loan'] = {
	error: null,
	loans: [],
	userLoans: [],
};

const slice = createSlice({
	name: 'loan',
	initialState,
	reducers: {
		hasError(state, action) {
			state.error = action.payload;
		},

		getLoansSuccess(state, action) {
			state.loans = action.payload;
		},
		getUserLoansSuccess(state, action) {
			state.userLoans = action.payload;
		},
	},
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const loanApi = {
	getAll: () => async () => {
		try {
			const response = await axios.get('/loan');
			dispatch(slice.actions.getLoansSuccess(response.data.data));
		} catch (error) {
			dispatch(slice.actions.hasError(error));
		}
	},
	get update() {
		return async (id: number, data: TSetLoan, options: { sync?: boolean }) => {
			try {
				const response = await axios.put(`/loan/${id}`, data);
				if (response.status === 200) alert.display('Loan Accept Success');
				if (options?.sync === true) this.getAll()();
			} catch (error) {
				console.log(error);
				if (options?.sync === true) dispatch(slice.actions.hasError(error));
			}
		};
	},
	get returnLoan() {
		return async (id: number, options: { sync?: boolean }) => {
			try {
				const response = await axios.put(`loan/loans/${id}`);
				if (response.status === 200) alert.display('Loan Return Success');
				if (options?.sync === true) this.getAll()();
				console.log(response);
			} catch (error) {
				console.log(error);
			}
		};
	},
};

export function create(id: number) {
	return async () => {
		try {
			const response = await axios.post(`/book/${id}/loan`);
			const res = await axios.get('/user/allowed');
			dispatch(getUserLoans());
			dispatch(getLoggedUser(res.data.loggedUser));
			console.log(response);
			if (response.status === 200) alert.display('Loan Request Success');
		} catch (error) {
			dispatch(slice.actions.hasError(error));
			console.log(error);
		}
	};
}

export function deleteLoan(id: number, options: { sync?: boolean }) {
	return async () => {
		try {
			const response = await axios.delete(`/loan/${id}`);
			console.log(response);
			if (options?.sync === true) loanApi.getAll()();
		} catch (error) {
			dispatch(slice.actions.hasError(error));
			console.log(error);
		}
	};
}
export function getUserLoans() {
	return async () => {
		try {
			const response = await axios.get(`loan/loans`);
			dispatch(slice.actions.getUserLoansSuccess(response.data.data));
			console.log(response);
		} catch (error) {
			dispatch(slice.actions.hasError(error));
			console.log(error);
		}
	};
}
