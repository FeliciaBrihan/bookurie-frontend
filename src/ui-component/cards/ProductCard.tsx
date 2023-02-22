import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import {
	Box,
	Button,
	CardContent,
	CardMedia,
	Grid,
	// Rating,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material';

// project import
import MainCard from './MainCard';
import SkeletonProductPlaceholder from 'ui-component/cards/Skeleton/ProductPlaceholder';
import { useDispatch, useSelector } from 'store';
import { addProduct } from 'store/slices/cart';
import { ProductCardProps } from 'types/cart';
import { getUserPurchases } from 'store/slices/purchase';

// assets
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import Chip from 'ui-component/extended/Chip';
import { TGetPurchase } from 'types/purchase';
import { getUserLoans } from 'store/slices/loan';
import { TGetLoan } from 'types/loan';
import { alert } from 'utils/helpers/alert';

const prodImage = require.context('assets/images/e-commerce', true);

// ==============================|| PRODUCT CARD ||============================== //

const ProductCard = ({
	id,
	title,
	image,
	genre,
	author,
	price,
	stockOld,
	stockNew,
	typeFormat,
	pricePromo,
}: ProductCardProps) => {
	const dispatch = useDispatch();

	const prodProfile = image && prodImage(`./${image}`);
	// const [productRating] = useState<number | undefined>(rating);
	const cart = useSelector((state) => state.cart);
	const { subscription } = useSelector((state) => state.subscription);
	const [purchases, setPurchases] = useState<TGetPurchase[]>([]);
	const purchasesState = useSelector((state) => state.purchase);
	const [loans, setLoans] = useState<TGetLoan[]>([]);
	const loanState = useSelector((state) => state.loan);
	const [isLoading, setLoading] = useState(true);
	const [wasBorrowed, setWasBorrowed] = useState<boolean>(false);

	useEffect(() => {
		setLoading(true);
		dispatch(getUserPurchases());
		dispatch(getUserLoans());
	}, []);

	useEffect(() => {
		if (purchasesState?.userPurchases?.length > 0) {
			setPurchases(purchasesState.userPurchases);
			setLoading(false);
		} else setLoading(false);
	}, [purchasesState]);

	useEffect(() => {
		if (loanState?.userLoans?.length > 0) setLoans(loanState.userLoans);
	}, [loanState]);

	useEffect(() => {
		const bookWasBorrowed: boolean = loans
			? loans.filter((loan) => loan.BookId === id).length > 0
			: false;
		setWasBorrowed(bookWasBorrowed);
	}, [loans]);

	const bookInCart =
		cart.checkout.products.filter((prod) => prod.id === id).length > 0;

	const addCart = () => {
		const filteredProducts = cart.checkout.products.filter(
			(prod) => prod.id === id
		);
		const filteredOnlinePurchases = purchases
			? purchases.filter((purchase) => {
					if (typeFormat === 'online') return purchase.BookId === id;
			  })
			: [];
		if (filteredProducts.length === 0 && filteredOnlinePurchases.length === 0) {
			dispatch(
				addProduct(
					{
						id,
						title,
						image,
						genre,
						author,
						typeFormat,
						stockOld,
						stockNew,
						price,
						pricePromo,
						quantity: 1,
					},
					cart.checkout.products
				)
			);
			alert.display('Add To Cart Success');
		} else
			alert.display(
				filteredOnlinePurchases.length > 0
					? 'Online Book Already Bought!'
					: 'Book Already In Cart',
				'warning'
			);
	};

	return (
		<>
			{isLoading ? (
				<SkeletonProductPlaceholder />
			) : (
				<MainCard
					content={false}
					boxShadow
					sx={{
						'&:hover': {
							transform: 'scale3d(1.02, 1.02, 1)',
							transition: 'all .4s ease-in-out',
						},
					}}
				>
					<Box
						sx={{
							position: 'relative',
						}}
					>
						<CardMedia
							sx={{
								height: 220,
								opacity:
									typeFormat === 'printed' && !stockNew && !stockOld ? 0.3 : 1,
								transition: 'opacity 0.3s ease-in-out',
							}}
							image={prodProfile}
							title={title}
							component={Link}
							to={`/books/${id}`}
						/>
						{typeFormat === 'online' ? (
							<Chip
								size="small"
								label="Online"
								chipcolor="primary"
								sx={{
									borderRadius: '4px',
									textTransform: 'capitalize',
									position: 'absolute',
									bottom: '0',
									right: '0',
								}}
							/>
						) : (
							<Chip
								size="small"
								label="Printed"
								chipcolor="secondary"
								sx={{
									borderRadius: '4px',
									textTransform: 'capitalize',
									position: 'absolute',
									bottom: '0',
									right: '0',
								}}
							/>
						)}
					</Box>
					<CardContent sx={{ p: 2 }}>
						<Grid container spacing={2}>
							<Grid
								item
								xs={12}
								sx={{ display: 'flex', justifyContent: 'space-between' }}
							>
								<Typography
									component={Link}
									to={`/books/${id}`}
									variant="subtitle1"
									sx={{
										textDecoration: 'none',
										fontWeight: 'bold',
										maxWidth: '170px',
										textOverflow: 'ellipsis',
										overflow: 'hidden',
										whiteSpace: 'nowrap',
									}}
								>
									{title}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography
									component={Link}
									to={`/books/${id}`}
									variant="subtitle1"
									sx={{ textDecoration: 'none' }}
								>
									{author}
								</Typography>
							</Grid>

							{genre && (
								<Grid item xs={12}>
									<Typography
										variant="body2"
										sx={{
											overflow: 'hidden',
											height: 45,
										}}
									>
										{genre}
									</Typography>
								</Grid>
							)}
							<Grid item xs={12}>
								<Stack
									direction="row"
									justifyContent="space-between"
									alignItems="center"
								>
									<Grid container spacing={1}>
										<Grid>
											<Grid item>
												<Typography variant="h4">
													{subscription ? pricePromo : price} RON
												</Typography>
											</Grid>
											{subscription && (
												<Grid item>
													<Typography
														variant="h6"
														sx={{
															color: 'grey.500',
															textDecoration: 'line-through',
														}}
													>
														{price} RON
													</Typography>
												</Grid>
											)}
										</Grid>
									</Grid>
									{stockNew || typeFormat === 'online' ? (
										<Tooltip
											title={bookInCart ? 'Book In Cart' : 'Add To Cart'}
										>
											<span>
												<Button
													disabled={bookInCart ? true : false}
													variant="contained"
													sx={{ minWidth: 0 }}
													onClick={addCart}
												>
													<ShoppingCartTwoToneIcon fontSize="small" />
												</Button>
											</span>
										</Tooltip>
									) : (
										!stockOld && (
											<Chip
												size="medium"
												label={
													typeFormat === 'printed' ? `Out of stock` : 'Online'
												}
												chipcolor={
													typeFormat === 'printed' ? 'error' : 'primary'
												}
												sx={{
													borderRadius: '4px',
													textTransform: 'capitalize',
												}}
											/>
										)
									)}
									{stockOld ? (
										<Tooltip title={'Loan'}>
											<span>
												<Link to={`/books/${id}`}>
													<Button
														disabled={wasBorrowed}
														size="small"
														variant="contained"
														color="secondary"
														sx={{ minWidth: 0, marginLeft: '5px' }}
													>
														Loan
													</Button>
												</Link>
											</span>
										</Tooltip>
									) : (
										''
									)}
								</Stack>
							</Grid>
						</Grid>
					</CardContent>
				</MainCard>
			)}
		</>
	);
};

export default ProductCard;
