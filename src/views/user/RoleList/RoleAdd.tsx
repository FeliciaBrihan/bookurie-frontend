import * as React from 'react';
import { forwardRef, useState } from 'react';

// material-ui
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	Grid,
	Slide,
	SlideProps,
	Switch,
	TextField,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableRow,
} from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import { TSetRole } from 'types/roles';
import { roleApi } from 'store/slices/role';
import { TGetAction } from 'types/action';
import { useDispatch, useSelector } from 'store';
import { actionApi } from 'store/slices/action';

interface ProductAddProps {
	handleCloseDialog: (e?: any) => void;
}

// animation
const Transition = forwardRef((props: SlideProps, ref) => (
	<Slide direction="left" ref={ref} {...props} />
));

const defaultValue = {
	name: '',
	allowedActions: [],
};

const RoleAdd = ({ handleCloseDialog }: ProductAddProps) => {
	const dispatch = useDispatch();
	const [actions, setActions] = useState<TGetAction[]>([]);
	const [formValue, setFormValue] = useState<TSetRole>(defaultValue);
	const actionState = useSelector((state) => state.action);

	React.useEffect(() => {
		if (actionState.actions.length === 0) dispatch(actionApi.getAll());
	}, [dispatch]);

	React.useEffect(() => {
		setActions(actionState.actions);
	}, [actionState]);

	const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFormValue({
			...formValue,
			name: event?.target.value,
		});
	};

	const handleSave = async () => {
		await roleApi.create(
			{
				name: formValue.name,
				allowedActions: formValue.allowedActions,
			},
			{ sync: true }
		);
		handleCloseDialog();
	};

	const handleSwitchChange =
		(id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
			if (event.target.checked)
				setFormValue({
					...formValue,
					allowedActions: [...formValue.allowedActions, id],
				});
			else
				setFormValue({
					...formValue,
					allowedActions: formValue.allowedActions.filter((el) => el !== id),
				});
		};

	return (
		<Dialog
			open
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
			<DialogTitle>Add New Role</DialogTitle>
			<DialogContent>
				<Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
					<Grid item xs={12}>
						<TextField
							id="name"
							required
							fullWidth
							label="Enter Role Name"
							onChange={handleValueChange}
						/>
					</Grid>
					<Grid item xs={7}>
						<Table>
							<TableBody>
								{actions.map((action) => (
									<TableRow key={String(action.id)}>
										<TableCell sx={{ borderBottom: 'none', padding: 0 }}>
											<Typography variant="subtitle1">{action.name}</Typography>
										</TableCell>
										<TableCell
											sx={{
												borderBottom: 'none',
												alignItems: 'left',
												padding: 0,
											}}
										>
											<FormControlLabel
												control={
													<Switch
														checked={
															formValue.allowedActions.includes(action.id) ||
															false
														}
														onChange={handleSwitchChange(action.id)}
													/>
												}
												label=""
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
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
		</Dialog>
	);
};

export default RoleAdd;
