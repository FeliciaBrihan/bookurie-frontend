import { TGetBook } from 'types/book';

export const getBookTitle = (id: number, books: TGetBook[]) => {
	if (books.length > 0) {
		return books.filter((book) => book.id === id)[0]?.title;
	}
	return '';
};
