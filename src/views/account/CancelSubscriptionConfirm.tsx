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
	Typography,
} from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import AnimateButton from 'ui-component/extended/AnimateButton';

import { unsubscribe } from 'store/slices/subscription';
import { dispatch } from 'store';

// assets
interface SubscriptionCancelProps {
	handleCloseCancel: (e?: any) => void;
	subscriptionId: number;
}

// animation
const Transition = forwardRef((props: SlideProps, ref) => (
	<Slide direction="left" ref={ref} {...props} />
));

const CancelSubscriptionConfirm = ({
	handleCloseCancel,
	subscriptionId,
}: SubscriptionCancelProps) => {
	const cancelSubscription = () => {
		dispatch(unsubscribe(subscriptionId));
		handleCloseCancel();
	};
	return (
		<Dialog
			open
			TransitionComponent={Transition}
			keepMounted
			onClose={handleCloseCancel}
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
			<DialogTitle></DialogTitle>
			<DialogContent>
				<Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
					<Grid item xs={12}>
						<Typography>
							Your subscription will be now removed and your money refund. Are
							you sure you want to unsubscribe?
						</Typography>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<AnimateButton>
					<Button variant="contained" onClick={cancelSubscription}>
						Yes
					</Button>
				</AnimateButton>
				<Button variant="text" color="error" onClick={handleCloseCancel}>
					No
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CancelSubscriptionConfirm;
