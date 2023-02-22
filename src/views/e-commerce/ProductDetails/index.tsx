import { useEffect, useState, SyntheticEvent } from 'react';
import { Link, useParams } from 'react-router-dom';

// material-ui
import { Box, Grid, Stack, Tab, Tabs } from '@mui/material';

// project imports
import ProductImages from './ProductImages';
import ProductInfo from './ProductInfo';
import MainCard from 'ui-component/cards/MainCard';
import FloatingCart from 'ui-component/cards/FloatingCart';
// import Chip from 'ui-component/extended/Chip';
import { TabsProps } from 'types';
import { gridSpacing } from 'store/constant';
import { useDispatch, useSelector } from 'store';
import { getProduct } from 'store/slices/book';
import { resetCart } from 'store/slices/cart';

function TabPanel({ children, value, index, ...other }: TabsProps) {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`product-details-tabpanel-${index}`}
			aria-labelledby={`product-details-tab-${index}`}
			{...other}
		>
			{value === index && <Box>{children}</Box>}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `product-details-tab-${index}`,
		'aria-controls': `product-details-tabpanel-${index}`,
	};
}

const ProductDetails = () => {
	const { id } = useParams();

	const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart);

	// product description tabs
	const [value, setValue] = useState(0);

	const handleChange = (event: SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	useEffect(() => {
		// getProduct();
		dispatch(getProduct(id));

		// clear cart if complete order
		if (cart.checkout.step > 2) {
			dispatch(resetCart());
		}
	}, []);

	const { book } = useSelector((state) => state.book);

	return (
		<Grid
			container
			alignItems="center"
			justifyContent="center"
			spacing={gridSpacing}
		>
			<Grid item xs={12} lg={10}>
				<MainCard>
					{book && book?.id === Number(id) && (
						<Grid container spacing={gridSpacing}>
							<Grid item xs={12} md={6}>
								<ProductImages product={book} />
							</Grid>
							<Grid item xs={12} md={6}>
								<ProductInfo product={book} />
							</Grid>
							<Grid item xs={12}>
								<Tabs
									value={value}
									indicatorColor="primary"
									onChange={handleChange}
									sx={{ marginBottom: '10px' }}
									aria-label="product description tabs example"
									variant="scrollable"
								>
									<Tab
										component={Link}
										to="#"
										label="Description"
										{...a11yProps(0)}
									/>
									<Tab
										component={Link}
										to="#"
										label={
											<Stack direction="row" alignItems="center">
												Details
											</Stack>
										}
										{...a11yProps(1)}
									/>
								</Tabs>
								<TabPanel value={value} index={0}>
									{book.description}
								</TabPanel>
								<TabPanel value={value} index={1}>
									Genre: {book.publishingHouse}
								</TabPanel>
								<TabPanel value={value} index={1}>
									Publishing House: {book.publishingHouse}
								</TabPanel>
								<TabPanel value={value} index={1}>
									Published Year: {book.publishedYear}
								</TabPanel>
								<TabPanel value={value} index={1}>
									Pages: {book.pages}
								</TabPanel>
							</Grid>
						</Grid>
					)}
				</MainCard>
			</Grid>
			<FloatingCart />
		</Grid>
	);
};

export default ProductDetails;
