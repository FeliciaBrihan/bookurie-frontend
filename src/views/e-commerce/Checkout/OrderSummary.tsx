// material-ui
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Typography,
} from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import { CartCheckoutStateProps } from 'types/cart';

// ==============================|| CHECKOUT CART - ORDER SUMMARY ||============================== //

const OrderSummary = ({ checkout }: { checkout: CartCheckoutStateProps }) => (
	<SubCard>
		<TableContainer>
			<Table sx={{ minWidth: 'auto' }} size="small" aria-label="simple table">
				<TableBody>
					<TableRow>
						<TableCell>
							<Typography variant="subtitle1">Order Summary</Typography>
						</TableCell>
						<TableCell />
					</TableRow>
					<TableRow>
						<TableCell>Sub Total</TableCell>
						<TableCell align="right">
							<Typography variant="subtitle1">
								{checkout.subtotal} RON
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Shipping Charges</TableCell>
						<TableCell align="right">
							<Typography variant="subtitle1">
								{checkout.shipping <= 0 ? 0 : checkout.shipping} RON
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ borderBottom: 'none' }}>
							<Typography variant="subtitle1">Total</Typography>
						</TableCell>
						<TableCell align="right" sx={{ borderBottom: 'none' }}>
							<Typography variant="subtitle1">{checkout.total} RON</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	</SubCard>
);

export default OrderSummary;
