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
	Typography,
} from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import { bookApi, hasError } from 'store/slices/book';
import { TSetBook } from 'types/book';
import axios from 'axios';
import { dispatch } from 'store';

// book type options
const types = [
	{
		value: 'online',
	},
	{
		value: 'printed',
	},
];

import { useFormik } from 'formik';
import * as yup from 'yup';

// animation
const Transition = forwardRef((props: SlideProps, ref) => (
	<Slide direction="left" ref={ref} {...props} />
));

// ==============================|| PRODUCT ADD DIALOG ||============================== //

interface ProductAddProps {
	open: boolean;
	handleCloseDialog: () => void;
}
const initialValues = {
	title: '',
	author: '',
	publishingHouse: '',
	publishedYear: 0,
	coverImage: '',
	genre: '',
	description: '',
	pages: 0,
	typeFormat: '',
	price: 0,
	stockOld: 0,
	stockNew: 0,
};

const BookAdd = ({ open, handleCloseDialog }: ProductAddProps) => {
	const [file, setFile] = useState<File | undefined>();

	const validationSchema = yup.object({
		title: yup.string().required('Title is required'),
		author: yup.string().required('Author is required'),
		publishingHouse: yup.string().notRequired(),
		publishedYear: yup
			.number()
			.required('Published Year is required')
			.test(
				'is-four-digits',
				'Must be a four digit number',
				(value) => value !== undefined && value.toString().length === 4
			),
		coverImage: yup.string().notRequired(),
		genre: yup.string().required('Genre is required'),
		description: yup.string().notRequired(),
		pages: yup
			.number()
			.min(1, 'Must be grater than 0')
			.required('Pages is required'),
		typeFormat: yup.string().required('Type Format is required'),
		price: yup.number().required('Price is required'),
		stockOld: yup
			.number()
			.min(0, 'Must be positive')
			.required('Stock Old is required'),
		stockNew: yup
			.number()
			.min(0, 'Must be positive')
			.required('Stock New is required'),
	});

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: async (values) => {
			console.log(values);
			if (values) {
				const book: TSetBook = {
					title: values.title,
					author: values.author,
					publishingHouse: values.publishingHouse,
					publishedYear: values.publishedYear,
					coverImage: file ? file.name : '',
					genre: values.genre,
					description: values.description,
					pages: values.pages,
					typeFormat: values.typeFormat,
					price: values.price,
					stockOld: values.stockOld,
					stockNew: values.stockNew,
				};
				if (file) uploadFile();
				await bookApi.create(book, { sync: true });
				handleCloseDialog();
			}
		},
	});

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFile(event.target.files![0]);
	};

	const uploadFile = async () => {
		const formData: any = new FormData();
		formData.append('file', file);

		try {
			const result = await axios.post(
				'http://localhost:5000/upload',
				formData,
				{
					headers: { 'Content-Type': 'multipart/form-data' },
				}
			);
			console.log(result.data);
		} catch (err) {
			dispatch(hasError(err));
		}
	};

	return (
		<Dialog
			open={open}
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
			{open && (
				<>
					<DialogTitle>Add Book</DialogTitle>
					<form onSubmit={formik.handleSubmit}>
						<DialogContent>
							<Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
								<Grid item xs={12}>
									<TextField
										id="title"
										required
										fullWidth
										label="Enter Book Title"
										value={formik.values.title}
										onBlur={formik.handleBlur}
										error={formik.touched.title && Boolean(formik.errors.title)}
										helperText={formik.touched.title && formik.errors.title}
										onChange={formik.handleChange}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										id="author"
										required
										fullWidth
										label="Enter Book Author"
										value={formik.values.author}
										onBlur={formik.handleBlur}
										error={
											formik.touched.author && Boolean(formik.errors.author)
										}
										helperText={formik.touched.author && formik.errors.author}
										onChange={formik.handleChange}
									/>
								</Grid>
								<Grid item xs={6}>
									<TextField
										id="typeFormat"
										required
										select
										label="Select Book Format"
										name="typeFormat"
										value={formik.values.typeFormat}
										onBlur={formik.handleBlur}
										error={
											formik.touched.typeFormat &&
											Boolean(formik.errors.typeFormat)
										}
										helperText={
											formik.touched.typeFormat && formik.errors.typeFormat
										}
										fullWidth
										onChange={formik.handleChange}
									>
										{types.map((option) => (
											<MenuItem
												key={option.value}
												value={option.value}
												id={option.value}
											>
												{option.value}
											</MenuItem>
										))}
									</TextField>
								</Grid>
								<Grid item xs={6}>
									<TextField
										id="price"
										required
										fullWidth
										value={formik.values.price}
										onBlur={formik.handleBlur}
										error={formik.touched.price && Boolean(formik.errors.price)}
										helperText={formik.touched.price && formik.errors.price}
										label="Price"
										onChange={formik.handleChange}
									/>
								</Grid>
								<Grid item xs={6}>
									<TextField
										id="stockOld"
										type="number"
										required
										fullWidth
										value={formik.values.stockOld}
										onBlur={formik.handleBlur}
										error={
											formik.touched.stockOld && Boolean(formik.errors.stockOld)
										}
										helperText={
											formik.touched.stockOld && formik.errors.stockOld
										}
										label="Enter Book Old Stock"
										onChange={formik.handleChange}
									/>
								</Grid>
								<Grid item xs={6}>
									<TextField
										id="stockNew"
										type="number"
										required
										fullWidth
										value={formik.values.stockNew}
										onBlur={formik.handleBlur}
										error={
											formik.touched.stockNew && Boolean(formik.errors.stockNew)
										}
										helperText={
											formik.touched.stockNew && formik.errors.stockNew
										}
										label="Enter Book New Stock"
										onChange={formik.handleChange}
									/>
								</Grid>
								<Grid item xs={6}>
									<TextField
										id="pages"
										type="number"
										required
										fullWidth
										value={formik.values.pages}
										onBlur={formik.handleBlur}
										error={formik.touched.pages && Boolean(formik.errors.pages)}
										helperText={formik.touched.pages && formik.errors.pages}
										label="Enter Book Pages"
										onChange={formik.handleChange}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										id="genre"
										fullWidth
										value={formik.values.genre}
										onBlur={formik.handleBlur}
										error={formik.touched.genre && Boolean(formik.errors.genre)}
										helperText={formik.touched.genre && formik.errors.genre}
										label="Enter Book Genre"
										onChange={formik.handleChange}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										id="publishedYear"
										fullWidth
										value={formik.values.publishedYear}
										onBlur={formik.handleBlur}
										error={
											formik.touched.publishedYear &&
											Boolean(formik.errors.publishedYear)
										}
										helperText={
											formik.touched.publishedYear &&
											formik.errors.publishedYear
										}
										label="Enter Book Published Year"
										onChange={formik.handleChange}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										id="publishingHouse"
										fullWidth
										value={formik.values.publishingHouse}
										onBlur={formik.handleBlur}
										error={
											formik.touched.publishingHouse &&
											Boolean(formik.errors.publishingHouse)
										}
										helperText={
											formik.touched.publishingHouse &&
											formik.errors.publishingHouse
										}
										label="Enter Book Publishing House"
										onChange={formik.handleChange}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										id="description"
										fullWidth
										multiline
										rows={4}
										value={formik.values.description}
										onBlur={formik.handleBlur}
										error={
											formik.touched.description &&
											Boolean(formik.errors.description)
										}
										helperText={
											formik.touched.description && formik.errors.description
										}
										label="Enter Book Description"
										onChange={formik.handleChange}
									/>
								</Grid>
								<Grid item xs={12}>
									<Grid container spacing={1}>
										<Grid item xs={12}></Grid>
										<Button
											sx={{ marginLeft: '10px' }}
											variant="outlined"
											component="label"
											color="primary"
										>
											Upload Book Image
											<input
												id="coverImage"
												type="file"
												name="coverImage"
												hidden
												onBlur={formik.handleBlur}
												onChange={handleImageUpload}
											/>
										</Button>
										<Typography sx={{ marginLeft: '10px' }}>
											{' '}
											{file ? file.name : ''}
										</Typography>
									</Grid>
								</Grid>
							</Grid>
						</DialogContent>

						<DialogActions>
							<AnimateButton>
								<Button
									variant="contained"
									disabled={formik.isSubmitting}
									type="submit"
								>
									Create
								</Button>
							</AnimateButton>
							<Button variant="text" color="error" onClick={handleCloseDialog}>
								Close
							</Button>
						</DialogActions>
					</form>
				</>
			)}
		</Dialog>
	);
};

export default BookAdd;
