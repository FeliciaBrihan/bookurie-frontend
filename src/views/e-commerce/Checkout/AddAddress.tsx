import { forwardRef } from 'react';

// material-ui
import {
	Button,
	Dialog,
	IconButton,
	Grid,
	Stack,
	TextField,
	Zoom,
	ZoomProps,
} from '@mui/material';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { Address } from 'types/e-commerce';
import { gridSpacing } from 'store/constant';

// assets
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';

const validationSchema = yup.object({
	street: yup.string().required('Street is required'),
	building: yup.string().required('Building is required'),
	city: yup.string().required('City is required'),
	country: yup.string().required('Country is required'),
	number: yup.number().required('Number is required'),
	zipCode: yup.number().required('Zip code is required'),
	contact: yup.number().required('Phone no is required'),
});

const Transition = forwardRef((props: ZoomProps, ref) => (
	<Zoom ref={ref} {...props} />
));

// ==============================|| CHECKOUT BILLING ADDRESS - ADD NEW ADDRESS ||============================== //

interface AddAddressProps {
	address: Address;
	open: boolean;
	handleClose: () => void;
	addAddress: (address: Address) => void;
	editAddress: (address: Address) => void;
}

const AddAddress = ({
	address,
	open,
	handleClose,
	addAddress,
	editAddress,
}: AddAddressProps) => {
	const edit = address && address.id;

	const formik = useFormik({
		initialValues: {
			building: edit ? address.building : '',
			street: edit ? address.street : '',
			city: edit ? address.city : '',
			number: edit ? address.number : '',
			country: edit ? address.country : '',
			zipCode: edit ? address.zipCode : '',
			contact: edit ? address.contact : '',
		},
		validationSchema,
		onSubmit: (values) => {
			if (edit) {
				editAddress({ id: address.id, ...values });
			} else {
				addAddress(values);
			}
			handleClose();
		},
	});

	return (
		<Dialog
			open={open}
			TransitionComponent={Transition}
			keepMounted
			onClose={handleClose}
			aria-labelledby="alert-dialog-slide-title"
			aria-describedby="alert-dialog-slide-description"
			sx={{
				'& .MuiDialog-paper': {
					p: 0,
				},
			}}
		>
			{open && (
				<MainCard
					title={edit ? 'Edit Billing Address' : 'Add Billing Address'}
					secondary={
						<IconButton onClick={handleClose} size="large">
							<HighlightOffTwoToneIcon fontSize="small" />
						</IconButton>
					}
				>
					<form onSubmit={formik.handleSubmit}>
						<Grid container spacing={gridSpacing}>
							<Grid item xs={12}>
								<TextField
									fullWidth
									id="street"
									name="street"
									label="Street"
									onBlur={formik.handleBlur}
									value={formik.values.street}
									onChange={formik.handleChange}
									error={formik.touched.street && Boolean(formik.errors.street)}
									helperText={formik.touched.street && formik.errors.street}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									id="building"
									name="building"
									label="Building"
									onBlur={formik.handleBlur}
									value={formik.values.building}
									onChange={formik.handleChange}
									error={
										formik.touched.building && Boolean(formik.errors.building)
									}
									helperText={formik.touched.building && formik.errors.building}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									fullWidth
									id="number"
									name="number"
									label="Number"
									onBlur={formik.handleBlur}
									value={formik.values.number}
									onChange={formik.handleChange}
									error={formik.touched.number && Boolean(formik.errors.number)}
									helperText={formik.touched.number && formik.errors.number}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									fullWidth
									id="city"
									name="city"
									label="City"
									onBlur={formik.handleBlur}
									value={formik.values.city}
									onChange={formik.handleChange}
									error={formik.touched.city && Boolean(formik.errors.city)}
									helperText={formik.touched.city && formik.errors.city}
								/>
							</Grid>

							<Grid item xs={6}>
								<TextField
									fullWidth
									id="country"
									name="country"
									label="Country"
									onBlur={formik.handleBlur}
									value={formik.values.country}
									onChange={formik.handleChange}
									error={
										formik.touched.country && Boolean(formik.errors.country)
									}
									helperText={formik.touched.country && formik.errors.country}
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									fullWidth
									id="zipCode"
									name="zipCode"
									label="Zip Code"
									onBlur={formik.handleBlur}
									value={formik.values.zipCode}
									onChange={formik.handleChange}
									error={
										formik.touched.zipCode && Boolean(formik.errors.zipCode)
									}
									helperText={formik.touched.zipCode && formik.errors.zipCode}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									id="contact"
									name="contact"
									label="Phone"
									onBlur={formik.handleBlur}
									value={formik.values.contact}
									onChange={formik.handleChange}
									error={
										formik.touched.contact && Boolean(formik.errors.contact)
									}
									helperText={formik.touched.contact && formik.errors.contact}
								/>
							</Grid>
							<Grid item xs={12}>
								<Stack direction="row" spacing={1} justifyContent="flex-end">
									<Button color="error" onClick={handleClose}>
										Cancel
									</Button>
									<AnimateButton>
										<Button variant="contained" type="submit">
											Submit
										</Button>
									</AnimateButton>
								</Stack>
							</Grid>
						</Grid>
					</form>
				</MainCard>
			)}
		</Dialog>
	);
};

export default AddAddress;
