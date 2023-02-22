// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/live-axios';
import { dispatch } from '../index';

// types
import { DefaultRootStateProps } from 'types';
import { TGetBook, TSetBook } from 'types/book';
import { ProductsFilter } from 'types/e-commerce';
import { TGetSubscription } from 'types/subscription';
import { alert } from 'utils/helpers/alert';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['book'] = {
	error: null,
	book: null,
	books: [],
	addresses: [],
};

const slice = createSlice({
	name: 'book',
	initialState,
	reducers: {
		hasError(state, action) {
			state.error = action.payload;
		},

		getBooksSuccess(state, action) {
			state.books = action.payload;
		},
		getBookSuccess(state, action) {
			state.book = action.payload;
		},
		// FILTER PRODUCTS
		filterProductsSuccess(state, action) {
			state.books = action.payload;
		},
	},
});

// Reducer
export default slice.reducer;
export const { hasError } = slice.actions;

// ----------------------------------------------------------------------

export const bookApi = {
	getAll: () => async () => {
		try {
			const response = await axios.get('/book');
			const books = response.data.data;
			dispatch(slice.actions.getBooksSuccess(books));
		} catch (error) {
			dispatch(slice.actions.hasError(error));
		}
	},

	get create() {
		return async (data: TSetBook, options: { sync?: boolean }) => {
			try {
				const response = await axios.post<TGetBook>(`/book`, data);
				if (response.status === 201) alert.display('Book Add Success');
				if (options?.sync === true) this.getAll()();
				return response.data;
			} catch (error) {
				console.log(error);
				if (options?.sync === true) dispatch(slice.actions.hasError(error));
			}
		};
	},
	get update() {
		return async (id: number, data: TSetBook, options: { sync?: boolean }) => {
			try {
				const response = await axios.put(`/book/${id}`, data);
				if (response.status === 200) alert.display('Book Update Success');
				if (options?.sync === true) this.getAll()();
			} catch (error) {
				if (options?.sync === true) dispatch(slice.actions.hasError(error));
			}
		};
	},
};

export function getProduct(id: string | undefined) {
	return async () => {
		try {
			const response = await axios.get(`/book/${id}`);
			console.log(response);
			dispatch(slice.actions.getBookSuccess(response.data.data));
		} catch (error) {
			dispatch(slice.actions.hasError(error));
		}
	};
}

export function deleteBook(id: number, options: { sync?: boolean }) {
	return async () => {
		try {
			const response = await axios.delete(`/book/${id}`);
			if (response.status === 200) alert.display('Book Delete Success');
			console.log(response);
			if (options?.sync === true) bookApi.getAll()();
		} catch (error) {
			dispatch(slice.actions.hasError(error));
			console.log(error);
		}
	};
}

export function filterProducts(
	filter: ProductsFilter,
	sortLabel: string,
	subscription: TGetSubscription | undefined
) {
	return async () => {
		try {
			const response = await axios.get('/book', {
				params: {
					genre: filter.genre,
					typeFormat: filter.typeFormat,
					author: filter.author,
				},
			});
			let sortedBooks = response.data.data;

			const { price } = filter;

			if (price && price >= 0) {
				sortedBooks = sortedBooks.filter((book: TGetBook) =>
					subscription ? book.pricePromo! <= price : book.price <= price
				);
			}

			if (sortLabel === 'low') {
				sortedBooks = sortedBooks.sort((a: TGetBook, b: TGetBook) =>
					subscription ? a.pricePromo! - b.pricePromo! : a.price - b.price
				);
			} else if (sortLabel === 'high') {
				sortedBooks = sortedBooks.sort((a: TGetBook, b: TGetBook) =>
					subscription ? b.pricePromo! - a.pricePromo! : b.price - a.price
				);
			}
			dispatch(slice.actions.filterProductsSuccess(sortedBooks));
		} catch (error) {
			dispatch(slice.actions.hasError(error));
		}
	};
}
