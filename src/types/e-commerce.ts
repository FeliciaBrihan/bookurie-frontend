// product shop list
export type Products = {
	id: string | number | undefined;
	image: string;
	name: string;
	description?: string;
	rating?: number;
	discount?: number;
	salePrice?: number;
	offerPrice?: number;
	gender?: string;
	categories?: string[];
	colors?: string[];
	popularity?: number;
	date?: number;
	created: Date;
	isStock?: boolean;
	new?: number;
};

// checkout-cart billing address
export type Address = {
	id?: string | number | undefined;
	building: string;
	street: string;
	city: string;
	number: string;
	country: string;
	zipCode: string | number;
	contact: string | number;
};

// product reviews list
export type Reviews = {
	id: string | number | undefined;
	rating: number;
	review: string;
	date: Date | string;
	profile: {
		avatar: string;
		name: string;
		status: boolean;
	};
};

// product shop filter
export type ProductsFilter = {
	length?: number;
	sort?: string;
	genre: string[];
	price: number | null;
	typeFormat: string[];
	author: string[];
};

// product shop filter - sort options
export type SortOptionsProps = {
	value: string;
	label: string;
};

// product shop filter - colors options
export type ColorsOptionsProps = {
	label: string;
	value: string;
	bg: string;
};

export type PaymentOptionsProps = {
	id: number;
	value: string;
	title: string;
	caption: string;
	image: string;
	size: {
		width: number;
		height: number;
	};
};

export interface ProductStateProps {
	products: Products[];
	product: Products | null;
	relatedProducts: Products[];
	reviews: Reviews[];
	addresses: Address[];
	error: object | string | null;
}
