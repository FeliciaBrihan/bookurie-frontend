export interface TBudgetRequestStatus {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	name: string;
}

export enum TEnumBudgetRequestStatus {
	Pending = 1,
	InProgress,
	OnHold,
	Approved,
	Rejected,
}
