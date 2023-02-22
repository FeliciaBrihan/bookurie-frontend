import { forwardRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
	Button,
	Dialog,
	Divider,
	Grid,
	Stack,
	Typography,
	Zoom,
	ZoomProps,
	useMediaQuery,
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
import Invoice from '../Products/Invoice';

// assets
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import completed from 'assets/images/e-commerce/completed.png';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CartCheckoutStateProps } from 'types/cart';
import { dispatch, useSelector } from 'store';
import { getUserPurchases } from 'store/slices/purchase';
import { TGetPurchase } from 'types/purchase';
import { TGetUser } from 'types/user';

const Transition = forwardRef((props: ZoomProps, ref) => (
	<Zoom ref={ref} {...props} />
));

// ==============================|| CHECKOUT CART - DISCOUNT COUPON CODE ||============================== //

const OrderComplete = ({
	open,
	items,
	loggedUser,
}: {
	open: boolean;
	items: CartCheckoutStateProps;
	loggedUser: TGetUser;
}) => {
	const theme = useTheme();
	const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));
	const [purchases, setPurchases] = useState<TGetPurchase[]>([]);
	const { userPurchases } = useSelector((state) => state.purchase);
	const [orderId, setOrderId] = useState('');

	useEffect(() => {
		dispatch(getUserPurchases());
	}, []);

	useEffect(() => {
		setPurchases(userPurchases);
	}, [userPurchases]);

	useEffect(() => {
		if (purchases?.length > 0)
			setOrderId(purchases[purchases.length - 1].orderId);
	}, [purchases]);

	return (
		<>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
				maxWidth="md"
				sx={{
					'& .MuiDialog-paper': {
						p: 0,
					},
				}}
			>
				{open && (
					<MainCard>
						<PerfectScrollbar
							style={{
								overflowX: 'hidden',
								height: 'calc(100vh - 100px)',
							}}
						>
							<Grid
								container
								direction="column"
								spacing={gridSpacing}
								alignItems="center"
								justifyContent="center"
								sx={{ my: 0 }}
							>
								<Grid item xs={12}>
									<Typography variant={matchDownMD ? 'h2' : 'h1'}>
										Thank you for order!
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Stack alignItems="center" spacing={1}>
										<Typography
											align="center"
											variant="h4"
											sx={{ fontWeight: 300, color: 'grey.500' }}
										>
											We will send a process notification, before it delivered.
										</Typography>
										<Typography variant="body1" align="center">
											Your order id:{' '}
											<Typography
												variant="subtitle1"
												component="span"
												color="primary"
											>
												{orderId}
											</Typography>
										</Typography>
									</Stack>
								</Grid>
								<Grid item xs={12} sx={{ m: 0 }}>
									<img
										src={completed}
										alt="Order Complete"
										width="90%"
										style={{ maxWidth: 780 }}
									/>
								</Grid>
								<Grid item xs={12}>
									<Divider />
								</Grid>
								<Grid item xs={12}>
									<Grid
										direction={matchDownMD ? 'column-reverse' : 'row'}
										container
										spacing={3}
										alignItems={matchDownMD ? '' : 'center'}
										justifyContent="space-between"
									>
										<Grid item>
											<Button
												component={Link}
												to="/dashboard"
												variant="text"
												startIcon={<KeyboardBackspaceIcon />}
											>
												Continue Shopping
											</Button>
										</Grid>
										<Grid item>
											<Button variant="text" fullWidth>
												<PDFDownloadLink
													document={
														<Invoice
															items={items}
															orderId={orderId}
															loggedUser={loggedUser}
														/>
													}
													fileName="invoice bookurie.pdf"
												>
													{({ loading }) =>
														loading ? 'Loading document...' : 'Download Invoice'
													}
												</PDFDownloadLink>
											</Button>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</PerfectScrollbar>
					</MainCard>
				)}
			</Dialog>
		</>
	);
};

export default OrderComplete;
