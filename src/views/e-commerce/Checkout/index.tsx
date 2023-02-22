import { useEffect, useState, ReactNode } from 'react';

// material-ui
import { styled, Theme, useTheme } from '@mui/material/styles';
import { Grid, Tab, Tabs, Typography } from '@mui/material';

// project imports
import CartEmpty from './CartEmpty';
import Cart from './Cart';
import BillingAddress from './BillingAddress';
import Payment from './Payment';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { TabsProps } from 'types';
import { CartStateProps } from 'types/cart';
import { Address } from 'types/e-commerce';
import { useDispatch, useSelector } from 'store';
import { getAddress, editAddress, addAddress } from 'store/slices/address';
import {
	removeProduct,
	setBackStep,
	setBillingAddress,
	setNextStep,
	setStep,
	updateProduct,
} from 'store/slices/cart';

// assets
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CreditCardTwoToneIcon from '@mui/icons-material/CreditCardTwoTone';
import useConfig from 'hooks/useConfig';
import { alert } from 'utils/helpers/alert';

interface StyledProps {
	theme: Theme;
	border: number;
	value: number;
	cart: CartStateProps;
	disabled?: boolean;
	icon?: ReactNode;
	label?: ReactNode;
}

interface TabOptionProps {
	label: string;
	icon: ReactNode;
	caption: string;
}

const StyledTab = styled((props) => <Tab {...props} />)(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	({ theme, border, value, cart, ...others }: StyledProps) => ({
		color:
			cart.checkout.step >= value
				? theme.palette.success.dark
				: theme.palette.grey[600],
		minHeight: 'auto',
		minWidth: 250,
		padding: 16,
		borderRadius: `${border}px`,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-start',
		textAlign: 'left',
		justifyContent: 'flex-start',
		'&:after': {
			backgroundColor: 'transparent !important',
		},
		'&.Mui-selected': {
			color: theme.palette.primary.main,
			background:
				theme.palette.mode === 'dark'
					? theme.palette.dark.main
					: theme.palette.grey[50],
		},
		'& > svg': {
			marginBottom: '0px !important',
			marginRight: 10,
			marginTop: 2,
			height: 20,
			width: 20,
		},
		[theme.breakpoints.down('md')]: {
			minWidth: '100%',
		},
	})
);

// tabs option
const tabsOption: TabOptionProps[] = [
	{
		label: 'User Profile',
		icon: <ShoppingCartTwoToneIcon />,
		caption: 'Product Added',
	},
	{
		label: 'Billing Address',
		icon: <ApartmentIcon />,
		caption: 'Billing Information',
	},
	{
		label: 'Payment',
		icon: <CreditCardTwoToneIcon />,
		caption: 'Add & Update Card',
	},
];

// tabs
function TabPanel({ children, value, index, ...other }: TabsProps) {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <div>{children}</div>}
		</div>
	);
}

// ==============================|| PRODUCT - CHECKOUT MAIN ||============================== //

