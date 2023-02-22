// material-ui
import { useTheme } from '@mui/material/styles';
import {
	Button,
	CardContent,
	Grid,
	Typography,
	useMediaQuery,
} from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import Chip from 'ui-component/extended/Chip';
import { gridSpacing } from 'store/constant';

// assets
import CloseIcon from '@mui/icons-material/Close';
import { ProductsFilter } from 'types/e-commerce';

// ==============================|| PRODUCT GRID - FILTER VIEW ||============================== //

interface ProductFilterViewProps {
	filter: ProductsFilter;
	initialState: ProductsFilter;
	filterIsEqual: (
		initialState: ProductsFilter,
		filter: ProductsFilter
	) => boolean;
	handelFilter: (type: string, params: string) => void;
}

const ProductFilterView = ({
	filter,
	filterIsEqual,
	handelFilter,
	initialState,
}: ProductFilterViewProps) => {
	const theme = useTheme();
	const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

	return (
		<>
			{!filterIsEqual(initialState, filter) && (
				<Grid
					container
					spacing={gridSpacing}
					sx={{ pb: gridSpacing }}
					alignItems="center"
				>
					{!(initialState.sort === filter.sort) && (
						<Grid item>
							<SubCard content={false}>
								<CardContent sx={{ pb: '12px !important', p: 1.5 }}>
									<Grid container spacing={1} alignItems="center">
										<Grid item>
											<Typography variant="subtitle1">Sort</Typography>
										</Grid>
										<Grid item>
											<Chip
												size={matchDownMD ? 'small' : undefined}
												label={filter.sort}
												chipcolor="secondary"
												onDelete={() =>
													handelFilter('sort', initialState.sort!)
												}
												sx={{
													borderRadius: '4px',
													textTransform: 'capitalize',
												}}
											/>
										</Grid>
									</Grid>
								</CardContent>
							</SubCard>
						</Grid>
					)}
					{!(
						JSON.stringify(initialState.genre) === JSON.stringify(filter.genre)
					) &&
						filter.genre.length > 0 && (
							<Grid item>
								<SubCard content={false}>
									<CardContent sx={{ pb: '12px !important', p: 1.5 }}>
										<Grid container spacing={1} alignItems="center">
											<Grid item>
												<Typography variant="subtitle1">Categories</Typography>
											</Grid>
											{filter.genre.map((item: string, index: number) => (
												<Grid item key={index}>
													<Chip
														size={matchDownMD ? 'small' : undefined}
														label={item}
														onDelete={() => handelFilter('genre', item)}
														chipcolor="secondary"
														sx={{
															borderRadius: '4px',
															textTransform: 'capitalize',
														}}
													/>
												</Grid>
											))}
										</Grid>
									</CardContent>
								</SubCard>
							</Grid>
						)}
					{!(
						JSON.stringify(initialState.author) ===
						JSON.stringify(filter.author)
					) &&
						filter.author.length > 0 && (
							<Grid item>
								<SubCard content={false}>
									<CardContent sx={{ pb: '12px !important', p: 1.5 }}>
										<Grid container spacing={1} alignItems="center">
											<Grid item>
												<Typography variant="subtitle1">Author</Typography>
											</Grid>
											{filter.author.map((item: string, index: number) => (
												<Grid item key={index}>
													<Chip
														size={matchDownMD ? 'small' : undefined}
														label={item}
														onDelete={() => handelFilter('author', item)}
														chipcolor="secondary"
														sx={{
															borderRadius: '4px',
															textTransform: 'capitalize',
														}}
													/>
												</Grid>
											))}
										</Grid>
									</CardContent>
								</SubCard>
							</Grid>
						)}
					{!(
						JSON.stringify(initialState.typeFormat) ===
						JSON.stringify(filter.typeFormat)
					) &&
						filter.typeFormat.length > 0 && (
							<Grid item>
								<SubCard content={false}>
									<CardContent sx={{ pb: '12px !important', p: 1.5 }}>
										<Grid container spacing={1} alignItems="center">
											<Grid item>
												<Typography variant="subtitle1">Book Type</Typography>
											</Grid>
											{filter.typeFormat.map((item: string, index: number) => (
												<Grid item key={index}>
													<Chip
														size={matchDownMD ? 'small' : undefined}
														label={item}
														onDelete={() => handelFilter('typeFormat', item)}
														chipcolor="secondary"
														sx={{
															borderRadius: '4px',
															textTransform: 'capitalize',
														}}
													/>
												</Grid>
											))}
										</Grid>
									</CardContent>
								</SubCard>
							</Grid>
						)}
					{!(initialState.price === filter.price) && (
						<Grid item>
							<SubCard content={false}>
								<CardContent sx={{ pb: '12px !important', p: 1.5 }}>
									<Grid container spacing={1} alignItems="center">
										<Grid item>
											<Typography variant="subtitle1">Price Range</Typography>
										</Grid>
										<Grid item>
											<Chip
												size={matchDownMD ? 'small' : undefined}
												label={`0 - ${String(filter.price)}`}
												chipcolor="primary"
												sx={{
													borderRadius: '4px',
													textTransform: 'capitalize',
												}}
											/>
										</Grid>
									</Grid>
								</CardContent>
							</SubCard>
						</Grid>
					)}
					<Grid item>
						<Button
							variant="outlined"
							startIcon={<CloseIcon />}
							color="error"
							onClick={() => handelFilter('reset', '')}
						>
							Clear All
						</Button>
					</Grid>
				</Grid>
			)}
		</>
	);
};

export default ProductFilterView;
