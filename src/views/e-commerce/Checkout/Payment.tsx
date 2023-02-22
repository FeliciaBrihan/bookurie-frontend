import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'store';

// material-ui
import {
	Box,
	Button,
	FormControl,
	FormControlLabel,
	Grid,
	RadioGroup,
	Radio,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Typography,
} from '@mui/material';

// project imports
import OrderSummary from './OrderSummary';
import AddressCard from './AddressCard';
import PaymentSelect from './PaymentSelect';
import PaymentOptions from './PaymentOptions';
import PaymentCard from './PaymentCard';
import AddPaymentCard from './AddPaymentCard';
import OrderComplete from './OrderComplete';
import SubCard from 'ui-component/cards/SubCard';
import Avatar from 'ui-component/extended/Avatar';
import { gridSpacing } from 'store/constant';

// assets
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { CartCheckoutStateProps } from 'types/cart';
import { PaymentOptionsProps } from 'types/e-commerce';
import { setPaymentCard, setPaymentMethod } from 'store/slices/cart';
import { create, getUserPurchases } from 'store/slices/purchase';
import { alert } from 'utils/helpers/alert';

const prodImage = require.context('assets/images/e-commerce', true);

// ==============================|| CHECKOUT PAYMENT - MAIN ||============================== //

interface PaymentProps {
	checkout: CartCheckoutStateProps;
	onBack: () => void;
	onNext: () => void;
}

