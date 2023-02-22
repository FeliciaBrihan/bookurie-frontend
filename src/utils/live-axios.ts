import axios from 'axios';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { alert } from './helpers/alert';

const axiosServices = axios.create({
	baseURL: 'http://localhost:5000',
});

axiosServices.interceptors.response.use(
	(response) => response,
	async (error) => {
		alert.displayAxiosError(
			error.response &&
				(error.response.data.details || error.response.data.error),
			error.response.status
		);
		try {
			if (error.response.status === 403) await firebase.auth().signOut();
		} catch (error) {
			console.error(error);
		}

		return Promise.reject(
			(error.response && error.response.data) || 'Wrong Services'
		);
	}
);

export default axiosServices;
