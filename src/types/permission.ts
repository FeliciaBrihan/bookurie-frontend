export interface TPermissionStateProps {
	permissions: TGetPermission[];
	error: object | string | null;
}

export interface TSetPermission {
	ActionId?: number;
	RoleId?: number;
}
export interface TGetPermission {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	ActionId: number;
	RoleId: number;
}
