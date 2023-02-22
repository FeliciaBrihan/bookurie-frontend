export interface TPrizeStateProps {
	prizes: TGetPrize[];
	error: object | string | null;
}

export interface TSetPrize {
	bookId: number;
	voucher: number;
}
export interface TGetPrize {
	id: number;
	bookId: number;
	voucher: number;
	createdAt: Date;
	updatedAt: Date;
}
