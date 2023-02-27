import * as React from 'react';
import { forwardRef } from 'react';

// material-ui
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	Slide,
	SlideProps,
	Stack,
	Typography,
} from '@mui/material';

// assets
import { TGetUser } from 'types/user';
import { useSelector } from 'store';

interface ProductAddProps {
	handleCloseDialog: (e?: any) => void;
	data: TGetUser;
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

const UserDetails = ({ handleCloseDialog, data }: ProductAddProps) => {
	const { roles } = useSelector((state) => state.role);
	const getRoleName = (id: number) => {
		if (roles.length > 0)
			return roles.filter((role) => role.id === id)[0]?.name;
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
			<DialogTitle>
				{data.firstName} {data.lastName}
			</DialogTitle>
			<DialogContent>
				<Grid container spacing={1} sx={{ mt: 0.25 }}>
					<Grid item xs={12}>
						<Text label="ID" value={data.id} />
					</Grid>
					<Grid item xs={12}>
						<Text label="First Name" value={data.firstName} />
					</Grid>
					<Grid item xs={12}>
						<Text label="Last Name" value={data.lastName} />
					</Grid>
					<Grid item xs={12}>
						<Text label="Email" value={data.email} />
					</Grid>
					<Grid item xs={12}>
						<Text label="Username" value={data.username} />
					</Grid>
					<Grid item xs={12}>
						<Text label="Role ID" value={data.roleId} />
					</Grid>
					<Grid item xs={12}>
						<Text label="Role Name" value={getRoleName(data.roleId)!} />
					</Grid>
					<Grid item xs={12}>
						<Text label="Subscription Id" value={data.subscriptionId || '--'} />
					</Grid>
					<Grid item xs={12}>
						<Text
							label="Subscription Date"
							value={
								new Intl.DateTimeFormat('en-GB', {
									year: 'numeric',
									month: '2-digit',
									day: '2-digit',
									hour: '2-digit',
									minute: '2-digit',
									second: '2-digit',
								}).format(new Date(data.subscriptionDate)) || '--'
							}
						/>
					</Grid>
					<Grid item xs={12}>
						<Text
							label="Subscription Expiration Date"
							value={
								new Intl.DateTimeFormat('en-GB', {
									year: 'numeric',
									month: '2-digit',
									day: '2-digit',
									hour: '2-digit',
									minute: '2-digit',
									second: '2-digit',
								}).format(new Date(data.subscriptionExpirationDate)) || '--'
							}
						/>
					</Grid>
					<Grid item xs={12}>
						<Text
							label="Books Read This Month"
							value={data.booksReadThisMonth}
						/>
					</Grid>
					<Grid item xs={12}>
						<Text label="Budget" value={data.budget} />
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
							label="Updated At"
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

export default UserDetails;
