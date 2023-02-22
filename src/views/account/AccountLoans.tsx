import * as React from 'react';

// material-ui
import { useTheme, Theme } from '@mui/material/styles';
import {
	Box,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	Toolbar,
	Tooltip,
	Typography,
} from '@mui/material';
import Chip from 'ui-component/extended/Chip';
import { visuallyHidden } from '@mui/utils';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch, useSelector } from 'store';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import {
	ArrangementOrder,
	EnhancedTableHeadProps,
	KeyedObject,
	GetComparator,
	HeadCell,
	EnhancedTableToolbarProps,
} from 'types';
import { TGetLoan } from 'types/loan';
import { deleteLoan, getUserLoans } from 'store/slices/loan';
import { bookApi } from 'store/slices/book';
import { getBookTitle } from 'utils/helpers/getBookTitle';

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
	array: TGetLoan[],
	comparator: (a: TGetLoan, b: TGetLoan) => number
) {
	const stabilizedThis = array.map((el: TGetLoan, index: number) => [
		el,
		index,
	]);
	stabilizedThis.sort((a, b) => {
		const el = comparator(a[0] as TGetLoan, b[0] as TGetLoan);
		if (el !== 0) return el;
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
		id: 'expirationDate',
		numeric: false,
		label: 'Due Date',
		align: 'left',
	},
	{
		id: 'BookId',
		numeric: false,
		label: 'Book',
		align: 'left',
	},
	{
		id: 'status',
		numeric: false,
		label: 'Status',
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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onSelectAllClick,
	order,
	orderBy,
	numSelected,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	rowCount,
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
				<TableCell padding="checkbox" sx={{ pl: 3 }}></TableCell>
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
				<IconButton size="large" onClick={onDeleteClick}>
					<DeleteIcon fontSize="small" />
				</IconButton>
			</Tooltip>
		)}
	</Toolbar>
);

// ==============================|| ORDER LIST ||============================== //

const LoanList = () => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const [order, setOrder] = React.useState<ArrangementOrder>('asc');
	const [orderBy, setOrderBy] = React.useState<string>('id');
	const [selected, setSelected] = React.useState<number[]>([]);
	const [page, setPage] = React.useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
	const [rows, setRows] = React.useState<TGetLoan[]>([]);
	const { userLoans } = useSelector((state) => state.loan);
	const { books } = useSelector((state) => state.book);

	React.useEffect(() => {
		dispatch(getUserLoans());
		dispatch(bookApi.getAll());
	}, [dispatch]);

	React.useEffect(() => {
		dispatch(bookApi.getAll());
	}, [dispatch]);

	React.useEffect(() => {
		setRows(userLoans);
	}, [userLoans]);

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
			dispatch(deleteLoan(item, { sync: true }));
			setSelected([]);
		});
	};

	const isSelected = (id: number) => selected.indexOf(id) !== -1;
	const emptyRows = rows
		? page > 0
			? Math.max(0, (1 + page) * rowsPerPage - rows.length)
			: 0
		: 0;

	return (
		<MainCard title="" content={false}>
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
													#{row.id}
												</Typography>
											</TableCell>
											<TableCell>
												{row.expirationDate
													? new Intl.DateTimeFormat('en-GB', {
															year: 'numeric',
															month: '2-digit',
															day: '2-digit',
													  }).format(new Date(row.expirationDate))
													: '--'}
											</TableCell>
											<TableCell>
												{getBookTitle(row.BookId, books) || '-'}
											</TableCell>
											<TableCell>
												<Chip
													size="small"
													label={
														row.isAccepted
															? row.isReturned
																? 'Returned'
																: 'Approved'
															: 'Pending'
													}
													chipcolor={
														row.isAccepted
															? row.isReturned
																? 'secondary'
																: 'success'
															: 'error'
													}
													sx={{
														borderRadius: '4px',
														textTransform: 'capitalize',
													}}
												/>
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
					)}
				</Table>
			</TableContainer>
			{!rows && (
				<Box
					sx={{
						height: '50px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					No loans to display
				</Box>
			)}
			{rows && (
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
		</MainCard>
	);
};

export default LoanList;
