import * as React from 'react';
import { forwardRef, useState } from 'react';

// material-ui
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	MenuItem,
	Slide,
	SlideProps,
	TextField,
} from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useDispatch, useSelector } from 'store';

// assets
import { TGetRole } from 'types/roles';
import { roleApi } from 'store/slices/role';
import { TSetUser } from 'types/user';
import { userApi } from 'store/slices/user';

interface ProductAddProps {
	open: boolean;
	handleCloseDialog: (e?: any) => void;
}

// animation
const Transition = forwardRef((props: SlideProps, ref) => (
	<Slide direction="left" ref={ref} {...props} />
));

const defaultValue = {
	firstName: '',
	lastName: '',
	email: '',
	roleId: undefined,
	username: '',
	subscriptionId: undefined,
	subscriptionDate: null,
	subscriptionExpirationDate: null,
	booksReadThisMonth: undefined,
	budget: undefined,
};

const UserAdd = ({ open, handleCloseDialog }: ProductAddProps) => {
	const dispatch = useDispatch();
	const [role, setRole] = useState<TGetRole[]>([]);
	const [formValue, setFormValue] = useState<TSetUser>(defaultValue);
	const { roles } = useSelector((state) => state.role);

	React.useEffect(() => {
		dispatch(roleApi.getAll());
	}, [dispatch]);
	React.useEffect(() => {
		setRole(roles);
	}, [roles]);

	const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFormValue({
			...formValue,
			[event?.target.id]: event?.target.value,
		});
	};

	const handleSelectChange =
		(field: keyof typeof formValue) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setFormValue({ ...formValue, [field]: Number(event?.target.value) });
			console.log(event?.target.value);
		};

	const handleSave = async () => {
		await userApi.create(formValue, { sync: true });
		console.log(formValue);
		handleCloseDialog();
	};

	return (
		<Dialog
			open={open}
			TransitionComponent={Transition}
			keepMounted
			onClose={handleCloseDialog}
			sx={{
				'&>div:nth-of-type(3)': {
					justifyContent: 'flex-end',
					'&>div': {
						m: 0,
						borderRadius: '0px',
						maxWidth: 450,
						maxHeight: '100%',
					},
				},
			}}
		>
			{open && (
				<>
					<DialogTitle>Add New User</DialogTitle>
					<DialogContent>
						<Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
							<Grid item xs={12}>
								<TextField
									id="firstName"
									required
									fullWidth
									label="Enter First Name"
									onChange={handleValueChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									id="lastName"
									required
									fullWidth
									label="Enter Last Name"
									onChange={handleValueChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									id="email"
									required
									fullWidth
									label="Enter Email"
									onChange={handleValueChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									id="username"
									required
									fullWidth
									label="Enter Username"
									onChange={handleValueChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									id="password"
									required
									fullWidth
									label="Enter Password"
									onChange={handleValueChange}
								/>
							</Grid>

							<Grid item xs={12}>
								<TextField
									id="roleId"
									select
									required
									label="Select Role"
									fullWidth
									defaultValue=""
									onChange={handleSelectChange('roleId')}
								>
									{role.map((option) => (
										<MenuItem key={String(option.id)} value={option.id}>
											{option.name}
										</MenuItem>
									))}
								</TextField>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						<AnimateButton>
							<Button variant="contained" onClick={handleSave}>
								Create
							</Button>
						</AnimateButton>
						<Button variant="text" color="error" onClick={handleCloseDialog}>
							Close
						</Button>
					</DialogActions>
				</>
			)}
		</Dialog>
	);
};

export default UserAdd;
