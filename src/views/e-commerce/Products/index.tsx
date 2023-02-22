import { useEffect, useState, useRef, ReactElement } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import {
	Box,
	Button,
	Divider,
	Drawer,
	Grid,
	IconButton,
	InputAdornment,
	Menu,
	MenuItem,
	Stack,
	TextField,
	Typography,
	useMediaQuery,
} from '@mui/material';

// third party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import SortOptions from './SortOptions';
import ProductEmpty from './ProductEmpty';
import ProductFilter from './ProductFilter';
import ProductFilterView from './ProductFilterView';
import ProductCard from 'ui-component/cards/ProductCard';
import FloatingCart from 'ui-component/cards/FloatingCart';
import SkeletonProductPlaceholder from 'ui-component/cards/Skeleton/ProductPlaceholder';
import useConfig from 'hooks/useConfig';
import { resetCart } from 'store/slices/cart';
// import { openDrawer } from 'store/slices/menu';
import { useDispatch, useSelector } from 'store';
import { appDrawerWidth, gridSpacing } from 'store/constant';
import { bookApi, filterProducts } from 'store/slices/book';

// assets
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';

// types
import { TGetBook } from 'types/book';
import { ProductsFilter } from 'types/e-commerce';
import { KeyedObject } from 'types';
// import { TGetSubscription } from 'types/subscription';

// product list container
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
	open?: boolean;
}>(({ theme, open }) => ({
	flexGrow: 1,
	transition: theme.transitions.create('margin', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.shorter,
	}),
	marginRight: -appDrawerWidth,
	[theme.breakpoints.down('xl')]: {
		paddingRight: 0,
		marginRight: 0,
	},
	...(open && {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.shorter,
		}),
		marginRight: 0,
	}),
}));

// ==============================|| E-COMMERCE - PRODUCT GRID ||============================== //

