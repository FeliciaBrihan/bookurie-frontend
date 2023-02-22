/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useEffect, useReducer } from 'react';

// third-party
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// action - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';
import { useDispatch } from 'store';

// project imports
import Loader from 'ui-component/Loader';
import { FIREBASE_API } from 'config';
import { FirebaseContextType, InitialLoginContextProps } from 'types/auth';
import { getIdToken } from 'firebase/auth';
import { getLoggedUser } from 'store/slices/user';
import { getLoggedUserSubscription } from 'store/slices/subscription';
import axios from 'utils/live-axios';
import { Snackbar, Alert } from '@mui/material';

// firebase initialize
if (!firebase.apps.length) {
	firebase.initializeApp(FIREBASE_API);
}

// const
const initialState: InitialLoginContextProps = {
	isLoggedIn: false,
	isInitialized: false,
	user: null,
};

// ==============================|| FIREBASE CONTEXT & PROVIDER ||============================== //

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const FirebaseProvider = ({
	children,
}: {
	children: React.ReactElement;
}) => {
	const [state, setState] = useReducer(accountReducer, initialState);
	const [open, setOpen] = React.useState(false);
	const dispatch = useDispatch();

	useEffect(
		() =>
			firebase.auth().onAuthStateChanged(async (user) => {
				setOpen(false);
				if (user) {
					const token = await getIdToken(user!);
					axios.defaults.headers.common.authorization = token;
					console.log(user);
					try {
						const response = await axios.get('/user/allowed', {
							headers: { authorization: token },
						});
						console.log('response', response.data);
						localStorage.setItem('email', user?.email!);
						localStorage.setItem('token', token);

						setState({
							type: LOGIN,
							payload: {
								isLoggedIn: true,
								user: {
									id: user.uid,
									email: user.email!,
									name: user.displayName!,
								},
							},
						});
						dispatch(getLoggedUser(response.data.loggedUser));
						dispatch(getLoggedUserSubscription(response.data.subscription));
					} catch (error) {
						setState({
							type: LOGOUT,
						});
						setOpen(true);
					}
				} else {
					setState({
						type: LOGOUT,
					});
					localStorage.removeItem('email');
				}
			}),
		[setState]
	);

	firebase.auth().onIdTokenChanged(async (user) => {
		if (user) {
			const token = await getIdToken(user);
			axios.defaults.headers.common.authorization = token;
		}
	});

	const firebaseEmailPasswordSignIn = (email: string, password: string) =>
		firebase.auth().signInWithEmailAndPassword(email, password);

	const firebaseGoogleSignIn = () => {
		const provider = new firebase.auth.GoogleAuthProvider();

		return firebase.auth().signInWithPopup(provider);
	};

	const firebaseRegister = async (email: string, password: string) =>
		firebase.auth().createUserWithEmailAndPassword(email, password);

	const logout = () => firebase.auth().signOut();

	const resetPassword = async (email: string) => {
		await firebase.auth().sendPasswordResetEmail(email);
	};

	const updateProfile = () => {};
	if (state.isInitialized !== undefined && !state.isInitialized) {
		return <Loader />;
	}

	return (
		<>
			<FirebaseContext.Provider
				value={{
					...state,
					firebaseRegister,
					firebaseEmailPasswordSignIn,
					login: () => {},
					firebaseGoogleSignIn,
					logout,
					resetPassword,
					updateProfile,
				}}
			>
				{children}
			</FirebaseContext.Provider>
			{open && (
				<>
					<Snackbar
						open
						anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
					>
						<Alert severity="error" sx={{ width: '100%' }}>
							Unauthorized user!
						</Alert>
					</Snackbar>
					<Snackbar
						open
						anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
					>
						<Alert severity="info" sx={{ width: '100%', marginTop: '55px' }}>
							In order to retry login with same google account is required to
							refresh first the page!
						</Alert>
					</Snackbar>
				</>
			)}
		</>
	);
};

export default FirebaseContext;
