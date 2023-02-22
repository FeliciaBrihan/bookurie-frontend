export interface TSubscriptionStateProps {
	subscriptions: TGetSubscription[];
	error: object | string | null;
	subscription?: TGetSubscription;
}

export interface TSetSubscription {
	name: string;
	monthlyFee?: number;
	monthlyFreeBooks?: number;
	everyBookDiscount?: number;
	type: string;
}
export interface TGetSubscription {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	name: string;
	monthlyFee: number;
	monthlyFreeBooks: number;
	everyBookDiscount: number;
	type: string;
}
