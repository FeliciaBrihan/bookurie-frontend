export interface TPaymentTypeStateProps {
	paymentTypes: TPaymentType[];
	error: object | string | null;
}

export interface TPaymentType {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	name: string;
}
