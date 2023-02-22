import { createSlice } from '@reduxjs/toolkit';
import { NotistackProps } from 'types/notistack';

const initialState: NotistackProps = {
	text: '',
	variant: 'default',
	random: false,
};

const slice = createSlice({
	name: 'notistack',
	initialState,
	reducers: {
		openNotistack(state, action) {
			const { text, variant } = action.payload;
			state.text = text;
			state.variant = variant;
			state.random = !state.random;
		},
	},
});

export default slice.reducer;

export const { openNotistack } = slice.actions;
