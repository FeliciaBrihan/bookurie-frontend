import { TGetUser } from 'types/user';

export const getUserFullName = (userId: number, users: TGetUser[]) => {
	if (users.length > 0) {
		const userFirstName = users.filter((user) => user.id === userId)?.[0]
			?.firstName;
		const userLastName = users.filter((user) => user.id === userId)?.[0]
			?.lastName;
		return userFirstName + ' ' + userLastName;
	}
	return '';
};
