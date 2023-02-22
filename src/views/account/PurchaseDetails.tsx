import { useState, useEffect } from 'react';

// material-ui
import {
	Button,
	Dialog,
	DialogActions,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from '@mui/material';
import { useDispatch, useSelector } from 'store';
import { TGetBook } from 'types/book';
import { bookApi } from 'store/slices/book';

// assets
import { TGetPurchase } from 'types/purchase';

interface ProductAddProps {
	handleCloseDialog: (e?: any) => void;
	data: TGetPurchase[];
}

const PurchaseDetails = ({ handleCloseDialog, data }: ProductAddProps) => {
	const dispatch = useDispatch();
	const [books, setBooks] = useState<TGetBook[]>([]);
	const bookState = useSelector((state) => state.book);

	useEffect(() => {
		dispatch(bookApi.getAll());
	}, []);

	useEffect(() => {
		setBooks(bookState.books);
	}, [bookState]);

	const getBookTitle = (id: number) => {
		if (books.length > 0)
			return books.filter((book) => book.id === id)[0]?.title;
	};

	return (
		<Dialog open={true} onClose={handleCloseDialog}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Book</TableCell>
						<TableCell sx={{ width: '100px' }}>Price</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data.map((item, index) => (
						<TableRow key={index}>
							<TableCell>{getBookTitle(item.BookId) || ''}</TableCell>
							<TableCell>{item.price} RON</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<DialogActions>
				<Button variant="text" color="primary" onClick={handleCloseDialog}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default PurchaseDetails;
