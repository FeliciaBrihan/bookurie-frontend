// project imports
import services from 'utils/mockAdapter';

import { v4 as UIDV4 } from 'uuid';

// types
import { Address } from 'types/e-commerce';

// billing address list
let address: Address[] = [];

// ==============================|| MOCK SERVICES ||============================== //

services.onGet('/api/address/list').reply(200);

services.onPost('/api/address/new').reply((request) => {
	try {
		const data = JSON.parse(request.data);
		const { building, street, city, number, country, zipCode, contact } = data;
		const newAddress = {
			id: UIDV4(),

			building,
			street,
			city,
			number,
			country,
			zipCode,
			contact,
		};

		address = [...address, newAddress];

		return [200, { address }];
	} catch (err) {
		console.error(err);
		return [500, { message: 'Internal server error' }];
	}
});

services.onPost('/api/address/edit').reply((request) => {
	try {
		const data = JSON.parse(request.data);

		address = address.map((item) => {
			if (item.id === data.id) {
				return data;
			}
			return item;
		});

		return [200, { address }];
	} catch (err) {
		console.error(err);
		return [500, { message: 'Internal server error' }];
	}
});
