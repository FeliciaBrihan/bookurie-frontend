import { forwardRef, useEffect, useState } from 'react';

// material-ui
// import { useTheme } from '@mui/material/styles';
import {
	Button,
	Card,
	CardActions,
	CardContent,
	Dialog,
	Grid,
	SlideProps,
	Slide,
	Typography,
} from '@mui/material';
// assets

// project imports

import { dispatch, useSelector } from 'store';

import { subscribe, subscriptionApi } from 'store/slices/subscription';
import SubCard from 'ui-component/cards/SubCard';
import { TGetSubscription } from 'types/subscription';

const Transition = forwardRef((props: SlideProps, ref) => (
	<Slide direction="left" ref={ref} {...props} />
));
interface SubscriptionAddProps {
	handleCloseDialog: (e?: any) => void;
}

const SubscriptionListUserView = ({
	handleCloseDialog,
}: SubscriptionAddProps) => {
	const cardStyle = {
		width: '200px',
		height: '250px',
	};
	const [subscriptions, setSubscriptions] = useState<TGetSubscription[]>([]);
	const subscriptionState = useSelector((state) => state.subscription);
	const { loggedUser } = useSelector((state) => state.user);

	useEffect(() => {
		dispatch(subscriptionApi.getAll());
	}, []);

	useEffect(() => {
		setSubscriptions(subscriptionState.subscriptions);
	}, [subscriptionState]);

	return (
		<Dialog
			open
			TransitionComponent={Transition}
			PaperProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0)' } }}
			keepMounted
			onClose={handleCloseDialog}
		>
			<Grid
				container
				spacing={2}
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: ' 0 12px 0 12px',
				}}
			>
				{subscriptions.map((subscription) => {
					return (
						<Grid item xs={12} lg={6} key={subscription.id}>
							<SubCard title={subscription.name}>
								<Card style={cardStyle}>
									<CardContent>
										<Grid container spacing={2}>
											<Grid item>
												<Typography variant="subtitle1">
													{subscription.monthlyFee} RON / month
												</Typography>
											</Grid>
										</Grid>
										<Grid container spacing={2}>
											<Grid item>
												<Typography variant="subtitle2">
													{subscription.everyBookDiscount} % book discount
												</Typography>
											</Grid>
										</Grid>
										<Grid container spacing={2}>
											<Grid item>
												<Typography variant="subtitle2">
													unlimited loans
												</Typography>
											</Grid>
										</Grid>
										<Grid container spacing={2}>
											<Grid item>
												<Typography variant="subtitle2">
													{subscription.type === 'basic'
														? `${subscription.monthlyFreeBooks} free online books / month`
														: `unlimited free online books`}
												</Typography>
											</Grid>
										</Grid>
									</CardContent>
									<CardActions>
										<Grid container>
											<Grid item>
												{subscription.id !== loggedUser?.subscriptionId ? (
													<Button
														variant="contained"
														onClick={() => {
															dispatch(subscribe(subscription.id));
															handleCloseDialog();
														}}
													>
														Subscribe
													</Button>
												) : (
													<Button variant="contained" disabled>
														Subscribed
													</Button>
												)}
											</Grid>
										</Grid>
									</CardActions>
								</Card>
							</SubCard>
						</Grid>
					);
				})}
			</Grid>
		</Dialog>
	);
};

export default SubscriptionListUserView;
