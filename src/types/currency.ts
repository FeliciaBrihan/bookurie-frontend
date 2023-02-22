export interface TCurrencyStateProps {
	currencies: TCurrency[];
	error: object | string | null;
}

export interface TCurrency {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	name: string;
}
