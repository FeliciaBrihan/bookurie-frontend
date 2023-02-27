import * as React from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme, Theme } from '@mui/material/styles';
import {
	Box,
	Button,
	CardContent,
	Checkbox,
	Fab,
	Grid,
	Dialog,
	DialogActions,
	DialogContent,
	IconButton,
	InputAdornment,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	TextField,
	Toolbar,
	Tooltip,
	Typography,
	Slide,
	SlideProps,
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Avatar from 'ui-component/extended/Avatar';
import Chip from 'ui-component/extended/Chip';
import { TGetBook } from 'types/book';
import {
	ArrangementOrder,
	GetComparator,
	HeadCell,
	EnhancedTableHeadProps,
	EnhancedTableToolbarProps,
	KeyedObject,
} from 'types';
import { useDispatch, useSelector } from 'store';
import BookAdd from './BookAdd';
import BookDetails from './BookDetails';
import BookEdit from './BookEdit';
import { bookApi, deleteBook } from 'store/slices/book';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/AddTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { visuallyHidden } from '@mui/utils';
import AnimateButton from 'ui-component/extended/AnimateButton';

// animation
const Transition = React.forwardRef((props: SlideProps, ref) => (
	<Slide direction="left" ref={ref} {...props} />
));

const prodImage = require.context('assets/images/e-commerce', true);

// table sort
function descendingComparator(a: KeyedObject, b: KeyedObject, orderBy: string) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

const getComparator: GetComparator = (order, orderBy) =>
	order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);

function stableSort(
	array: TGetBook[],
	comparator: (a: TGetBook, b: TGetBook) => number
) {
	const stabilizedThis =
		array?.length > 0 ? array.map((el, index) => [el, index]) : [];
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0] as TGetBook, b[0] as TGetBook);
		if (order !== 0) return order;
		return (a[1] as number) - (b[1] as number);
	});
	return stabilizedThis.map((el) => el[0]);
}

// table header options
const headCells: HeadCell[] = [
	{
		id: 'id',
		numeric: true,
		label: 'ID',
		align: 'left',
	},
	{
		id: '#',
		numeric: true,
		label: 'Image',
		align: 'center',
	},
	{
		id: 'title',
		numeric: false,
		label: 'Title',
		align: 'left',
	},
	{
		id: 'author',
		numeric: false,
		label: 'Author',
		align: 'left',
	},
	{
		id: 'typeFormat',
		numeric: true,
		label: 'Type',
		align: 'left',
	},
	{
		id: 'price',
		numeric: true,
		label: 'Price',
		align: 'left',
	},

	{
		id: 'stockNew',
		numeric: true,
		label: 'Status New',
		align: 'center',
	},
	{
		id: 'stockOld',
		numeric: true,
		label: 'Status Old',
		align: 'center',
	},
];

// ==============================|| TABLE HEADER ||============================== //

interface OrderListEnhancedTableHeadProps extends EnhancedTableHeadProps {
	theme: Theme;
	selected: number[];
	deleteHandler: () => void;
}

function EnhancedTableHead({
	onSelectAllClick,
	order,
	orderBy,
	numSelected,
	rowCount,
	onRequestSort,
	theme,
	selected,
	deleteHandler,
}: OrderListEnhancedTableHeadProps) {
	const createSortHandler =
		(property: string) => (event: React.SyntheticEvent<Element, Event>) => {
			onRequestSort(event, property);
		};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox" sx={{ pl: 3 }}>
					<Checkbox
						color="primary"
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{
							'aria-label': 'select all books',
						}}
					/>
				</TableCell>
				{numSelected > 0 && (
					<TableCell padding="none" colSpan={9}>
						<EnhancedTableToolbar
							numSelected={selected.length}
							onDeleteClick={deleteHandler}
						/>
					</TableCell>
				)}
				{numSelected <= 0 &&
					headCells.map((headCell) => (
						<TableCell
							key={headCell.id}
							align={headCell.align}
							padding={headCell.disablePadding ? 'none' : 'normal'}
							sortDirection={orderBy === headCell.id ? order : false}
						>
							<TableSortLabel
								active={orderBy === headCell.id}
								direction={orderBy === headCell.id ? order : 'asc'}
								onClick={createSortHandler(headCell.id)}
							>
								{headCell.label}
								{orderBy === headCell.id ? (
									<Box component="span" sx={visuallyHidden}>
										{order === 'desc'
											? 'sorted descending'
											: 'sorted ascending'}
									</Box>
								) : null}
							</TableSortLabel>
						</TableCell>
					))}
				{numSelected <= 0 && (
					<TableCell sortDirection={false} align="center" sx={{ pr: 3 }}>
						<Typography
							variant="subtitle1"
							sx={{
								color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900',
							}}
						>
							Action
						</Typography>
					</TableCell>
				)}
			</TableRow>
		</TableHead>
	);
}

