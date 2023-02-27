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
import { TSetSubscription } from 'types/subscription';
import { subscriptionApi } from 'store/slices/subscription';

interface ProductAddProps {
	handleCloseDialog: (e?: any) => void;
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

const defaultValue = {
	name: '',
	monthlyFee: undefined,
	monthlyFreeBooks: undefined,
	everyBookDiscount: undefined,
	type: '',
};

const SubscriptionAdd = ({ handleCloseDialog }: ProductAddProps) => {
	const [formValue, setFormValue] = useState<TSetSubscription>(defaultValue);
	const [subscriptionType, setSubscriptionType] = useState('basic');

	const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFormValue({
			...formValue,
			[event?.target.id]: event?.target.value,
		});
	};
	const handleSelectChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined
	) => {
		event?.target.value && setSubscriptionType(event?.target.value);
	};

	const handleSave = async () => {
		await subscriptionApi.create(
			{
				name: formValue.name,
				monthlyFee: formValue.monthlyFee,
				monthlyFreeBooks: formValue.monthlyFreeBooks,
				everyBookDiscount: formValue.everyBookDiscount,
				type: subscriptionType,
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
			<DialogTitle>Add New Subscription</DialogTitle>
			<DialogContent>
				<Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
					<Grid item xs={12}>
						<TextField
							id="name"
							required
							fullWidth
							label="Enter Subscription Name"
							onChange={handleValueChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							id="monthlyFee"
							required
							fullWidth
							label="Enter Monthly Fee"
							onChange={handleValueChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							id="monthlyFreeBooks"
							required
							fullWidth
							label="Enter Monthly Free Books Number"
							onChange={handleValueChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							id="everyBookDiscount"
							required
							fullWidth
							label="Every Book Discount"
							onChange={handleValueChange}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							id="type"
							required
							select
							label="Select Subscription Type"
							value={subscriptionType}
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
					<Button variant="contained" onClick={handleSave}>
						Create
					</Button>
				</AnimateButton>
				<Button variant="text" color="error" onClick={handleCloseDialog}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default SubscriptionAdd;
