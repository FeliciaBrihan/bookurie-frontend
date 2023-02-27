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
import { TGetSubscription } from 'types/subscription';

interface ProductAddProps {
	handleCloseDialog: (e?: any) => void;
	data: TGetSubscription;
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

const SubscriptionDetails = ({ handleCloseDialog, data }: ProductAddProps) => {
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
						<Text label="Monthly Fee" value={`${data.monthlyFee} RON`} />
					</Grid>
					<Grid item xs={12}>
						<Text label="Monthly Free Books" value={data.monthlyFreeBooks} />
					</Grid>
					<Grid item xs={12}>
						<Text label="Book Discount" value={`${data.everyBookDiscount} %`} />
					</Grid>
					<Grid item xs={12}>
						<Text label="Subscription Type" value={data.type} />
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
							}).format(new Date(data.updatedAt))}
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

export default SubscriptionDetails;
