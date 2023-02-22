// material-ui
import { Button, IconButton, Grid, Stack, Typography } from '@mui/material';

// project imports
import { Address } from 'types/e-commerce';
import SubCard from 'ui-component/cards/SubCard';

// assets
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

// ==============================|| CHECKOUT BILLING ADDRESS - ADDRESS CARD ||============================== //

interface AddressCardProps {
	address: Address | null;
	change?: boolean;
	onBack?: () => void;
	handleClickOpen?: (billingAddress: Address) => void;
	billingAddressHandler?: (billingAddress: Address) => void;
}

const AddressCard = ({
	address,
	change,
	handleClickOpen,
	onBack,
}: AddressCardProps) => (
	<SubCard>
		{address && (
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
					>
						<Typography>Shipping Address</Typography>
						{change && (
							<Button
								variant="contained"
								size="small"
								color="primary"
								startIcon={<EditTwoToneIcon />}
								onClick={onBack}
							>
								Change
							</Button>
						)}
						{handleClickOpen && (
							<IconButton size="small" onClick={() => handleClickOpen(address)}>
								<EditTwoToneIcon fontSize="small" />
							</IconButton>
						)}
					</Stack>
				</Grid>

				<Grid item xs={12}>
					<Stack spacing={1}>
						<Typography variant="body2">
							{` Street: ${address.street}, Building: ${address.building}, Number: ${address.number}, City: ${address.city},  Country: ${address.country},  Zip Code:  ${address.zipCode}`}
						</Typography>
						<Typography variant="caption" color="secondary">
							Phone: {address.contact}
						</Typography>
					</Stack>
				</Grid>
				{
					<Grid item xs={12}>
						<Stack
							direction="row"
							alignItems="center"
							justifyContent="space-between"
						></Stack>
					</Grid>
				}
			</Grid>
		)}
	</SubCard>
);

export default AddressCard;
