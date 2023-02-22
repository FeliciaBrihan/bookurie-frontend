export interface TLoanStateProps {
	loans: TGetLoan[];
	error: object | string | null;
	userLoans: TGetLoan[];
}

export interface TSetLoan {
	isAccepted?: boolean;
	expirationDate?: Date;
	isReturned?: boolean;
}
export interface TGetLoan {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	isAccepted: boolean;
	expirationDate: Date;
	isReturned?: boolean;
	BookId: number;
	UserId: number;
}
