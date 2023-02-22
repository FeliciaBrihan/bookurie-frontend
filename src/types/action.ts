export interface TActionStateProps {
	actions: TGetAction[];
	error: object | string | null;
}

export interface TGetAction {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	name: string;
}

export interface TSetAction {
	name: string;
}