// ==============================|| TABLE HEADER TOOLBAR ||============================== //

const EnhancedTableToolbar = ({
	numSelected,
	onDeleteClick,
}: EnhancedTableToolbarProps) => (
	<Toolbar
		sx={{
			p: 0,
			pl: 1,
			pr: 1,
			...(numSelected > 0 && {
				color: (theme) => theme.palette.secondary.main,
			}),
		}}
	>
		{numSelected > 0 ? (
			<Typography color="inherit" variant="h4">
				{numSelected} Selected
			</Typography>
		) : (
			<Typography variant="h6" id="tableTitle">
				''
			</Typography>
		)}
		<Box sx={{ flexGrow: 1 }} />
		{numSelected > 0 && (
			<Tooltip title="Delete">
				<IconButton size="large" onClick={() => onDeleteClick?.()}>
					<DeleteIcon fontSize="small" />
				</IconButton>
			</Tooltip>
		)}
	</Toolbar>
);

// ==============================|| PRODUCT LIST ||============================== //

const ProductList = () => {
	const theme = useTheme();
	const dispatch = useDispatch();

	const [order, setOrder] = React.useState<ArrangementOrder>('asc');
	const [orderBy, setOrderBy] = React.useState<string>('id');
	const [selected, setSelected] = React.useState<number[]>([]);
	const [page, setPage] = React.useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
	const [search, setSearch] = React.useState<string>('');
	const [rows, setRows] = React.useState<TGetBook[]>([]);
	const [openCreate, setOpenCreate] = React.useState(false);
	const [openDetails, setOpenDetails] = React.useState(false);
	const [openEdit, setOpenEdit] = React.useState(false);
	const [openDelete, setOpenDelete] = React.useState(false);
	const [rowData, setRowData] = React.useState<TGetBook | undefined>(undefined);
	const { books } = useSelector((state) => state.book);

	React.useEffect(() => {
		dispatch(bookApi.getAll());
	}, []);

	React.useEffect(() => {
		setRows(books);
	}, [books]);

	const handleSearch = (
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined
	) => {
		const newString = event?.target.value;
		setSearch(newString || '');

		if (newString) {
			const newRows = rows?.filter((row: KeyedObject) => {
				let matches = true;

				const properties = ['title', 'author', 'price'];
				let containsQuery = false;

				properties.forEach((property) => {
					if (
						row[property]
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
			setRows(newRows);
		} else {
			setRows(books);
		}
	};

	const handleRequestSort = (
		event: React.SyntheticEvent<Element, Event>,
		property: string
	) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			const newSelectedId = rows?.map((n) => n.id);
			setSelected(newSelectedId!);
			return;
		}
		setSelected([]);
	};

	const handleClick = (
		event: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>,
		id: number
	) => {
		const selectedIndex = selected.indexOf(id);
		let newSelected: number[] = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}

		setSelected(newSelected);
	};

	const handleChangePage = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
		newPage: number
	) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined
	) => {
		event?.target.value && setRowsPerPage(parseInt(event?.target.value, 10));
		setPage(0);
	};
	const handleCloseDialog = () => {
		setOpenCreate(false);
	};

	const handleClickOpenDialog = () => {
		setOpenCreate(true);
	};

	const handleCloseDetails = () => {
		setOpenDetails(false);
	};

	const handleOpenDetails = (row: TGetBook) => () => {
		setRowData(row);
		setOpenDetails(true);
	};

	const handleCloseEdit = () => {
		setOpenEdit(false);
	};

	const handleOpenEdit = (row: TGetBook) => () => {
		setRowData(row);
		setOpenEdit(true);
	};
	const handleDelete = () => {
		setOpenDelete(true);
	};

	const handleCloseDelete = () => {
		setOpenDelete(false);
	};

	const handleConfirmDelete = (selectedItemsArray: number[]) => {
		selectedItemsArray.forEach((item) => {
			dispatch(deleteBook(item, { sync: true }));
			setSelected([]);
		});
		setOpenDelete(false);
	};

	const isSelected = (id: number) => selected.indexOf(id) !== -1;
	const emptyRows = rows
		? page > 0
			? Math.max(0, (1 + page) * rowsPerPage - rows.length)
			: 0
		: 0;

	return (
		<MainCard title="Book List" content={false}>
			<CardContent>
				<Grid
					container
					justifyContent="space-between"
					alignItems="center"
					spacing={2}
				>
					<Grid item xs={12} sm={6}>
						<TextField
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon fontSize="small" />
									</InputAdornment>
								),
							}}
							onChange={handleSearch}
							placeholder="Search Title or Author"
							value={search}
							size="small"
						/>
					</Grid>
					<Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
						{/* product add & dialog */}
						<Tooltip title="Add Book">
							<Fab
								color="primary"
								size="small"
								onClick={handleClickOpenDialog}
								sx={{
									boxShadow: 'none',
									ml: 1,
									width: 32,
									height: 32,
									minHeight: 32,
								}}
							>
								<AddIcon fontSize="small" />
							</Fab>
						</Tooltip>
					</Grid>
				</Grid>
			</CardContent>

			{/* table */}
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
					<EnhancedTableHead
						numSelected={selected.length}
						order={order}
						orderBy={orderBy}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={rows ? rows.length : 0}
						theme={theme}
						selected={selected}
						deleteHandler={handleDelete}
					/>

					<TableBody>
						{stableSort(rows, getComparator(order, orderBy))
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row, index) => {
								if (typeof row === 'number') return null;
								const isItemSelected = isSelected(row.id);
								const labelId = `enhanced-table-checkbox-${index}`;

								return (
									<TableRow
										hover
										role="checkbox"
										aria-checked={isItemSelected}
										tabIndex={-1}
										key={index}
										selected={isItemSelected}
									>
										<TableCell
											padding="checkbox"
											sx={{ pl: 3 }}
											onClick={(event) => handleClick(event, row.id)}
										>
											<Checkbox
												color="primary"
												checked={isItemSelected}
												inputProps={{
													'aria-labelledby': labelId,
												}}
											/>
										</TableCell>
										<TableCell
											component="th"
											id={labelId}
											scope="row"
											sx={{ cursor: 'pointer' }}
										>
											<Typography
												component={Link}
												to={`/books/${row.id}`}
												variant="subtitle1"
												sx={{
													color:
														theme.palette.mode === 'dark'
															? theme.palette.grey[600]
															: 'grey.900',
													textDecoration: 'none',
												}}
											>
												#{row.id}
											</Typography>
										</TableCell>

										<TableCell
											align="left"
											component="th"
											id={labelId}
											scope="row"
											onClick={(event) => handleClick(event, row.id)}
											sx={{ cursor: 'pointer' }}
										>
											<Link to={`/books/${row.id}`}>
												<Avatar
													src={
														row.coverImage && prodImage(`./${row.coverImage}`)
													}
													size="md"
													variant="rounded"
												/>
											</Link>
										</TableCell>
										<TableCell
											component="th"
											id={labelId}
											scope="row"
											sx={{ cursor: 'pointer' }}
										>
											<Typography
												component={Link}
												to={`/books/${row.id}`}
												variant="subtitle1"
												sx={{
													color:
														theme.palette.mode === 'dark'
															? theme.palette.grey[600]
															: 'grey.900',
													textDecoration: 'none',
												}}
											>
												{row.title}
											</Typography>
										</TableCell>
										<TableCell align="left">{row.author}</TableCell>
										<TableCell align="left">{row.typeFormat}</TableCell>
										<TableCell align="left">{row.price} RON</TableCell>
										<TableCell align="center">
											{row.typeFormat === 'printed' ? (
												<Chip
													size="small"
													label={
														row.stockNew
															? `In Stock ${row.stockNew}`
															: 'Out of Stock'
													}
													chipcolor={row.stockNew ? 'success' : 'error'}
													sx={{
														borderRadius: '4px',
														textTransform: 'capitalize',
													}}
												/>
											) : (
												<Chip
													size="small"
													label="Online"
													chipcolor={'primary'}
													sx={{
														borderRadius: '4px',
														textTransform: 'capitalize',
													}}
												/>
											)}
										</TableCell>
										<TableCell align="center">
											{row.typeFormat === 'printed' ? (
												<Chip
													size="small"
													label={
														row.stockOld
															? `In Stock ${row.stockOld}`
															: 'Out of Stock'
													}
													chipcolor={row.stockOld ? 'success' : 'error'}
													sx={{
														borderRadius: '4px',
														textTransform: 'capitalize',
													}}
												/>
											) : (
												<Chip
													size="small"
													label="Online"
													chipcolor={'primary'}
													sx={{
														borderRadius: '4px',
														textTransform: 'capitalize',
													}}
												/>
											)}
										</TableCell>
										<TableCell sx={{ pr: 3 }} align="center">
											<IconButton
												title="Details"
												color="primary"
												size="large"
												onClick={handleOpenDetails(row)}
											>
												<VisibilityTwoToneIcon sx={{ fontSize: '1.3rem' }} />
											</IconButton>
											<IconButton
												title="Edit"
												color="secondary"
												size="large"
												onClick={handleOpenEdit(row)}
											>
												<EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
											</IconButton>
										</TableCell>
									</TableRow>
								);
							})}
						{emptyRows > 0 && (
							<TableRow
								style={{
									height: 53 * emptyRows,
								}}
							>
								<TableCell colSpan={6} />
							</TableRow>
						)}
					</TableBody>
				</Table>

				{openDetails && (
					<BookDetails handleCloseDialog={handleCloseDetails} data={rowData!} />
				)}
				{openEdit && (
					<BookEdit handleCloseDialog={handleCloseEdit} data={rowData!} />
				)}
				{openCreate && (
					<BookAdd open={true} handleCloseDialog={handleCloseDialog} />
				)}
			</TableContainer>

			{openDelete && (
				<Dialog
					open
					TransitionComponent={Transition}
					keepMounted
					onClose={handleCloseDelete}
					sx={{
						'&>div:nth-of-type(3)': {
							justifyContent: 'flex-end',
							'&>div': {
								m: 0,
								borderRadius: '0px',
								maxWidth: 550,
								maxHeight: '100%',
							},
						},
					}}
				>
					<DialogContent>
						<Grid container>
							<Grid item xs={12}>
								<Typography>
									{`Are you sure you want to permanently delete the selected ${
										selected.length === 1 ? 'book' : 'books'
									}
									?`}
								</Typography>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<AnimateButton>
							<Button
								variant="contained"
								onClick={() => handleConfirmDelete(selected)}
							>
								Yes
							</Button>
						</AnimateButton>
						<Button variant="text" color="error" onClick={handleCloseDelete}>
							No
						</Button>
					</DialogActions>
				</Dialog>
			)}

			{/* table pagination */}
			{rows && (
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={rows ? rows.length : 0}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			)}
		</MainCard>
	);
};

export default ProductList;
