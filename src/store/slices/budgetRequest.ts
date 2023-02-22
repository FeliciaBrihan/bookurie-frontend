// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/live-axios';
import { dispatch } from '../index';

// types
import { DefaultRootStateProps } from 'types';
import { TSetBudgetRequest, TSetRule } from 'types/budgetRequest';
import { TEnumBudgetRequestStatus } from 'types/budgetRequestStatus';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['budgetRequest'] = {
	error: null,
	requests: [],
	request: undefined,
	rules: [],
};

const slice = createSlice({
	name: 'budgetRequest',
	initialState,
	reducers: {
		hasError(state, action) {
			state.error = action.payload;
		},

		getBudgetRequestsSuccess(state, action) {
			state.requests = action.payload;
		},

		getBudgetRequestSuccess(state, action) {
			state.request = action.payload;
		},

		getBudgetRequestRulesSuccess(state, action) {
			state.rules = action.payload;
		},
	},
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------
type ReqQuery = { include: 'own' } | { type: 'approval' };

export const budgetRequestApi = {
	getAll: (query?: ReqQuery) => async () => {
		try {
			const response = await axios.get('/budgetRequest', {
				params: query || {},
			});
			dispatch(slice.actions.getBudgetRequestsSuccess(response.data));
		} catch (error) {
			dispatch(slice.actions.hasError(error));
		}
	},
	getById: (query: { id: number }) => async () => {
		try {
			const response = await axios.get(`/budgetRequest/${query.id}`);
			dispatch(slice.actions.getBudgetRequestSuccess(response.data));
		} catch (error) {
			dispatch(slice.actions.hasError(error));
		}
	},
	get create() {
		return async (
			data: { budgetRequest: TSetBudgetRequest; approvalsId?: number[] },
			options?: { sync: boolean; params?: ReqQuery }
		) => {
			try {
				await axios.post('/budgetRequest', data);
				if (options?.sync === true) this.getAll(options?.params)();
			} catch (error) {
				if (options?.sync === true) dispatch(slice.actions.hasError(error));
			}
		};
	},
	get update() {
		return async (
			id: number,
			data: { budgetRequest?: TSetBudgetRequest; approvalsId?: number[] },
			options?: { sync: boolean; params?: ReqQuery }
		) => {
			try {
				await axios.put(`/budgetRequest/${id}`, data);
				if (options?.sync === true) this.getAll(options?.params)();
			} catch (error) {
				if (options?.sync === true) dispatch(slice.actions.hasError(error));
			}
		};
	},
	get approve() {
		return async (
			id: number,
			data: { statusId: TEnumBudgetRequestStatus },
			options?: { sync: boolean; params?: ReqQuery }
		) => {
			try {
				await axios.post(`/budgetRequest/${id}/approve`, data);
				if (options?.sync === true) this.getAll(options?.params)();
			} catch (error) {
				if (options?.sync === true) dispatch(slice.actions.hasError(error));
			}
		};
	},
	rule: {
		getAll: () => async () => {
			try {
				const response = await axios.get('/rule');
				dispatch(slice.actions.getBudgetRequestRulesSuccess(response.data));
			} catch (error) {
				dispatch(slice.actions.hasError(error));
			}
		},
		get create() {
			return async (data: TSetRule, options: { sync?: boolean }) => {
				try {
					await axios.post(`/rule`, data);
					if (options?.sync === true) this.getAll()();
				} catch (error) {
					if (options?.sync === true) dispatch(slice.actions.hasError(error));
				}
			};
		},
		get update() {
			return async (
				id: number,
				data: TSetRule,
				options: { sync?: boolean }
			) => {
				try {
					await axios.put(`/rule/${id}`, data);
					if (options?.sync === true) this.getAll()();
				} catch (error) {
					if (options?.sync === true) dispatch(slice.actions.hasError(error));
				}
			};
		},
	},
};
