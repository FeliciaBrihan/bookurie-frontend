import * as React from 'react';
import { forwardRef, useState } from 'react';

// material-ui
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	MenuItem,
	Slide,
	SlideProps,
	TextField,
} from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import { TGetSubscription, TSetSubscription } from 'types/subscription';
import { subscriptionApi } from 'store/slices/subscription';

interface ProductAddProps {
	handleCloseDialog: (e?: any) => void;
	data: TGetSubscription;
}

// animation
const Transition = forwardRef((props: SlideProps, ref) => (
	<Slide direction="left" ref={ref} {...props} />
));

// subscription type options
const types = [
	{
		value: 'basic',
	},
	{
		value: 'premium',
	},
];

const SubscriptionEdit = ({ handleCloseDialog, data }: ProductAddProps) => {
	const defaultValue = {
		name: data.name,
		monthlyFee: data.monthlyFee,
		monthlyFreeBooks: data.monthlyFreeBooks,
		everyBookDiscount: data.everyBookDiscount,
		type: data.type,
	};

	const [formValue, setFormValue] = useState<TSetSubscription>(defaultValue);
	const [subscriptionType, setSubscriptionType] = useState(data.type);

	const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFormValue({
			...formValue,
			[event?.target.id]: event?.target.value,
		});
	};
	const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSubscriptionType(event.target.value);
	};

	const handleUpdate = async () => {
		await subscriptionApi.update(
			data.id,
			{
				name: formValue.name,
				monthlyFee: formValue.monthlyFee,
				monthlyFreeBooks: formValue.monthlyFreeBooks,
				everyBookDiscount: formValue.everyBookDiscount,
				type: formValue.type,
			},
			{ sync: true }
		);
		handleCloseDialog();
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
			<DialogTitle>Subscription #{data.name}</DialogTitle>
			<DialogContent>
				<Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
					<Grid item xs={12}>
						<TextField
							id="name"
							required
							fullWidth
							defaultValue={formValue.name}
							label="Enter Subscription Name"
							onChange={handleValueChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							id="monthlyFee"
							required
							fullWidth
							defaultValue={formValue.monthlyFee}
							label="Enter Monthly Fee"
							onChange={handleValueChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							id="monthlyFreeBooks"
							required
							fullWidth
							defaultValue={formValue.monthlyFreeBooks}
							label="Enter Monthly Free Books Number"
							onChange={handleValueChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							id="everyBookDiscount"
							required
							fullWidth
							defaultValue={formValue.everyBookDiscount}
							label="Enter Book Discount"
							onChange={handleValueChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							id="type"
							select
							label="Select Subscription Type"
							defaultValue={subscriptionType}
							fullWidth
							onChange={handleSelectChange}
						>
							{types.map((option) => (
								<MenuItem key={option.value} value={option.value}>
									{option.value}
								</MenuItem>
							))}
						</TextField>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<AnimateButton>
					<Button variant="contained" onClick={handleUpdate}>
						Save
					</Button>
				</AnimateButton>
				<Button variant="text" color="error" onClick={handleCloseDialog}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default SubscriptionEdit;
