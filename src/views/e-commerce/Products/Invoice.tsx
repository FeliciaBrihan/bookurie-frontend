import { Document, Page, Text, StyleSheet } from '@react-pdf/renderer';
import { CartCheckoutStateProps } from 'types/cart';
import { TGetUser } from 'types/user';

const styles = StyleSheet.create({
	page: {
		padding: 30,
	},
	invoiceHeader: {
		fontSize: 20,
		marginBottom: 20,
		alignItems: 'center',
	},
	headerRow: {
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 10,
	},
	headerCell: {
		flex: 1,
	},
	itemRow: {
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 10,
	},
	itemCell: {
		flex: 1,
		fontSize: 15,
	},
});

type InvoiceProps = {
	items: CartCheckoutStateProps;
	orderId: string;
	loggedUser: TGetUser;
};

const Invoice = ({ items, orderId, loggedUser }: InvoiceProps) => {
	const nowDate = new Date();
	const date =
		nowDate.getDate() +
		'/' +
		(nowDate.getMonth() + 1) +
		'/' +
		nowDate.getFullYear();
	return (
		<Document>
			<Page style={styles.page}>
				<Text style={styles.invoiceHeader}>Invoice</Text>
				<Text style={styles.headerRow}>
					<Text style={styles.headerCell}>Invoice number: </Text>
					<Text style={styles.itemCell}>{orderId}</Text>
				</Text>
				<Text style={styles.headerRow}>
					<Text style={styles.headerCell}>Date: </Text>
					<Text style={styles.itemCell}>{date}</Text>
				</Text>
				<Text style={styles.headerRow}>
					<Text style={styles.headerCell}>Customer name: </Text>
					<Text style={styles.itemCell}>
						{loggedUser?.firstName} {loggedUser?.lastName}
					</Text>
				</Text>
				<Text style={styles.headerRow}>
					<Text style={styles.headerCell}>Shipping address: </Text>
					<Text style={styles.itemCell}>
						Street: {items.billing?.street}, Building {items.billing?.building},{' '}
						No: {items.billing?.number}, City: {items.billing?.city}, Country:
						{items.billing?.country}, Zip Code: {items.billing?.zipCode}, Phone:
						{items.billing?.contact}
					</Text>
				</Text>
				<Text style={styles.headerRow}>
					<Text style={styles.headerCell}>Total: </Text>
					<Text style={styles.itemCell}>{items.total} RON</Text>
				</Text>
				<Text style={styles.itemRow}>
					<Text style={styles.headerCell}>Items: </Text>
				</Text>
				{items.products.map((item) => (
					<Text style={styles.itemRow} key={item.title}>
						<Text style={styles.itemCell}> * {item.title} </Text>
						<Text style={styles.itemCell}>{item.price} RON</Text>
					</Text>
				))}
			</Page>
		</Document>
	);
};

export default Invoice;
