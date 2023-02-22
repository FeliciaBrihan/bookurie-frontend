import { TBudgetRequestStatus } from './budgetRequestStatus';
import { TCurrency } from './currency';
import { TPaymentType } from './paymentType';
import { TGetUser } from './user';

export interface TBudgetRequestStateProps {
	requests: TGetBudgetRequest[];
	request: BudgetRequestData | undefined;
	rules: TGetRule[];
	error: object | string | null;
}

export interface TSetBudgetRequest {
	title: string;
	details: string;
	price: number;
	currencyId: number;
	paymentTypeId: number;
}

export interface TGetBudgetRequest {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	title: string;
	details: string;
	price: number;
	intervention: boolean;
	Currency: Pick<TCurrency, 'id' | 'name'>;
	PaymentType: Pick<TPaymentType, 'id' | 'name'>;
	BudgetRequestStatus: Pick<TBudgetRequestStatus, 'id' | 'name'>;
	RequestByUser: Pick<TGetUser, 'id' | 'email'>;
}

export interface TSetRule {
	price: number;
	userId: number;
}
export interface TGetRule {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	price: number;
	User: Pick<TGetUser, 'id' | 'email'>;
}

interface BudgetRequestData extends TGetBudgetRequest {
	approvals: {
		BudgetRequestStatus: Pick<TBudgetRequestStatus, 'id' | 'name'>;
		User: Pick<TGetUser, 'id' | 'email'>;
	}[];
}
