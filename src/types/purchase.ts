export interface TPurchaseStateProps {
	purchases: TGetPurchase[];
	error: object | string | null;
	userPurchases: TGetPurchase[];
}

export interface TSetPurchase {
	BookId: number;
	UserId: number;
	price: number;
}
export interface TGetPurchase {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	BookId: number;
	UserId: number;
	price: number;
	orderId: string;
	totalPrice: number;
}
