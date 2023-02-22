import { useEffect, useState } from 'react';

// material-ui
import {
	Button,
	CardContent,
	Checkbox,
	// FormControl,
	FormControlLabel,
	Grid,
	// Radio,
	// RadioGroup,
	Skeleton,
	Stack,
	Theme,
	useMediaQuery,
	Slider,
	Typography,
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Accordion from 'ui-component/extended/Accordion';
import { gridSpacing } from 'store/constant';
import { ProductsFilter } from 'types/e-commerce';

// ==============================|| PRODUCT GRID GENDER FILTER ||============================== //

// ==============================|| PRODUCT GRID - CATEGORIES FILTER ||============================== //

const Genre = ({
	genre,
	handelFilter,
	genres,
}: {
	genre: string[];
	handelFilter: (type: string, params: string) => void;
	genres: string[];
}) => {
	const [isCategoriesLoading, setCategoriesLoading] = useState(true);
	useEffect(() => {
		setCategoriesLoading(false);
	}, []);

	return (
		<Grid container spacing={1}>
			{isCategoriesLoading ? (
				<Grid item xs={12}>
					<Skeleton variant="rectangular" width="100%" height={96} />
				</Grid>
			) : (
				<Grid item xs={12}>
					{genres.map((gen, index) => {
						return (
							<FormControlLabel
								key={index}
								control={
									<Checkbox checked={genre.some((item) => item === gen)} />
								}
								onChange={() => handelFilter('genre', gen)}
								label={gen}
								sx={{ textTransform: 'capitalize' }}
							/>
						);
					})}
				</Grid>
			)}
		</Grid>
	);
};

const Price = ({
	price,
	handelFilter,
	maxValue,
}: {
	price: number;
	handelFilter: (type: string, params: string) => void;
	maxValue: number;
}) => {
	const [isPriceLoading, setPriceLoading] = useState(true);
	useEffect(() => {
		setPriceLoading(false);
	}, []);

	return (
		<>
			{isPriceLoading ? (
				<Skeleton variant="rectangular" width="100%" height={172} />
			) : (
				<div>
					<Typography id="range-slider" gutterBottom></Typography>
					<Slider
						value={price}
						onChange={(e: any) => handelFilter('price', e.target.value)}
						valueLabelDisplay="auto"
						aria-labelledby="range-slider"
						step={5}
						min={0}
						max={maxValue}
					/>
					<Typography>0 RON - {maxValue} RON</Typography>
				</div>
			)}
		</>
	);
};

const BookFormat = ({
	typeFormat,
	handelFilter,
}: {
	typeFormat: string[];
	handelFilter: (type: string, params: string) => void;
}) => {
	const [isBookFormatLoading, setBookFormatLoading] = useState(true);
	useEffect(() => {
		setBookFormatLoading(false);
	}, []);

	return (
		<Grid container spacing={1}>
			{isBookFormatLoading ? (
				<Grid item xs={12}>
					<Skeleton variant="rectangular" width="100%" height={96} />
				</Grid>
			) : (
				<>
					<Grid item xs={12}>
						<FormControlLabel
							control={
								<Checkbox
									checked={typeFormat.some((item) => item === 'online')}
								/>
							}
							onChange={() => handelFilter('typeFormat', 'online')}
							label="Online"
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={typeFormat.some((item) => item === 'printed')}
								/>
							}
							onChange={() => handelFilter('typeFormat', 'printed')}
							label="Printed"
						/>
					</Grid>{' '}
				</>
			)}
		</Grid>
	);
};
const Author = ({
	author,
	handelFilter,
	authors,
}: {
	author: string[];
	handelFilter: (type: string, params: string) => void;
	authors: string[];
}) => {
	const [isAuthorsLoading, setAuthorsLoading] = useState(true);
	useEffect(() => {
		setAuthorsLoading(false);
	}, []);

	return (
		<Grid container spacing={1}>
			{isAuthorsLoading ? (
				<Grid item xs={12}>
					<Skeleton variant="rectangular" width="100%" height={96} />
				</Grid>
			) : (
				<Grid item xs={12}>
					{authors.map((authorItem, index) => {
						return (
							<FormControlLabel
								key={index}
								control={
									<Checkbox
										checked={author.some((item) => item === authorItem)}
									/>
								}
								onChange={() => handelFilter('author', authorItem)}
								label={authorItem}
								sx={{ textTransform: 'capitalize' }}
							/>
						);
					})}
				</Grid>
			)}
		</Grid>
	);
};

// ==============================|| PRODUCT GRID - FILTER ||============================== //

const ProductFilter = ({
	filter,
	handelFilter,
	maxValue,
	genres,
	authors,
}: {
	filter: ProductsFilter;
	handelFilter: (type: string, params: string, rating?: number) => void;
	maxValue: number;
	genres: string[];
	authors: string[];
}) => {
	const matchDownLG = useMediaQuery((theme: Theme) =>
		theme.breakpoints.down('xl')
	);

	const filterData = [
		{
			id: 'genre',
			defaultExpand: true,
			title: 'Categories',
			content: (
				<Genre
					genre={filter.genre}
					handelFilter={handelFilter}
					genres={genres}
				/>
			),
		},
		{
			id: 'price',
			defaultExpand: true,
			title: 'Price',
			content: (
				<Price
					price={filter.price!}
					handelFilter={handelFilter}
					maxValue={maxValue}
				/>
			),
		},
		{
			id: 'typeFormat',
			defaultExpand: true,
			title: 'Book Type',
			content: (
				<BookFormat
					typeFormat={filter.typeFormat}
					handelFilter={handelFilter}
				/>
			),
		},
		{
			id: 'author',
			defaultExpand: true,
			title: 'Author',
			content: (
				<Author
					author={filter.author}
					handelFilter={handelFilter}
					authors={authors}
				/>
			),
		},
	];

	return (
		<MainCard
			border={!matchDownLG}
			content={false}
			sx={{ overflow: 'visible' }}
		>
			<CardContent sx={{ p: 1, height: matchDownLG ? '100vh' : 'auto' }}>
				<Grid container spacing={gridSpacing}>
					<Grid item xs={12}>
						<Accordion data={filterData} />
					</Grid>
					<Grid item xs={12} sx={{ m: 1 }}>
						<Stack direction="row" justifyContent="center" alignItems="center">
							<Button
								variant="contained"
								fullWidth
								color="error"
								onClick={() => handelFilter('reset', '')}
							>
								Clear All
							</Button>
						</Stack>
					</Grid>
				</Grid>
			</CardContent>
		</MainCard>
	);
};

export default ProductFilter;
