import * as React from 'react';
import { forwardRef } from 'react';

// material-ui
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Grid,
	Slide,
	SlideProps,
	Stack,
	Typography,
} from '@mui/material';

// assets
import { TGetRole } from 'types/roles';
import { useDispatch, useSelector } from 'store';
import { actionApi } from 'store/slices/action';
import { TGetAction } from 'types/action';

interface ProductAddProps {
	handleCloseDialog: (e?: any) => void;
	data: TGetRole;
}

// animation
const Transition = forwardRef((props: SlideProps, ref) => (
	<Slide direction="left" ref={ref} {...props} />
));

const Text = ({ label, value }: { label: string; value: string | number }) => (
	<Stack direction="row" spacing={1}>
		<Typography variant="subtitle1">{label} :</Typography>
		<Typography variant="body2" display="flex" alignItems="center">
			{value}
		</Typography>
	</Stack>
);

const RoleDetails = ({ handleCloseDialog, data }: ProductAddProps) => {
	const dispatch = useDispatch();
	const [actions, setActions] = React.useState<TGetAction[]>([]);
	const actionState = useSelector((state) => state.action);

	React.useEffect(() => {
		if (actionState.actions.length === 0) dispatch(actionApi.getAll());
	}, [dispatch]);

	React.useEffect(() => {
		setActions(actionState.actions);
	}, [actionState]);

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
			<DialogTitle>{data.name}</DialogTitle>
			<DialogContent>
				<Grid container spacing={1} sx={{ mt: 0.25 }}>
					<Grid item xs={12}>
						<Text label="ID" value={data.id} />
					</Grid>
					<Grid item xs={12}>
						<Text
							label="Created At"
							value={new Intl.DateTimeFormat('en-GB', {
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
								hour: '2-digit',
								minute: '2-digit',
								second: '2-digit',
							}).format(new Date(data.createdAt))}
						/>
					</Grid>
					<Grid item xs={12}>
						<Text
							label="Last Update"
							value={new Intl.DateTimeFormat('en-GB', {
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
								hour: '2-digit',
								minute: '2-digit',
								second: '2-digit',
							}).format(new Date(data.updatedAt))}
						/>
					</Grid>
					<Divider sx={{ width: '100%', marginTop: '20px' }}>
						Permissions
					</Divider>
					<Grid item xs={12}>
						{actions.map((action) => (
							<Text
								label={action.name}
								key={action.id}
								value={data.allowedActions.includes(action.id) ? '√' : '-'}
							/>
						))}
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions
				sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'flex-end',
				}}
			>
				<Button variant="text" color="primary" onClick={handleCloseDialog}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default RoleDetails;
