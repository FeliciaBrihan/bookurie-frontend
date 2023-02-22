import { TGetRole } from './roles';

export interface TUserStateProps {
	users: TGetUser[];
	activeUsers: TGetUser[];
	error: object | string | null;
	loggedUser?: TGetUser;
}

export interface TSetUser {
	firstName: string;
	lastName: string;
	email: string;
	roleId?: number;
	active?: boolean;
	username: string;
	subscriptionId?: number;
	subscriptionDate?: Date | null;
	subscriptionExpirationDate?: Date | null;
	booksReadThisMonth?: number;
}

export interface TGetUser {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	firstName: string;
	lastName: string;
	email: string;
	username: string;
	subscriptionId: number;
	subscriptionDate: Date;
	subscriptionExpirationDate: Date;
	booksReadThisMonth: number;
	budget: number;
	Role?: Pick<TGetRole, 'id' | 'name'>;
	roleId: number;
	active: boolean;
	addressId?: number;
}
