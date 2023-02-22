import * as React from 'react';

// material-ui
import { useTheme, Theme } from '@mui/material/styles';
import {
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
	Typography,
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch, useSelector } from 'store';

// assets

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { HeadCell } from 'types';
import PrizeEdit from './PrizeEdit';
import { prizeApi } from 'store/slices/prize';
import { TGetPrize } from 'types/prize';

// table header options

const headCells: HeadCell[] = [
	{
		id: 'id',
		numeric: true,
		label: 'ID',
		align: 'left',
	},
	{
		id: 'bookId',
		numeric: false,
		label: 'Book ID',
		align: 'left',
	},
	{
		id: 'voucher',
		numeric: false,
		label: 'Voucher',
		align: 'left',
	},
	{
		id: 'updatedAt',
		numeric: false,
		label: 'Last update',
		align: 'left',
	},
];

// ==============================|| TABLE HEADER ||============================== //

interface OrderListEnhancedTableHeadProps {
	theme: Theme;
}

function EnhancedTableHead({ theme }: OrderListEnhancedTableHeadProps) {
	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox" sx={{ pl: 3 }}></TableCell>

				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.align}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						<Typography>{headCell.label}</Typography>
					</TableCell>
				))}

				<TableCell align="center" sx={{ pr: 3 }}>
					<Typography
						variant="subtitle1"
						sx={{
							color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900',
						}}
					>
						Action
					</Typography>
				</TableCell>
			</TableRow>
		</TableHead>
	);
}

// ==============================|| ORDER LIST ||============================== //

const PrizeList = () => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const [rows, setRows] = React.useState<TGetPrize[]>([]);
	const [openEdit, setOpenEdit] = React.useState(false);
	const [rowData, setRowData] = React.useState<TGetPrize | undefined>(
		undefined
	);
	const { prizes } = useSelector((state) => state.prize);

	React.useEffect(() => {
		dispatch(prizeApi.getAll());
	}, [dispatch]);
	React.useEffect(() => {
		setRows(prizes);
	}, [prizes]);

	const handleCloseEdit = () => {
		setOpenEdit(false);
	};

	const handleOpenEdit = (row: TGetPrize) => () => {
		setRowData(row);
		setOpenEdit(true);
	};

	return (
		<MainCard title="Raffle Prize" content={false}>
			{/* table */}
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
					<EnhancedTableHead theme={theme} />
					<TableBody>
						{rows.map((row, index) => {
							return (
								<TableRow hover tabIndex={-1} key={index}>
									<TableCell></TableCell>
									<TableCell component="th" scope="row">
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
									<TableCell component="th" scope="row">
										<Typography
											variant="subtitle1"
											sx={{
												color:
													theme.palette.mode === 'dark'
														? 'grey.600'
														: 'grey.900',
											}}
										>
											{row.bookId}
										</Typography>
									</TableCell>
									<TableCell component="th" scope="row">
										<Typography
											variant="subtitle1"
											sx={{
												color:
													theme.palette.mode === 'dark'
														? 'grey.600'
														: 'grey.900',
											}}
										>
											{row.voucher} RON
										</Typography>
									</TableCell>
									<TableCell>
										{' '}
										{new Intl.DateTimeFormat('en-GB', {
											year: 'numeric',
											month: '2-digit',
											day: '2-digit',
											hour: '2-digit',
											minute: '2-digit',
											second: '2-digit',
										}).format(new Date(row.updatedAt))}
									</TableCell>
									<TableCell sx={{ pr: 3 }} align="center">
										<Tooltip title="Edit">
											<IconButton
												color="secondary"
												size="large"
												onClick={handleOpenEdit(row)}
											>
												<EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
											</IconButton>
										</Tooltip>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>

				{openEdit && (
					<PrizeEdit handleCloseDialog={handleCloseEdit} data={rowData!} />
				)}
			</TableContainer>
		</MainCard>
	);
};

export default PrizeList;
