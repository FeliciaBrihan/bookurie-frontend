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
	Slide,
	SlideProps,
	Typography,
} from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import { TGetLoan, TSetLoan } from 'types/loan';
import { loanApi } from 'store/slices/loan';

interface ProductAddProps {
	handleCloseDialog: (e?: any) => void;
	data: TGetLoan;
}

// animation
const Transition = forwardRef((props: SlideProps, ref) => (
	<Slide direction="left" ref={ref} {...props} />
));

const LoanReturn = ({ handleCloseDialog, data }: ProductAddProps) => {
	const defaultValue = {
		isReturned: data.isReturned,
	};

	const [formValue, setFormValue] = useState<TSetLoan>(defaultValue);

	const handleUpdate = async () => {
		await loanApi.returnLoan(data.id, { sync: true });
		setFormValue({ ...formValue, isReturned: true });
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
			<DialogTitle>Loan #{data.id}</DialogTitle>
			<DialogContent>
				<Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
					<Grid item xs={12}>
						<Typography>
							{data.isAccepted
								? data.isReturned
									? 'Loan already returned.'
									: 'Are you sure you want to return this loan?'
								: 'Loan cannot be returned because is not yet approved.'}
						</Typography>
					</Grid>
				</Grid>
			</DialogContent>
			{data.isAccepted && !data.isReturned ? (
				<DialogActions
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<AnimateButton>
						<Button variant="contained" onClick={handleUpdate}>
							Yes
						</Button>
					</AnimateButton>
					<Button variant="text" color="error" onClick={handleCloseDialog}>
						No
					</Button>
				</DialogActions>
			) : (
				<DialogActions>
					<Button variant="text" color="primary" onClick={handleCloseDialog}>
						Close
					</Button>
				</DialogActions>
			)}
		</Dialog>
	);
};

export default LoanReturn;
