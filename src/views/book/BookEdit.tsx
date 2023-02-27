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
	Typography,
} from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import { TGetBook } from 'types/book';
import { bookApi } from 'store/slices/book';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface ProductAddProps {
	handleCloseDialog: (e?: any) => void;
	data: TGetBook;
}

// animation
const Transition = forwardRef((props: SlideProps, ref) => (
	<Slide direction="left" ref={ref} {...props} />
));

// type format options
const type = [
	{
		value: 'printed',
	},
	{
		value: 'online',
	},
];

const BookEdit = ({ handleCloseDialog, data }: ProductAddProps) => {
	const [file, setFile] = useState<File | undefined>();

	const initialValues = {
		title: data.title,
		author: data.author,
		publishingHouse: data.publishingHouse,
		publishedYear: data.publishedYear,
		coverImage: data.coverImage,
		genre: data.genre,
		description: data.description,
		pages: data.pages,
		typeFormat: data.typeFormat,
		price: data.price,
		stockOld: data.stockOld,
		stockNew: data.stockNew,
	};

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
			if (values) {
				const book = {
					title: values.title,
					author: values.author,
					publishingHouse: values.publishingHouse,
					publishedYear: values.publishedYear,
					coverImage: file ? file.name : values.coverImage,
					genre: values.genre,
					description: values.description,
					pages: values.pages,
					typeFormat: values.typeFormat,
					price: values.price,
					stockOld: values.stockOld,
					stockNew: values.stockNew,
				};
				if (file) uploadFile();
				await bookApi.update(data.id, book, { sync: true });
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
			console.log(err);
		}
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
			<DialogTitle>Book #{data.id}</DialogTitle>
			<form onSubmit={formik.handleSubmit}>
				<DialogContent>
					<Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
						<Grid item xs={12}>
							<TextField
								id="title"
								required
								fullWidth
								value={formik.values.title}
								label="Enter Book Title"
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
								value={formik.values.author}
								label="Enter Book Author"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={formik.touched.author && Boolean(formik.errors.author)}
								helperText={formik.touched.author && formik.errors.author}
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								id="typeFormat"
								name="typeFormat"
								select
								label="Select Book Format"
								value={formik.values.typeFormat}
								fullWidth
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={
									formik.touched.typeFormat && Boolean(formik.errors.typeFormat)
								}
								helperText={
									formik.touched.typeFormat && formik.errors.typeFormat
								}
							>
								{type.map((option) => (
									<MenuItem key={option.value} value={option.value}>
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
								label="Enter Book Price"
								onBlur={formik.handleBlur}
								error={formik.touched.price && Boolean(formik.errors.price)}
								helperText={formik.touched.price && formik.errors.price}
								onChange={formik.handleChange}
							/>
						</Grid>

						<Grid item xs={6}>
							<TextField
								id="stockNew"
								required
								fullWidth
								value={formik.values.stockNew}
								label="Enter Book New Stock"
								onBlur={formik.handleBlur}
								error={
									formik.touched.stockNew && Boolean(formik.errors.stockNew)
								}
								helperText={formik.touched.stockNew && formik.errors.stockNew}
								onChange={formik.handleChange}
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								id="stockOld"
								required
								fullWidth
								value={formik.values.stockOld}
								label="Enter Book Old Stock"
								onBlur={formik.handleBlur}
								error={
									formik.touched.stockOld && Boolean(formik.errors.stockOld)
								}
								helperText={formik.touched.stockOld && formik.errors.stockOld}
								onChange={formik.handleChange}
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								id="pages"
								required
								fullWidth
								value={formik.values.pages}
								label="Enter Book Pages"
								onBlur={formik.handleBlur}
								error={formik.touched.pages && Boolean(formik.errors.pages)}
								helperText={formik.touched.pages && formik.errors.pages}
								onChange={formik.handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="genre"
								required
								fullWidth
								value={formik.values.genre}
								label="Enter Book Genre"
								onBlur={formik.handleBlur}
								error={formik.touched.genre && Boolean(formik.errors.genre)}
								helperText={formik.touched.genre && formik.errors.genre}
								onChange={formik.handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="publishedYear"
								required
								fullWidth
								value={formik.values.publishedYear}
								onBlur={formik.handleBlur}
								error={
									formik.touched.publishedYear &&
									Boolean(formik.errors.publishedYear)
								}
								helperText={
									formik.touched.publishedYear && formik.errors.publishedYear
								}
								label="Enter Book Published Year"
								onChange={formik.handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="publishingHouse"
								required
								fullWidth
								value={formik.values.publishingHouse}
								label="Enter Book Publishing House"
								onBlur={formik.handleBlur}
								error={
									formik.touched.publishingHouse &&
									Boolean(formik.errors.publishingHouse)
								}
								helperText={
									formik.touched.publishingHouse &&
									formik.errors.publishingHouse
								}
								onChange={formik.handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="description"
								required
								fullWidth
								value={formik.values.description}
								label="Enter Book Description"
								onBlur={formik.handleBlur}
								error={
									formik.touched.description &&
									Boolean(formik.errors.description)
								}
								helperText={
									formik.touched.description && formik.errors.description
								}
								onChange={formik.handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								value={formik.values.coverImage}
								label="Book Image Name"
							/>
						</Grid>

						<Grid item xs={12}></Grid>
						<Button
							sx={{ marginLeft: '25px' }}
							variant="outlined"
							component="label"
							color="primary"
						>
							Change Book Image
							<input
								id="coverImage"
								type="file"
								hidden
								onBlur={formik.handleBlur}
								onChange={handleImageUpload}
							/>
						</Button>
						<Typography sx={{ marginLeft: '10px' }}>
							{file ? file.name : ''}
						</Typography>
					</Grid>
				</DialogContent>
				<DialogActions>
					<AnimateButton>
						<Button
							variant="contained"
							disabled={formik.isSubmitting}
							type="submit"
						>
							Save
						</Button>
					</AnimateButton>
					<Button variant="text" color="error" onClick={handleCloseDialog}>
						Close
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default BookEdit;
