export interface TRoleStateProps {
	roles: TGetRole[];
	error: object | string | null;
}

export interface TSetRole {
	name: string;
	allowedActions: number[];
}
export interface TGetRole {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	name: string;
	allowedActions: number[];
}
