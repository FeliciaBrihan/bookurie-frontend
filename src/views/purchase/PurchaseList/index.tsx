import * as React from 'react';

// material-ui
import { useTheme, Theme } from '@mui/material/styles';
import {
	Box,
	CardContent,
	Grid,
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
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch, useSelector } from 'store';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
// import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import {
	ArrangementOrder,
	EnhancedTableHeadProps,
	KeyedObject,
	GetComparator,
	HeadCell,
	EnhancedTableToolbarProps,
} from 'types';
import { TGetPurchase } from 'types/purchase';
import { deletePurchase, purchaseApi } from 'store/slices/purchase';
import PurchaseDetails from '../PurchaseDetails';
import { getUserFullName } from 'utils/helpers/getUserFullName';
import { userApi } from 'store/slices/user';

interface CumulatedPurchase extends TGetPurchase {
	totalPrice: number;
}

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
	array: TGetPurchase[],
	comparator: (a: TGetPurchase, b: TGetPurchase) => number
) {
	const stabilizedThis = array.map((el: TGetPurchase, index: number) => [
		el,
		index,
	]);
	stabilizedThis.sort((a, b) => {
		const el = comparator(a[0] as TGetPurchase, b[0] as TGetPurchase);
		if (el !== 0) return el;
		return (a[1] as number) - (b[1] as number);
	});
	return stabilizedThis.map((el) => el[0]);
}

// table header options

const headCells: HeadCell[] = [
	{
		id: 'orderId',
		numeric: true,
		label: 'Order Id',
		align: 'left',
	},
	{
		id: 'createdAt',
		numeric: false,
		label: 'Date',
		align: 'left',
	},
	{
		id: 'userId',
		numeric: true,
		label: 'User',
		align: 'left',
	},
	{
		id: 'price',
		numeric: true,
		label: 'Total Price',
		align: 'left',
	},
];

// ==============================|| TABLE HEADER ||============================== //

interface OrderListEnhancedTableHeadProps extends EnhancedTableHeadProps {
	theme: Theme;
	selected: number[];
	deleteHandler: () => void;
}

function EnhancedTableHead({
	order,
	orderBy,
	numSelected,
	onRequestSort,
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
				<TableCell sx={{ pl: 3 }}></TableCell>
				{numSelected > 0 && (
					<TableCell padding="none" colSpan={8}>
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
						<Typography variant="subtitle1">Action</Typography>
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

// ==============================|| ORDER LIST ||============================== //

const PurchaseList = () => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const [order, setOrder] = React.useState<ArrangementOrder>('asc');
	const [orderBy, setOrderBy] = React.useState<string>('id');
	const [openDetails, setOpenDetails] = React.useState(false);
	const [selected, setSelected] = React.useState<number[]>([]);
	const [page, setPage] = React.useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
	const [search, setSearch] = React.useState<string>('');
	const [rows, setRows] = React.useState<TGetPurchase[]>([]);
	const { purchases } = useSelector((state) => state.purchase);
	const { users } = useSelector((state) => state.user);
	const [rowData, setRowData] = React.useState<TGetPurchase[] | undefined>(
		undefined
	);

	React.useEffect(() => {
		dispatch(purchaseApi.getAll());
		dispatch(userApi.getAll());
	}, [dispatch]);

	React.useEffect(() => {
		const purchasesByOrderId = purchases
			? purchases.reduce(
					(
						acc: { [key: string]: CumulatedPurchase },
						purchase: TGetPurchase
					) => {
						if (!acc[purchase.orderId]) {
							acc[purchase.orderId] = {
								...purchase,
								orderId: purchase.orderId,
								totalPrice: purchase.price,
							};
						} else {
							acc[purchase.orderId].totalPrice += purchase.price;
						}
						return acc;
					},
					{}
			  )
			: [];
		const cumulatedPurchases: CumulatedPurchase[] =
			Object.values(purchasesByOrderId);
		setRows(cumulatedPurchases);
	}, [purchases]);

	const handleSearch = (
		event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined
	) => {
		const newString = event?.target.value;
		setSearch(newString || '');

		if (newString) {
			const newRows = rows.filter((row: KeyedObject) => {
				let matches = true;

				const properties = ['UserId', 'orderId'];
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
			setRows(purchases);
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
			if (selected.length > 0) {
				setSelected([]);
			} else {
				const newSelectedId = rows.map((n) => n.id);
				setSelected(newSelectedId);
			}
			return;
		}
		setSelected([]);
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
	const handleDelete = (selectedItemsArray: number[]) => {
		selectedItemsArray.forEach((item) => {
			dispatch(deletePurchase(item, { sync: true }));
			setSelected([]);
		});
	};
	const handleOpenDetails = (row: TGetPurchase) => () => {
		const relatedPurchases = purchases.filter(
			(purchase) => purchase.orderId === row.orderId
		);
		setRowData(relatedPurchases);
		setOpenDetails(true);
	};
	const handleCloseDetails = () => {
		setOpenDetails(false);
	};

	const isSelected = (id: number) => selected.indexOf(id) !== -1;
	return (
		<MainCard title="Purchase List" content={false}>
			<>
				<CardContent>
					<Grid
						container
						justifyContent="space-between"
						alignItems="center"
						spacing={2}
					>
						<Grid item xs={12} sm={6}>
							<TextField
								sx={{ width: 300 }}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon fontSize="small" />
										</InputAdornment>
									),
								}}
								onChange={handleSearch}
								placeholder="Search by Order ID or User ID"
								value={search}
								size="small"
							/>
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
							rowCount={rows?.length}
							theme={theme}
							selected={selected}
							deleteHandler={() => handleDelete(selected)}
						/>
						{rows && (
							<TableBody>
								{stableSort(rows, getComparator(order, orderBy))
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((row, index) => {
										/** Make sure no display bugs if row isn't an OrderData object */
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
												<TableCell sx={{ pl: 3 }}></TableCell>
												<TableCell component="th" id={labelId} scope="row">
													<Typography
														variant="subtitle1"
														sx={{
															color:
																theme.palette.mode === 'dark'
																	? 'grey.600'
																	: 'grey.900',
														}}
													>
														#{row.orderId}
													</Typography>
												</TableCell>
												<TableCell>
													{new Intl.DateTimeFormat('en-GB', {
														year: 'numeric',
														month: '2-digit',
														day: '2-digit',
														hour: '2-digit',
														minute: '2-digit',
														second: '2-digit',
													}).format(new Date(row.createdAt))}
												</TableCell>
												<TableCell>
													{getUserFullName(row.UserId, users)} #{row.UserId}
												</TableCell>
												<TableCell>{row.totalPrice} RON</TableCell>
												<TableCell sx={{ pr: 3 }} align="center">
													<IconButton
														title="Details"
														color="primary"
														size="large"
														onClick={handleOpenDetails(row)}
													>
														<VisibilityTwoToneIcon
															sx={{ fontSize: '1.3rem' }}
														/>
													</IconButton>
												</TableCell>
											</TableRow>
										);
									})}
							</TableBody>
						)}
					</Table>
					{openDetails && (
						<PurchaseDetails
							handleCloseDialog={handleCloseDetails}
							data={rowData!}
						/>
					)}
				</TableContainer>
				{/* table pagination */}
				{rows.length !== 0 && (
					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component="div"
						count={rows.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				)}
				{!rows.length && (
					<Box
						sx={{
							height: '50px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						No purchases to display
					</Box>
				)}
			</>
		</MainCard>
	);
};

export default PurchaseList;