const Checkout = () => {
	const theme = useTheme();
	const cart = useSelector((state) => state.cart);
	const { borderRadius } = useConfig();
	const dispatch = useDispatch();

	const isCart = cart.checkout.products && cart.checkout.products.length > 0;

	const [value, setValue] = useState(
		cart.checkout.step > 2 ? 2 : cart.checkout.step
	);
	const [address, setAddress] = useState<Address>();
	const addressState = useSelector((state) => state.address);
	const { loggedUser } = useSelector((state) => state.user);
	const { subscription } = useSelector((state) => state.subscription);

	useEffect(() => {
		if (loggedUser?.addressId) dispatch(getAddress());
	}, []);

	useEffect(() => {
		setAddress(addressState.address);
	}, [addressState]);

	const addShippingAddress = (addressNew: Address) => {
		dispatch(addAddress(addressNew));
	};

	const editShippingAddress = (addressEdit: Address) => {
		dispatch(editAddress(addressEdit.id, addressEdit));
	};

	const handleChange = (newValue: number) => {
		setValue(newValue);
		dispatch(setStep(newValue));
	};

	useEffect(() => {
		setValue(cart.checkout.step > 2 ? 2 : cart.checkout.step);
	}, [cart.checkout.step]);

	const removeCartProduct = (id: string | number | undefined) => {
		dispatch(removeProduct(id, cart.checkout.products));
		alert.display('Update Cart Success');
	};

	const updateQuantity = (
		id: string | number | undefined,
		quantity: number
	) => {
		dispatch(updateProduct(id, quantity, cart.checkout.products));
	};

	const onNext = () => {
		if (!subscription || subscription?.type === 'premium')
			dispatch(setNextStep());
		if (subscription?.type === 'basic') {
			const remainingFreeBooks =
				subscription.monthlyFreeBooks - loggedUser!.booksReadThisMonth;
			const onlineBooksInCart = cart.checkout.products.filter(
				(product) => product.typeFormat === 'online' && product.pricePromo === 0
			);
			if (onlineBooksInCart.length > remainingFreeBooks)
				alert.display(
					`You can only buy ${remainingFreeBooks} free books`,
					'warning'
				);
			else dispatch(setNextStep());
		}
	};

	const onBack = () => {
		dispatch(setBackStep());
	};

	const checkAddressHandler = () => {
		if (address?.street === '')
			alert.display(`Please Add Delivery Address!`, 'warning');
		else {
			dispatch(setBillingAddress(address!));
			onNext();
		}
	};

	return (
		<MainCard>
			<Grid container spacing={gridSpacing}>
				<Grid item xs={12}>
					<Tabs
						value={value}
						onChange={(e, newValue) => handleChange(newValue)}
						aria-label="icon label tabs example"
						variant="scrollable"
						sx={{
							'& .MuiTabs-flexContainer': {
								borderBottom: 'none',
							},
							'& .MuiTabs-indicator': {
								display: 'none',
							},
							'& .MuiButtonBase-root + .MuiButtonBase-root': {
								position: 'relative',
								overflow: 'visible',
								ml: 2,
								'&:after': {
									content: '""',
									bgcolor: '#ccc',
									width: 1,
									height: 'calc(100% - 16px)',
									position: 'absolute',
									top: 8,
									left: -8,
								},
							},
						}}
					>
						{tabsOption.map((tab, index) => (
							<StyledTab
								theme={theme}
								border={borderRadius}
								value={index}
								cart={cart}
								disabled={
									index > cart.checkout.step || index < cart.checkout.step
								}
								key={index}
								icon={tab.icon}
								label={
									<Grid container direction="column">
										<Typography variant="subtitle1" color="inherit">
											{tab.label}
										</Typography>
										<Typography
											component="div"
											variant="caption"
											sx={{ textTransform: 'capitalize' }}
										>
											{tab.caption}
										</Typography>
									</Grid>
								}
							/>
						))}
					</Tabs>
				</Grid>
				<Grid item xs={12}>
					<TabPanel value={value} index={0}>
						{isCart && (
							<Cart
								checkout={cart.checkout}
								onNext={onNext}
								removeProduct={removeCartProduct}
								updateQuantity={updateQuantity}
							/>
						)}
						{!isCart && <CartEmpty />}
					</TabPanel>
					<TabPanel value={value} index={1}>
						<BillingAddress
							checkout={cart.checkout}
							onBack={onBack}
							address={address!}
							addAddress={addShippingAddress}
							editAddress={editShippingAddress}
							checkAddressHandler={checkAddressHandler}
						/>
					</TabPanel>
					<TabPanel value={value} index={2}>
						<Payment checkout={cart.checkout} onBack={onBack} onNext={onNext} />
					</TabPanel>
				</Grid>
			</Grid>
		</MainCard>
	);
};

export default Checkout;
