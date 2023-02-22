import { useState, ReactElement, useEffect } from 'react';

// material-ui
import { Button, Grid, Stack, Typography } from '@mui/material';

// project imports
import AddAddress from './AddAddress';
import OrderSummary from './OrderSummary';
import AddressCard from './AddressCard';
import { gridSpacing } from 'store/constant';

// assets
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import AddIcon from '@mui/icons-material/Add';
import { Address } from 'types/e-commerce';
import { CartCheckoutStateProps } from 'types/cart';
import { setBillingAddress } from 'store/slices/cart';

// ==============================|| CHECKOUT BILLING ADDRESS - MAIN ||============================== //

interface BillingAddressProps {
	address: Address;
	checkout: CartCheckoutStateProps;
	onBack: () => void;
	addAddress: (address: Address) => void;
	editAddress: (address: Address) => void;
	checkAddressHandler: () => void;
}

const BillingAddress = ({
	checkout,
	onBack,
	checkAddressHandler,
	address,
	addAddress,
	editAddress,
}: BillingAddressProps) => {
	useEffect(() => {
		if (address?.street !== '') {
			setBillingAddress(address);
		}
	}, []);

	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	let shippingAddress: ReactElement | ReactElement[] = <></>;

	if (address?.street) {
		shippingAddress = (
			<Grid item xs={12} lg={12} key={0}>
				<AddressCard address={address} handleClickOpen={handleClickOpen} />
			</Grid>
		);
	}

	return (
		<Grid container spacing={gridSpacing}>
			<Grid item xs={12} md={12}>
				<Grid container spacing={gridSpacing}>
					<Grid item xs={12}>
						<Stack
							direction="row"
							alignItems="center"
							justifyContent="space-between"
						>
							{!address?.street && (
								<>
									<Typography variant="subtitle1">Shipping Address</Typography>

									<Button
										size="small"
										variant="contained"
										startIcon={<AddIcon />}
										onClick={() => handleClickOpen()}
									>
										Add Address
									</Button>
								</>
							)}
						</Stack>
					</Grid>
					{shippingAddress}
					<Grid item xs={12}>
						<OrderSummary checkout={checkout} />
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
								<Button variant="contained" onClick={checkAddressHandler}>
									Place Order
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<AddAddress
				open={open}
				handleClose={handleClose}
				address={address!}
				addAddress={addAddress}
				editAddress={editAddress}
			/>
		</Grid>
	);
};

export default BillingAddress;
