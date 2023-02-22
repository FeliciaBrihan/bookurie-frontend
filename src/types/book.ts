export interface TBookStateProps {
	books: TGetBook[];
	book: TGetBook | null;
	error: object | string | null;
	addresses: [];
}

export interface TSetBook {
	title: string;
	author: string;
	publishingHouse: string;
	publishedYear?: number;
	coverImage: string;
	genre: string;
	description: string;
	pages?: number;
	typeFormat: string;
	price?: number;
	stockOld?: number;
	stockNew?: number;
}
export interface TGetBook {
	id: number;
	title: string;
	author: string;
	publishingHouse: string;
	publishedYear: number;
	coverImage: string;
	genre: string;
	description: string;
	pages: number;
	typeFormat: string;
	price: number;
	stockOld: number;
	stockNew: number;
	createdAt: Date;
	updatedAt: Date;
	pricePromo?: number;
}
