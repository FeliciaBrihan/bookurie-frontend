import { openNotistack } from 'store/slices/notistack';
import { VariantType } from 'notistack';
import { dispatch } from 'store';

export const alert = {
	displayAxiosError: (errorMessage: string, status: number) => {
		let text: string;

		switch (status) {
			case 400: {
				text = errorMessage;
				break;
			}
			case 401: {
				text = 'Not authorized.';
				break;
			}
			case 403: {
				text = 'Not authenticated. Please login.';
				break;
			}

			default: {
				text = 'Internal error.';
				break;
			}
		}
		dispatch(openNotistack({ text, variant: 'warning' }));
	},
	display: (text: string, variant?: VariantType) => {
		dispatch(openNotistack({ text, variant: variant || 'success' }));
	},
};