const BooksList = () => {
	const theme = useTheme();

	const { borderRadius } = useConfig();
	const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart);
	const [search, setSearch] = useState<string>('');

	const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
	const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));
	const matchDownLG = useMediaQuery(theme.breakpoints.down('xl'));

	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(false);
	}, []);

	// drawer
	const [open, setOpen] = useState(isLoading);

	const handleDrawerOpen = () => {
		setOpen((prevState) => !prevState);
	};

	// product data
	const [books, setBooks] = useState<TGetBook[]>([]);
	const bookState = useSelector((state) => state.book);
	const allBooksRef = useRef<TGetBook[]>([]);
	const [sortLabel, setSortLabel] = useState<string>('');
	const { subscription } = useSelector((state) => state.subscription);

	useEffect(() => {
		dispatch(bookApi.getAll());

		// hide left drawer when email app opens
		// dispatch(openDrawer(false));

		// clear cart if complete order
		if (cart.checkout.step > 2) {
			dispatch(resetCart());
		}
	}, []);

	useEffect(() => {
		setBooks(bookState.books);
	}, [bookState]);

	useEffect(() => {
		if (allBooksRef.current.length === 0) allBooksRef.current = bookState.books;
	}, [bookState]);

	const maxValue =
		allBooksRef.current && allBooksRef.current.length > 0
			? Math.max(
					...allBooksRef.current.map((book) =>
						subscription ? book.pricePromo! : book.price
					)
			  )
			: 1000;

	const uniqueGenres =
		allBooksRef.current && allBooksRef.current.length > 0
			? allBooksRef.current
					.map((book) => book.genre)
					.filter((genre, index, array) => array.indexOf(genre) === index)
			: [];
	const authors =
		allBooksRef.current && allBooksRef.current.length > 0
			? allBooksRef.current
					.map((book) => book.author)
					.filter((author, index, array) => array.indexOf(author) === index)
			: [];

	// filter
	const initialState: ProductsFilter = {
		// sort: 'low',
		genre: [],
		price: null,
		typeFormat: [],
		author: [],
	};
	const [filter, setFilter] = useState(initialState);

	const handleSort = (option: string) => {
		setSortLabel(option);
		setAnchorEl(null);
	};

	const handleSearch = (
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined
	) => {
		const newString = event?.target.value;
		setSearch(newString || '');

		if (newString) {
			const filteredBooks = books?.filter((book: KeyedObject) => {
				let matches = true;

				const properties = ['title', 'author'];
				let containsQuery = false;

				properties.forEach((property) => {
					if (
						book[property]
							.toString()
							.toLowerCase()
							.includes(newString.toString().toLowerCase())
					) {
						containsQuery = true;
					}
				});

				if (!containsQuery) {
					matches = false;
				}
				return matches;
			});
			setBooks(filteredBooks);
		} else {
			setBooks(bookState.books);
		}
	};
	// sort options
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const openSort = Boolean(anchorEl);
	const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const filterIsEqual = (a1: ProductsFilter, a2: ProductsFilter) =>
		a1 === a2 ||
		(a1.length === a2.length &&
			a1.price === a2.price &&
			a1.sort === a2.sort &&
			JSON.stringify(a1.genre) === JSON.stringify(a2.genre) &&
			JSON.stringify(a1.author) === JSON.stringify(a2.author) &&
			JSON.stringify(a1.typeFormat) === JSON.stringify(a2.typeFormat));

	const handelFilter = (type: string, params: string) => {
		setLoading(true);
		switch (type) {
			case 'genre':
				if (filter.genre.some((item) => item === params)) {
					setFilter({
						...filter,
						genre: filter.genre.filter((item) => item !== params),
					});
				} else {
					setFilter({ ...filter, genre: [...filter.genre, params] });
				}
				break;
			case 'author':
				if (filter.author.some((item) => item === params)) {
					setFilter({
						...filter,
						author: filter.author.filter((item) => item !== params),
					});
				} else {
					setFilter({ ...filter, author: [...filter.author, params] });
				}
				break;
			case 'sort':
				setFilter({ ...filter, sort: params });
				break;
			case 'price':
				setFilter({ ...filter, price: +params });
				break;
			case 'typeFormat':
				if (filter.typeFormat.some((item) => item === params)) {
					setFilter({
						...filter,
						typeFormat: filter.typeFormat.filter((item) => item !== params),
					});
				} else {
					setFilter({ ...filter, typeFormat: [...filter.typeFormat, params] });
				}
				break;

			case 'reset':
				setFilter(initialState);
				setSortLabel('');
				break;
			default:
			// no options
		}
	};

	const filterData = async () => {
		await dispatch(filterProducts(filter, sortLabel, subscription));
		setLoading(false);
	};

	useEffect(() => {
		filterData();
	}, [filter, sortLabel]);

	useEffect(() => {
		setOpen(!matchDownLG);
	}, [matchDownLG]);

	// sort filter
	// const handleMenuItemClick = (
	// 	event: React.MouseEvent<HTMLElement>,
	// 	index: string
	// ) => {
	// 	setFilter({ ...filter, sort: index });
	// 	setAnchorEl(null);
	// };

	const sortLabelOption = SortOptions.filter(
		(items) => items.value === sortLabel
	);

	let bookResult: ReactElement | ReactElement[] = <></>;
	if (books && books.length > 0) {
		bookResult = books.map((book: TGetBook, index) => (
			<Grid key={index} item xs={12} sm={6} md={4} lg={3}>
				<ProductCard
					id={book.id}
					image={book.coverImage}
					title={book.title}
					author={book.author}
					description={book.description}
					price={book.price}
					pages={book.pages}
					genre={book.genre}
					stockNew={book.stockNew}
					stockOld={book.stockOld}
					typeFormat={book.typeFormat}
					pricePromo={book.pricePromo}
				/>
			</Grid>
		));
	} else {
		bookResult = (
			<Grid item xs={12} sx={{ mt: 3 }}>
				<ProductEmpty />
			</Grid>
		);
	}

	const spacingMD = matchDownMD ? 1 : 1.5;

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Grid
					container
					alignItems="center"
					justifyContent="space-between"
					spacing={matchDownMD ? 0.5 : 2}
				>
					<Grid item>
						<Stack direction="row" alignItems="center" spacing={1}>
							<Typography variant="h4">Shop</Typography>
							<IconButton size="large">
								<ArrowForwardIosIcon
									sx={{
										width: '0.875rem',
										height: '0.875rem',
										fontWeight: 500,
										color: 'grey.500',
									}}
								/>
							</IconButton>
						</Stack>
					</Grid>
					<Grid item>
						<Stack
							direction="row"
							alignItems="center"
							justifyContent="center"
							spacing={matchDownSM ? 0.5 : spacingMD}
						>
							<TextField
								sx={{ width: { xs: 50, md: 'auto' } }}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon fontSize="small" />
										</InputAdornment>
									),
								}}
								value={search}
								placeholder="Search Book"
								size="small"
								onChange={handleSearch}
							/>

							<Typography
								sx={{
									pl: 1.5,
									fontSize: '1rem',
									color: 'grey.500',
									fontWeight: 400,
								}}
							>
								|
							</Typography>

							<Button
								disableRipple
								onClick={handleDrawerOpen}
								color="secondary"
								startIcon={
									<FilterAltIcon
										sx={{ fontWeight: 500, color: 'secondary.200' }}
									/>
								}
							>
								Filter
							</Button>

							<Typography
								sx={{
									display: { xs: 'none', sm: 'flex' },
									fontSize: '1rem',
									color: 'grey.500',
									fontWeight: 400,
								}}
							>
								|
							</Typography>
							<Stack
								direction="row"
								alignItems="center"
								justifyContent="center"
								sx={{ display: { xs: 'none', sm: 'flex' } }}
							>
								<Typography variant="h5">Sort by: </Typography>
								<Button
									id="demo-positioned-button"
									aria-controls="demo-positioned-menu"
									aria-haspopup="true"
									aria-expanded={openSort ? 'true' : undefined}
									onClick={handleClickListItem}
									sx={{ color: 'grey.500', fontWeight: 400 }}
									endIcon={<KeyboardArrowDownIcon />}
								>
									{sortLabel.length > 0 && sortLabelOption[0].label}
								</Button>
								<Menu
									id="demo-positioned-menu"
									aria-labelledby="demo-positioned-button"
									anchorEl={anchorEl}
									open={openSort}
									onClose={handleClose}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'right',
									}}
									transformOrigin={{
										vertical: 'top',
										horizontal: 'right',
									}}
								>
									{SortOptions.map((option, index) => (
										<MenuItem
											sx={{ p: 1.5 }}
											key={index}
											selected={option.label === filter.sort}
											onClick={() => handleSort(option.value)}
										>
											{option.label}
										</MenuItem>
									))}
								</Menu>
							</Stack>
						</Stack>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12}>
				<Divider sx={{ borderColor: 'grey.400' }} />
			</Grid>
			<Grid item xs={12}>
				<Box sx={{ display: 'flex' }}>
					<Main open={open}>
						<ProductFilterView
							filter={filter}
							filterIsEqual={filterIsEqual}
							handelFilter={handelFilter}
							initialState={initialState}
						/>
						<Grid container spacing={gridSpacing}>
							{isLoading
								? [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
										<Grid key={item} item xs={12} sm={6} md={4} lg={3}>
											<SkeletonProductPlaceholder />
										</Grid>
								  ))
								: bookResult}
						</Grid>
					</Main>
					<Drawer
						sx={{
							ml: open ? 3 : 0,
							height: matchDownLG ? '100vh' : 'auto',
							flexShrink: 0,
							zIndex: { xs: 1200, lg: open ? 0 : -1 },
							overflowX: 'hidden',
							width: appDrawerWidth,
							'& .MuiDrawer-paper': {
								height: 'auto',
								width: appDrawerWidth,
								position: matchDownLG ? 'fixed' : 'relative',
								border: 'none',
								borderRadius: matchDownLG ? 0 : `${borderRadius}px`,
							},
						}}
						variant={matchDownLG ? 'temporary' : 'persistent'}
						anchor="right"
						open={open}
						ModalProps={{ keepMounted: true }}
						onClose={handleDrawerOpen}
					>
						{open && (
							<PerfectScrollbar component="div">
								<ProductFilter
									filter={filter}
									handelFilter={handelFilter}
									maxValue={maxValue ? maxValue : 1000}
									genres={uniqueGenres}
									authors={authors}
								/>
							</PerfectScrollbar>
						)}
					</Drawer>
				</Box>
			</Grid>
			<FloatingCart />
		</Grid>
	);
};

export default BooksList;