const Payment = ({ checkout, onBack, onNext }: PaymentProps) => {
	const dispatch = useDispatch();

	const [type, setType] = useState(checkout.payment.type);
	const [payment, setPayment] = useState(checkout.payment.method);
	const [rows, setRows] = useState(checkout.products);
	const [cards, setCards] = useState(checkout.payment.card);
	const { loggedUser } = useSelector((state) => state.user);

	const [open, setOpen] = useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const [complete, setComplete] = useState(false);

	useEffect(() => {
		if (checkout.step > 2) {
			setComplete(true);
		}
	}, []);

	useEffect(() => {
		setRows(checkout.products);
	}, [checkout.products]);

	const cardHandler = (card: string) => {
		if (payment === 'card') {
			setCards(card);
			dispatch(setPaymentCard(card));
		}
	};

	const handlePaymentMethod = (value: string) => {
		setPayment(value);
		dispatch(setPaymentMethod(value));
	};

	const completeHandler = async () => {
		if (payment === 'card' && (cards === '' || cards === null)) {
			alert.display('Select Payment Card!', 'warning');
		} else {
			if (loggedUser!.budget <= checkout.total)
				alert.display('Not Enough Money!', 'warning');
			else {
				const booksId = [];
				for (const product of checkout.products) {
					booksId.push(product.id);
				}
				await dispatch(create(booksId));
				await dispatch(getUserPurchases());
				onNext();
				setComplete(true);
			}
		}
	};

	return (
		<Grid container spacing={gridSpacing}>
			<Grid item xs={12} md={6} lg={8} xl={9}>
				<Grid container spacing={gridSpacing}>
					<Grid item xs={12}>
						<Stack>
							<Typography variant="subtitle1">Delivery</Typography>
							<FormControl>
								<RadioGroup
									row
									aria-label="delivery-options"
									value={type}
									onChange={(e) => {
										setType(e.target.value);
									}}
									name="delivery-options"
								>
									<Grid
										container
										spacing={gridSpacing}
										alignItems="center"
										sx={{ pt: 2 }}
									>
										<Grid item xs={12} sm={6} md={12} lg={6}>
											<SubCard content={false}>
												<Box sx={{ p: 2 }}>
													<FormControlLabel
														value="free"
														control={<Radio />}
														label={
															<Stack spacing={0.25}>
																<Typography variant="subtitle1">
																	Standard Delivery (Free)
																</Typography>
															</Stack>
														}
														sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }}
													/>
												</Box>
											</SubCard>
										</Grid>
									</Grid>
								</RadioGroup>
							</FormControl>
						</Stack>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="subtitle1">Payment Options</Typography>
					</Grid>
					<Grid item xs={12} lg={6}>
						<FormControl>
							<RadioGroup
								aria-label="delivery-options"
								value={payment}
								onChange={(e) => handlePaymentMethod(e.target.value)}
								name="delivery-options"
							>
								<Grid container spacing={gridSpacing} alignItems="center">
									{PaymentOptions.map((item: PaymentOptionsProps, index) => (
										<Grid item xs={12} key={index}>
											<PaymentSelect item={item} />
										</Grid>
									))}
								</Grid>
							</RadioGroup>
						</FormControl>
					</Grid>
					<Grid
						item
						xs={12}
						lg={6}
						sx={{ opacity: payment === 'card' ? 1 : 0.4 }}
					>
						<SubCard
							title="Add Your Card"
							secondary={
								<Button
									disabled={payment === 'card' ? false : true}
									variant="contained"
									size="small"
									startIcon={<AddTwoToneIcon />}
									onClick={handleClickOpen}
								>
									Add Card
								</Button>
							}
						>
							<Grid container spacing={gridSpacing}>
								<Grid item xs={12} xl={6}>
									<PaymentCard
										type="mastercard"
										cards={cards}
										cardHandler={cardHandler}
									/>
								</Grid>
								<Grid item xs={12} xl={6}>
									<PaymentCard
										type="visa"
										cards={cards}
										cardHandler={cardHandler}
									/>
								</Grid>
							</Grid>
							<AddPaymentCard open={open} handleClose={handleClose} />
						</SubCard>
					</Grid>
					<Grid item xs={12}>
						<Grid
							container
							spacing={3}
							alignItems="center"
							justifyContent="space-between"
						>
							<Grid item>
								<Button
									variant="text"
									startIcon={<KeyboardBackspaceIcon />}
									onClick={onBack}
								>
									Back
								</Button>
							</Grid>
							<Grid item>
								<Button variant="contained" onClick={completeHandler}>
									Complete Order
								</Button>
								<OrderComplete
									open={complete}
									items={checkout}
									loggedUser={loggedUser!}
								/>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12} md={6} lg={4} xl={3}>
				<Grid container spacing={gridSpacing}>
					<Grid item xs={12}>
						<Stack>
							<Typography variant="subtitle1" sx={{ pb: 2 }}>
								Cart Items
							</Typography>
							<TableContainer>
								<Table sx={{ minWidth: 280 }} aria-label="simple table">
									<TableBody>
										{rows.map((row, index) => {
											return (
												<TableRow
													key={index}
													sx={{
														'&:last-of-type td, &:last-of-type th': {
															border: 0,
														},
													}}
												>
													<TableCell component="th" scope="row">
														<Grid container alignItems="center" spacing={2}>
															<Grid item>
																<Avatar
																	size="md"
																	variant="rounded"
																	src={
																		row.image ? prodImage(`./${row.image}`) : ''
																	}
																/>
															</Grid>
															<Grid item>
																<Stack spacing={0}>
																	<Typography variant="subtitle1">
																		{row.title}
																	</Typography>
																	<Stack
																		direction="row"
																		alignItems="center"
																		spacing={1}
																	>
																		<Typography
																			variant="caption"
																			sx={{ fontSize: '1rem' }}
																		></Typography>
																	</Stack>
																</Stack>
															</Grid>
														</Grid>
													</TableCell>
													<TableCell align="right">
														{row.quantity && (
															<Typography variant="subtitle1">
																{row.pricePromo || row.pricePromo === 0
																	? row.pricePromo * row.quantity
																	: row.price * row.quantity}{' '}
																RON
															</Typography>
														)}
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</TableContainer>
						</Stack>
					</Grid>
					<Grid item xs={12}>
						<OrderSummary checkout={checkout} />
					</Grid>
					<Grid item xs={12}>
						<AddressCard change address={checkout.billing} onBack={onBack} />
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default Payment;
